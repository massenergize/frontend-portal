import React from 'react'
import { section } from '../../../api/functions'
import LoadingCircle from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages';
import { connect } from 'react-redux'

class ServicesPage extends React.Component {
    
    render() {
        const {
            pageData,
            serviceProviders
        } = this.props;

        if(pageData == null || serviceProviders == null) return <LoadingCircle/>;

        const welcomeImagesData = section(pageData, "WelcomeImages").slider[0].slides;

        return (
            <div className="boxed_wrapper">
                <WelcomeImages
                    data={welcomeImagesData} title="Service Providers"
                />
                <div className="container">
                    <div className="row pt-3 pb-3">
                        {this.renderVendors(serviceProviders)}
                    </div>
                </div>
            </div>
        );
    }

    renderVendors(vendors) {
        return vendors.map((vendor) => {
            return (
                <div className="col-12 col-md-6 col-lg-4" key={vendor.vendor}>
                    <div className="card rounded-0 spacing">
                        <div className="card-body">
                            <div className="col-12 text-center">
                                <img className="w-100" src={vendor.logo.url} alt={vendor.name}/>
                                <h3 className="pt-3">{vendor.name}</h3>
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
                                        // return <li key={vendor.name + "-" + action.id}><Link to={"/actions/" + action.id}><u>{action.name}</u></Link></li>;
                                        return <li key={vendor.name + "-" + action.id}>{action.name}</li>;
                                    })}
                                </ul>
                            </div>
                            <div className="w-100 p-2 bg-dark text-white text-center justify-content-center">
                                <span className="fa fa-map-pin"></span> {vendor.address.city}, {vendor.address.state}
                            </div>
                            
                            {vendor.key_contact != null ? (
                                <div className="w-100 p-2 text-center">
                                    <a href={"//" + vendor.key_contact.user_info.website} target="_blank" rel="noopener noreferrer" className="font-normal mr-3"><span className="fa fa-link fa-2x"></span></a> 
                                    <a href={"mail://" + vendor.key_contact.email} className="font-normal ml-3"><span className="fa fa-envelope fa-2x"></span></a>
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
        pageData: store.page.serviceProvidersPage,
        serviceProviders: store.page.serviceProviders
    }
}
export default connect(mapStoreToProps, null)(ServicesPage);