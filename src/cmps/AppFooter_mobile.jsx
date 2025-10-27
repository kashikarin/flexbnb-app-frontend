import { NavLink, useLocation } from "react-router-dom"
import { FaSearch, FaHeart, FaUser } from "react-icons/fa"
import { AiOutlineMessage } from "react-icons/ai"
import { MdOutlineTravelExplore } from "react-icons/md"
import { ReactSVG } from 'react-svg'
import { HomeDetailsMobileFooter } from "./HomeDetailsMobileFooter"

export function AppFooter_mobile() {
  const location = useLocation()
  const isHomeDetails = location.pathname.startsWith('/home/')
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
          <NavLink to="" className={({ isActive }) => "nav-btn"} onClick={(ev) => ev.preventDefault()}>
            <ReactSVG src="/svgs/profile-icon.svg" />
            <span>Profile</span>
          </NavLink>
        </nav>
      </footer>)
  )
}
