import { Link } from "react-router-dom"
export function PastTripsPlaceholder(){
    return(
        <div className="profile-desktop-past-trips-box">          
            <img className="iekrptg atm_e2_1osqo2v atm_vy_1osqo2v atm_jp_sm7xtg atm_jr_xm9jbw atm_5j_nw3v2p atm_vh_yfq0k3 dir dir-ltr" aria-hidden="true" elementtiming="LCP-target" src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-trips-tab/original/c2f5127b-f701-4e2d-bbf0-d54afe17d6e3.png?im_w=720" data-original-uri="https://a0.muscache.com/pictures/airbnb-platform-assets/AirbnbPlatformAssets-trips-tab/original/c2f5127b-f701-4e2d-bbf0-d54afe17d6e3.png" width="100%" height="auto"></img>
            <span>You’ll find your past reservations here after you’ve taken your first trip on Airbnb.</span>
            <Link to='/'>Book a trip</Link>
        </div>
    )
}