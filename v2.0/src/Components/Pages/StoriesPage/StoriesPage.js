import React from 'react'
import LoadingCircle from '../../Shared/LoadingCircle'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import StoryForm from '../ActionsPage/StoryForm'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import PageTitle from '../../Shared/PageTitle';
import CONST from '../../Constants'
import Funnel from './../EventsPage/Funnel';
import avatar from './user_ava.png';
import Error404 from './../Errors/404';
import leafy from './leafy.png';

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
		if (!this.props.pageData) return <p className='text-center'> <Error404 /></p>;

		const stories = this.findCommon().length > 0 ? this.findCommon() : this.props.stories;
		if (stories == null) return <LoadingCircle />;

		//const welcomeImagesData = section(pageData, "WelcomeImages").slider[0].slides;

		return (
			<>

				<div className="boxed_wrapper" >
					<BreadCrumbBar links={[{ name: 'Testimonials' }]} />
					<section className="testimonial2">

						<div className="container">
							<div className="row masonary-layout">
								<div className="col-md-3">
									<div className="event-filter raise" style={{ marginTop: 48, padding: 45, borderRadius: 15 }}>
										<h4>Filter by...</h4>
										<Funnel type="testimonial" boxClick={this.handleBoxClick} search={() => { console.log("No Search") }} foundNumber={0} />
									</div>
								</div>
								<div className="col-md-8 col-lg-8 col-sm-12 ">
									<PageTitle>Testimonials</PageTitle>
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


	renderImage(img) {
		if (img && !this.state.expanded) {
			return (
				<div >
					<center><img className="testi-img" src={img.url} /></center>
				</div>
			)
		}
		else if (!img && !this.state.expanded) {
			return (
				<div >
					<center><img className="testi-img" src={leafy} style={{ objectFit: 'contain' }} /></center>
				</div>
			)
		}
	}
	renderMoreBtn(body) {
		if (body.length > 100) {
			return <button className="testi-more">More...</button>
		}
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
			var body = "";
			if (story.body.length > 0) {
				body = story.body.length > 100 ? story.body.substring(0, 100) + "..." : story.body;
			}
			var cn = "col-md-5 col-lg-5 col-sm-5 col-xs-12";
			var style = { padding: 30, borderRadius: 15, minHeight: 417, maxHeight: 417 };
			if (this.state.expanded !== null) {
				if (this.state.expanded === story.id) {
					cn = 'col-12'
					style = { padding: 30, borderRadius: 15 }
				} else {
					cn = 'd-none'

				}
			}

			return (
				<div className={cn} style={{ marginRight: 40 }}>
					{this.state.expanded !== null ?
						<center>
							<button className="g-back" onClick={() => { this.setState({ expanded: null }) }}><i className='fa fa-back'></i> Go Back </button>
						</center>
						:
						null
					}
					<div className="" >
						<div className="testi-card">
							<div >
								{this.renderImage(story.file)}
								<div className="testi-para z-depth-1" >
									<p style={{ marginBottom: 6 }}><b>{story.title.length > 30 ? story.title.substring(0, 30) + "..." : story.title}</b></p>
									{story.action ?
										<a href={`${this.props.links.actions}/${story.action.id}`} className="testi-anchor">{story.action.title > 70 ? story.action.title.substring(0, 70) + "..." : story.action.title}</a>
										: null}
									<p>{body}</p>
									{this.renderMoreBtn(story.body)}
								</div>

							</div>
						</div>

						{/* <div className="quote">
							<i className="fa fa-quote-left"></i>
						</div>
						<div style={this.state.expanded !== null ? { textAlign: 'left' } : {}}>
							<h4 className="title p-2 cool-font" style={{ textTransform: 'capitalize', marginBottom: 0 }}>{story.title} </h4>
							{(story.action) ? <p><Link to={`${this.props.links.actions}/${story.action.id}`} className="cool-font"><u>{story.action.title}</u></Link></p> : null}
						</div>
						{this.state.expanded && this.state.expanded === story.id ?
							<button className='as-link' style={{ width: '100%', margin: 'auto' }} onClick={() => { this.setState({ expanded: null }) }}>close</button> : null
						}
						<p className="p-1  cool-font" style={this.state.expanded !== null ? { textAlign: 'left' } : {}}>
							{this.state.expanded && this.state.expanded === story.id ? story.body : story.body.substring(0, CONST.LIMIT)}
							{(!this.state.expanded || !this.state.expanded === story.id) && CONST.LIMIT < story.body.length ?
								<button className='as-link' style={{ width: '100%', margin: 'auto' }} onClick={() => { this.setState({ expanded: story.id }); window.scrollTo(10, 10) }}>...more</button>
								:
								null
							}
						</p>
						<div className="author cool-font">
							{story.user ?
								<h6 className="cool-font">{story.user.full_name}</h6>
								: null}
							<p>{story.location}</p>
						</div> */}
						{/* {(story.action) ? <p><Link to={`${this.props.links.actions}/${story.action.id}`} className="cool-font"><u>{story.action.title}</u></Link></p> : null} */}
					</div>
					{this.state.expanded !== null ?
						<center>
							<button className="g-back" onClick={() => { this.setState({ expanded: null }) }}><i className='fa fa-back'></i> Go Back </button>
						</center>
						:
						null
					}
				</div>
			);
		});
	}
}
const mapStoreToProps = (store) => {
	return {
		pageData: store.page.homePage,
		stories: store.page.testimonials,
		user: store.user.info,
		links: store.links
	}
}
export default connect(mapStoreToProps, null)(StoriesPage);