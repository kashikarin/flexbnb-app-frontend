import { useSelector } from "react-redux"
import { ReactSVG } from "react-svg"
import { logout } from "../store/actions/user.actions"
import { useNavigate } from "react-router"
import { useEffect } from "react"

export function ProfileMobile(){
    const loggedInUser = useSelector(state => state.userModule.loggedInUser)
    const navigate = useNavigate()

    useEffect(() => {
        if (!loggedInUser) navigate('/')
    }, [loggedInUser, navigate])

    if (!loggedInUser) return null
    return(
        <section className="profile-mobile-container narrow-layout">
            <h2>Profile</h2>
            <article className="profile-user-box">
                {/* user-image */}
                {loggedInUser.imageUrl ? (
                    <img
                    src={loggedInUser.imageUrl}
                    alt={
                        loggedInUser.fullname || loggedInUser.username
                    }
                    />
                ) : (
                    <div className="profile-user-avatar-placeholder">
                        <span>
                            {(
                            loggedInUser.fullname ||
                            loggedInUser.username ||
                            'U'
                            )
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                    </div>
                )}
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