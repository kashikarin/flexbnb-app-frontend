import { useState } from 'react'
import { useEffectUpdate } from '../customHooks/useEffectUpdate.js'

export function WhereDropdown({ 
  isOpen, 
  onClose, 
  cityFilter, 
  onUpdateFilterBy, 
  dropdownRef, 
  onSelectCity
}) {

    const [cityFilterToEdit, setCityFilterToEdit] = useState({city: cityFilter || ''})

  useEffectUpdate(()=>{
    onUpdateFilterBy(cityFilterToEdit)
  }, [cityFilterToEdit])

    const suggestedPlaces = [
        { city: 'Tel Aviv-Yafo', country: 'Israel', subtitle: 'Popular beach destination' },
        { city: 'London', country: 'United Kingdom', subtitle: 'For its stunning architecture'},
        { city: 'Barcelona', country: 'Spain', subtitle: 'Popular beach destination'},
        { city: 'Paris', country: 'France', subtitle: 'For its bustling nightlife'},
    ]

    function handleClick(ev, city) {
      ev.preventDefault()
      ev.stopPropagation()
      setCityFilterToEdit(prev => ({...prev, city}))
      if (onSelectCity) {
        onSelectCity(city) 
      } else {
        onClose?.()
      }
    }
    
    return (
      <div ref={dropdownRef}>
        {isOpen && (
          <div className="where-dropdown-panel dropdown-wrapper">
            <div>Suggested destinations</div>
            <ul>
              {suggestedPlaces.map((place, idx) => (
                <li key={idx} onClick={(ev) => handleClick(ev, place.city)}>
                  <div className="where-dropdown-row-content">
                    <img src={`/img/cities/${place.city.toLowerCase().replace(/[^a-z0-9]/g, "")}.png`} alt={place.city} className="where-dropdown-city-image" />
                    <div className="where-dropdown-city-txt">
                      <strong>{place.city}, {place.country}</strong>
                      <div className="subtitle">{place.subtitle}</div>
                    </div>
                  </div>
                  
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
}