import React from 'react'
import LoadingCircle from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages'
import Graphs from './Graphs';
import IconBoxTable from './IconBoxTable';
import Events from './EventHomepageSection';
import { section } from '../../../api/functions'
import { connect } from 'react-redux'
import oops from './oops.png';

/*
* The Home Page of the MassEnergize
*/
class HomePage extends React.Component {

	render() {

		if (!this.props.pageData) {
			return (
				<div className="boxed_wrapper" style={{ paddingTop: 221, height: window.screen.height }}>
					<center>
						<img src={oops} style={{ marginBottom:20,height: 200, width: 200 }} />
						<h1 style={{ color: 'lightgray' }}>OOPS!</h1>

						<h3 className='text-center' style={{ marginBottom:20,color: 'lightgray' }}> Sorry, the page you are looking for, could not be found. <br />Please try again later, or use the links on the navigation bar </h3>
						<p className='text-center'><a href={"http://"+window.location.host} className="mass-domain-link "  >Find My Community</a> </p>
					</center>

				</div>
			)
		}
		const comGoals = this.props.pageData ? this.props.pageData.goal : null;
		const communityDescription = this.props.pageData.description;
		const events = this.props.pageData ? this.props.pageData.featured_events : [];
		const welcomeImagesData = this.props.pageData ? this.props.pageData.images : [];
		const iconQuickLinks = this.props.pageData ? this.props.pageData.featured_links : [];
		//const header = section(pageData, "HomeHeader");
		const title = this.props.pageData ? this.props.pageData.title : '';
		const graphs = [
			{
				title: 'Actions Completed',
				data: comGoals ? { target: comGoals.target_number_of_actions, attained: comGoals.attained_number_of_actions } : null
			},
			{
				title: 'Households Engaged',
				data: comGoals ? { target: comGoals.target_number_of_households, attained: comGoals.attained_number_of_households } : null
			},
			// {
			// 	title: 'Actions Completed',
			// 	data: this.props.graphsData ? this.props.graphsData.filter(data => { return data.name === 'ActionsCompletedData' })[0] : null
			// },
			// {
			// 	title: 'Households Engaged',
			// 	data: this.props.graphsData ? this.props.graphsData.filter(data => { return data.name === 'EngagedHouseholdsData' })[0] : null
			// }, 
		]
		return (
			<div className="boxed_wrapper" style={{ paddingTop: 91 }}>
				{welcomeImagesData ?

					<WelcomeImages
						data={welcomeImagesData}
						title={title}
					/>
					: null
				}
				<div className="" style={{ padding: 30, background: 'white', color: "#383838" }}>
					<h4 align='center' className="cool-font">{communityDescription ? communityDescription : "Welcome To Our Page"}</h4>
					{/* <p align='center' className=' col-md-8 col-lg-8 offset-md-2 cool-font ' style={{color:"#383838"}}>We believe that local leaders can engage their communities, but need better tools like fully customizable web platforms and strategies for outreach, networking and empowerment. Most groups just don’t have the bandwidth. But we do.</p> */}
				</div>
				{this.props.pageData.show_featured_links ?

					<IconBoxTable
						title="Get started - See your local options!"
						boxes={iconQuickLinks}
					/>
					: null
				}
				{this.props.pageData.show_featured_stats ?

					<Graphs
						graphs={graphs}
						size={148}
					/>
					: null
				}

				{this.props.pageData.show_featured_events ?
					<Events
						events={events}
					/> : null
				}

			</div>
		);
	}
}

const mapStoreToProps = (store) => {
	return {
		pageData: store.page.homePage,
		events: store.page.events,
		graphsData: store.page.communityData
	}
}
export default connect(mapStoreToProps, null)(HomePage);