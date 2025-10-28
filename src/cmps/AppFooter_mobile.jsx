import { NavLink, useLocation } from "react-router-dom"
import { FaSearch, FaHeart, FaUser } from "react-icons/fa"
import { AiOutlineMessage } from "react-icons/ai"
import { MdOutlineTravelExplore } from "react-icons/md"
import { ReactSVG } from 'react-svg'
import { HomeDetailsMobileFooter } from "./HomeDetailsMobileFooter"
import { useSelector } from "react-redux"
import { useState } from "react"

export function AppFooter_mobile() {
  const loggedInUser = useSelector(state => state.userModule.loggedInUser)
  const location = useLocation()
  const isHomeDetails = location.pathname.startsWith('/home/')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isSignup, setIsSignup] = useState(false)

  function openAuthModal(ev, isSignupMode = false) {
    ev.preventDefault()
    setIsSignup(isSignupMode)
    setIsAuthModalOpen(true)
    // setError('')
  }

  async function handleLogout() {
      try {
        await logout()
        dispatch({ type: SET_LOGGEDINUSER, user: null })
        setIsDropdownOpen(false)
      } catch (err) {
        console.error('Logout failed:', err)
      }
  }
  
    function handleKeyPress(ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault()
        handleAuth()
      }
    }

  return (
    isHomeDetails ? (<HomeDetailsMobileFooter />) :
      (<footer className="app-footer-mobile">
        <nav className="bottom-nav">
          <NavLink to="/" className="nav-btn">
            <ReactSVG src="/svgs/search-icon-footer.svg" />
            <span>Explore</span>
          </NavLink>
          <NavLink to="/wishlists" className="nav-btn">
            <ReactSVG src="/svgs/heart-icon.svg" />
            <span>Wishlist</span>
          </NavLink>
          <NavLink to="/hosting/reservations" className="nav-btn">
            <ReactSVG src="/svgs/dashboard-icon.svg" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="" className={({ isActive }) => "nav-btn"} onClick={(ev) => loggedInUser ? openAuthModal(ev, true) : openAuthModal(ev, false)}>
            <ReactSVG src="/svgs/profile-icon.svg" />
            <span>{loggedInUser ? 'Log out' : 'Log in'}</span>
          </NavLink>
        </nav>
      </footer>)
  )
}
