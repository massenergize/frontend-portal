import React from 'react'
import BarGraph from '../../Shared/BarGraph'
import CircleGraph from '../../Shared/CircleGraph';
import PageTitle from '../../Shared/PageTitle';
import { connect } from 'react-redux';
import LoadingCircle from '../../Shared/LoadingCircle';
import { reduxLoadCommunitiesStats } from '../../../redux/actions/pageActions'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import Error404 from './../Errors/404';
// TODO: Render sidebar graphs
// Replace Households Engaged by Categories with Actions Completed by Category

class ImpactPage extends React.Component {
	render() {
		if (!this.props.comData) {
			return (
				<Error404 message = "Sorry, there are no stats for this community yet "/>
			)
		}
		const community = this.props.communityData ? this.props.comData.community :null;
		const goal = this.props.comData ? this.props.comData.goal : null;
		const completed = this.props.communityData ? this.props.communityData.data :[];
		if (!this.props.tagCols || !this.props.communityData) return <LoadingCircle />;
		if (!this.props.communityData || this.props.communityData.length === 0) {
			return (
				<div className="boxed_wrapper" >
					<h2 className='text-center' style={{ color: '#9e9e9e', margin: "190px 150px", padding: "30px", border: 'solid 2px #fdf9f9', borderRadius: 10 }}> :( </h2>
				</div>
			)
		}
		let stats = this.props.communitiesStats ?this.props.communitiesStats.data.slice(0):[];
		stats = stats.sort((a, b) => {
			return b.actions_completed - a.actions_completed;
		});

		let communityImpact = {
			"categories": [],
			"series": [
				{
					name: "Households Engaged",
					data: []
				},
				{
					name: "Actions Completed",
					data: []
				}
			]
		};
		stats.forEach(comm => {
			communityImpact.categories.push(comm.community.name);
			communityImpact.series[0].data.push(comm.households_engaged);
			communityImpact.series[1].data.push(comm.actions_completed);
		});

		var graph2Categories = [];
		var graph2Series = [
			{
				name: "Self Reported",
				data: [],
			},
			{
				name: "State Reported",
				data: [],
			}
		];

		completed.forEach(el =>{
			if(el){
				graph2Categories.push(el.name);
				graph2Series[0].data.push(el.value);
				graph2Series[1].data.push(el.reported_value);
			}
		})

		return (
			<>

				<div className='boxed_wrapper' >
					<BreadCrumbBar links={[{ name: 'Impact' }]} />
					<div className="container p-5" style={{background:'white'}}>

						<div className="row">
							<div className="col-12 col-lg-4" >
								<h5 className="text-center" style={{ color: '#888', margin: 19 }}>{community ? community.name : null}</h5>
								<div className="card  mb-4 raise"  style={{borderRadius:10,background:'transparent',borderColor:'#ecf3ee'}}>
									<div className="card-body">
										<CircleGraph
											num={goal ? goal.attained_number_of_households : 0} goal={goal ? goal.target_number_of_households : 0} label={'Households Engaged'} size={150}
											colors={["#428a36"]}
										/>
									</div>
								</div>
								<div className="card raise mb-4"  style={{borderRadius:10,background:'transparent',borderColor:'#ecf3ee'}}>
									<div className="card-body">
										<CircleGraph
											num={goal ? goal.attained_number_of_actions : 0} goal={goal ? goal.target_number_of_actions : 0} label={"Actions Completed"} size={150}
											colors={["#FB5521"]}
										/>
									</div>
								</div>
							</div>
							<div className="col-12 col-lg-8">
								<PageTitle>Our Community's Impact</PageTitle>
								<div className="card rounded-0 mb-4" style={{ marginTop: 15 }}>
									<div className="card-header text-center bg-white" style={{marginTop:5}}>
										<h4 className="cool-font">Number Of Actions Completed</h4>
										{/* <p style={{top:240,position:'absolute',fontSize:16, transform:'rotateZ(-90deg',left:-100}}>Number Of Actions Completed</p> */}
									</div>
									<div className="card-body">
										<BarGraph
											categories={graph2Categories}
											series={graph2Series}
											stacked={true}
											colors={["rgba(251, 85, 33, 0.85)","#ff9a9a" ]}
										// 86bd7d
										/>
										{/* <center><p style={{fontSize:16,margin:0}} className="cool-font">Community Goals</p></center> */}
									</div>

								</div>

								<div className="card rounded-0 mb-4">
									<div className="card-header text-center bg-white">
										<h4 className="cool-font"> See How We Compare To Our Neighbors</h4>
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
		tagCols: store.page.tagCols,
		comData: store.page.homePage,
	}
}
export default connect(mapStoreToProps, { reduxLoadCommunitiesStats })(ImpactPage);