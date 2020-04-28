import React from 'react'
import './BookingList.css'

const BookingList = props => {
    return (
        <ul className="booking-list">
            {props.bookings.map(booking => (
                <li className="booking-item" key={booking._id}>
                    <div className="booking-item-data">
                        {booking.event.title} - {' '}
                        {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                    <div className="booking-item-action">
                        <button className="btn"
                            onClick={props.onDelete.bind(this, booking._id)}>Cancel Booking</button>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default BookingList
