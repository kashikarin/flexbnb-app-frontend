import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import {
  capitalizeStr,
  getAvgRating,
  getNextAvailableStayStr,
  roundToDecimals,
} from '../services/util.service'
import { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { DotsIndicator } from './DotsIndicator'
import { useIsMobile } from '../Providers/MobileProvider'

export function HomePreview({ home, isHomeLiked, onAddLike, onRemoveLike }) {
  const location = useLocation()
  const isMobile = useIsMobile()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [isLiked, setIsLiked] = useState(isHomeLiked)
  const imgRef = useRef(null)
  const containerRef = useRef(null)
  const loggedInUser = useSelector((state) => state.userModule.loggedInUser)
  function onPrevClick(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    if (currentIdx === 0) return
    setCurrentIdx((prev) => Math.max(0, prev - 1))
  }

  function onNextClick(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    if (currentIdx + 1 >= home.imageUrls.length) return
    setCurrentIdx((prev) => Math.min(prev + 1, home.imageUrls.length - 1))
  }

  const getWidthByScreen = () => {
    if (imgRef.current) {
      return imgRef.current.getBoundingClientRect().width
    }
    if (containerRef.current) {
      return containerRef.current.getBoundingClientRect().width
    }
    return window.innerWidth
  }

  useEffect(() => {
    const updateImageWidth = () => {
      const width = getWidthByScreen()
      setImgWidth(width)
    }

    updateImageWidth()

    const handleResize = () => {
      updateImageWidth()
    }

    let resizeObserver
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateImageWidth()
      })
      resizeObserver.observe(containerRef.current)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [imgRef.current, containerRef.current])

  useEffect(() => {
    const updateImageWidth = () => {
      const width = getWidthByScreen()
      setImgWidth(width)
    }

    const timeoutId = setTimeout(updateImageWidth, 100)
    return () => clearTimeout(timeoutId)
  }, [home.imageUrls])

  useEffect(() => {
    const slider = document.querySelector('.home-preview-image-slider-container')
    if (!slider) return

    const handleScroll = () => {
      const index = Math.round(slider.scrollLeft / slider.clientWidth)
      setActiveIndex(index) // ← כאן תעדכני את ה-state של הנקודות
    }

    slider.addEventListener('scroll', handleScroll)
    return () => slider.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsLiked(isHomeLiked)
  }, [isHomeLiked])

  async function handleLike(e) {
    e.preventDefault()
    e.stopPropagation()

    const nextIsLiked = !isLiked
    setIsLiked(nextIsLiked)
    if (nextIsLiked) {
      try {
        await onAddLike(home._id)
      } catch (err) {
        setIsLiked(false)
        console.error('Failed to like the home', err)
      }
    } else {
      try {
        await onRemoveLike(home._id)
      } catch (err) {
        setIsLiked(true)
        console.error('Faied to remove like', err)
      }
    }
  }

  function onDotClick(e, index) {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIdx(index)
  }

  return (
    <Link className="home-preview-link" to={`/home/${home._id}`}>
      <article className="home-preview-container">
        {loggedInUser ? (
          <div className="heart-icon-container" onClick={handleLike}>
            <FaHeart
              className={`heart filled ${
                loggedInUser.likedHomes.includes(home._id) ? 'liked' : ''
              }`}
            />
            <FaRegHeart className="heart outline" />
          </div>
        ) : (
          <div className="heart-icon-container" onClick={handleLike}>
            <FaHeart
              className={`heart filled ${
                loggedInUser?.likedHomes.includes(home._id) ? 'liked' : ''
              }`}
            />
            <FaRegHeart className="heart outline" />
          </div>
        )}

        {getAvgRating(home) >= 4 && (
          <div className="guest-fav-badge">Guest favorite</div>
        )}
        {/* <button className='home-like-btn'>Like</button> */}
        <div className="home-preview-image-slider-container" ref={containerRef}>
          <div className="home-preview-image-slider-wrapper">
            <div
              className="home-preview-image-slider-track"
              style={{ '--translate-x-images': `${-currentIdx * imgWidth}px` }}
            >
              {home?.imageUrls?.map((imageUrl, idx) => (
                <div
                  key={idx}
                  className="images-slider-item"
                  ref={idx === 0 ? imgRef : null}
                >
                  <img src={imageUrl} alt={`${home.name} preview image`} />
                </div>
              ))}
            </div>
          </div>
          {!isMobile && <div className="images-slider-buttons-container">
            <div className="images-slider-btn-left">
              {currentIdx > 0 && (
                <button
                  onClick={(ev) => onPrevClick(ev)}
                  className="images-slider-btn left"
                >
                  <img src="https://res.cloudinary.com/do0a92wpm/image/upload/v1699218785/left-arrow_ap8jfr.svg" />
                </button>
              )}
            </div>
            <div className="images-slider-btn-right">
              {currentIdx < home?.imageUrls?.length - 1 && (
                <button
                  onClick={(ev) => onNextClick(ev)}
                  className="images-slider-btn right"
                >
                  <img src="https://res.cloudinary.com/do0a92wpm/image/upload/v1699218790/right-arrow_pxdlnj.svg" />
                </button>
              )}
            </div>
          </div>}
          <div className="home-preview-dots-indicator-wrapper">
            <DotsIndicator
              slidesNum={home?.imageUrls?.length}
              currentIdx={currentIdx}
              onDotClick={onDotClick}
            />
          </div>
        </div>
        <div className="home-preview-info-container">
          <p>
            {home.loc?.city
              ? `${capitalizeStr(home.type)} in ${capitalizeStr(
                  home.loc.city
                )} `
              : capitalizeStr(home.type)}
          </p>
          {location.pathname !== '/wishlists' && <p>{getNextAvailableStayStr(home)}</p>}
          <p>
            {`${roundToDecimals(home.price * 3 * 1.14).toLocaleString()}$`}
            {` for 3 nights`} · ★ <span>{getAvgRating(home)}</span>
          </p>
        </div>
      </article>
    </Link>
  )
}
