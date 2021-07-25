import React from 'react'
import "react-datepicker/dist/react-datepicker.css"
import SideBar from '../../Menu/SideBar'
import PageTitle from '../../Shared/PageTitle';
import LoadingCircle from '../../Shared/LoadingCircle'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import RSVPForm from './RSVPForm';
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import CONST from '../../Constants'
import * as moment from 'moment';


/**
 * Renders the event page
 */
class EventsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			events_search_toggled: false,
			startDate: null, //these start and end dates are selected by the datepickers in the sidebar
			endDate: null,   //when selected, they filter the actions to be between them
			userData: null,
		}
		this.selectStartDate = this.selectStartDate.bind(this);
		this.selectEndDate = this.selectEndDate.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.resetDates = this.resetDates.bind(this);
	}

	render() {
		
		//avoids trying to render before the promise from the server is fulfilled
		return (
			<>
				
				<div className="boxed_wrapper" >
					{/* renders the sidebar and events columns */}
					<div className="boxed-wrapper">
					<BreadCrumbBar links={[{ name: 'Events' }]} />
						<PageTitle>Events</PageTitle>
						<section className="eventlist">
							<div className="container">
								<div className="row">
									<div className="col-lg-4 col-md-5 col-12">
										{this.props.tagCols ?
											this.renderSideBar() : <LoadingCircle />}
									</div>
									<div className="col-lg-8 col-md-7 col-12">
										<div className="outer-box sec-padd event-style2">
											{this.renderEvents(this.props.events)}
										</div>
									</div>
								</div>
							</div>
						</section>
					</div>
				</div>
			</>
		);
	}

	/**
	 * Renders all the events on the page,
	 * before rendering, pulls the list of event from the server and sorts the list
	 * 
	 *  Sort:
	 *      if the event is coming up,
	 *          it is sorted old-new (coming soon - coming later)
	 *      if the event has already passed
	 *          it is sorted new-old (most recently occured - oldest)
	 *      all past events are put after all upcoming events
	 *      if an event is today it is considered an upcoming event even if the start time has past
	 *  Filter:
	 *      filter by all/upcoming/ between two dates (also does before one date or after one date)
	 *      filter by search
	 *      filter by category tags 
	 * @param events - json list of events
	 */
	renderEvents(events) {
		if (!this.props.events || this.props.events.length === 0) {
			return (
				<div className='text-center'>
					<p className="cool-font"> Sorry, looks like there are no upcoming events in your community </p>
				</div>
			);
		}
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const now = new Date();
		//reads events into a list
		var eventsList = Object.keys(events).map(key => {
			return events[key];
		});
		//sorts the list
		var sortedEvents = eventsList.sort((eventA, eventB) => {
			const dateA = new Date(eventA.start_date_and_time);
			const dateAEnd = new Date(eventA.end_date_and_time);
			const dateB = new Date(eventB.start_date_and_time);
			const dateBEnd = new Date(eventB.end_date_and_time);

			if (((dateA - now) > 0 || (dateAEnd - now) > 0) && ((dateB - now) > 0 || (dateBEnd - now) > 0)) {
				return dateA - dateB; //if both dates are coming up/ are not over, sort by oldest(closest to current date) to newest (furthest away from current date)
			}
			return (dateB - now) - (dateA - now); //otherwise sort newest(most recently occured or upcoming) to oldest(least recently occured)
		});
		//maps the list to react/html code that renders each element
		return sortedEvents.map(event => {
			const format = "MMMM Do YYYY, h:mm:ss a";
			const date = new Date(event.start_date_and_time);
			const endDate = new Date(event.end_date_and_time);
			const textyStart = moment(date).format(format);
			const textyEnd = moment(endDate).format(format);
			console.log('event details');
			console.log(event);
			if (this.shouldRender(event)) {
				
				return ( 
					<div className="item style-1 clearfix m-action-item" onClick={() => { window.location = `${this.props.links.events + "/" + event.id}` }} key={event.id}>
						<div className="row no-gutter">
							{/* renders the image */}
							<div className="col-lg-4 col-12">
								<figure className="img-holder" style={{borderRadius:10}}>
									<Link to={this.props.links.events + "/" + event.id}><img style={{margin:10,borderRadius:10}} src={event.image ? event.image.url : null} alt="" /></Link>
									{/* if the date has passed already the calender div should be all gray */}
									<div className={(endDate - now > 0) ? "date" : "date old"}><span>{months[date.getMonth()]}<br />{date.getDate()}</span></div>
								</figure>
							</div>
							{/* renders the event text */}
							<div className=" col-lg-8 col-12 ">
								<div className="lower-content ">
									<Link className="cool-font" to={this.props.links.events + "/" + event.id}><h4 className="cool-font"> {event.name} </h4></Link>
									<div className="text">
										{event.description.length < CONST.BIG_LIMIT ?
											<p className="cool-font"> {event.description} </p>
											:
											<p className="cool-font">
												{event.description.substring(0, CONST.BIG_LIMIT)}
												&nbsp;<Link to={`${this.props.links.events}/${event.id}`}> ...more</Link>
											</p>
										}
									</div>
									{(endDate - now > 0) ?
										<>
											{this.props.user ?
												<RSVPForm
													eventid={event.id}
													userid={this.props.user.id}
													//value={this.userRSVPvalue(event.id)}
													rsvp={this.userRSVP(event.id)}
												/>
												:
												<p>
													<Link className="cool-font" to={this.props.links.signin}>Sign In</Link> to RSVP to events
                                        </p>
											}
										</> : null}
								</div>
							</div>
							{/* renders the  date time and location of the event */}
							<div className="col-12">
								<ul className="post-meta list_inline">
									{this.sameDay(date, endDate) ?
										<li><i className="fa fa-clock-o"></i> {textyStart} - {textyEnd}</li>
										:
										<li><i className="fa fa-clock-o"></i> {textyStart} - {textyEnd}</li>
									}
									{event.location ?
										<li>
											&nbsp;|&nbsp;&nbsp;&nbsp;<i className="fa fa-map-marker" />
											{event.location.street + ", " + event.location.city + " " + event.location.state}
										</li>
										:
										null
									}
								</ul>
							</div>
						</div>
					</div>
				);
			} else return null;
		});
	}

	userRSVP(event_id) {
		if (!this.props.user || !this.props.eventRSVPs) return null;
		const RSVPs = this.props.eventRSVPs.filter(rsvp => { return (rsvp.attendee.id === this.props.user.id && rsvp.event.id === event_id) })
		if (RSVPs.length < 1) return null;
		return RSVPs[0];
	}

	/**
	 * checks if a two dates are on the same day ignoring time
	 * @param  someDate
	 */
	sameDay(someDate, someOtherDate) {
		return someDate.getDate() === someOtherDate.getDate() &&
			someDate.getMonth() === someOtherDate.getMonth() &&
			someDate.getFullYear() === someOtherDate.getFullYear()
	}
	/**
	 * changes the start date to the date chosen by the date selector
	 * also removes checks from the radio buttons all and upcoming
* @param {*} newdate
			*/
	selectStartDate(newdate) {
		this.setState({
			startDate: newdate
		});
		if (this.state.endDate) { //if the end date is smaller than the start date, remove the end date
			if (newdate > this.state.endDate) {
				this.setState({
					endDate: null
				});
			}
		}
		document.getElementById('show-all-button').checked = false;
		document.getElementById('show-upcoming-button').checked = false;
	}
	/**
	 * changes the end date to the date chosen by the date selector
	 * also removes checks from the radio buttons all and upcoming
* @param {*} newdate
					*/
	selectEndDate(newdate) {
		this.setState({
			endDate: newdate
		});
		document.getElementById('show-all-button').checked = false;
		document.getElementById('show-upcoming-button').checked = false;
	}

	/**
	 * checks the filters in the sidebar to see if an event should render or not
* @param {*} event
			*/
	shouldRender(event) {
		var date = new Date(event.start_date_and_time);
		var endDate = new Date(event.end_date_and_time);

		if (!(this.searchFits(event.name) || this.searchFits(event.description)))
			return false;
		if (!this.showButtonFits(date, endDate))
			return false;
		if (!this.dateFits(date, endDate))
			return false;

		var tagSet = new Set(); //create a set of the action's tag ids
		event.tags.forEach(tag => {
			tagSet.add(tag.id);
		});
		for (var i in this.props.tagsCols) {
			var filter = this.props.tagCols[i]; //if any filter does not fit, return false
			if (!this.filterFits(filter.tags, tagSet)) { //only one tag in a filter collection needs to fit to make the filter fit
				return false;
			}
		}
		return true;
	}
	//checks if the value of the search bar is in the title of the action
	searchFits(string) {
		var searchbar = document.getElementById('action-searchbar');
		if (!searchbar) //if cant find the search bar just render everything
			return true;
		if (searchbar.value === '')
			return true;
		if ((string.toLowerCase()).includes((searchbar.value.toLowerCase())))
			return true;

		return false;
	}
	showButtonFits(date, endDate) {
		var now = new Date();
		var showAll = document.getElementById('show-all-button');
		var showUpcoming = document.getElementById('show-upcoming-button');
		if (!showAll || !showUpcoming)
			return true; //if can't find the buttons they haven't rendered yet, just default true
		if ((!showUpcoming.checked && !showAll.checked) || showAll.checked)
			return true;
		else if (showUpcoming.checked)
			return (date - now > 0 || endDate - now > 0);
		return false;
	}
	dateFits(startDate, endDate) {
		if (!this.state.startDate && !this.state.endDate)
			return true;
		if (!this.state.endDate)
			return startDate >= this.state.startDate;
		if (!this.state.startDate)
			return endDate <= this.state.endDate.setHours(23, 59, 59, 99);
		return endDate >= this.state.startDate && endDate <= this.state.endDate.setHours(23, 59, 59, 99)
	}
	//checks if any of the options are checked off in the filter
	//takes in the the filter and the actions' options for that filter
	filterFits(filtertags, tagSet) {
		var noFilter = true; //go through the filters and check if any of them fit or if none are checked
		for (var i in filtertags) {
			var checkbox = document.getElementById("filtertag" + filtertags[i].id);
			if (checkbox && checkbox.checked) {
				noFilter = false;
				if (tagSet.has(filtertags[i].id))
					return true;
			}
		}
		return noFilter;
	}

	renderCategoryFilter = () => {
		if (!this.state.events_search_toggled) return <div></div>;
		else {
			return (
				<div >
					<div className="tabs-outer">
						{/* <!--Tabs Box--> */}
						<div className="tabs-box tabs-style-one">
							{/* <!--Tab Buttons--> */}
							<form className="tab-buttons">
								<div className="tab-btn"><input type="radio" name="tabs" id="show-all-button" defaultChecked onClick={this.resetDates} /> All</div>
								<div className="tab-btn"><input type="radio" name="tabs" id="show-upcoming-button" onClick={this.resetDates} /> Upcoming</div>
							</form>

							{/* <!--Tabs Content--> */}
							<div className="tabs-content">
								{/* <!--Tab / Active Tab--> */}
								<div className="tab active-tab" id="tab-two" style={{ display: 'block' }}>
									<div className="default-form-area all">
										{/* <form id="contact-form" name="contact_form" className="default-form style-5" action="inc/sendmail.php" method="post">
											<div className="clearfix">
												<div className="form-group">
													<p>
														Find events between:
                                                </p>
													<DatePicker
														selected={this.state.startDate}
														selectsStart
														startDate={this.state.startDate}
														endDate={this.state.endDate}
														onChange={this.selectStartDate}
														placeholderText="Enter a starting date"
													/>
													<DatePicker
														selected={this.state.endDate}
														selectsEnd
														startDate={this.state.startDate}
														endDate={this.state.endDate}
														onChange={this.selectEndDate}
														minDate={this.state.startDate}
														placeholderText="Enter an ending date"
													/>
												</div>
											</div>
										</form> */}
									</div>
								</div>
							</div>
						</div>
					</div>
					<SideBar
						tagCols={this.props.tagCols}
						onChange={this.handleChange} //runs when any category is selected or unselected
					/>
				</div>
			);
		}
	}
	toggleFilter = () => {
		var prev = this.state.events_search_toggled;
		this.setState({ events_search_toggled: !prev });
	}
	renderSideBar() {
		
		return (
			<div className="blog-sidebar sec-padd">
				<div className="event-filter" style={{padding:35,borderRadius:15}}>
					<div className="section-title style-2">
						<div className="sidebar_search" style={{ margin: 0 }}>
							<form action="#">
								<input type="text" placeholder="Search...." id='action-searchbar' />
								<button className="tran3s color1_bg" ><i className="fa fa-search" aria-hidden="true"></i></button>
							</form>
						</div>
					</div>
					<div >
						<div className="tabs-outer">
							{/* <!--Tabs Box--> */}
							<div className="tabs-box tabs-style-one">
								{/* <!--Tab Buttons--> */}
								<form className="tab-buttons">
									<div className="tab-btn"><input type="radio" name="tabs" id="show-all-button" defaultChecked onClick={this.resetDates} /> All</div>
									<div className="tab-btn"><input type="radio" name="tabs" id="show-upcoming-button" onClick={this.resetDates} /> Upcoming</div>
								</form>

								{/* <!--Tabs Content--> */}
								<div className="tabs-content">
									{/* <!--Tab / Active Tab--> */}
									<div className="tab active-tab" id="tab-two" style={{ display: 'block' }}>
										<div className="default-form-area all">
											{/* <form id="contact-form" name="contact_form" className="default-form style-5" action="inc/sendmail.php" method="post">
											<div className="clearfix">
												<div className="form-group">
													<p>
														Find events between:
                                                </p>
													<DatePicker
														selected={this.state.startDate}
														selectsStart
														startDate={this.state.startDate}
														endDate={this.state.endDate}
														onChange={this.selectStartDate}
														placeholderText="Enter a starting date"
													/>
													<DatePicker
														selected={this.state.endDate}
														selectsEnd
														startDate={this.state.startDate}
														endDate={this.state.endDate}
														onChange={this.selectEndDate}
														minDate={this.state.startDate}
														placeholderText="Enter an ending date"
													/>
												</div>
											</div>
										</form> */}
										</div>
									</div>
								</div>
							</div>
						</div>
						<SideBar
							tagCols={this.props.tagCols}
							onChange={this.handleChange} //runs when any category is selected or unselected
						/>
					</div>

				</div>
			</div>
		);
	}
	handleChange() {
		this.forceUpdate();
	}
	resetDates() {
		this.setState({
			endDate: null,
			startDate: null,
		});
		this.forceUpdate();
	}

}

const mapStoreToProps = (store) => {
	return {
		auth: store.firebase.auth,
		user: store.user.info,
		events: store.page.events,
		eventRSVPs: store.page.rsvps,
		links: store.links,
		tagCols: store.page.tagCols ? store.page.tagCols.filter(col => { return col.name === 'Category' }) : null
	}
}
export default connect(mapStoreToProps, null)(EventsPage);