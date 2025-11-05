import React, { useState, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadOrders, updateOrder } from '../store/actions/order.actions'
import AccessDenied from '../cmps/AccessDenied'
import { useOrderFilterSearchParams } from '../customHooks/useOrderFilterSearchParams'
import { UserImageCircle } from '../cmps/UserImageCircle'

export const BookingDashboard = () => {
  const loggedInUser = useSelector((state) => state.userModule.loggedInUser)
  const orders = useSelector((state) => state.orderModule.orders)

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const { filterBy, setExistOrderFilterSearchParams } = useOrderFilterSearchParams()  
  const homeImagePlaceholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIGZpbGw9IiNFMEUwRTAiLz4KICA8dGV4dCB4PSI1MCIgeT0iNDAiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM3Nzc3NzciIGZvbnQtc2l6ZT0iMTRweCIgZm9udC1mYW1pbHk9IkFyaWFsIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+"
  // Load orders on component mount (for any logged in user)
  
  useEffect(() => {
    if (!loggedInUser) return
      loadOrders()
  }, [loggedInUser])

  // Helper functions

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
  }

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusText = (status) => {
    const statusMap = {
      approved: 'Approved',
      pending: 'Pending',
      rejected: 'Rejected',
    }
    return statusMap[status] || status
  }

  const getGuestCount = (guests) => {
    if (!guests) return 0
    let count = parseInt(guests.adults) || 0
    count += parseInt(guests.children) || 0
    // count += parseInt(guests.infants) || 0
    return count
  }

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
        console.log("🚀 ~ updatedOrder:", updatedOrder)
        
        await loadOrders()
        console.log('Orders reloaded successfully')
      } else {
        console.error('Order not found with ID:', selectedBooking)
      }
    } catch (err) {
      console.error('Error in confirmBookingAction:', err)

      try {
        await loadOrders()
      } catch (reloadErr) {
        console.error('Error reloading orders:', reloadErr)
      }
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

    const txt = (filterBy?.txt || '').toLowerCase()
    const status = filterBy?.status || 'all'

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
    
  }, [orders, filterBy, loggedInUser])

  const stats = useMemo(() => {
    if (!orders || !loggedInUser)
      return { total: 0, approved: 0, pending: 0, rejected: 0, revenue: 0 }

    return {
      total: orders.length,
      approved: orders.filter((b) => b.status === 'approved').length,
      pending: orders.filter((b) => b.status === 'pending').length,
      rejected: orders.filter((b) => b.status === 'rejected').length,
      revenue: orders
        .filter((b) => b.status === 'approved')
        .reduce((sum, b) => sum + b.totalPrice, 0),
    }
  }, [orders, loggedInUser])

