import { Routes, Route, Navigate, useLocation } from 'react-router'
import { HomeIndex } from './pages/HomeIndex.jsx'
import { AdminIndex } from './pages/AdminIndex.jsx'
import { HomeDetails } from './pages/HomeDetails'
import { AppFooterWrapper } from './cmps/AppFooterWrapper'
import { UserMsg } from './cmps/UserMsg.jsx'
import { ScrollToTop } from './cmps/ScrollToTop.jsx'
import { Hosting } from './pages/Hosting.jsx'
import { HomeEdit } from './pages/HomeEdit.jsx'
import { useEffect, useState } from 'react'
import { HomeEditFooter } from './cmps/home-edit/HomeEditFooter.jsx'
import { Wishlist } from './cmps/Wishlist.jsx'
import MyTravels from './cmps/MyTravels.jsx'
import { BookingDashboard } from './pages/BookingDashboard.jsx'
import { initUser } from './store/actions/user.actions.js'
import { BookingPlaceholder } from './cmps/BookingPlaceholder.jsx'
import { BuyingStepOneModal } from './cmps/BuyingStepOneModal.jsx'
import { useSelector } from 'react-redux'
import { draftOrderService } from './services/draft-order/draft-order.service.local.js'
import { addOrder } from './store/actions/order.actions.js'
import { closeOrderConfirmationModal } from './store/actions/draft-order.actions.js'

export function RootCmp({ mainRef, isSearchExpanded, setIsSearchExpanded }) {
  const location = useLocation()
  const isHomeEdit = location.pathname === '/hosting/edit'
  const isHomeDetails = location.pathname.startsWith('/home/')
  const isMobile = useSelector((state) => state.systemModule.isMobile)
  console.log('isMobile', isMobile)
  const isOrderConfirmationModalOpen = useSelector(
    (state) => state.draftOrderModule.isOrderConfirmationModalOpen
  )
  const { getNumberOfNights } = draftOrderService
  const home = useSelector((state) => state.homeModule.home)
  const draftOrder = useSelector((state) => state.draftOrderModule.draftOrder)
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1300)
    
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
    initUser()
  }, [])
  return (
    <>
      <ScrollToTop />
      <div className={isHomeDetails && isWideScreen ? 'narrow-layout' : 'wide-layout'}>
        <UserMsg />
        <main ref={mainRef}>
          <Routes>
            <Route
              path=""
              element={<HomeIndex setIsSearchExpanded={setIsSearchExpanded} />}
            />
            <Route path="home/:homeId" element={<HomeDetails />} />
            <Route path="/wishlists" element={<Wishlist />} />
            <Route path="/my-travels" element={<MyTravels />} />
            <Route
              path="admin"
              element={
                <AuthGuard checkAdmin={true}>
                  <AdminIndex />
                </AuthGuard>
              }
            />
            <Route path="hosting" element={<Hosting />}>
              <Route index element={<BookingPlaceholder />} />
              <Route path="edit" element={<HomeEdit />} />
              <Route path="reservations" element={<BookingDashboard />} />
            </Route>
          </Routes>
        </main>

        {home && draftOrder && isOrderConfirmationModalOpen && (
          <BuyingStepOneModal
            draftOrder={draftOrder}
            homePrice={home.price}
            nightsNum={getNumberOfNights(
              draftOrder.checkIn,
              draftOrder.checkOut
            )}
            homeType={home.type}
            homeCity={home.loc?.city || ''}
            homeCountry={home.loc?.country || ''}
            homeSummary={home.summary}
            addOrder={addOrder}
            closeOrderConfirmationModal={closeOrderConfirmationModal}
          />
        )}
        {isHomeEdit && <HomeEditFooter />}
        {!isSearchExpanded && <AppFooterWrapper />}
      </div>
    </>
  )
}

function AuthGuard({ children, checkAdmin = false }) {
  const user = useSelector((storeState) => storeState.userModule.loggedInUser)
  const isNotAllowed = !user || (checkAdmin && !user.isAdmin)
  if (isNotAllowed) {
    console.log('Not Authenticated!')
    return <Navigate to="/" />
  }
  return children
}
