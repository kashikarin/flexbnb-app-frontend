import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { UserImageCircle } from "./UserImageCircle"
import { Link } from "react-router-dom"
import { PastTripsPlaceholder } from "./PastTripsPlaceholder"

export function ProfileDesktop(){
    const loggedInUser = useSelector(state => state.userModule.loggedInUser)
    const navigate = useNavigate()
    const [selectedContent, setSelectedContent] = useState('user-info')


    useEffect(() => {
        if (!loggedInUser) navigate('/')
    }, [loggedInUser, navigate])

    if (!loggedInUser) return null
    return(
        <section className="profile-desktop-container">
            <aside>
                <span>Profile</span>  
                <div className={`profile-sidebar-row ${selectedContent === 'user-info' ? 'active' : ''}`} onClick={()=>setSelectedContent('user-info')}>
                    <UserImageCircle 
                        imageUrl={loggedInUser.imageUrl} 
                        name={loggedInUser.fullname || loggedInUser.username} 
                        father='profile-desktop-sidebar'
                    />
                    <span>About me</span>
                </div>
                <div className={`profile-sidebar-row ${selectedContent === 'past-trips' ? 'active' : ''}`} onClick={()=>setSelectedContent('past-trips')}>
                    <img class="iekrptg atm_e2_1osqo2v atm_vy_1osqo2v atm_jp_sm7xtg atm_jr_xm9jbw atm_5j_nw3v2p atm_vh_yfq0k3 dir dir-ltr" aria-hidden="true" alt="" elementtiming="LCP-target" src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-UserProfile/original/797c1df2-a40c-4d93-9550-ca5b213cd01b.png?im_w=720" data-original-uri="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-UserProfile/original/797c1df2-a40c-4d93-9550-ca5b213cd01b.png" width="40" height="40"></img>
                    <span>Past trips</span>
                </div>
            </aside>
            <main>
                <span>{selectedContent === 'user-info' ? 'About me' : 'Past trips'}</span>
                {selectedContent === 'user-info' && (
                    <div className="profile-desktop-user-info-box">
                        <UserImageCircle 
                            imageUrl={loggedInUser.imageUrl} 
                            name={loggedInUser.fullname || loggedInUser.username} 
                            father='profile-desktop-main'
                        />
                        <span>{loggedInUser.fullname || loggedInUser.username}</span>
                    </div>
                )}
                {selectedContent === 'past-trips' && <PastTripsPlaceholder />}
            </main>
            

        </section>
        
    )
}