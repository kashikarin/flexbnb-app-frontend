import { useSelector } from "react-redux"
import { loadOrders } from "../store/actions/order.actions"
import { useEffect } from "react"
import { useIsMobile } from "../Providers/MobileProvider"
import { OrdersTableDesktop } from "../cmps/OrdersTableDesktop"
import { OrdersTableMobile } from "../cmps/OrdersTableMobile"

export function PastTrips(){
    const loggedInUser = useSelector(state => state.userModule.loggedInUser)
    const orders = useSelector((state) => state.orderModule.orders)
    const isMobile = useIsMobile()
    console.log("🚀 ~ orders:", orders)
    useEffect(()=>{
        if (!loggedInUser?._id) return
        const filterBy = { purchaserId: loggedInUser._id }
        loadOrders(filterBy)
              
    }, [loggedInUser])

    return(
        <div className='past-trips-wrapper'>
            <h2>Past Trips</h2>
            <section className="past-trips-container">
                {isMobile ? 
                    <OrdersTableMobile 
                        orders={orders} 
                        isDashboard={false} 
                    /> :
                    <OrdersTableDesktop
                        orders={orders} 
                        isDashboard={false}
                    />     
                }
            </section>
        </div>
        
    )
}