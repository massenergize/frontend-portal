import React from 'react'
import CONST from '../../Constants'
import LoadingPage from '../../Shared/LoadingCircle'
import { Link } from 'react-router-dom'

class OneEventPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null,
            userData: null,
        }
    }
    //grab the events page data from the api
    componentDidMount() {
        fetch(CONST.URL.EVENTS).then(data => {
            return data.json()
        }).then(myJson => {
            this.setState({
                pageData: myJson.pageData,
                userData: myJson.userData,
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
    }
    render() {
        //waits for the data from the server
        if (!this.state.pageData) return <LoadingPage />;
        const {
            events,
        } = this.state.pageData;
        return (
            <div className="boxed_wrapper">


                <section className="shop-single-area">
                    <div className="container">
                        <div className="single-products-details">
                            {this.renderEvent(events, this.props.match.params.id)}
                        </div>
                    </div>
                </section>

            </div>
        );
    }

    renderEvent(events, id) {
        for (var i in events) {
            var event = events[i]; // finds the action we are looking to display and displays it
            if (event.id === parseInt(id)) {
                const date = new Date(event.year, event.month - 1, event.day, event.hour, event.minute);
                return (
                    <section className="event-section style-3">
                        <div className="container">
                            <div className="single-event sec-padd">
                                <div className="row">
                                    <div className="col-12 col-lg-6">
                                        <div className="img-box">
                                            <img src={event.image} alt="" />
                                            <div className="countdown-timer">
                                                <div className="default-coundown">
                                                    <div className="countdown time-countdown-two" data-countdown-time="2017/07/07"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div className="text">
                                            <p>Organizer: {event.organizer}</p>
                                            <h3>{event.title}</h3>
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
                                                    <li key='time'><i className="fa fa-clock-o"></i><b>Time:</b> {date.toLocaleString()}</li>
                                                    <li key='venue'><i className="fa fa-map-marker"></i><b>Venue:</b> {event.address}</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-sm-6 col-xs-12">
                                            <div className="section-title style-2">
                                                <h3>Event Details</h3>
                                            </div>
                                            <ul className="list2">
                                                {this.renderDetails(event.details)}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="section-title style-2">
                                        <h3>Our Sponsors</h3>
                                    </div>
                                    <ul className="brand-carousel2">
                                        <li key='0'><Link to="#"><img src="images/event/b1.jpg" alt="" /></Link></li>
                                        <li key='1'><Link to="#"><img src="images/event/b2.jpg" alt="" /></Link></li>
                                        <li key='2'><Link to="#"><img src="images/event/b3.jpg" alt="" /></Link></li>
                                        <li key='3'><Link to="#"><img src="images/event/b4.jpg" alt="" /></Link></li>
                                    </ul>
                                </div>
                                <div className="share clearfix">
                                    <div className="social-box float_left">
                                        <span>Share <i className="fa fa-share-alt"></i></span>
                                        <ul className="list-inline social">
                                            <li key='fb'><Link to="/"><i className="fa fa-facebook"></i></Link></li>
                                            <li key='g'><Link to="/"><i className="fa fa-google-plus"></i></Link></li>
                                        </ul>
                                    </div>
                                    <div className="float_right">
                                        <Link to="/donate" className="thm-btn style-2 donate-box-btn">Donate</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                );
            }
        }
        return <div> ...oops couldn't find event with id: {id}</div>
    }
    renderDetails(details) {
        return Object.keys(details).map(key => {
            return <li key={key}><i className="fa fa-check-circle"></i>{details[key]}</li>
        })
    }
} export default OneEventPage;