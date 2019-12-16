import React from 'react'
import LoadingCircle from '../../Shared/LoadingCircle'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import StoryForm from '../ActionsPage/StoryForm'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import PageTitle from '../../Shared/PageTitle';
import Funnel from './../EventsPage/Funnel';
import Error404 from './../Errors/404';
import leafy from './leafy.png';
import StoryModal from './StoryModal';

class StoriesPage extends React.Component {
	constructor(props) {
		super(props)
		this.closeModal = this.closeModal.bind(this);
		this.handleBoxClick = this.handleBoxClick.bind(this);
		this.state = {
			limit: 140, //size of a tweet
			expanded: null,
			check_values: null,
			modal_content: { image: null, title: null, desc: null }
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
	renderModal(){
		if(this.state.expanded){
			return 	<StoryModal content = {this.state.modal_content} close = {this.closeModal} />
		}
	}
	render() {
		if (!this.props.pageData) return <p className='text-center'> <Error404 /></p>;

		const stories = this.findCommon().length > 0 ? this.findCommon() : this.props.stories;
		if (stories == null) return <LoadingCircle />;

		//const welcomeImagesData = section(pageData, "WelcomeImages").slider[0].slides;

		return (
			<>
			{this.renderModal()}
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
							<div className="col-12 " style={{ marginTop: 80 }}>
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

	closeModal() {
		this.setState({ expanded: null })
	}
	renderImage(img) {
		if (img && !this.state.expanded) {
			return (
				<div >
					<center><img className="testi-img" src={img.url} alt="IMG"/></center>
				</div>
			)
		}
		else if (!img && !this.state.expanded) {
			return (
				<div >
					<center><img className="testi-img" src={leafy} style={{ objectFit: 'contain' }} alt="IMG"/></center>
				</div>
			)
		}
	}
	renderMoreBtn(body, id,title,imageObj) {
		var content = { image:imageObj, title:title, desc:body};
		if (body.length > 100 && !this.state.expanded) {
			return <button className="testi-more" onClick={() => { this.setState({ expanded: id, modal_content:content })}}>More...</button>
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
			var cn = "col-md-5 col-lg-5 col-sm-5 col-xs-12 mob-testy-card-fix";
			// var style = { padding: 30, borderRadius: 15, minHeight: 417, maxHeight: 417 };
			// if (this.state.expanded !== null) {
			// 	if (this.state.expanded === story.id) {
			// 		cn = 'col-12'
			// 		style = { padding: 30, borderRadius: 15 }
			// 	} else {
			// 		cn = 'd-none';

			// 	}
			// }

			return (
				<div className={cn} style={{ marginRight: 40 }}>
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
									{this.renderMoreBtn(story.body, story.id,story.title,story.file)}
								</div>

							</div>
						</div>

					</div>
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