import { useState, useEffect, useRef } from 'react'
import { ReactSVG } from 'react-svg'
import { CapacityDropdown } from './CapacityDropdown'
import { BuyingModal } from './BuyingModal'
import { formatDate, normalizeDate, roundToDecimals } from '../services/util.service'
import { DatesDropdown } from './DatesDropdown'
import { draftOrderService } from '../services/draft-order/draft-order.service.local'
import { useSelector } from 'react-redux'
import { DatesInputs } from './DatesInputs'


export function ReservationModal({
  home,
  draftOrder,
  updateDraftOrder,
  openOrderConfirmationModal,
}) {
  const [openedDropdown, setOpenedDropdown] = useState(null)
  const loggedInUser = useSelector((state) => state.userModule.loggedInUser)
  console.log(Boolean(loggedInUser))

  const rmSelectionRef = useRef(null)
  const rmDatesRef = useRef()
  const rmCapacityDropdownRef = useRef()

  const [adultsNum, setAdultsNum] = useState(draftOrder.guests?.adults ?? 0)
  const [childrenNum, setChildrenNum] = useState(
    draftOrder.guests?.children ?? 0
  )
  const [infantsNum, setInfantsNum] = useState(draftOrder.guests?.infants ?? 0)
  const [petsNum, setPetsNum] = useState(draftOrder.guests?.pets ?? 0)

  const { getNumberOfNights } = draftOrderService
  const nightsNum = getNumberOfNights(draftOrder.checkIn, draftOrder.checkOut)

  useEffect(() => {
    if (!draftOrder?.guests) return
    setAdultsNum(draftOrder.guests.adults ?? 0)
    setChildrenNum(draftOrder.guests.children ?? 0)
    setInfantsNum(draftOrder.guests.infants ?? 0)
    setPetsNum(draftOrder.guests.pets ?? 0)
  }, [draftOrder?.guests])

  useEffect(() => {
    onUpdateDatesDetails(home.price * nightsNum * 1.14)
    console.log(
      '🚀 ~ home.price * nightsNum * 1.14:',
      home.price * nightsNum * 1.14
    )
  }, [nightsNum])

  useEffect(() => {
    onUpdateGuestsDetails({
      adults: adultsNum,
      children: childrenNum,
      infants: infantsNum,
      pets: petsNum,
    })
  }, [adultsNum, childrenNum, infantsNum, petsNum])

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (openedDropdown === 'checkIn' || openedDropdown === 'checkOut') {
        if (rmDatesRef.current && !rmDatesRef.current.contains(event.target)) {
          onCloseDropdown()
        }
      }

      if (openedDropdown === 'capacity') {
        const clickedInsideDropdown =
        rmCapacityDropdownRef.current?.contains(event.target)
        const clickedTrigger = rmSelectionRef.current
        ?.querySelector('.reservation-selection-guest-container')
        ?.contains(event.target)
        if (!clickedInsideDropdown && !clickedTrigger) {
          onCloseDropdown()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openedDropdown])


  function handleWhereClick(e, btName) {
    e.stopPropagation()
    setOpenedDropdown((curr) => (curr === btName ? null : btName))
  }

  function onCloseDropdown() {
    setOpenedDropdown(null)
  }

  function handleChange(ev) {
  }
  function getGuestsNumStrToDisplay() {
    if (!adultsNum && !childrenNum) return 'Add guests'
    const guestsNum = Number(adultsNum ?? 0) + Number(childrenNum ?? 0)
    return `${guestsNum} ${guestsNum > 1 ? 'guests' : 'guest'}`
  }

  function onUpdateDatesDetails(updatedTotalPrice) {
    updateDraftOrder({ ...draftOrder, totalPrice: updatedTotalPrice })
  }

  function onUpdateGuestsDetails(updatedGuests) {
    updateDraftOrder({ ...draftOrder, guests: updatedGuests })
  }

  

  console.log('🚀 ~ draftOrder:', draftOrder)
  if (!draftOrder) return null
  return (
    <aside className="home-details-reservation-modal-section">
      <div className="reservation-header">
        <div className="reservation-header-price-container">
          <span>{`${roundToDecimals(home.price).toLocaleString()}$ `}</span>
          <span>night</span>
        </div>
      </div>
      <div className="reservation-selection" ref={rmSelectionRef}>
        <DatesInputs 
          checkIn={normalizeDate(draftOrder.checkIn)}
          checkOut={normalizeDate(draftOrder.checkOut)}
          openedDropdown={openedDropdown}
          handleWhereClick={handleWhereClick}
        />
        {openedDropdown === 'checkIn' && (
          <div className="rm-dates-dropdown-wrapper" ref={rmDatesRef}>
            <DatesDropdown
              isOpen={true}
              isReservationModalDD={true}
              openedDropdown={openedDropdown}
              handleWhereClick={handleWhereClick}
              checkIn={normalizeDate(draftOrder.checkIn)}
              checkOut={normalizeDate(draftOrder.checkOut)}
              nightsNum={nightsNum}
              onSetDates={({ checkIn, checkOut }) => {
                updateDraftOrder({ ...draftOrder, 
                  checkIn: normalizeDate(checkIn), 
                  checkOut: normalizeDate(checkOut) })
                if (checkIn && checkOut) onCloseDropdown()
              }}
              bookings={home.bookings}
            />
          </div>
        )}
        {openedDropdown === 'checkOut' ? (
          <div className="rm-dates-dropdown-wrapper" ref={rmDatesRef}>
            <DatesDropdown
              isOpen={true}
              isReservationModalDD={true}
              openedDropdown={openedDropdown}
              handleWhereClick={handleWhereClick}
              checkIn={normalizeDate(draftOrder.checkIn)}
              checkOut={normalizeDate(draftOrder.checkOut)}
              nightsNum={nightsNum}
              onSetDates={({ checkIn, checkOut }) => {
                updateDraftOrder({ ...draftOrder, 
                  checkIn: normalizeDate(checkIn), 
                  checkOut: normalizeDate(checkOut) })
                if (checkIn && checkOut) onCloseDropdown()
              }}
              bookings={home.bookings}
            />
          </div>
        ) : null}
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            gridColumn: 'span 2',
          }}
        >
          <div
            className={`reservation-selection-guest-container ${
              openedDropdown === 'capacity' ? 'active' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation()
              handleWhereClick(e, 'capacity')
            }}
          >
            <div className="reservation-selection-guests-input">
              <div>GUESTS</div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontSize: '14px' }} onChange={handleChange}>
                  {getGuestsNumStrToDisplay()}
                </div>
                <ReactSVG src="/svgs/arrow-down.svg" />
              </div>
            </div>
          </div>
          <div
            ref={rmCapacityDropdownRef}
            className="reservation-selection-guest-dropdown-wrapper"
          >
            <CapacityDropdown
              isOpen={openedDropdown === 'capacity'}
              onClose={onCloseDropdown}
              father={'reservation-modal'}
              adultsFilter={Number(adultsNum ?? 0)}
              childrenFilter={Number(childrenNum ?? 0)}
              infantsFilter={Number(infantsNum ?? 0)}
              petsFilter={Number(petsNum ?? 0)}
              setAdultsNum={setAdultsNum}
              setChildrenNum={setChildrenNum}
              setInfantsNum={setInfantsNum}
              setPetsNum={setPetsNum}
              homeCapacity={home.capacity}
              petsAllowed={home.petsAllowed}
            />
          </div>
        </div>
      </div>
      <button
        onClick={openOrderConfirmationModal}
        disabled={!loggedInUser}
        style={{
          cursor: !loggedInUser ? 'not-allowed' : 'pointer',
          background: !loggedInUser && 'gray',
        }}
      >
        Reserve
      </button>
      {loggedInUser && <span>You won't be charged yet</span>}

      {!loggedInUser && (
        <span>Please log in to be able to make a reservation</span>
      )}
      <div className="reservation-summary-information-container">
        <div className="cost-breakdown-container">
          <div className="reservation-summary-row price">
            <span>
              {roundToDecimals(home.price || 550).toLocaleString()} x{' '}
              {nightsNum} {nightsNum > 1 ? 'nights' : 'night'}
            </span>
            <span>
              {roundToDecimals(
                (home.price || 550) * nightsNum
              ).toLocaleString()}
            </span>
          </div>
          <div className="reservation-summary-row service-fee">
            <span>Flexbnb service fee</span>
            <span>
              $
              {roundToDecimals(
                (home.price || 550) * nightsNum * 0.14
              ).toLocaleString()}
            </span>
          </div>
          <div className="reservation-summary-row total">
            <span>Total</span>
            <span>
              $
              {roundToDecimals(
                (home.price || 550) * nightsNum * 1.14
              ).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
