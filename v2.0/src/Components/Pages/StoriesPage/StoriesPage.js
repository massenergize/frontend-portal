import React from 'react'
import LoadingCircle from '../../Shared/LoadingCircle'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import StoryForm from '../ActionsPage/StoryForm'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import PageTitle from '../../Shared/PageTitle';
import CONST from '../../Constants'
import Funnel from './../EventsPage/Funnel';
class StoriesPage extends React.Component {
	constructor(props) {
		super(props)
		this.handleBoxClick = this.handleBoxClick.bind(this);
		this.state = {
			limit: 140, //size of a tweet
			expanded: null,
			check_values: null,
		}
	}
	findCommon() {
		//everytime there is a change in "check_values",
		//loop through all the events again, and render events 
		//with the tag IDs  in "check_values"
		//then pass it on to "renderEvents(...)"
		const stories = this.props.stories;
		const values = this.state.check_values ? this.state.check_values : [];
		const common = [];
		if (stories) {
			for (let i = 0; i < stories.length; i++) {
				const story = stories[i];
				const ev = stories[i].action;
				if (ev) {
					for (let i = 0; i < ev.tags.length; i++) {
						const tag = ev.tags[i];
						//only push events if they arent there already
						if (values.includes(tag.id) && !common.includes(story)) {
							common.push(story)
						}
					}
				}
			}
		}
		return common;
	}

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
	render() {
		const stories = this.findCommon().length >0 ? this.findCommon() : this.props.stories;
		if (stories == null) return <LoadingCircle />;

		//const welcomeImagesData = section(pageData, "WelcomeImages").slider[0].slides;

		return (
			<>

				<div className="boxed_wrapper" >
					<BreadCrumbBar links={[{ name: 'Testimonials' }]} />
					<section className="testimonial2">
						<PageTitle>Testimonials</PageTitle>
						<div className="container">
							<div className="row masonary-layout">
								<div className="col-md-3">
									<div className="event-filter raise" style={{ padding: 45, borderRadius: 15 }}>
										<h4>Filter by...</h4>
										<Funnel type="testimonial" boxClick={this.handleBoxClick} search={() => { console.log("No Search") }} foundNumber={0} />
									</div>
								</div>
								<div className="col-md-8 col-lg-8 col-sm-12 ">
									<div className="row">
										{this.renderStories(stories)}
									</div>
								</div>
							</div>
							<div className="col-12 ">
								{this.props.user ?
									<StoryForm uid={this.props.user.id} />
									:
									<p className='text-center'><Link to={this.props.links.signin}>Sign in</Link> to submit a story</p>
								}
							</div>
						</div>
					</section>
				</div>
			</>
		);
	}


	renderStories(stories) {
		if (stories.length === 0) {
			
			return (
				<div className="col-12 text-center">
					<p className="cool-font"> There are not any testimonials yet.  If you have a story to tell, let us know in the form below</p>
				</div>
			)
		}
		return stories.map(story => {
			var cn = "col-md-6 col-lg-6 col-sm-6 col-xs-12";
			if (this.state.expanded !== null) {
				if (this.state.expanded === story.id) {
					cn = 'col-12'
				} else {
					cn = 'd-none'
				}
			}

			return (
				<div className={cn}>
					<div className="item center" style={{ padding: 30, borderRadius: 15, minHeight: 417, maxHeight: 417 }}>
						{/* <div className="quote">
							<i className="fa fa-quote-left"></i>
						</div> */}
						<h4 className="title p-2 cool-font">{story.title}</h4>
						{this.state.expanded && this.state.expanded === story.id ?
							<button className='as-link' style={{ width: '100%', margin: 'auto' }} onClick={() => { this.setState({ expanded: null }) }}>close</button> : null
						}
						<p className="p-1 text-center cool-font">
							{this.state.expanded && this.state.expanded === story.id ? story.body : story.body.substring(0, CONST.LIMIT)}
							{(!this.state.expanded || !this.state.expanded === story.id) && CONST.LIMIT < story.body.length ?
								<button className='as-link' style={{ width: '100%', margin: 'auto' }} onClick={() => { this.setState({ expanded: story.id }) }}>...more</button>
								:
								null
							}
						</p>
						<div className="author cool-font">
							<h6 className="cool-font">{story.user.full_name}</h6>
							{/* <p>{story.location}</p> */}
						</div>
						{(story.action) ? <p><Link to={`${this.props.links.actions}/${story.action.id}`} className="cool-font"><u>{story.action.title}</u></Link></p> : null}
					</div>
				</div>
			);
		});
	}
}
const mapStoreToProps = (store) => {
	return {
		stories: store.page.testimonials,
		user: store.user.info,
		links: store.links
	}
}
export default connect(mapStoreToProps, null)(StoriesPage);