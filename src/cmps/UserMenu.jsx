import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ReactSVG } from 'react-svg'
import { Link } from 'react-router-dom'
import { userService } from '../services/user/index'
import { SET_LOGGEDINUSER } from '../store/reducers/user.reducer'
import { logout, setAuthMode } from '../store/actions/user.actions.js'

export function UserMenu() {
  const loggedInUser = useSelector((state) => state.userModule.loggedInUser)
  const dispatch = useDispatch()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)
  const [coords, setCoords] = useState({ top: 0, right: 0 })
  const authMode = useSelector(state => state.userModule.authMode)

  useEffect(() => {
    let portalRoot = document.getElementById('portal-root')
    if (!portalRoot) {
      portalRoot = document.createElement('div')
      portalRoot.id = 'portal-root'
      document.body.appendChild(portalRoot)
    }
  }, [])

  function updateMenuPosition() {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    setCoords({
      top: rect.bottom + window.scrollY + 8,
      right: window.innerWidth - rect.right - window.scrollX - 8,
    })
  }

  function toggleDropdown() {
    if (!isDropdownOpen) updateMenuPosition()
    setIsDropdownOpen((prev) => !prev)
  }
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target) &&
          !buttonRef.current.contains(event.target)
         ) {
        setIsDropdownOpen(false)
      }
    }

    function handleEsc(e) {
      if (e.key === 'Escape') setIsDropdownOpen(false)
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEsc)
      window.addEventListener('resize', updateMenuPosition)
      window.addEventListener('scroll', updateMenuPosition)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition)
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

  const dropdown = (
    <div 
      className="user-menu-dropdown" 
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: coords.top,
        right: coords.right,
        zIndex: 2000,
      }}
    >
        {loggedInUser ? (
        <div className="user-menu-content">
          <div className="user-greeting">
            Hi, {loggedInUser.fullname || loggedInUser.username}
          </div>
          <div className="menu-divider"></div>
          <Link
            to="/profile"
            className="menu-item"
            onClick={() => setIsDropdownOpen(false)}
          >
            Profile
          </Link>
          {/* <div className="menu-divider"></div> */}
          <Link
            to="/pasttrips"
            className="menu-item"
            onClick={() => setIsDropdownOpen(false)}
          >
            My trips
          </Link>
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
            Log out
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
  )
  return (
    <>
      <div className="user-menu-container">
        <div className="user-menu" ref={buttonRef} onClick={toggleDropdown}>
          <ReactSVG src="/svgs/user-menu-hamburger.svg" />
        </div>

        {isDropdownOpen && 
          createPortal(
            dropdown,
            document.getElementById('portal-root') || document.body
          )}
          </div>
        
    </>
  )
}
