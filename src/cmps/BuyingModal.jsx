import { useState } from 'react'
import { useNavigate } from 'react-router'
import { roundToDecimals } from '../services/util.service'
import { removeDraftOrder } from '../store/actions/draft-order.actions'

export function BuyingModal({
  draftOrder,
  homePrice,
  nightsNum,
  homeType,
  homeCity,
  homeCountry,
  homeSummary,
  addOrder,
  closeOrderConfirmationModal
}) {
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  async function handleConfirm(e) {
    e.preventDefault()
    try {
      const savedOrder = await addOrder(draftOrder)
      return savedOrder
    } catch(err) {
      console.error('Failed to add order', err)
    } finally {
      setCurrentStep(2)
    } 
  }
  
  const guestsNum =
    Number(draftOrder?.guests?.adults ?? 0) + Number(draftOrder?.guests?.children ?? 0)
  const serviceFeeRate = 0.14

  function formatDate(date) {
    if (!date) return ''
    
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  function formatAmount(num) {
    if (num == null || isNaN(num)) return '$0'
    
    return Number(num).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  }
  if (!draftOrder || !homePrice || !nightsNum) {
  return <div className="loader-container">
          <span className="loading"></span>
        </div>
}
  return (
    <div className='buying-modal'>
      <div>
        <h3>{currentStep === 2 ? 'Booking Confirmed!' : 'One last step'}</h3>
        <p>
          {currentStep === 2 ? (
            'Thank you! Your reservation has been successfully confirmed.'
          ) : (
            <>
              Dear Guest,
              <br />
              In order to complete your reservation, please confirm your trip
              details.
            </>
          )}
        </p>
        
        <div className='reservation-details'>
          
          <div className='reservation-info'>
            <div className='reservation-date-guest'>
              <h3>
                {currentStep === 2
                  ? 'Reservation completed successfully'
                  : 'Reservation details'}
              </h3>
              <p>
                <span>Trip dates:</span>
                <span>{`${formatDate(draftOrder?.checkIn)} - ${formatDate(draftOrder?.checkOut)}`}</span>
              </p>
              <p>
                <span>Guests:</span>
                <span>{`${guestsNum} ${
                  guestsNum > 1 ? 'guests' : 'guest'
                }`}</span>
              </p>
            </div>
            <div className='reservation-price-details'>
              <h3>Price Details</h3>
              <div className='price-amount'>
                <p>
                  <span>{`${formatAmount(homePrice)} x ${nightsNum} ${
                    nightsNum > 1 ? 'nights' : 'night'
                  }`}</span>
                  <span>{formatAmount(homePrice * nightsNum)}</span>
                </p>
              </div>
              <div className='service-fee'>
                <p>
                  <span>Service fee</span>
                  <span>{formatAmount(homePrice * nightsNum * serviceFeeRate)}</span>
                </p>
              </div>
              <div className='total'>
                <p>
                  <span>Total</span>
                  <span>
                    {formatAmount(homePrice * nightsNum * (1 + serviceFeeRate))}
                  </span>
                </p>
              </div>
              <div className="buying-modals-divider"></div>
            </div>
          </div>
          <div className='property-details'>
            <img src={draftOrder?.home?.imageUrl} alt='Property' />
            <div className='property-info'>
              <h4>
                {homeType} in {homeCity}, {homeCountry}
              </h4>
              <p>{homeSummary}</p>
            </div>
          </div>
        </div>
        <div className='modal-actions'>
          <button
            className='back-btn'
            onClick={() => {
              if (currentStep === 2) {
                removeDraftOrder()
                navigate('/')
                closeOrderConfirmationModal()
              }
              else closeOrderConfirmationModal()
            }}
          >
            {currentStep === 2 ? 'Close' : 'Back'}
          </button>
          {currentStep !== 2 && (
            <button className='confirm-btn' onClick={handleConfirm}>
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
