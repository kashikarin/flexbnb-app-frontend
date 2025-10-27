import { useSelector } from "react-redux"
import { openOrderConfirmationModal } from "../store/actions/draft-order.actions"
import { roundToDecimals, formatRange } from "../services/util.service"
import { draftOrderService } from "../services/draft-order/draft-order.service.local"

export function HomeDetailsMobileFooter(){
    const draftOrder = useSelector(state => state.draftOrderModule.draftOrder)
    const { getNumberOfNights } = draftOrderService
    const nightsNum = getNumberOfNights(draftOrder?.checkIn, draftOrder?.checkOut)
    if (!draftOrder) return null
    return(
        <footer className='home-details-mobile-footer' >
            <div className="home-details-mobile-footer-wrapper">
                <div>
                    <span>{roundToDecimals(draftOrder?.totalPrice).toLocaleString()}$</span>
                    <span>
                        {'\u00A0'}
                        {`for 
                            ${nightsNum} 
                            ${nightsNum === 1 ? 'night' : 'nights'} · ${formatRange(draftOrder?.checkIn, draftOrder?.checkOut)}
                        `}
                    </span> 
                </div>
                <button onClick={openOrderConfirmationModal}>Reserve</button>
            </div>
        </footer>
    )
} 