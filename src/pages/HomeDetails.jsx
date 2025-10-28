import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useIsMobile } from '../Providers/MobileProvider'
import {
  loadHome,
  addUserLike,
  removeUserLike,
} from '../store/actions/home.actions'
import { addLike, removeLike } from '../store/actions/user.actions'
import { getAvgRating } from '../services/util.service'
import { FaHeart, FaStar } from 'react-icons/fa'
import { IoDiamond } from 'react-icons/io5'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import { ReservationModal } from '../cmps/ReservationModal'
import { BedIcon, CalendarIcon, DoorIcon } from '../assets/svgs/icons'
import { GuestFav } from '../cmps/GuestFav'
import { ReviewCard } from '../cmps/ReviewCard'
import { homeService } from '../services/home'
import {
  setHomeDetailsImgNotScrolled,
  setHomeDetailsImgScrolled,
  setHomeDetailsStickyCardNotScrolled,
  setHomeDetailsStickyCardScrolled,
  setHomePageNotScrolled,
} from '../store/actions/scroll.actions'
import {
  addDraftOrder,
  closeOrderConfirmationModal,
  openOrderConfirmationModal,
  updateDraftOrder,
} from '../store/actions/draft-order.actions'
import { addOrder } from '../store/actions/order.actions'
import { ReactSVG } from 'react-svg'
import { DotsIndicator } from '../cmps/DotsIndicator'
import { LikeButton } from '../cmps/LikeButton'

