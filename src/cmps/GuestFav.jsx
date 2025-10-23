import { FaStar } from 'react-icons/fa'
import { getAvgRating } from '../services/util.service'
import { useEffect, useState } from 'react'

export function GuestFav({ home }) {
  const rating = getAvgRating(home) || 0
  const reviewsCount = home?.reviews?.length || 0
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1300)
  
  useEffect(() => {
      function handleResize() {
        const width = window.innerWidth
        setIsWideScreen(width > 1300)
      }
  
      // Set initial state
      handleResize()
  
      window.addEventListener('resize', handleResize, { passive: true })
      return () => window.removeEventListener('resize', handleResize)
    }, [])
  
  return (
    <div className='guest-fav-container'>
      <div className='guest-fav-badge-row'>
        <div className='guest-fav-wings'>
          <img
            src='https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/78b7687c-5acf-4ef8-a5ea-eda732ae3b2f.png'
            alt='left wing'
          />
          <div className='guest-fav-wings-text'>
            <span>Guest</span>
            <span>favorite</span>
          </div>
          <img
            className='guest-fav-wing-right'
            src='https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/b4005b30-79ff-4287-860c-67829ecd7412.png'
            alt='right wing'
          />
        </div>
        {isWideScreen ? 
          <div className='guest-fav-text'>
            One of the most loved homes on Flexbnb, according to guests
          </div> :
          <div className='guest-fav-divider' />
        }
        <div className='guest-fav-rating-block'>
          <span className='guest-fav-rating'>{rating.toFixed(2)}</span>
          <div className='guest-fav-stars'>
            {[...Array(fullStars)].map((_, i) => (
              <FaStar key={i} />
            ))}
            {hasHalfStar && <FaStar key='half' style={{ opacity: 0.4 }} />}
            {[...Array(emptyStars)].map((_, i) => (
              <FaStar key={i + fullStars + 1} style={{ opacity: 0.2 }} />
            ))}
          </div>
        </div>
        <div className='guest-fav-divider' />
        <div className='guest-fav-reviews-block'>
          <span className='guest-fav-reviews-count'>{reviewsCount}</span>
          <span className='guest-fav-reviews-label'>Reviews</span>
        </div>
      </div>
    </div>
  )
}
