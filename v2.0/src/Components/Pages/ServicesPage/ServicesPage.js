import React from 'react'
import LoadingCircle from '../../Shared/LoadingCircle';
import { connect } from 'react-redux'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import { Link } from 'react-router-dom'

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
                <BreadCrumbBar links={[{ name: 'Service Providers' }]} />
                <div className="boxed_wrapper" style={{marginTop:90}}>
                    <div className="container">
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
                <div className="text-center">
                    <p > Looks like your community hasn't partnered with any vendors yet.  Try again later</p>
                </div>
            )
        }
        return vendors.map((vendor) => {
            return (
                <div className="col-12 col-md-6 col-lg-4" key={vendor.vendor}>
                    <div className="card rounded-0 spacing">
                        <div className="card-body">
                            <div className="col-12 text-center">
                                <Link to={`${this.props.links.services}/${vendor.id}`}>
                                    <img className="w-100" src={vendor.logo.url} alt={vendor.name} />
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
                            <div className="col-12 mt-3">
                                <span><b>Services</b></span>
                                <ul className="normal">
                                    {vendor.services.map((action) => {
                                        return <li key={vendor.name + "-" + action.id}>{action.name}</li>;
                                    })}
                                </ul>
                            </div>
                            {vendor.address ?
                                <div className="w-100 p-2 bg-dark text-white text-center justify-content-center">
                                    <span className="fa fa-map-pin"></span> {vendor.address.city}, {vendor.address.state}
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