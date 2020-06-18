import React from 'react'
import "react-datepicker/dist/react-datepicker.css"
import PageTitle from '../../Shared/PageTitle';
import LoadingCircle from '../../Shared/LoadingCircle'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
// import CONST from '../../Constants'
import Funnel from './Funnel';
import Error404 from './../Errors/404';
import notFound from './not-found.jpg';
import { dateFormatString, locationFormatJSX } from '../../Utils';


/**
 * Renders the event page
 */
class EventsPage extends React.Component {
	constructor(props) {
		super(props);
		this.handleBoxClick = this.handleBoxClick.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.state = {
			events_search_toggled: false,
			userData: null,
			check_values: null,
			mirror_events: []
		}
	}
	/**
	 * check_values is intentionally "null" to help identify (first time loading, and when all boxes have been unselected)
	 * How filtering is done 
	 * add the tag Ids to "check_values"(states) array as they are selected, 
	 * loop through events and see which events have tags with those Ids,
	 * ( happens in "findCommon")
	 * pass the return values into "renderEvents"
	 */

	addMeToSelected(tagID) {
		tagID = Number(tagID);
		const arr = this.state.check_values ? this.state.check_values : [];
		if (arr.includes(tagID)) {
			var filtered = arr.filter(item => item !== tagID);
			this.setState({ check_values: filtered.length === 0 ? null : filtered });
		}
		else {
			this.setState({ check_values: [tagID, ...arr] })
		}
	} 

	handleBoxClick(event) {
		var id = event.target.value;
		this.addMeToSelected(id);
	}
	findCommon() {
		//everytime there is a change in "check_values",
		//loop through all the events again, and render events 
		//with the tag IDs  in "check_values"
		//then pass it on to "renderEvents(...)"
		const events = this.props.events;
		const values = this.state.check_values ? this.state.check_values : [];
		const common = [];
		if (events) {
			for (let i = 0; i < events.length; i++) {
				const ev = events[i];
				for (let i = 0; i < ev.tags.length; i++) {
					const tag = ev.tags[i];
					//only push events if they arent there already
					if (values.includes(tag.id) && !common.includes(ev)) {
						common.push(ev)
					}
				}
			}
		}
		return common;
	}

	handleSearch = event => {
		const value = event.target.value;
		const events = this.props.events;
		const common = [];
		if (value.trim() !== "") {
			for (let i = 0; i < events.length; i++) {
				const ev = events[i];
				if (ev.name.toLowerCase().includes(value.toLowerCase())) {
					common.push(ev);
				}
			}
			this.setState({ mirror_events: [...common] });
		} else {
			this.setState({ mirror_events: [] })
		}
	}
	renderSideBar() {
		return (
			<div className="blog-sidebar sec-padd">
				<div className="phone-vanish event-filter raise mob-event-white-cleaner" style={{ padding: "45px 33px", borderRadius: 15 }}>
					<h4>Filter by...</h4>
					<Funnel type="event" boxClick={this.handleBoxClick} search={this.handleSearch} foundNumber={this.state.mirror_events.length} />
				</div>
			</div>
		);
	}
	render() {
		if (!this.props.homePageData) return <p className='text-center'> <Error404 /></p>;
		
		const found = this.state.mirror_events.length > 0 ? this.state.mirror_events : this.findCommon();
		return (
			<>
				<div className="boxed_wrapper"  style={{marginBottom:70}}>
					{/* renders the sidebar and events columns */}
					<div className="boxed-wrapper">
						<BreadCrumbBar links={[{ name: 'Events' }]} />
						{/* <PageTitle>Events</PageTitle> */}
						<section className="eventlist">
							<div className="container">
								<div className="row">
									<div className="col-lg-3 col-md-3 col-12" style={{paddingTop:35}}>
										{this.props.tagCols ?
											this.renderSideBar() : <LoadingCircle />}
									</div>
									<div className="col-lg-9 col-md-9 col-12" >
										<PageTitle>Events and Campaigns</PageTitle>
										<div className="mob-event-cards-fix outer-box sec-padd event-style2" style={{ paddingTop:0,marginTop:9,paddingRight:40 }}>
											{this.renderEvents(found)}
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
	 * @param events - json list of events
	 */
	renderEvents(events) {
		//when mirror_events.length ===0, it means no one is searching,so go on to check if 
		//someone if user is using check_values 
		//if check_values ===null, then it means it is probably the first time the user
		//is loading the page, so show everything from props
		if (this.state.mirror_events.length === 0) {
			events = this.state.check_values === null ? this.props.events : events;
		}
		if (!this.props.events || this.props.events.length === 0) {
			return (
				<div className='text-center'>
					<p className="cool-font"> Sorry, looks like there are no upcoming events in your community </p>
				</div>
			);
		}
		if (events) {
			return events.map(event => {
				const dateString = dateFormatString(new Date(event.start_date_and_time), new Date(event.end_date_and_time));
				const location = event.location;
        return (
          <Link to={`${this.props.links.events + "/" + event.id}`}>
					  <div className="item style-1 clearfix m-action-item" key={event.id}>
					  	<div className="row no-gutter">
					  		{/* renders the image */}
					  		<div className="col-lg-4 col-12">
					  			<figure className="raise-2" style={{ marginTop: 15, marginRight: 10,   marginLeft: 20, borderRadius: 10, height: 190 }}>
					  				<Link className="" to={this.props.links.events + "/" + event.id}><img   className="force-height-event" style={{ width:'100%', height:'100%' ,  objectFit: 'cover', borderRadius: 10 }} src={event.image ? event.image.url :   notFound} alt="" /></Link>
					  				{/* if the date has passed already the calender div should be all gray */}
					  			</figure>
					  		</div>
					  		{/* renders the event text */}
					  		<div className=" col-lg-8 col-12 ">
					  			<div className="lower-content ">
					  				<Link className="cool-font" to={this.props.links.events + "/" + event.id}><h4   className="cool-font"> {event.name} </h4></Link>
					  				<div className="text">
					  					<p>{event.featured_summary}</p>
					  				</div>
					  			</div>
					  		</div>
					  		{/* renders the  date time and location of the event */}
					  		<div className="col-12">
					  			<ul className="post-meta list_inline">
					  				{dateString}
					  				{location ?
					  					<li>
					  						&nbsp;|&nbsp;&nbsp;&nbsp;<i className="fa fa-map-marker" />
                        {locationFormatJSX(location)}
					  					</li>
					  					:
					  					null
					  				}
					  			</ul>
					  		</div>
					  	</div>
            </div>
          </Link>
				);

			});
		}
	}

	userRSVP(event_id) {
		if (!this.props.user || !this.props.eventRSVPs) return null;
		const RSVPs = this.props.eventRSVPs.filter(rsvp => { return (rsvp.attendee.id === this.props.user.id && rsvp.event.id === event_id) })
		if (RSVPs.length < 1) return null;
		return RSVPs[0];
	}


}

const mapStoreToProps = (store) => {
	return {
		homePageData: store.page.homePage,
		collection: store.page.collection,
		auth: store.firebase.auth,
		user: store.user.info,
		events: store.page.events,
		eventRSVPs: store.page.rsvps,
		links: store.links,
		tagCols: store.page.tagCols ? store.page.tagCols.filter(col => { return col.name === 'Category' }) : null
	}
}
export default connect(mapStoreToProps, null)(EventsPage);