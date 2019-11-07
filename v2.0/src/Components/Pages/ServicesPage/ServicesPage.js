import React from 'react'
import LoadingCircle from '../../Shared/LoadingCircle';
import { connect } from 'react-redux'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import { Link } from 'react-router-dom'
import notFound from './green-mat.jpg';
class ServicesPage extends React.Component {

	render() {
		const {
			serviceProviders
		} = this.props;

		if (!serviceProviders || serviceProviders.length === 0) {
			return (
				<div className="text-center">
					<p > Looks like your community hasn't partnered with any service providers yet.  Try again later</p>
				</div>
			)
		}

		return (
			<>

				<div className="boxed_wrapper" >
					<BreadCrumbBar links={[{ name: 'Service Providers' }]} />
					<div className="container">
						{serviceProviders.length > 0 ?
							<div>
								<h3 className="text-center">Service Providers</h3>
								<h5 className="text-center" style={{ color: 'darkgray' }}>Click to view each provider's services</h5>
							</div>
							: null}
						<div className="row pt-3 pb-3">
							{this.renderVendors(serviceProviders)}
						</div>
					</div>
				</div>
			</>
		);
	}

	renderVendors(vendors) {
		if (!vendors || vendors.length === 0) {
			return (
				<div className="boxed_wrapper" >
					<h2 className='text-center' style={{ color: '#9e9e9e', margin: "190px 150px", padding: "30px", border: 'solid 2px #fdf9f9', borderRadius: 10 }}> Looks like your community hasn't partnered with any vendors yet.  Try again later :( </h2>
				</div>
			)
		}
		return vendors.map((vendor) => {
			return (
				<div className="col-12 col-md-6 col-lg-4" key={vendor.vendor} >
					<div className="card  spacing" style={{ borderTopRightRadius: 12, borderTopLeftRadius: 12 }}>
						<div className="card-body pref-height" style={{ padding: 0 }}>
							<div className="col-12 text-center" style={{ padding: 0 }}>
								<Link to={`${this.props.links.services}/${vendor.id}`}>
									<img className="w-100" style={{ minHeight: 250, maxHeight: 250, objectFit: 'cover', borderTopRightRadius: 12, borderTopLeftRadius: 12 }} src={vendor.logo ? vendor.logo.url : notFound} alt={vendor.name} />
								</Link>
								<Link to={`${this.props.links.services}/${vendor.id}`}>
									<h4 className="pt-3">{vendor.name}</h4>
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
							{vendor.address ?
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
								: null}

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