const canManageBookings = filteredBookings.some(order => order.status === 'pending')
const ordersToShow = filteredBookings || []

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
                value={filterBy.txt || ''}
                onChange={(e) => setExistOrderFilterSearchParams({ ...filterBy, txt: e.target.value })}
              />
            </div>
            <div className="filter-box">
              <select
                value={filterBy.status || ''}
                onChange={(e) => setExistOrderFilterSearchParams({ ...filterBy, status: e.target.value })}
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
                {/* Desktop Table View */}
                <div className="desktop-table-view">
                  <div className="table-wrapper">
                    <table className="bookings-table">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Guest</th>
                          <th>Check-in</th>
                          <th>Check-out</th>
                          <th>Guests</th>
                          <th>Total</th>
                          <th>Status</th>
                          {canManageBookings && <th>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {ordersToShow.map((order) => (
                          <tr key={order._id} className="booking-row">
                            <td className="property-cell">
                              <div className="property-info">
                                <img
                                  src={
                                    order.home?.imageUrl || 
                                    homeImagePlaceholder
                                  }
                                  alt={order.home?.name || 'Property'}
                                  className="property-image"
                                  onError={(e) => {
                                    if (
                                      !e.target.hasAttribute('data-fallback')
                                    ) {
                                      e.target.setAttribute(
                                        'data-fallback',
                                        'true'
                                      )
                                      e.target.src =
                                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNSAyMEgzNVYzMEgyNVYyMFoiIGZpbGw9IiNEREREREQiLz4KPHBhdGggZD0iTTQwIDI1SDUwVjM1SDQwVjI1WiIgZmlsbD0iI0RERERERCIvPgo8dGV4dCB4PSI0MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SG91c2U8L3RleHQ+Cjwvc3ZnPgo='
                                    }
                                  }}
                                />
                                <div className="property-details">
                                  <div className="property-name">
                                    {order.home?.name || 'Property Name'}
                                  </div>
                                  <div className="booking-id">
                                    #{order._id?.slice(-8) || 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="guest-cell">
                              <div className="guest-info">
                                <UserImageCircle 
                                  imageUrl={order.purchaser?.imageUrl}
                                  name={order.purchaser?.fullname || order.host?.fullname}
                                  father='dashboard'
                                />
                                <div className="guest-details">
                                  <div className="guest-name">
                                    {order.purchaser?.fullname ||
                                      order.host?.fullname ||
                                      'Unknown'}
                                  </div>
                                  <div className="guest-email">
                                    {order.purchaser?.email || 'No email'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="date-cell">
                              <div className="check-date">
                                {formatDate(order.checkIn)}
                              </div>
                            </td>
                            <td className="date-cell">
                              <div className="check-date">
                                {formatDate(order.checkOut)}
                              </div>
                              <div className="nights-count">
                                {calculateNights(order.checkIn, order.checkOut)}{' '}
                                nights
                              </div>
                            </td>
                            <td className="guests-cell">
                              <div className="guests-count">
                                {getGuestCount(order.guests)} guests
                              </div>
                              <div className="pets-count">
                                {`${order.guests?.pets ? 'With ' : 'No '}pets`}
                              </div>
                            </td>
                            <td className="price-cell">
                              <div className="total-price">
                                ${order.totalPrice?.toLocaleString() || '0'}
                              </div>
                            </td>
                            <td className="status-cell">
                              <span
                                className={`status-badge status-${order.status}`}
                              >
                                {getStatusText(order.status)}
                              </span>
                            </td>
                            {canManageBookings && (
                              <td className="actions-cell">
                                {order.status === 'pending' && (
                                  <div className="table-actions">
                                    <button
                                      className="table-btn approve-btn"
                                      onClick={() =>
                                        handleBookingAction(
                                          order._id,
                                          'approved'
                                        )
                                      }
                                      title="Approve booking"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      className="table-btn reject-btn"
                                      onClick={() =>
                                        handleBookingAction(
                                          order._id,
                                          'rejected'
                                        )
                                      }
                                      title="Reject booking"
                                    >
                                      ✗
                                    </button>
                                  </div>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Cards View */}
                <div className="mobile-cards-view">
                  <div className="bookings-grid">
                    {ordersToShow.map((order) => (
                      <div key={order._id} className="booking-card">
                        {/* Card Header */}
                        <div className="booking-header">
                          <div className="property-info">
                            <img
                              src={
                                order.home?.imageUrl ||
                                homeImagePlaceholder
                              }
                              alt={order.home?.name || 'Property'}
                              className="property-image"
                              onError={(e) => {
                                if (!e.target.hasAttribute('data-fallback')) {
                                  e.target.setAttribute('data-fallback', 'true')
                                  e.target.src =
                                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNSAyMEgzNVYzMEgyNVYyMFoiIGZpbGw9IiNEREREREQiLz4KPHBhdGggZD0iTTQwIDI1SDUwVjM1SDQwVjI1WiIgZmlsbD0iI0RERERERCIvPgo8dGV4dCB4PSI0MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SG91c2U8L3RleHQ+Cjwvc3ZnPgo='
                                }
                              }}
                            />
                            <div className="property-details">
                              <div className="property-name">
                                {order.home?.name || 'Property Name'}
                              </div>
                              <div className="booking-id">
                                #{order._id?.slice(-8) || 'N/A'}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`status-badge status-${order.status}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        {/* Booking Details */}
                        <div className="booking-details">
                          <div className="detail-row">
                            <div className="detail-item">
                              <span className="detail-label">Check-in</span>
                              <span className="detail-value">
                                {formatDate(order.checkIn)}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Check-out</span>
                              <span className="detail-value">
                                {formatDate(order.checkOut)}
                              </span>
                            </div>
                          </div>
                          <div className="detail-row">
                            <div className="detail-item">
                              <span className="detail-label">Duration</span>
                              <span className="detail-value">
                                {calculateNights(order.checkIn, order.checkOut)}{' '}
                                nights
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Guests</span>
                              <span className="detail-value">
                                {getGuestCount(order.guests)} guests
                                {order.guests?.pets &&
                                  ` + ${order.guests.pets} pets`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Guest Info */}
                        <div className="guest-section">
                          <div className="guest-info">
                            <UserImageCircle 
                              imageUrl={order.purchaser?.imageUrl}
                              name={order.purchaser?.fullname || order.host?.fullname}
                              father='dashboard'
                            />
                            {/* {order.purchaser?.imageUrl ? (
                              <img
                                src={order.purchaser?.imageUrl}
                                alt={
                                  order.purchaser?.fullname ||
                                  order.host?.fullname ||
                                  'Guest'
                                }
                                className="guest-image"
                              />
                            ) : (
                              <div className="user-avatar-placeholder">
                                {(
                                  loggedInUser.fullname ||
                                  loggedInUser.username ||
                                  'U'
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )} */}
                            <div className="guest-details">
                              <div className="guest-name">
                                {order.purchaser?.fullname ||
                                  order.host?.fullname ||
                                  'Unknown'}
                              </div>
                              <div className="guest-email">
                                {order.purchaser?.email || 'No email'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="booking-footer">
                          <div className="total-price">
                            ${order.totalPrice?.toLocaleString() || '0'}
                          </div>
                          {canManageBookings && order.status === 'pending' && (
                            <div className="card-actions">
                              <button
                                className="card-btn approve-btn"
                                onClick={() =>
                                  handleBookingAction(order._id, 'approved')
                                }
                                title="Approve booking"
                              >
                                ✓ Approve
                              </button>
                              <button
                                className="card-btn reject-btn"
                                onClick={() =>
                                  handleBookingAction(order._id, 'rejected')
                                }
                                title="Reject booking"
                              >
                                ✗ Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
