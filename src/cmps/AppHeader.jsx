import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FaAirbnb } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { SearchBar } from './SearchBar'
import { LabelsSlider } from './LabelsSlider'
import { userService } from '../services/user/index'
import { SET_LOGGEDINUSER } from '../store/reducers/user.reducer'
import { HeaderHomeDetailsScrolled } from './HeaderHomeDetailsScrolled'
import { HeaderHomeEdit } from './home-edit/HeaderHomeEdit'
import { setPotentialHome } from '../store/actions/home-edit.actions'
import {
  setHomePageNotScrolled,
  setHomePageScrolled
} from '../store/actions/scroll.actions'
import { UserMenu } from './UserMenu'
import { useIsMobile } from '../Providers/MobileProvider'
import { SearchBar_mobile } from './SearchBar_mobile'
import { HomeDetailsMobileHeader } from './HomeDetailsMobileHeader'

export function AppHeader({ scrollContainerRef, setIsSearchExpanded }) {
  const dispatch = useDispatch()
  const location = useLocation()
  const isHomePageScrolled = useSelector(
    (state) => state.scrollModule.isHomePageScrolled
  )
  const isHDImgScrolled = useSelector(
    (state) => state.scrollModule.isHDImgScrolled
  )
  const isHomeIndex = location.pathname === '/'
  const isHosting = location.pathname.startsWith('/hosting')
  const isHomeEdit = location.pathname === '/hosting/edit'
  const isHomeDetails = location.pathname.startsWith('/home/')
  const isBookingDashboard = location.pathname === '/hosting/reservations/'
  const isWishLists = location.pathname === '/wishlists'
  const loggedInUser = useSelector((state) => state.userModule.loggedInUser)
  const [forceExpand, setForceExpand] = useState(false)
  const isMobile = useIsMobile()
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1300)
      
  useEffect(() => {
    if (isHomeDetails && isHDImgScrolled) {
      setHomePageNotScrolled()
    }
  }, [isHomeDetails, isHDImgScrolled])

  useEffect(() => {
      function handleResize() {
        const width = window.innerWidth
        setIsWideScreen(width > 1300)
      }
  
      handleResize()
  
      window.addEventListener('resize', handleResize, { passive: true })
      return () => window.removeEventListener('resize', handleResize)
    }, [])

  useEffect(() => {
    if (!isHomeIndex) return
    function handleScroll() {
      if (window.scrollY > 20) setHomePageScrolled()
      else setHomePageNotScrolled()
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() 
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  useEffect(() => {
    ;(async function initAndLoadData() {
      try {
        await loadLoggedInUser()
      } catch (err) {
        console.error('Cannot create or load data', err)
      }
    })()
  }, [])

  async function loadLoggedInUser() {
    const loggedInUser = await userService.getLoggedinUser()
    if (loggedInUser) {
      dispatch({ type: SET_LOGGEDINUSER, user: loggedInUser })
    }
  }

  useEffect(() => {
    if (!isHomeIndex || isHomeDetails) return
    if (!isHomeIndex) {
      setHomePageScrolled()
    } else {
      setHomePageNotScrolled()
    }
  }, [isHomeIndex, isHomeDetails])

  function onCreateNewListing() {
    if (!loggedInUser) return console.warn('No logged in user yet!')
    setPotentialHome()
  }

  const shouldCollapse = isHomePageScrolled || !isHomeIndex

  return (
    <header
      className={`app-header ${
        shouldCollapse && !forceExpand ? 'scrolled' : ''
      } ${isHosting || isHDImgScrolled ? 'one-row-divider' : ''}
      ${forceExpand ? 'expanded' : ''}
      ${isHomeDetails && isWideScreen ? 'narrow-layout' : 'wide-layout'}
      ${
        (isBookingDashboard || isWishLists) && isMobile
          ? 'searchbar-wrapper-mobile'
          : ''
      }
      `}
    >
      {isHomeEdit ? (
        <HeaderHomeEdit />
      ) : isHDImgScrolled && isHomeDetails ? (
        <HeaderHomeDetailsScrolled />
      ) : (
        <>
          <nav
            className={`app-header-main-nav ${
              shouldCollapse ? 'scrolled' : 'expanded'
            }
            ${isHomeDetails && isWideScreen ? 'narrow-layout' : 'wide-layout'}`}
            style={!(isHomeDetails && isMobile) ? {paddingBlockEnd: '2rem'} : {}}
          >
            {isHomeDetails && isMobile && <HomeDetailsMobileHeader />}
            {/* hosting, excluding edit, routes: */}
            {isHosting ? (
              !isMobile ? (
                <div className="app-header-main-nav-content hosing-layout">
                  {/* hosting - left section */}
                  <div className="app-header-left-section">
                    <NavLink
                      to="/"
                      className="logo"
                      onClick={() => dispatch(setHomePageNotScrolled())}
                    >
                      <FaAirbnb className="logo-icon" />
                      <span>flexbnb</span>
                    </NavLink>
                  </div>
                  {/* hosting - mid section */}
                  <nav className="hosting-header-nav">
                    <NavLink to="/hosting/edit" onClick={onCreateNewListing}>
                      Create a new listing
                    </NavLink>
                    <NavLink to="/hosting/reservations/">Reservations</NavLink>
                  </nav>
                  {/* hosting - right section */}
                  <div className="app-header-right-section">
                    {loggedInUser ? (
                      <>
                        {isWideScreen && (<Link to={isHosting ? '/' : '/hosting'}>
                          {isHosting
                            ? 'Switch to traveling'
                            : 'Switch to hosting'}
                        </Link>)}
                        <div className="user-info">
                          <Link to={`user/${loggedInUser._id}`}>
                            {loggedInUser.imageUrl ? (
                              <img
                                src={loggedInUser.imageUrl}
                                alt={
                                  loggedInUser.fullname || loggedInUser.username
                                }
                              />
                            ) : (
                              <div className="user-avatar-placeholder">
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
                          </Link>
                        </div>
                      </>
                    ) : (
                      <Link to={'/'}>Become a host</Link>
                    )}
                    <UserMenu />
                  </div>
                </div>
              ) : (
                <div className="app-header-main-nav-content hosing-layout">
                  <div className="app-header-left-section">
                    <NavLink
                      to="/"
                      className="logo"
                      onClick={() => dispatch(setHomePageNotScrolled())}
                    >
                      <FaAirbnb className="logo-icon" />
                      <span>flexbnb</span>
                    </NavLink>
                  </div>
                </div>
              )
            ) : (
              <>
                {/* non-hosting layout */}
                {!isMobile && (
                  <div className="app-header-main-nav-content">
                    {/* non-hosting - left section */}
                    <div className="app-header-left-section">
                      <NavLink
                        to="/"
                        className="logo"
                        onClick={() => dispatch(setHomePageNotScrolled())}
                      >
                        <FaAirbnb className="logo-icon" />
                        <span>flexbnb</span>
                      </NavLink>
                    </div>
                    {/* non-hosting - right section */}
                    <div className="app-header-right-section">
                      {loggedInUser ? (
                        <>
                      {isWideScreen && (<Link to={isHosting ? '/' : '/hosting'}>
                            {isHosting
                              ? 'Switch to traveling'
                              : 'Switch to hosting'}
                          </Link>)}
                          <div className="user-info">
                            <Link to={`user/${loggedInUser._id}`}>
                              {loggedInUser.imageUrl ? (
                                <img
                                  src={loggedInUser.imageUrl}
                                  alt={
                                    loggedInUser.fullname ||
                                    loggedInUser.username
                                  }
                                />
                              ) : (
                                <div className="user-avatar-placeholder">
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
                            </Link>
                          </div>
                        </>
                      ) : (
                        <Link to={'/'}>Become a host</Link>
                      )}
                      <UserMenu />
                    </div>
                  </div>
                )}
                {/* home details mobile header */}
                {isWishLists && isMobile && (
                  <div className="app-header-main-nav-content">
                    {/* non-hosting - left section */}
                    <div className="app-header-left-section">
                      <NavLink
                        to="/"
                        className="logo"
                        onClick={() => dispatch(setHomePageNotScrolled())}
                      >
                        <FaAirbnb className="logo-icon" />
                        <span>flexbnb</span>
                      </NavLink>
                    </div>
                  </div>
                )}
                {/* non-hosting - mid section (searchbar) */}
                <div
                  className={`app-header-mid-section ${
                    shouldCollapse ? 'scrolled' : 'expanded'
                  }`}
                >
                  {!isWishLists ? (
                    !isMobile ? (
                      <div
                        className={`searchbar-wrapper ${
                          shouldCollapse ? 'scrolled' : 'expanded'
                        }`}
                      >
                        <SearchBar
                          shouldCollapse={shouldCollapse}
                          forceExpand={forceExpand}
                          setForceExpand={setForceExpand}
                          scrollContainerRef={scrollContainerRef}
                        />
                      </div>
                    ) : (
                      isHomeIndex ? (<div className="searchbar-wrapper-mobile">
                        <SearchBar_mobile
                          setIsSearchExpanded={setIsSearchExpanded}
                        />
                      </div>) : <></>
                    )
                  ) : (
                    <div></div>
                  )}
                </div>
              </>
            )}
          </nav>

          {/* bottom-row */}
          <div
            className={`app-header-bottom-row ${
              !isHomePageScrolled ? 'expanded' : ''
            }`}
          >
            {isHomeIndex && !isHomePageScrolled && !isMobile && (
              <div className="app-header-labels-slider-wrapper">
                <LabelsSlider />
              </div>
            )}
          </div>
        </>
      )}
    </header>
  )
}
