import React from 'react'
import { Link } from 'react-router-dom'
/**
 * Events section displays upcoming events,
 * @TODO make a limit number so it only displays that many events
 * @props
    events: list of the events to show
        title
        time
        day
        month
        year
        link //may need to rethink this/do it more like actions so it links to a single event view by id
        image
        organizer
        address
        //may need to add in id
 */
class Events extends React.Component {
    renderEvents(events, start, end) {
        if (!events) {
            return <div>No Events to Display</div>
        }
        return Object.keys(events).map(key => {
            if (key >= start && key < end) {
                var event = events[key]

                var eventStyle = "item style-2";
                if (parseInt(key) % 3 === 0) {
                    eventStyle = "item style-1";
                }

                var date = new Date(event.start_date_and_time);

                return (
                    <div key={key} className={eventStyle}>
                        <div className="clearfix">
                            <div className="img-column">
                                <figure className="img-holder">
                                    <Link to={'events/' + event.id}><img src={event.image ? event.image.url : ""} alt="" /></Link>
                                </figure>
                            </div>
                            <div className="text-column">
                                <div className="lower-content">
                                    <Link to={'events/' + event.id}><h4>{event.name}</h4></Link>
                                    <div className="text">
                                        <p>{event.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul className="post-meta list_inline">
                            <li><i className="fa fa-clock-o"></i>{date.toLocaleTimeString()}</li>  |&nbsp;&nbsp;&nbsp;
                        <li><i className="fa fa-calendar"></i>{date.toString().substring(4, 10)}, {date.getFullYear().toString()}</li> 
                            {event.location ?
                                <li>&nbsp;|&nbsp;&nbsp;&nbsp;<i className="fa fa-map-marker"></i> {event.location.street}, {event.location.city}, {event.location.state} {event.location.zip}</li>
                                : null
                            }
                        </ul>
                    </div>
                );
            }
            return null;
        });
    }
    render() {
        return (
            <section className="event-style1">
                <div className="container">
                    <div className="row">
                        <div className="col-md-9 col-sm-10 col-xs-12">
                            <div className="section-title">
                                <h2>Upcoming Events</h2>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-2 col-xs-12">
                            <Link to="events" className="thm-btn float_right">All Events</Link>
                        </div>
                    </div>
                    <div className="row">
                        <article className="col-md-6 col-sm-12 col-xs-12">
                            {this.renderEvents(this.props.events, 0, 1)}
                        </article>
                        <article className="col-md-6 col-sm-12 col-xs-12">
                            {this.renderEvents(this.props.events, 1, 3)}
                        </article>
                    </div>
                </div>
            </section>
        );
    }
}
export default Events;