import React from 'react'
import { Link } from 'react-router-dom'
//import Tooltip from '../Shared/Tooltip'
import { connect } from 'react-redux'
import { reduxMoveToDone, reduxRemoveFromTodo, reduxRemoveFromDone } from '../../../redux/actions/userActions'
import { reduxChangeData, reduxTeamAddAction, reduxTeamRemoveAction } from '../../../redux/actions/pageActions'
//import URLS from '../../api/urls'
//import { postJson, deleteJson } from '../../api/functions'
import RSVPForm from '../EventsPage/RSVPForm';

/**
 * Cart component
 * renders a list of actions
 * @props title
 *      action list: title, image, id
 * 
 */
class EventCart extends React.Component {
    render() {
        return (
            // <!--Cart Outer-->
            <div className="cart-outer mb-5">
                <h3 className="center m-0 m-cart-header">{this.props.title}</h3>
                <div className="table-outer">
                    <table className="cart-table" style={{ width: '100%' }}>
                        {this.props.info ?
                            <thead className='cart-header'>
                                <tr>
                                    <th>Event</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            : null}
                        <tbody>
                            {this.props.info ? this.renderEventsMoreInfo(this.props.eventRSVPs) : this.renderEvents(this.props.eventRSVPs)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    renderEvents(eventRSVPs) {
        if (!eventRSVPs || eventRSVPs.length <= 0) {
            return (
                <tr key="1"><td colSpan="100%"><p className="m-0 p-2 w-100 text-center">Nothing here, yet! See all <Link to={this.props.links.events}> events </Link></p></td></tr>
            );
        }
        //returns a list of action components
        return Object.keys(eventRSVPs).map(key => {
            var rsvp = eventRSVPs[key];
            var event = rsvp.event;
            var date = new Date(event.start_date_and_time)
            return (
                <tr key={key}>
                    {/* <td colSpan="2" className="prod-column">
                        <img className="thumbnail" src={action.image? action.image.url : null} alt="" />
                    </td> */}
                    <td>
                        <div className="column-box">
                            <Link to={`${this.props.links.events}/${event.id}`}>
                                <h5> {event.name}</h5>
                            </Link>
                        </div>
                    </td>
                    <td>
                        <div className="column-box">
                                <p> {event.location? `${event.location.street}, ${event.location.city}`: null}</p>
                                <p> {date? date.toLocaleDateString() : null}</p>
                        </div>
                    </td>
                    <td>
                        <div className="column-box">
                            <RSVPForm 
                            noText={true}
                            eventid={event.id}
                             userid={this.props.user.id}
                            //value={this.userRSVPvalue(event.id)}
                            rsvp={rsvp}/>
                        </div>
                    </td>
                </tr>
            );
        });
    }

    renderEventsMoreInfo(eventRSVPs) {
        if (!eventRSVPs || eventRSVPs.length <= 0) {
            return (
                <tr key="1"><td colSpan="100%"><p className="m-0 p-2 w-100 text-center">Nothing here, yet! See all <Link to={this.props.links.events}> events </Link></p></td></tr>
            );
        }
        //returns a list of action components
        return Object.keys(eventRSVPs).map(key => {
            var rsvp = eventRSVPs[key];
            var event = rsvp.event;
            var startdate = new Date(event.start_date_and_time);
            var enddate = new Date(event.end_date_and_time);
            return (
                <tr key={key}>
                    <td>
                        <div className="column-box">
                            <h4>{event.name}</h4>
                        </div>
                    </td>
                    <td className="prod-column">
                        <div className="column-box">
                            <p>{this.sameDay(startdate, enddate)? startdate.toLocaleDateString() : startdate.toLocaleDateString() + ' - ' + enddate.toLocaleDateString()}</p>
                        </div>
                    </td>
                    <td className="prod-column">
                        <div className="column-box">
                            <p>{this.sameDay(startdate, enddate)? startdate.toLocaleTimeString()+' - '+enddate.toLocaleTimeString() : startdate.toLocaleTimeString()}</p>
                        </div>
                    </td>
                    <td className="prod-column">
                        <div className="column-box">
                            <p>{event.location? `${event.location.street}, ${event.location.city}`: null}</p>
                        </div>
                    </td>
                    <td className="prod-column">
                        <div className="column-box">
                            <p> {rsvp.status} </p>
                        </div>
                    </td>
                </tr>
            );
        });
    }

    sameDay = (someDate, someOtherDate) => {
        return someDate.getDate() === someOtherDate.getDate() &&
            someDate.getMonth() === someOtherDate.getMonth() &&
            someDate.getFullYear() === someOtherDate.getFullYear()
    }
}
const mapStoreToProps = (store) => {
    return {
        user: store.user.info,
        todo: store.user.todo,
        done: store.user.done,
        communityData: store.page.communityData,
        links: store.links,
    }
}

const mapDispatchToProps = {
    reduxMoveToDone, reduxRemoveFromTodo, reduxRemoveFromDone, reduxChangeData, reduxTeamAddAction, reduxTeamRemoveAction
}

export default connect(mapStoreToProps, mapDispatchToProps)(EventCart);