import { FaStar } from 'react-icons/fa'
import { useSelector } from "react-redux";
import { getAvgRating, roundToDecimals } from "../services/util.service";
import { openOrderConfirmationModal } from '../store/actions/draft-order.actions';
import { useEffect, useState } from 'react';
import { useIsMobile } from '../Providers/MobileProvider';
import { ReactSVG } from 'react-svg';
import { LikeButton } from './LikeButton';
import { HomeDetailsMobileHeader } from './HomeDetailsMobileHeader';

export function HeaderHomeDetailsScrolled() {
    const home = useSelector(state => state.homeModule.home)
    const isHDStickyCardScrolled = useSelector(state => state.scrollModule.isHDStickyCardScrolled)
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1300)
    const isMobile = useIsMobile()
    
      useEffect(() => {
          function handleResize() {
            const width = window.innerWidth
            setIsWideScreen(width > 1300)
          }
      
          handleResize()
      
          window.addEventListener('resize', handleResize, { passive: true })
          return () => window.removeEventListener('resize', handleResize)
        }, [])

    if (isMobile) return <HomeDetailsMobileHeader />

    return (<header className={`home-details-scrolled-header 
                            ${isWideScreen ? 'narrow-layout' : 'wide-layout'}`}>
            <div className="header-home-details-wrapper">
                <nav>
                    <div>Photos</div>
                    <div>Amenities</div>
                    <div>Location</div>
                </nav>
                {isHDStickyCardScrolled && <div className="reservation-header-modal">
                    <div className="reservation-header-modal-text-container">
                        <div>
                            <span>{roundToDecimals(home.price).toLocaleString()}$</span>
                            <span>{'\u00A0'}night</span> 
                        </div>
                        <div className='home-details-reviews'>
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
                                    {roundToDecimals(getAvgRating(home)).toLocaleString()}{' '}
                                </span>
                            </span>
                            <span>•</span>
                            <span>{home.reviews?.length} reviews </span>
                        </div>
                    </div>
                    <button onClick={openOrderConfirmationModal}>Reserve</button>
                </div>}
            </div>
        </header>
    )
}