import React from 'react'
import LoadingCircle from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages'
import Graphs from './Graphs';
import IconBoxTable from './IconBoxTable';
import Events from './Events';
import { section } from '../../../api/functions'
import { connect } from 'react-redux'


/*
* The Home Page of the MassEnergize
*/
class HomePage extends React.Component {

	render() {
		if (!this.props.pageData) return <p className='text-center'> Sorry, looks like this community's Home Page is under maintenance. Try again later </p>;

		const { pageData, events } = this.props;
		const welcomeImagesData = section(pageData, "WelcomeImages").slider[0].slides;
		const iconQuickLinks = section(pageData, "IconQuickLinks").cards;
		const header = section(pageData, "HomeHeader");
		const graphs = [
			{
				title: 'Actions Completed',
				data: this.props.graphsData ? this.props.graphsData.filter(data => { return data.name === 'ActionsCompletedData' })[0] : null
			},
			{
				title: 'Households Engaged',
				data: this.props.graphsData ? this.props.graphsData.filter(data => { return data.name === 'EngagedHouseholdsData' })[0] : null
			},
		]
		return (
			<div className="boxed_wrapper">
				{welcomeImagesData ?
					<WelcomeImages
						data={welcomeImagesData}
						title={header.title}
					/> : null
				}
				<h3 align='center' className='home-subtitle p-3'>{header.description}</h3>
				{this.props.graphsData ?
					<Graphs
						graphs={graphs}
						size={120}
					/> : null
				}
				{iconQuickLinks ?
					<IconBoxTable
						title="Get started - See your local options!"
						boxes={iconQuickLinks}
					/> : null
				}
				{events ?
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