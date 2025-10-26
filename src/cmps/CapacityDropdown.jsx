import { useRef } from 'react'
import { ReactSVG } from 'react-svg'
import { useIsMobile } from '../Providers/MobileProvider'

export function CapacityDropdown({
  isOpen,
  onClose,
  father,
  adultsFilter,
  childrenFilter,
  infantsFilter,
  petsFilter,
  setAdultsNum,
  setChildrenNum,
  setInfantsNum,
  setPetsNum,
  homeCapacity,
  petsAllowed,
}) {

  const numbersReady =
    adultsFilter !== null &&
    childrenFilter !== null &&
    infantsFilter !== null &&
    petsFilter !== null

  const isMobile = useIsMobile()

  return isOpen && numbersReady ? (
    <div>
      <div className="capacity-dropdown-container">
        <div 
          className="capacity-dropdown-panel" 
          style={father === 'reservation-modal' ? 
              {left: 'unset', 
              right: '0', 
              borderRadius: '4px', 
              marginTop: '0px', 
              boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 6px, rgba(0, 0, 0, 0.07) 0px 0px 0px 1px'} : {}}>
          <div className="capacity-drowdown-categories-wrapper">
            <div className="capacity-drowdown-category-row adults">
              <div className="category-row-description">
                <div>Adults</div>
                <div>Age 18+</div>
              </div>
              <div className="category-row-user-action">
                <button
                  onMouseDown={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                  }}
                  onClick={() => setAdultsNum((prev) => Number(prev) - 1)}
                  disabled={adultsFilter <= 0}
                >
                  <ReactSVG src="/svgs/minus-icon.svg" />
                </button>
                <span>{adultsFilter}</span>{' '}
                <button
                  onMouseDown={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                  }}
                  onClick={() => setAdultsNum((prev) => Number(prev) + 1)}
                >
                  <ReactSVG src="/svgs/plus-icon.svg" />
                </button>
              </div>
            </div>
            <div className="capacity-drowdown-category-row children">
              <div className="category-row-description">
                <div>Children</div>
                <div>Ages 2-17</div>
              </div>
              <div className="category-row-user-action">
                <button
                  onMouseDown={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                  }}
                  onClick={() => setChildrenNum((prev) => prev - 1)}
                  disabled={childrenFilter <= 0}
                >
                  <ReactSVG src="/svgs/minus-icon.svg" />
                </button>
                <span>{childrenFilter}</span>{' '}
                <button
                  onMouseDown={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                  }}
                  onClick={() => setChildrenNum((prev) => prev + 1)}
                >
                  <ReactSVG src="/svgs/plus-icon.svg" />
                </button>
              </div>
            </div>
            <div className="capacity-drowdown-category-row infants">
              <div className="category-row-description">
                <div>Infants</div>
                <div>Under 2</div>
              </div>
              <div className="category-row-user-action">
                <button
                  onMouseDown={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                  }}
                  onClick={() => setInfantsNum((prev) => prev - 1)}
                  disabled={infantsFilter <= 0}
                >
                  <ReactSVG src="/svgs/minus-icon.svg" />
                </button>
                <span>{infantsFilter}</span>{' '}
                <button
                  onMouseDown={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                  }}
                  onClick={() => setInfantsNum((prev) => prev + 1)}
                >
                  <ReactSVG src="/svgs/plus-icon.svg" />
                </button>
              </div>
            </div>
            <div className="capacity-drowdown-category-row pets">
              <div className="category-row-description">
                <div>Pets</div>
                <div>Bringing a service animal?</div>
              </div>
              <div className="category-row-user-action">
                <button
                  onMouseDown={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                  }}
                  onClick={() => setPetsNum((prev) => prev - 1)}
                  disabled={petsFilter <= 0}
                >
                  <ReactSVG src="/svgs/minus-icon.svg" />
                </button>
                <span>{petsFilter}</span>{' '}
                <button
                  onMouseDown={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                  }}
                  onClick={() => setPetsNum((prev) => prev + 1)}
                >
                  <ReactSVG src="/svgs/plus-icon.svg" />
                </button>
              </div>
            </div>
            {father === 'search-bar' || isMobile ? (
              ''
            ) : (
              <div className="capacity-dropdown-capacity-description">
                <span>
                  This place has a maximum of {homeCapacity}{' '}
                  {homeCapacity > 1 ? 'guests' : 'guest'}, not including
                  infants. Pets {petsAllowed ? 'are' : "aren't"} allowed
                </span>
              </div>
            )}
          </div>
          {father === 'search-bar' || isMobile ? (
            ''
          ) : (
            <button onClick={onClose}>Close</button>
          )}
        </div>
      </div>
    </div>
  ) : null
}
