import React from 'react'
import LoadingCircle from '../../Shared/LoadingCircle';
import { connect } from 'react-redux'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import { Link } from 'react-router-dom'

class OneServicePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null,
            limit: 140,
            expanded: null
        }
    }
    render() {
        if (!this.props.serviceProviders || !this.props.testimonials) {
            return <LoadingCircle />;
        }
        const vendor = this.props.serviceProviders.filter(vendor => {
            return vendor.id === Number(this.props.match.params.id)
        })[0]

        return (
            <>
                <BreadCrumbBar links={[{ name: 'Service Providers', link: '/services' }, { name: `Service Provider ${vendor.id}` }]} />
                <div className="boxed_wrapper">
                    <div className="container">
                        <div className="row pt-3 pb-3">
                            {this.renderVendor(vendor)}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    renderVendor(vendor) {
        const stories = this.props.testimonials.filter(story => {
            return story.vendor && story.vendor.id === Number(this.props.match.params.id)
        })
        return (
            <div className="col-12" key={vendor.vendor}>
                <div className="card rounded-0 spacing">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-4 col-xl-4 col-12 text-center">
                                <img className="w-100" src={vendor.logo.url} alt={vendor.name} />
                                {vendor.address ?
                                    <div className="w-100 p-2 bg-dark text-white text-center justify-content-center">
                                        <span className="fa fa-map-pin"></span> {vendor.address.city}, {vendor.address.state}
                                    </div> : null
                                }
                            </div>
                            <div className="col-lg-8 col-xl-5 col-12 mt-3">
                                <h1 className="pt-3">{vendor.name}</h1>
                                <p>
                                    {vendor.description}
                                </p>
                            </div>
                            <div className='col-xl-3 col-12'>
                                <span><h4>Services</h4></span>
                                <ul className="normal">
                                    {vendor.services.map((service) => {
                                        // return <li key={vendor.name + "-" + action.id}><Link to={"/actions/" + action.id}><u>{action.name}</u></Link></li>;
                                        return <li key={vendor.name + "-" + service.id}><b>{service.name}</b>&nbsp;&nbsp;&nbsp; <p>{service.description}</p></li>;
                                    })}
                                </ul>
                            </div>
                        </div>

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
                        <br />
                        <div className='text-center'>
                            <h4> Testimonials about this Service Provider </h4>
                        </div>
                        {this.renderStories(stories)}
                    </div>
                </div>
            </div>
        );
    }
    renderStories = (stories) => {
        if (stories.length === 0)
            return <p> No stories about this Service Provider yet </p>;
        return (
            <>
                {/* <div className="tab-title-h4">
                    <h4>{stories.length} Stories about this Action</h4>
                </div> */}
                {Object.keys(stories).map((key) => {
                    const story = stories[key];
                    const date = new Date(story.created_at);
                    return (
                        <div className="single-review-box" key={key} style={{ padding: 0 }}>
                            <div className="img-holder">
                                <img src="" alt="" />
                            </div>
                            <div className="text-holder">
                                <div className="top">
                                    <div className="name pull-left">
                                        <h4>{story.user.full_name} – {date.toLocaleDateString()}:</h4>
                                    </div>
                                </div>
                                <div className="text">
                                    <h6>
                                        {story.title}
                                        {this.state.expanded && this.state.expanded === story.id ?
                                            <button className='as-link' style={{ float: 'right' }} onClick={() => { this.setState({ expanded: null }) }}>close</button> : null
                                        }
                                    </h6>
                                    <p>{this.state.expanded && this.state.expanded === story.id ? story.body : story.body.substring(0, this.state.limit)}
                                        {this.state.limit < story.body.length && this.state.expanded !== story.id ?
                                            <button className='as-link' style={{ float: 'right' }} onClick={() => { this.setState({ expanded: story.id }) }}>...more</button>
                                            :
                                            null
                                        }</p>
                                </div>
                                {story.action ?
                                    <div className="text">
                                        <p>Linked Action: <Link to={`/actions/${story.action.id}`}>{story.action.title}</Link></p>
                                    </div> : null
                                }
                            </div>
                        </div>
                    );
                })}
            </>
        );
    }
}
const mapStoreToProps = (store) => {
    return {
        serviceProviders: store.page.serviceProviders,
        testimonials: store.page.testimonials
    }
}
export default connect(mapStoreToProps, null)(OneServicePage);