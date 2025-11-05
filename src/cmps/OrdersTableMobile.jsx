import { calculateNightsForTable, formatOrderDateToTable, getGuestCount, getStatusText } from "../services/util.service"
import { UserImageCircle } from "./UserImageCircle"

export function OrdersTableMobile({orders, isDashboard = false, handleBookingAction = null}){
    console.log("🚀 ~ orders:", orders)
    const homeImagePlaceholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIGZpbGw9IiNFMEUwRTAiLz4KICA8dGV4dCB4PSI1MCIgeT0iNDAiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM3Nzc3NzciIGZvbnQtc2l6ZT0iMTRweCIgZm9udC1mYW1pbHk9IkFyaWFsIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+"

    return(
        <div className="mobile-cards-view">
            <div className="bookings-grid">
            {orders.map((order) => (
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
                            {formatOrderDateToTable(order.checkIn)}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Check-out</span>
                        <span className="detail-value">
                        {formatOrderDateToTable(order.checkOut)}
                        </span>
                    </div>
                    </div>
                    <div className="detail-row">
                    <div className="detail-item">
                        <span className="detail-label">Duration</span>
                        <span className="detail-value">
                            {calculateNightsForTable(order.checkIn, order.checkOut)}{' '}
                            {calculateNightsForTable(order.checkIn, order.checkOut) > 1 ? 
                                "nights" : "night"
                            }
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Guests</span>
                        <span className="detail-value">
                            {getGuestCount(order.guests)} {getGuestCount(order.guests) > 1 ? ' guests' : ' guest'}
                        </span>
                    </div>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">{isDashboard ? 'Purchaser' : 'Host'}</span>
                        <span className="detail-value">
                            {isDashboard ? order.purchaser?.fullname || order.host?.fullname :
                                order.host?.fullname
                            }
                        </span>
                    </div>
                </div>
                {/* Price and Actions */}
                <div className="booking-footer">
                    <div className="total-price">
                        ${order.totalPrice?.toLocaleString() || '0'}
                    </div>
                    {order.status === 'pending' && isDashboard && (
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
    )
}