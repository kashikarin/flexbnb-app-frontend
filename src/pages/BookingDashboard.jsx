import React, { useState, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadOrders, setFilterOrdersBy, updateOrder } from '../store/actions/order.actions'
import AccessDenied from '../cmps/AccessDenied'
import { useOrderFilterSearchParams } from '../customHooks/useOrderFilterSearchParams'
import { OrdersTableDesktop } from '../cmps/OrdersTableDesktop'
import { OrdersTableMobile } from '../cmps/OrdersTableMobile'
import { useIsMobile } from '../Providers/MobileProvider'

export function BookingDashboard() {
  const loggedInUser = useSelector((state) => state.userModule.loggedInUser)
  const orders = useSelector((state) => state.orderModule.orders)
  const filterOrdersBy = useSelector((state) => state.orderModule.filterOrdersBy)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const { setExistOrderFilterSearchParams } = useOrderFilterSearchParams()  
  const isMobile = useIsMobile()
  // const homeImagePlaceholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIGZpbGw9IiNFMEUwRTAiLz4KICA8dGV4dCB4PSI1MCIgeT0iNDAiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM3Nzc3NzciIGZvbnQtc2l6ZT0iMTRweCIgZm9udC1mYW1pbHk9IkFyaWFsIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+"
  // Load orders on component mount (for any logged in user)

  useEffect(() => {
    if (!loggedInUser?._id) return
    setFilterOrdersBy({ hostId: loggedInUser._id })
    loadOrders(filterOrdersBy)
      
  }, [loggedInUser])

  // Helper functions

  const handleBookingAction = (bookingId, action) => {
    setSelectedBooking(bookingId)
    setConfirmAction(action)
    setShowConfirmModal(true)
  }

  const confirmBookingAction = async () => {
    if (!selectedBooking || !confirmAction) return
    setShowConfirmModal(false)

    try {
      // Find the order and update its status
      const orderToUpdate = orders.find(order => order._id === selectedBooking)
      if (orderToUpdate) {
        const updatedOrder = { ...orderToUpdate, status: confirmAction }
        await updateOrder(updatedOrder)
        await loadOrders(filterOrdersBy)
        
        await loadOrders(filterOrdersBy)
        console.log('Orders reloaded successfully')
      } else {
        console.error('Order not found with ID:', selectedBooking)
      }
    } catch (err) {
        console.error('Error in confirmBookingAction:', err)
    } finally {
        setSelectedBooking(null)
        setConfirmAction(null)
    }
  }

  const cancelConfirmAction = () => {
    setShowConfirmModal(false)
    setSelectedBooking(null)
    setConfirmAction(null)
  }

  const getActionText = (action) => {
    const actionMap = {
      approved: 'approve',
      rejected: 'reject',
      pending: 'set as pending',
    }
    return actionMap[action] || action
  }

  // Filter and sort orders - unapproved orders first, then approved
  const filteredBookings = useMemo(() => {
    if (!orders || !loggedInUser) return []

    const txt = (filterOrdersBy?.txt || '').toLowerCase()
    const status = filterOrdersBy?.status || 'all'

    const filtered = orders.filter((order) => {
      const matchesSearch =
        order.home?.name?.toLowerCase().includes(txt) ||
        order.purchaser?.fullname?.toLowerCase().includes(txt)

      const matchesStatus = status === 'all' || order.status === status

      return matchesSearch && matchesStatus
    })

    const statusPriority = {
      pending: 1,
      approved: 2,
      rejected: 3,
    }

    return filtered.sort((a, b) => {
      return statusPriority[a.status] - statusPriority[b.status]
    })
    
  }, [orders, filterOrdersBy, loggedInUser])

  const stats = useMemo(() => {
    if (!filteredBookings || !loggedInUser)
      return { total: 0, approved: 0, pending: 0, rejected: 0, revenue: 0 }

    return {
      total: filteredBookings.length,
      approved: filteredBookings.filter((b) => b.status === 'approved').length,
      pending: filteredBookings.filter((b) => b.status === 'pending').length,
      rejected: filteredBookings.filter((b) => b.status === 'rejected').length,
      revenue: filteredBookings
        .filter((b) => b.status === 'approved')
        .reduce((sum, b) => sum + b.totalPrice, 0),
    }
  }, [filteredBookings, loggedInUser])

// const canManageBookings = filteredBookings.some(order => order.status === 'pending')
const ordersToShow = filteredBookings || []
if (!loggedInUser) return null
  return (
    <div className="booking-dashboard">
      {loggedInUser ? (
        <div className="container">
          <header className="header">
            <h1>Bookings Dashboard</h1>
            <p>Manage and view your property reservations</p>
          </header>

          {/* Search and Filter Controls */}
          <div className="controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by property name or booker..."
                value={filterOrdersBy.txt || ''}
                onChange={(e) => setExistOrderFilterSearchParams({ ...filterOrdersBy, txt: e.target.value })}
              />
            </div>
            <div className="filter-box">
              <select
                value={filterOrdersBy.status || ''}
                onChange={(e) => setExistOrderFilterSearchParams({ ...filterOrdersBy, status: e.target.value })}
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Statistics */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.approved}</div>
              <div className="stat-label">Approved</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
            <div className="stat-card revenue-card">
              <div className="stat-number">
                ${stats.revenue.toLocaleString()}
              </div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>

          {/* Bookings - Desktop Table / Mobile Cards */}
          <div className="bookings-container">
            {!orders ? (
              <div className="no-results">
                <h3>Loading...</h3>
                <p>Please wait while we load your bookings</p>
              </div>
            ) : ordersToShow.length === 0 ? (
              <div className="no-results">
                <h3>No bookings found</h3>
                <p>Try adjusting your search or filter parameters</p>
              </div>
            ) : (
              <>
                {isMobile ? 
                  <OrdersTableMobile 
                    orders={ordersToShow} 
                    isDashboard={true} 
                    handleBookingAction={handleBookingAction} 
                  /> :
                  <OrdersTableDesktop
                    orders={ordersToShow} 
                    isDashboard={true} 
                    handleBookingAction={handleBookingAction} 
                  />     
                }                
              </>
            )}
          </div>

          {/* Confirmation Modal */}
          {showConfirmModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Confirm Action</h3>
                <p>
                  Are you sure you want to {getActionText(confirmAction)} this
                  booking?
                </p>
                <div className="modal-actions">
                  <button
                    className="action-btn cancel-btn"
                    onClick={cancelConfirmAction}
                  >
                    Cancel
                  </button>
                  <button
                    className="action-btn approve-btn"
                    onClick={confirmBookingAction}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <AccessDenied />
      )}
    </div>
  )
}
