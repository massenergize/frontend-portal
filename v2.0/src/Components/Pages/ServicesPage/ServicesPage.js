import React from 'react'
import CONST from '../../Constants.js';
import LoadingPage from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages';
import {Link} from 'react-router-dom';

class ServicesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null
        }
    }
    componentDidMount() {
        fetch(CONST.URL.SERVICES).then(data => {
            return data.json()
        }).then(myJson => {
            this.setState({
                pageData: myJson.pageData,
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
    }

    render() {
        if(!this.state.pageData) return <LoadingPage/>;
        
        const {
            welcomeImagesData,
            vendors
        } = this.state.pageData;

        return (
            <div className="boxed_wrapper">
                <WelcomeImages
                    data={welcomeImagesData} title="Service Providers"
                />
                <div className="container">
                    <div className="row pt-3 pb-3">
                        {this.renderVendors(vendors)}
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
                                <img className="w-100" src={vendor.logo}/>
                                <h3 className="pt-3">{vendor.vendor}</h3>
                                <p className="action-tags">
                                    {vendor.categories.map((category) => {
                                        return (<span key={category}>{category}</span>)  
                                    })}
                                </p>
                            </div>
                            <div className="col-12 mt-3">
                                <span><b>Services:</b></span>
                                <ul className="normal">
                                    {vendor.services.map((action) => {
                                        return <li key={vendor.vendor + "-" + action.id}><Link to={"/actions/" + action.id}><u>{action.title}</u></Link></li>;
                                    })}
                                </ul>
                            </div>
                            <div className="w-100 p-2 bg-dark text-white text-center justify-content-center">
                                <span className="fa fa-map-pin"></span> {vendor.geographicServiceArea}
                            </div>
                            <div className="w-100 p-2 text-center">
                                <a href={"//" + vendor.website} target="_blank" className="font-normal mr-3"><span className="fa fa-link fa-2x"></span></a>
                                <a href={"mail://" + vendor.contactEmail} className="font-normal ml-3"><span className="fa fa-envelope fa-2x"></span>&nbsp;<span>{vendor.contactEmail}</span></a>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    }
}
export default ServicesPage;