import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { useSelector } from "react-redux"
import { ReactSVG } from "react-svg"
import { logout } from "../store/actions/user.actions"
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { UserImageCircle } from "./UserImageCircle"
import { OrdersTableMobile } from './OrdersTableMobile'
import { loadOrders, setFilterOrdersBy } from '../store/actions/order.actions'

export function ProfileMobile(){
    const loggedInUser = useSelector(state => state.userModule.loggedInUser)
    const navigate = useNavigate()
    const [isPastTripsModalOpen, setIsPastTripsModalOpen] = useState(false)
    const orders = useSelector(state => state.orderModule.orders)

    useEffect(()=>{
        if (!loggedInUser?._id) return
        const filter = { purchaserId: loggedInUser._id }
        setFilterOrdersBy(filter)
        loadOrders(filter)
    }, [loggedInUser])

    useEffect(() => {
        if (!loggedInUser) navigate('/')
    }, [loggedInUser, navigate])

    useEffect(() => {
        let portalRoot = document.getElementById('portal-root')
        if (!portalRoot) {
            portalRoot = document.createElement('div')
            portalRoot.id = 'portal-root'
            document.body.appendChild(portalRoot)
        }
    }, [])

    if (!loggedInUser) return null
    return(
        <>
            <section className="profile-mobile-container">
                <span>Profile</span>
                <article className="profile-mobile-bix-boxes-container">
                    <div className="profile-mobile-big-box user-info">
                        <UserImageCircle 
                            imageUrl={loggedInUser.imageUrl} 
                            name={loggedInUser.fullname || loggedInUser.username} 
                            father='profile-mobile'
                        />
                        <span>{loggedInUser.fullname || loggedInUser.username}</span>
                    </div>
                    <div className="profile-mobile-big-box past-trips" onClick={()=> setIsPastTripsModalOpen(true)}>
                        <img className="iekrptg atm_e2_1osqo2v atm_vy_1osqo2v atm_jp_sm7xtg atm_jr_xm9jbw atm_5j_nw3v2p atm_vh_yfq0k3 dir dir-ltr" aria-hidden="true" elementtiming="LCP-target" src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-trips-tab/original/c2f5127b-f701-4e2d-bbf0-d54afe17d6e3.png?im_w=720" data-original-uri="https://a0.muscache.com/pictures/airbnb-platform-assets/AirbnbPlatformAssets-trips-tab/original/c2f5127b-f701-4e2d-bbf0-d54afe17d6e3.png" width="100%" height="auto"></img>
                        <span>Past trips</span>
                    </div>
                </article>
                <article className="profile-mobile-links-list-container">
                    <div className="profile-mobile-link">
                        <ReactSVG src='/svgs/new-listing-icon.svg' />
                        <span>Create a new listing</span>
                    </div>
                    <div className="profile-mobile-link">
                        <ReactSVG src='/svgs/logout-icon.svg' />
                        <span onClick={logout}>Log out</span>
                    </div>
                </article>
            </section>
            {isPastTripsModalOpen && createPortal(
                <motion.div
                    className="past-trips-modal"
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                >
                    <button className="past-trips-modal-close-btn" onClick={()=>setIsPastTripsModalOpen(false)}>
                        <ReactSVG src='/svgs/arrow-back-header.svg' />    
                    </button>
                    <h2>Past trips</h2>
                    <OrdersTableMobile 
                        orders={orders} 
                        isDashboard={false}
                    />
                </motion.div>,
                document.getElementById('portal-root')
            )}
        </>
        
    )
}