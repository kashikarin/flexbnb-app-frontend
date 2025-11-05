import { useSelector } from "react-redux"
import { ReactSVG } from "react-svg"
import { logout } from "../store/actions/user.actions"
import { useNavigate } from "react-router"
import { useEffect } from "react"
import { UserImageCircle } from "./UserImageCircle"

export function ProfileMobile(){
    const loggedInUser = useSelector(state => state.userModule.loggedInUser)
    const navigate = useNavigate()

    useEffect(() => {
        if (!loggedInUser) navigate('/')
    }, [loggedInUser, navigate])

    if (!loggedInUser) return null
    return(
        <section className="profile-mobile-container">
            <span>Profile</span>
            <article className="profile-user-box">
                {/* user-image */}
                <UserImageCircle 
                    imageUrl={loggedInUser.imageUrl} 
                    name={loggedInUser.fullname || loggedInUser.username} 
                    father='profile-mobile'
                />
                <span>{loggedInUser.fullname || loggedInUser.username}</span>
            </article>
            <article className="profile-option">
                <ReactSVG src='/svgs/new-listing-icon.svg' />
                <span>Create a new listing</span>
            </article>
            <article className="profile-option">
                <ReactSVG src='/svgs/logout-icon.svg' />
                <span onClick={logout}>Log out</span>
            </article>
        </section>
    )
}