import React from 'react'
import BarGraph from '../../Shared/BarGraph'
import CircleGraph from '../../Shared/CircleGraph';
import PageTitle from '../../Shared/PageTitle';
import { connect } from 'react-redux';
import LoadingCircle from '../../Shared/LoadingCircle';
import { getJson } from '../../../api/functions'
import URLS from '../../../api/urls'
import { reduxLoadCommunitiesStats } from '../../../redux/actions/pageActions'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'

// TODO: Render sidebar graphs
// Replace Households Engaged by Categories with Actions Completed by Category

class ImpactPage extends React.Component {
	render() {
		if (!this.props.communitiesStats || this.props.communitiesStats.length <= 0) {
			getJson(URLS.COMMUNITIES_STATS).then(json => {
				console.log(json);
				if (json.success) {
					this.props.reduxLoadCommunitiesStats(json.data.length > 0 ? json.data : null)
				}
			})
			return <LoadingCircle />
		}
		
		if (!this.props.tagCols || !this.props.communityData) return <LoadingCircle />;
		if (!this.props.communityData || this.props.communityData.length === 0) {
			return (
				<div className="boxed_wrapper" >
					<h2 className='text-center' style={{ color:'#9e9e9e',margin: "190px 150px", padding: "30px", border: 'solid 2px #fdf9f9', borderRadius: 10 }}> Sorry, there are not stats for this community yet :( </h2>
				</div>
			)
		}
		let stats = this.props.communitiesStats.slice(0);

		stats = stats.sort((a, b) => {
			return b.actions_completed - a.actions_completed;
		});

		let communityImpact = {
			// "categories": ["Wayland", "Weston", "Lincoln", "Concord", "Framingham", "Newton"],
			"categories": [],
			"series": [
				{
					name: "Households Engaged",
					// data: [100, 90, 80, 70, 60, 50]
					data: []
				},
				{
					name: "Actions Completed",
					// data: [300, 250, 200, 150, 100, 50]
					data: []
				}
			]
		};

		stats.forEach(comm => {
			communityImpact.categories.push(comm.community.name);
			communityImpact.series[0].data.push(comm.households_engaged);
			communityImpact.series[1].data.push(comm.actions_completed);
		});

		var tags = this.props.tagCols.filter(tagCol => { return tagCol.name === 'Category' })[0].tags;
		var graph2Categories = [];
		var graph2Series = [
			{
				name: "State reported",
				data: [],
			},
			{
				name: "Self reported",
				data: [],
			},
		];

		tags.forEach(tag => {
			var data = this.props.communityData.filter(d => {
				return d.tag === tag.id
			})[0];
			if (data) {
				graph2Categories.push(data.name);
				graph2Series[1].data.push(data.value);
				var stata = this.props.communityData.filter(d => {
					return (d.tag && d.tag === data.tag && d.name.toLowerCase().indexOf('state') > -1);
				})[0];
				if (stata) {
					graph2Series[0].data.push(stata.value);
				} else {
					graph2Series[0].data.push(0);
				}
			}
		})

		var householdsEngaged = this.props.communityData.filter(d => {
			return d.name === 'EngagedHouseholdsData';
		})[0];
		var actionsCompleted = this.props.communityData.filter(d => {
			return d.name === 'ActionsCompletedData';
		})[0];
		return (
			<>
				
				<div className='boxed_wrapper' >
				<BreadCrumbBar links={[{ name: 'Impact' }]} />
					<div className="container bg-light p-5">
						<PageTitle>Our Community's Impact</PageTitle>
						<div className="row">
							<div className="col-12 col-lg-4">
								<div className="card rounded-0 mb-4">
									<div className="card-body">
										<CircleGraph
											num={householdsEngaged.value} goal={Number(householdsEngaged.denominator)} label={'Households Engaged'} size={150}
											colors={["#428a36"]}
										/>
									</div>
								</div>
								<div className="card rounded-0 mb-4">
									<div className="card-body">
										<CircleGraph
											num={actionsCompleted.value} goal={Number(actionsCompleted.denominator)} label={"Actions Completed"} size={150}
											colors={["#FB5521"]}
										/>
									</div>
								</div>
							</div>
							<div className="col-12 col-lg-8">
								<div className="card rounded-0 mb-4">
									<div className="card-header text-center bg-white">
										<h4 className="cool-font">Number Of Actions Completed</h4>
										{/* <p style={{top:240,position:'absolute',fontSize:16, transform:'rotateZ(-90deg',left:-100}}>Number Of Actions Completed</p> */}
									</div>
									<div className="card-body">
										<BarGraph
											categories={graph2Categories}
											series={graph2Series}
											stacked={true}
											colors={["#ff9a9a", "rgba(251, 85, 33, 0.85)"]}
										// 86bd7d
										/>
										{/* <center><p style={{fontSize:16,margin:0}} className="cool-font">Community Goals</p></center> */}
									</div>
								
								</div>

								<div className="card rounded-0 mb-4">
									<div className="card-header text-center bg-white">
										<h4 className="cool-font">Number Of Communities And Their Impacts</h4>
										{/* <p style={{top:240,position:'absolute',fontSize:14, transform:'rotateZ(-90deg',left:-133}}>Number Of Actions Completed By Community</p> */}
									</div>
									<div className="card-body">
										<BarGraph
											categories={communityImpact.categories}
											series={communityImpact.series}
											colors={["#428a36", "#FB5521"]}
										/>
											{/* <center><p style={{fontSize:16,margin:0}}>Communities</p></center> */}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

const mapStoreToProps = (store) => {
	return {
		communitiesStats: store.page.communitiesStats,
		communityData: store.page.communityData,
		tagCols: store.page.tagCols
	}
}
export default connect(mapStoreToProps, { reduxLoadCommunitiesStats })(ImpactPage);