import { calculateNightsForTable, formatOrderDateToTable, getGuestCount, getStatusText } from "../services/util.service"
import { UserImageCircle } from "./UserImageCircle"

export function OrdersTableDesktop({orders, isDashboard = false, handleBookingAction = null }){
    const homeImagePlaceholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIGZpbGw9IiNFMEUwRTAiLz4KICA8dGV4dCB4PSI1MCIgeT0iNDAiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM3Nzc3NzciIGZvbnQtc2l6ZT0iMTRweCIgZm9udC1mYW1pbHk9IkFyaWFsIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+"

    return(
        <div className="desktop-table-view">
            <div className="table-wrapper">
                <table className="bookings-table">
                    <thead>
                    <tr>
                        <th>Property</th>
                        <th>{isDashboard ? 'Guest' : 'Host'}</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Guests</th>
                        <th>Total</th>
                        <th>Status</th>
                        {isDashboard && <th>Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
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
                        <td className="guest-or-host-cell">
                            <div className="guest-or-host-info">
                            <UserImageCircle 
                                imageUrl={isDashboard ? order.purchaser?.imageUrl : order.host?.imageUrl}
                                name={isDashboard ? order.purchaser?.fullname || order.host?.fullname : order.host?.fullname}
                                father='dashboard'
                            />
                            <div className="guest-or-host-details">
                                <div className="guest-or-host-name">
                                {
                                    isDashboard ? order.purchaser?.fullname || 'Unknown':
                                    order.host?.fullname || 'Unknown' 
                                }
                                </div>
                                {isDashboard && <div className="guest-email">
                                    {isDashboard ? order.purchaser?.email || 'No email' : order.host?.email || 'No email'}
                                </div>}
                            </div>
                            </div>
                        </td>
                        <td className="date-cell">
                            <div className="check-date">
                                {formatOrderDateToTable(order.checkIn)}
                            </div>
                        </td>
                        <td className="date-cell" style={{paddingBlockStart: '27px', lineHeight: '1rem'}}>
                            <div className="check-date">
                                {formatOrderDateToTable(order.checkOut)}
                            </div>
                            <div className="nights-count">
                                {calculateNightsForTable(order.checkIn, order.checkOut)}{' '}
                                {calculateNightsForTable(order.checkIn, order.checkOut) > 1 ? 
                                    'nights' : 'night'}
                            </div>
                        </td>
                        <td className="guests-cell"style={{paddingBlockStart: '27px', lineHeight: '1rem'}}>
                            <div className="guests-count">
                                {getGuestCount(order.guests)} {getGuestCount(order.guests) > 1 ? ' guests' : ' guest'}
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
                        {isDashboard && (
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
    )
}