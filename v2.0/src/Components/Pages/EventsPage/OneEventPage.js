import React from 'react'
import LoadingCircle from '../../Shared/LoadingCircle'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
class OneEventPage extends React.Component {
    /**
    * renders a single event from the passes id prop 
    */
    render() {
        if (!this.props.events) return <LoadingCircle />;

        const event = this.props.events.filter(event => {
            return event.id === Number(this.props.match.params.id)
        })[0]
        //avoids trying to render before the promise from the server is fulfilled
        return (
            <>
                <BreadCrumbBar links={[{ link:this.props.links.events, name: 'Events' }, { name: `Event ${event.id}` }]} />
                <div className="boxed_wrapper">
                    <section className="shop-single-area">
                        <div className="container">
                            <div className="single-products-details">
                                {this.renderEvent(event)}
                            </div>
                        </div>
                    </section>
                </div>
            </>
        );
    }

    renderEvent(event) {
        if (!event) return (<div> ...oops couldn't find event with id: {this.props.match.params.id}</div>);
        const date = new Date(event.start_date_and_time);
        const endDate = new Date(event.end_date_and_time);
        return (
            <section className="event-section style-3">
                <div className="container">
                    <div className="single-event sec-padd">
                        <div className="row">
                            <div className="col-12 col-lg-6">
                                <div className="img-box">
                                    <img src={event.image ? event.image.url : null} alt="" />
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="text">
                                    <h3>{event.name}</h3>
                                    <p>{event.description}</p>
                                    <br />
                                    <p>{event.moreinfo}</p>
                                </div>
                            </div>
                        </div>

                        <div className="content">
                            <div className="row">

                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <div className="event-timeline">
                                        <div className="section-title style-2">
                                            <h3>Event Schedule</h3>
                                        </div>
                                        <ul>
                                            <li key='time'><i className="fa fa-clock-o"></i><b>Date:</b>{date.toLocaleString()}
                                                <b> - </b>{endDate.toLocaleString()}
                                            </li>
                                            {event.location ?
                                                <li>
                                                    <i className="fa fa-map-marker" />
                                                    <b>Venue:</b> {event.location.street + ", " + event.location.city + " " + event.location.state}
                                                </li>
                                                :
                                                null
                                            }
                                        </ul>
                                    </div>
                                </div>
                                {event.details ?
                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                        <div className="section-title style-2">
                                            <h3>Event Details</h3>
                                        </div>

                                        <ul className="list2">
                                            {this.renderDetails(event.details)}
                                        </ul>
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
    renderDetails(details) {
        return Object.keys(details).map(key => {
            return <li key={key}><i className="fa fa-check-circle"></i>{details[key]}</li>
        })
    }
}
const mapStoreToProps = (store) => {
    return {
        auth: store.firebase.auth,
        user: store.user.info,
        events: store.page.events,
        links: store.links
    }
}
export default connect(mapStoreToProps, null)(OneEventPage);