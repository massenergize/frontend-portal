import React from 'react'
import { Link } from 'react-router-dom'
import CONST from '../../Constants'
import { connect } from 'react-redux'
/**
 * Events section displays upcoming events,
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
	renderEvents(events, start, end, showMessage) {
		if (!events && showMessage) {
			return <div>No Events to Display</div>
		}
		var upcomingEvents = [];
		Object.keys(events).forEach(key => {
			var now = new Date();
			var event = events[key];
			var date = new Date(event.start_date_and_time);
			var endDate = new Date(event.end_date_and_time);
			if (date - now > 0 || endDate - now > 0) {
				upcomingEvents.push(event);
			}
		});
		if (upcomingEvents.length === 0 && showMessage) {
			return <div><p className="cool-font"> Sorry, no upcoming events. See all <Link to={this.props.links.events}> events</Link></p></div>
		}
		var eventsDisplayed = 0;
		return upcomingEvents.map(event => {
			if (eventsDisplayed >= start && eventsDisplayed < end) {
				var eventStyle = "item style-2";
				if (eventsDisplayed === 0) {
					eventStyle = "item style-1";
				}
				eventsDisplayed += 1;
				var date = new Date(event.start_date_and_time);
				var endDate = new Date(event.end_date_and_time);
				var location = event.location;

				return (
					<div key={eventsDisplayed} className={eventStyle}>
						<div className="clearfix">
							<div className="img-column">
								<figure className="img-holder" style={{height:190}}>
									<Link to={`${this.props.links.events}/${event.id}`}><img src={event.image ? event.image.url : ""} alt="" /></Link>
								</figure>
							</div>
							<div className="text-column">
								<div className="lower-content">
									<Link className="cool-font" to={`${this.props.links.events}/${event.id}`}><h4>{event.name}</h4></Link>
									<div >
										{event.description.length > CONST.LIMIT ?
											<p className="cool-font">
												{event.description.substring(0, CONST.LIMIT)}
												&nbsp;<Link to={`${this.props.links.events}/${event.id}`}> ...more </Link>
											</p>
											:
											<p className="cool-font"> {event.description} </p>
										}
									</div>
								</div>
							</div>
						</div>
						<ul className="post-meta list_inline">
							<li><i className="fa fa-clock-o"></i>{this.sameDay(date, endDate) ? `${date.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}` : `${date.toLocaleTimeString()}`}</li>  |&nbsp;&nbsp;&nbsp;
                        <li><i className="fa fa-calendar"></i>{this.sameDay(date, endDate) ? date.toString().substring(4, 10) : `${date.toString().substring(4, 10)} - ${endDate.toString().substring(4, 10)}`}, {date.getFullYear().toString()}</li>
							{event.location ?
								<li>&nbsp;|&nbsp;&nbsp;&nbsp;<i className="fa fa-map-marker"></i> {location.city? `${location.city}` : ''} <b>{location.unit? `, ${location.unit}` : ''} </b> {location.state? `, ${location.state}` : ''}  <b>{location.address? `, ${location.address}` : ''}</b> {location.country? `, ${location.country}` : ''}  <b>{location.zipcode? `, ${location.zipcode}` : ''}</b></li>
								: null
							}
						</ul>
					</div>
				);
			}
			eventsDisplayed += 1;
			return null;
		});
	}
	sameDay = (d1, d2) => {
		return d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate();
	}
	render() {
		return (
			<section className="event-style1" style={{background:'white'}}>
				<div className="container">
					<div className="row">
						<div className="col-md-9 col-sm-10 col-xs-12 text-center text-sm-left">
							<div className="section-title m-0">
								<h3 className="cool-font">Upcoming Events</h3>
							</div>
						</div>
						<div className="col-md-3 col-sm-2 col-xs-12 text-center text-sm-right">
							<Link to={`${this.props.links.events}`} className="cool-font thm-btn mb-4 btn-finishing raise">All Events</Link>
						</div>
					</div>
					<div className="row">
						<article className="col-md-6 col-sm-12 col-xs-12">
							{this.renderEvents(this.props.events, 0, 1, true)}
						</article>
						<article className="col-md-6 col-sm-12 col-xs-12">
							{this.renderEvents(this.props.events, 1, 3, false)}
						</article>
					</div>
				</div>
			</section>
		);
	}
}
const mapStoreToProps = (store) => {
	return ({
		links: store.links
	});
}
export default connect(mapStoreToProps)(Events);