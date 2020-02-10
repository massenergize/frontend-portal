import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
/**
 *Footer events renders the events in the footer
 *@props
    events
        title
        day
        month
        year
        link
        image
    @TODO should have a limiting number of events to show, 
    and should show the next events happening -need to sort by date or something
*/
class FooterEvents extends React.Component {
    renderEvents(events) {
        if (!events) {
            return <div>No Events to Display</div>
        }
        const { links } = this.props
        return Object.keys(events).map(key => {
            var event = events[key];
            return (
                <li>
                    <div className="post">
                        <div className="post-thumb"><Link to={`${links.events}/${event.id}`}><img src={event.image} alt="" /></Link></div>
                        <Link to={`${links.events}/${event.id}`}><h5>{event.title}</h5></Link>
                        <div className="post-info"><i className="fa fa-calendar"></i>{event.day} {event.month}, {event.year}</div>
                    </div>
                </li>
            );
        });
    }
    render() {
        return (
            <div className="col-md-6 col-sm-6 col-xs-12">
                <div className="footer-widget post-column">
                    <div className="section-title">
                        <h4>Upcoming Events</h4>
                    </div>
                    <div className="post-list">
                        {this.renderEvents(this.props.events)}
                    </div>
                </div>
            </div>
        );
    }
}
const mapStoreToProps = (store) => {
    return ({
        links: store.links
    });
}
export default connect(mapStoreToProps)(FooterEvents);