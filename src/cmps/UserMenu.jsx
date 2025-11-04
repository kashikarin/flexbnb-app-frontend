import { useState, useRef, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ReactSVG } from 'react-svg'
import { Link } from 'react-router-dom'
import { userService } from '../services/user/index'
import { SET_LOGGEDINUSER } from '../store/reducers/user.reducer'
import { logout, setAuthMode } from '../store/actions/user.actions.js'
import { AuthModal } from './AuthModal.jsx'

export function UserMenu() {
  const loggedInUser = useSelector((state) => state.userModule.loggedInUser)
  const dispatch = useDispatch()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const authMode = useSelector(state => state.userModule.authMode)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  useEffect(() => {
    const initUser = async () => {
      try {
        const user = await userService.getCurrentUser()
        if (user) {
          dispatch({ type: SET_LOGGEDINUSER, user })
        }
      } catch (err) {
        console.log('No user session found')
      }
    }

    if (!loggedInUser) {
      initUser()
    }
  }, [dispatch, loggedInUser])

  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen)
  }

  function onOpenAuthModal(mode = 'login') {
    setAuthMode(mode)
    setIsDropdownOpen(false)
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

  return (
    <>
      <div className="user-menu-container" ref={dropdownRef}>
        <div className="user-menu" onClick={toggleDropdown}>
          <ReactSVG src="/svgs/user-menu-hamburger.svg" />
        </div>

        {isDropdownOpen && (
          <div className="user-menu-dropdown">
            {loggedInUser ? (
              <div className="user-menu-content">
                <div className="user-greeting">
                  Hi, {loggedInUser.fullname || loggedInUser.username}
                </div>
                <div className="menu-divider"></div>
                <Link
                  to="/wishlists"
                  className="menu-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Wishlist
                </Link>
                <div className="menu-divider"></div>
                <button
                  className="menu-item logout-item"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="user-menu-content">
                <button
                  className="menu-item"
                  onClick={() => onOpenAuthModal('login')}
                >
                  Log In
                </button>
                <button
                  className="menu-item"
                  onClick={() => onOpenAuthModal('signup')}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