export function HomeDetails() {
  const { homeId } = useParams()
  const filterBy = useSelector((state) => state.homeModule.filterBy)
  const home = useSelector((storeState) => storeState.homeModule.home)
  const isOrderConfirmationModalOpen = useSelector(
    (state) => state.draftOrderModule.isOrderConfirmationModalOpen
  )
  const draftOrder = useSelector((state) => state.draftOrderModule.draftOrder)
  const imgBreakPointRef = useRef()
  const [ showLoader ] = useState(true)
  const isMobile = useIsMobile()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const imgRef = useRef(null)
  const containerRef = useRef(null)

  function getImgWidthByScreen(){
    if (imgRef.current) return imgRef.current.getBoundingClientRect().width
    if (containerRef.current) return containerRef.current.getBoundingClientRect().width
    return window.innerWidth
  }  

  useEffect(() => {
    function updateImageWidth(){
      const width = getImgWidthByScreen()
      setImgWidth(width)
    }

    updateImageWidth()

    const handleResize = () => updateImageWidth()

    let resizeObserver
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => updateImageWidth())
      resizeObserver.observe(containerRef.current)
    }

    window.addEventListener('resize', handleResize)

  return () => {
    window.removeEventListener('resize', handleResize)
    if (resizeObserver) resizeObserver.disconnect()
  }
}, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const width = getImgWidthByScreen()
      setImgWidth(width)
    }, 100)
    return () => clearTimeout(timeoutId)
  }, [home?.imageUrls])
  
  useEffect(() => {
    if (!homeId) return
    loadHome(homeId)
  }, [homeId])

  useEffect(() => {
    if (home && home._id) addDraftOrder(homeId, filterBy)
  }, [home, filterBy])

  useEffect(() => {
    try {
      const elAfterImg = imgBreakPointRef.current
      const stickySentinel = document.querySelector('#sticky-sentinel')
      const header = document.querySelector('.home-details-header')

      if (!header || !elAfterImg || !stickySentinel) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target === elAfterImg) {
              if (entry.isIntersecting) setHomeDetailsImgNotScrolled()
              else setHomeDetailsImgScrolled()
            }

            if (entry.target === stickySentinel) {
              if (entry.isIntersecting) setHomeDetailsStickyCardNotScrolled()
              else setHomeDetailsStickyCardScrolled()
            }
          })
        },
        { root: null, threshold: 0, rootMargin: '-80px 0px 0px 0px' }
      )

      if (elAfterImg) observer.observe(elAfterImg)
      if (stickySentinel) observer.observe(stickySentinel)

      return () => {
        if (elAfterImg) observer.unobserve(elAfterImg)
        if (stickySentinel) observer.unobserve(stickySentinel)
        observer.disconnect()
      }
    } catch (err) {
      console.error('💥 IntersectionObserver failed:', err)
    }
  }, [home])


  function onDotClick(e, index) {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIdx(index)
  }

  return (
    <>
      {!home && showLoader ? (
        <div className="loader-container">
          <span className="loading"></span>
        </div>
      ) : (
        <div className="home-details-container">
          <div className="home-details-header">
            <h1>
              {home.type} in {home.loc.city}, {home.loc.country}
            </h1>
            {!isMobile &&<LikeButton homeId={homeId} father={'HomeDetails'} />}
          </div>
          {isMobile ? (
            <div className="home-details-img-container-mobile" ref={containerRef}>
              <div className="home-details-img-slider-wrapper">
                <div 
                  className="home-details-img-tracker"
                  style={{ '--translate-x-images': `${-currentIdx * 100}%`,
                            '--slides-num': home.imageUrls?.slice(0, 5).length || 1   
                        }}
                >
                  {home.imageUrls?.slice(0, 5).map((imageUrl, idx) => (
                    <div 
                      className="hd-img-slider-item" 
                      key={idx}
                      ref={idx === 0 ? imgRef : null}
                    >
                      <img 
                        src={imageUrl}
                        alt={`home image ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="home-details-dots-indicator-wrapper">
                <DotsIndicator
                  slidesNum={home?.imageUrls?.length}
                  currentIdx={currentIdx}
                  onDotClick={onDotClick}
                />
              </div>
            </div>) : (
              <div
                className={`
                        home-details-img-container 
                        hd-img-layout-${home.imageUrls?.length}
                      `}
              >
                    {home.imageUrls?.slice(0, 5).map((imageUrl, idx) => (
                      <img
                        key={idx}
                        className={`home-details-img ${idx === currentIdx ? 'active' : ''}`}
                        src={imageUrl}
                        alt={`home image ${idx + 1}`}
                      />
                    ))}
              </div>
              
            )}
          <div style={{ paddingTop: '20px' }}>
  <div ref={imgBreakPointRef} style={{ height: '1px' }}></div>
</div>
          <section className="home-details-mid-section">
            <div className="home-details-mid-left-part-wrapper">
              <div
                id="home-details-amenities-container"
                className="home-details-amenities"
                style={
                  getAvgRating(home) >= 4
                    ? {}
                    : { borderBottom: '1px solid #e0e0e0' }
                }
              >
                <h2>
                  {home.type} in {home.loc.city}, {home.loc.country}
                </h2>

                <div className="home-details-amenities-list">
                  <p>
                    {home.capacity} {home.capacity > 1 ? 'guests' : 'guest'}
                  </p>
                  <span>·</span>
                  <p>
                    {home.bedsCount > 0 ? home.bedsCount : 0}{' '}
                    {home.bedsCount > 1 ? 'beds' : 'bed'}
                  </p>
                  <span>·</span>
                  <p>
                    {home.bathCount > 0 ? home.bathCount : 0}{' '}
                    {home.bathCount > 1 ? 'baths' : 'bath'}
                  </p>
                </div>
                {getAvgRating(home) < 4 && (
                  <div className="home-details-reviews-headline">
                    <span>
                      <FaStar
                        style={{
                          width: '8px',
                          height: '8px',
                          marginInlineEnd: '2px',
                          verticalAlign: 'middle',
                        }}
                      />
                      <span style={{ fontWeight: 'bold' }}>
                        {getAvgRating(home).toFixed(2)}{' '}
                      </span>
                    </span>
                    <span>·</span>
                    <span>
                      {home.reviews?.length || 0 > 0
                        ? `${home.reviews.length} reviews`
                        : 'No reviews yet'}
                    </span>
                  </div>
                )}
              </div>
              {getAvgRating(home) >= 4 && <GuestFav home={home} />}
              <div className="home-details-hosted-by-article">
                <img src={home.host.imageUrl || '/svgs/user-icon.svg'} />
                <div className="home-details-hosted-by-text">
                  <div>{`Hosted by ${home.host.fullname.split(' ')[0]}`}</div>
                </div>
              </div>
              <section className="home-details-home-highlights">
                <article>
                  <DoorIcon className="home-highlights-icon " />
                  <h4>Self check-in</h4>
                  <p>Check yourself in with the lockbox.</p>
                </article>
                <article>
                  <BedIcon className="home-highlights-icon " />
                  <h4>Room in a home</h4>
                  <p>Your own room in a home, plus access to shared spaces.</p>
                </article>
                <article>
                  <CalendarIcon className="home-highlights-icon " />
                  <h4>Free cancellation before Jul 27</h4>
                  <p>Get a full refund if you change your mind.</p>
                </article>
              </section>
              <section className="home-details-summary">
                {/* <h3>About this place</h3> */}
                <p>{home.summary}</p>
              </section>
              <section className="home-details-facilities-list">
                <h3>What this place offers</h3>
                <ul className="amenities-list">
                  {home.amenities.map((amenity, idx) => {
                    const iconPath = homeService.getAmenitySvgPath(amenity)
                    return (
                      <li key={idx} className="amenity-item">
                        <ReactSVG
                          src={iconPath}
                          className="svg-icon"
                          beforeInjection={(svg) => {
                            svg.removeAttribute('width')
                            svg.removeAttribute('height')
                          }}
                        />
                        <span>{amenity}</span>
                      </li>
                    )
                  })}
                </ul>
              </section>
            </div>
            {!isMobile && <div className="home-details-mid-right-part-wrapper">
              <section className="home-details-sticky-sidebars">
                <aside className="rare-modal">
                  <IoDiamond className="diamond-icon" />
                  <p>Rare find! This place is usually booked</p>
                </aside>
                {draftOrder && home && (
                  <ReservationModal
                    home={home}
                    draftOrder={draftOrder}
                    updateDraftOrder={updateDraftOrder}
                    addOrder={addOrder}
                    isOrderConfirmationModalOpen={isOrderConfirmationModalOpen}
                    openOrderConfirmationModal={openOrderConfirmationModal}
                    closeOrderConfirmationModal={closeOrderConfirmationModal}
                  />
                )}
              </section>
              <div id="sticky-sentinel" style={{ height: '250px' }} />
            </div>}
          </section>
          <section className="home-details-reviews-section">
            <ReviewCard reviews={home.reviews} />
          </section>
          <section
            className="home-details-google-maps-section"
            id="hd-location-container"
          >
            <h2>Where you'll be</h2>
            <APIProvider apiKey={import.meta.env.VITE_API_GOOGLE_KEY}>
              <Map
                defaultZoom={13}
                center={{
                  lat: home.loc?.lat,
                  lng: home.loc?.lng,
                }}
                gestureHandling={'greedy'}
                disableDefaultUI={false}
                style={{ height: '400px', width: '100%' }}
              />
              <Marker
                position={{ lat: home.loc?.lat, lng: home.loc?.lng }}
                clickable={true}
                onClick={() => alert('marker was clicked!')}
                title={'clickable google.maps.Marker'}
              />
            </APIProvider>
          </section>
        </div>
      )}
    </>
  )
}
