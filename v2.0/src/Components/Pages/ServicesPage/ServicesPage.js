import React from 'react'
import LoadingCircle from '../../Shared/LoadingCircle';
import { connect } from 'react-redux'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import { Link } from 'react-router-dom'
import notFound from './green-mat.jpg';
import Funnel from '../EventsPage/Funnel';

class ServicesPage extends React.Component {
	constructor(props) {
		super(props);
		this.handleBoxClick = this.handleBoxClick.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.state = {
			check_values: null,
			mirror_services: []
		}
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
	handleSearch = event => {
		const value = event.target.value;
		const services = this.props.serviceProviders;
		const common = [];
		if (value.trim() !== "") {
			for (let i = 0; i < services.length; i++) {
				const ev = services[i];
				if (ev.name.toLowerCase().includes(value.toLowerCase())) {
					common.push(ev);
				}
			}
			this.setState({ mirror_services: [...common] });
		} else {
			this.setState({ mirror_services: [] })
		}
	}
	findCommon() {
		//everytime there is a change in "check_values",
		//loop through all the events again, and render events 
		//with the tag IDs  in "check_values"
		//then pass it on to "renderEvents(...)"
		const services = this.props.serviceProviders;
		const values = this.state.check_values ? this.state.check_values : [];
		const common = [];
		if (services) {
			for (let i = 0; i < services.length; i++) {
				const ev = services[i];
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
	render() {
		var { serviceProviders } = this.props;

		if (!serviceProviders || serviceProviders.length === 0) {
			return (
				<div className="text-center">
					<p > Looks like your community hasn't partnered with any service providers yet.  Try again later</p>
				</div>
			)
		}
		var vendors = this.state.mirror_services.length > 0 ? this.state.mirror_services : this.findCommon();


		return (
			<>

				<div className="boxed_wrapper" >

					<BreadCrumbBar links={[{ name: 'Service Providers' }]} />
					<div className="container">
						<div className="row">

							<div className="col-md-3">
								<div className="event-filter raise" style={{ marginTop: 90, padding: 45, borderRadius: 15 }}>
									<h4>Filter by...</h4>
									<Funnel type="service" boxClick={this.handleBoxClick} search={this.handleSearch} foundNumber={this.state.mirror_services.length} />
								</div>
							</div>
							<div className="col-md-8 col-lg-8 col-sm-12 ">

								<div>
									<h3 className="text-center">Service Providers</h3>
									<h5 className="text-center" style={{ color: 'darkgray' }}>Click to view each provider's services</h5>
								</div>

								<div className="row pt-3 pb-3">
									{this.renderVendors(vendors)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}

	renderVendors(vendors) {
		if (this.state.mirror_services.length === 0) {
			vendors = this.state.check_values === null ? this.props.serviceProviders : vendors;
		}
		// if (!vendors || vendors.length === 0) {
		// 	return (
		// 		<div className="boxed_wrapper" >
		// 			<h2 className='text-center' style={{ color: '#9e9e9e', margin: "190px 150px", padding: "30px", border: 'solid 2px #fdf9f9', borderRadius: 10 }}> Looks like your community hasn't partnered with any vendors yet.  Try again later :( </h2>
		// 		</div>
		// 	)
		// }

		return vendors.map((vendor) => {
			return (
				<div className="col-12 col-md-4 col-lg-4" key={vendor.vendor} >
					<div className="card  spacing " style={{ borderTopRightRadius: 12, borderTopLeftRadius: 12 }}>
						<div className="card-body pref-height vendor-hover" style={{ padding: 0, borderTopRightRadius: 12, borderTopLeftRadius: 12 }}>
							<div className="col-12 text-center" style={{ padding: 0 }}>
								<Link to={`${this.props.links.services}/${vendor.id}`}>
									<img className="w-100" style={{ minHeight: 200, maxHeight: 200, objectFit: 'cover', borderTopRightRadius: 12, borderTopLeftRadius: 12 }} src={vendor.logo ? vendor.logo.url : notFound} alt={vendor.name} />
								</Link>
								<Link to={`${this.props.links.services}/${vendor.id}`}>
									<h4 className="pt-3" style={{ fontSize: 14 }}>{vendor.name}</h4>
								</Link>
								{/* <p className="action-tags">
                                    {vendor.categories.map((category) => {
                                        return (<span key={category}>{category}</span>)  
                                    })}
                                </p> */}
							</div>
							{/* <div className="col-12 mt-3 text-center">
								<span><b>Services</b></span>
								<ul className="normal">
									{vendor.services.map((action) => {
										return <li key={vendor.name + "-" + action.id}>{action.name}</li>;
									})}
								</ul>
							</div> */}
							{/* {vendor.address ?
								<div onClick={() => { window.location = `${this.props.links.services}/${vendor.id}` }} className="w-100 p-2 bg-dark text-white text-center justify-content-center loc-banner" style={{ marginBottom: -16, marginTop: 10 }}>
									<span className="fa fa-map-pin" style={{ marginRight: 4 }}></span> {vendor.address.city}, {vendor.address.state}
								</div> : null}

							{vendor.key_contact != null ? (
								<div className="w-100 p-2 text-center">
									{vendor.user_info ?
										<>
											<a href={"//" + vendor.key_contact.user_info.website} target="_blank" rel="noopener noreferrer" className="font-normal mr-3"><span className="fa fa-link fa-2x"></span></a>
											<a href={"mail://" + vendor.key_contact.email} className="font-normal ml-3"><span className="fa fa-envelope fa-2x"></span></a>
										</> : null}
								</div>
							)
								: null} */}

						</div>
					</div>
				</div>
			);
		});
	}
}
const mapStoreToProps = (store) => {
	return {
		serviceProviders: store.page.serviceProviders,
		links: store.links
	}
}
export default connect(mapStoreToProps, null)(ServicesPage);