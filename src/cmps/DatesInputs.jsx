import { formatDate } from "../services/util.service"

export function DatesInputs({ checkIn, checkOut, withWrapper = false, openedDropdown, handleWhereClick }) {
    const inputs = (
            <>
                <div
                    className={`reservation-selection-date-checkin ${
                        openedDropdown === 'checkIn' ? 'active' : ''
                    }`}
                    onClick={(e) => {
                        e.stopPropagation()
                        handleWhereClick(e, 'checkIn')
                    }}
                >
                    <div className="rmTitle">CHECK-IN</div>
                    <input
                        className="placeholder-content"
                        type="text"
                        placeholder="Add Dates"
                        value={formatDate(checkIn)}
                        readOnly
                    />
                </div>
                <div
                    className={`reservation-selection-date-checkout ${
                        openedDropdown === 'checkOut' ? 'active' : ''
                    }`}
                    onClick={(e) => {
                        e.stopPropagation()
                        handleWhereClick(e, 'checkOut')
                    }}
                >
                    <div className="rmTitle">CHECK-OUT</div>
                    <input
                        className="rm-placeholder-content"
                        type="text"
                        placeholder="Add Dates"
                        value={formatDate(checkOut)}
                        readOnly
                    />
                </div>
            </>
            
    )

    return withWrapper ? <div className="reservation-selection">{inputs}</div> : inputs
}
