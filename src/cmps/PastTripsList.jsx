export function PastTripsList({orders}){

    const homeImagePlaceholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIGZpbGw9IiNFMEUwRTAiLz4KICA8dGV4dCB4PSI1MCIgeT0iNDAiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM3Nzc3NzciIGZvbnQtc2l6ZT0iMTRweCIgZm9udC1mYW1pbHk9IkFyaWFsIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+"

    return(
        <div className="desktop-paast-trips-table-view">
            <div className="table-wrapper">
                <table className="bookings-table">
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>Host</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Guests</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order=>(
                            <tr key={order._id} className="past-trip-row">
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
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        
    )
}