import React from 'react'
import './EventItem.css';
const EventItem = props => (
    <li key={props._eventId} className="events_list-item">
        <div>
            <h1>{props.title}</h1>
            <h4>₹{props.price} - {new Date(props.date).toLocaleDateString()}</h4>
        </div>
        <div>
            {props.userId === props.creatorId ? <p>You are the owner of this event</p>
                : <button className="btn"
                    onClick={props.onDetail.bind(this, props.eventId)}>
                    View Details</button>}
        </div>
    </li>
)

export default EventItem; 