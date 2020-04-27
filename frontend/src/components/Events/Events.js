import React, { Component } from 'react'
import './Events.css';
import Modal from '../Modal/Modal';
import Backdrop from '../Modal/BackDrop/Backdrop';
import DateTimePicker from 'react-datetime-picker';
import AuthContext from '../../context/auth-context';
import EventList from './EventList/EventList';
import * as Spinners from 'css-spinners-react'
class EventsPage extends Component {
    constructor(props) {
        super(props)
        this.titleEl = React.createRef()
        this.priceEl = React.createRef()
        this.descriptionEl = React.createRef()
        this.dateEl = React.createRef()
    }
    static contextType = AuthContext;
    state = {
        create: false,
        date: new Date(),
        events: [],
        isLoading: false,
        selectedEvent: null
    }
    componentDidMount() {
        this.fetchEvents();
    }
    onChange = date => this.setState({ date })

    createEventHandler = () => {
        this.setState({ create: true });
    }

    modalCancelHandler = () => {
        this.setState({ create: false, selectedEvent: null })
    }

    modalCreateHandler = () => {
        this.setState({ create: false })
        const title = this.titleEl.current.value;
        const price = +this.priceEl.current.value;
        const description = this.descriptionEl.current.value;
        const date = this.state.date.toString();

        if (title.trim().length === 0 || price <= 0 || description.trim().length === 0)
            return
        const newCreatedEvent = {
            query: `
            mutation{
                createEvent(eventInput:{title:"${title}",description:"${description}",price:${price},date:"${date}"}){
                    _id title description date price
                }
            }
            `
        };
        const token = this.context.token;
        //Send a request to the backend
        fetch('http://localhost:5000/graphql', {
            method: "POST",
            body: JSON.stringify(newCreatedEvent),
            headers: {
                'Content-Type': "application/json",
                'Authorization': "Bearer " + token
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
                    const updatedEvents = [...prevState.events];
                    updatedEvents.push({
                        id: resData.data.createEvent._id,
                        title: resData.data.createEvent.title,
                        description: resData.data.createEvent.description,
                        date: resData.data.createEvent.date,
                        price: resData.data.createEvent.price,
                        creator: { _id: this.context.userId }
                    });
                    return { events: updatedEvents }
                })
            })
            .catch(err => { console.log(err) })
    }

    fetchEvents = () => {
        this.setState({ isLoading: true });
        const EventsQuery = {
            query: `
            query{
                events{
                    _id title description date price
                    creator{_id email name}
                }
            }
            `
        };

        //Send a request to the backend
        fetch('http://localhost:5000/graphql', {
            method: "POST",
            body: JSON.stringify(EventsQuery),
            headers: {
                'Content-Type': "application/json"
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                const events = resData.data.events
                this.setState({ events: events, isLoading: false })
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoading: false })
            })
    }
    showDetailHandler = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId)
            return { selectedEvent: selectedEvent };
        })
    }
    bookEventHandler = () => {

    }
    render() {
        return (
            <React.Fragment>
                {(this.state.create || this.state.selectedEvent) && <Backdrop />}
                {this.state.create &&
                    <Modal title="Add Your Event" text="Create Event"
                        canCancel canCreate onCancel={this.modalCancelHandler} onCreate={this.modalCreateHandler}>
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" ref={this.titleEl} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" id="price" ref={this.priceEl} />
                            </div>
                            <div>
                                <label htmlFor="date">Date</label><br />
                                <DateTimePicker
                                    value={this.state.date}
                                    onChange={this.onChange}
                                    required
                                    id="date"
                                />
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" rows="4" ref={this.descriptionEl}></textarea>
                            </div>
                        </form>
                    </Modal>}
                {this.state.selectedEvent &&
                    <Modal title="About This Event"
                        canCancel
                        canCreate
                        onCancel={this.modalCancelHandler}
                        onCreate={this.modalCreateHandler}
                        text="Book This Event">
                        <h1>{this.state.selectedEvent.title}</h1>
                        <h2>₹{this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                        <p>{this.state.selectedEvent.description}</p>
                    </Modal>}
                {this.context.token && <div className="events-control">
                    <p>Share Your Events!</p>
                    <button className="btn" onClick={this.createEventHandler}>Create Event</button>
                </div>}
                {this.state.isLoading ? <div style={{ textAlign: "center" }}><Spinners.Timer /> </div> :
                    <EventList events={this.state.events}
                        authUserId={this.context.userId}
                        onViewDetail={this.showDetailHandler} />}
            </React.Fragment>
        )
    }
}

export default EventsPage;
