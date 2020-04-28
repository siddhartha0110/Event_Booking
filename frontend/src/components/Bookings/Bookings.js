import React, { Component } from 'react'
import AuthContext from '../../context/auth-context';
import * as Spinners from 'css-spinners-react'
import BookingList from './BookingList/BookingList';

class BookingsPage extends Component {
    state = {
        isLoading: false,
        bookings: []
    }

    static contextType = AuthContext;
    componentDidMount() {
        this.fetchBookings();
    }

    fetchBookings = () => {
        this.setState({ isLoading: true });
        const EventsQuery = {
            query: `
            query{
                bookings{
                    _id 
                    createdAt
                    event{
                        _id
                        title
                        date
                    }
                }
            }
            `
        };

        //Send a request to the backend
        fetch('http://localhost:5000/graphql', {
            method: "POST",
            body: JSON.stringify(EventsQuery),
            headers: {
                'Content-Type': "application/json",
                'Authorization': "Bearer " + this.context.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                const bookings = resData.data.bookings
                this.setState({ bookings: bookings, isLoading: false })
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoading: false })
            })
    }

    deleteBooking = bookingId => {
        this.setState({ isLoading: true });
        const BookingCancel = {
            query: `
            mutation{
                cancelBooking(bookingId:"${bookingId}"){
                    _id
                    title
                }
            }
            `
        };

        //Send a request to the backend
        fetch('http://localhost:5000/graphql', {
            method: "POST",
            body: JSON.stringify(BookingCancel),
            headers: {
                'Content-Type': "application/json",
                Authorization: "Bearer " + this.context.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                this.setState(prevState => {
                    const updatedBookings = prevState.bookings.filter(booking => {
                        return booking._id !== bookingId
                    });
                    return { bookings: updatedBookings, isLoading: false }
                })
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoading: false })
            })
    }

    render() {

        return (
            <div>
                {this.state.isLoading ?
                    <div style={{ textAlign: "center" }}> <Spinners.Timer /> </div>
                    : <BookingList
                        bookings={this.state.bookings}
                        onDelete={this.deleteBooking}
                    />
                }
            </div>
        )
    }
}

export default BookingsPage;
