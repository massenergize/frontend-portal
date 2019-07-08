import React from 'react'
import CONST from '../Constants'
import LoadingPage from './LoadingPage'
import {Link} from 'react-router-dom'

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
                    <section class="event-section style-3">
                        <div class="container">
                            <div class="single-event sec-padd">
                                <div className="row">
                                    <div className="col-12 col-lg-6">
                                        <div class="img-box">
                                            <img src={event.image} alt="" />
                                            <div class="countdown-timer">
                                                <div class="default-coundown">
                                                    <div class="countdown time-countdown-two" data-countdown-time="2017/07/07"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div class="text">
                                            <p>Organizer: {event.organizer}</p>
                                            <h3>{event.title}</h3>
                                            <p>{event.description}</p>
                                            <br />
                                            <p>{event.moreinfo}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="content">
                                    <div class="row">
                                        <div class="col-md-6 col-sm-6 col-xs-12">
                                            <div class="event-timeline">
                                                <div class="section-title style-2">
                                                    <h3>Event Schedule</h3>
                                                </div>
                                                <ul>
                                                    <li><i class="fa fa-clock-o"></i><b>Time:</b> {date.toLocaleString()}</li>
                                                    <li><i class="fa fa-map-marker"></i><b>Venue:</b> {event.address}</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-sm-6 col-xs-12">
                                            <div class="section-title style-2">
                                                <h3>Event Details</h3>
                                            </div>
                                            <ul class="list2">
                                                {Object.keys(event.details).map(key => {
                                                    return <li><i class="fa fa-check-circle"></i>{event.details[key]}</li>
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="section-title style-2">
                                        <h3>Our Sponsors</h3>
                                    </div>
                                    <ul class="brand-carousel2">
                                        <li><Link to="#"><img src="images/event/b1.jpg" alt="" /></Link></li>
                                        <li><Link to="#"><img src="images/event/b2.jpg" alt="" /></Link></li>
                                        <li><Link to="#"><img src="images/event/b3.jpg" alt="" /></Link></li>
                                        <li><Link to="#"><img src="images/event/b4.jpg" alt="" /></Link></li>
                                    </ul>
                                </div>
                                <div class="share clearfix">
                                    <div class="social-box float_left">
                                        <span>Share <i class="fa fa-share-alt"></i></span>
                                        <ul class="list-inline social">
                                            <li><Link to="/"><i class="fa fa-facebook"></i></Link></li>
                                            <li><Link to="/"><i class="fa fa-twitter"></i></Link></li>
                                            <li><Link to="/"><i class="fa fa-google-plus"></i></Link></li>
                                            <li><Link to="/"><i class="fa fa-pinterest"></i></Link></li>
                                        </ul>
                                    </div>
                                    <div class="float_right">
                                        <Link to="/donate" class="thm-btn style-2 donate-box-btn">Donate</Link>
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
} export default OneEventPage;