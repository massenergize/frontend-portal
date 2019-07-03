import React from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import SideBar from './SideBar';
import CONST from './Constants.js';
import NavBarBurger from './NavBarBurger'
import NavBarOffset from './NavBarOffset'
import LoadingPage from './LoadingPage'
import Footer from './Footer'


class EventsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            endDate: new Date(),
            pageData: null,
            userData: null,
            menuData: null,
        }
        this.selectStartDate = this.selectStartDate.bind(this);
        this.selectEndDate = this.selectEndDate.bind(this);

    }
    //gets the data from the api url and puts it in pagedata and menudata
    componentDidMount() {
        fetch(CONST.URL.EVENTS).then(data => {
            return data.json()
        }).then(myJson => {
            this.setState({
                pageData: myJson.pageData,
                menuData: myJson.menuData,
                userData: myJson.userData,
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
    }
    render() {
        //avoids trying to render before the promise from the server is fulfilled
        if (!this.state.pageData) return <LoadingPage />;
        const { //gets the navLinks and footer data out of menu data
            navLinks,
            navBarSticky,
            footerData
        } = this.state.menuData;
        const { //gets the actions and sidebar data out of page data
            events
        } = this.state.pageData;
        return (
            <div className="boxed_wrapper">
                <NavBarBurger
                    navLinks={navLinks}
                    userData={this.state.userData}
                    sticky={navBarSticky}
                />
                <NavBarOffset sticky={navBarSticky} />
                <div className="boxed-wrapper">
                    <section class="eventlist">
                        <div class="container">
                            <div class="row">
                                <div class="d-lg-none d-md-block col-lg-3 col-md-12">
                                    {this.renderSideBar()}
                                </div>
                                <div class="col-lg-9 col-md-12 col-xs-12">
                                    <div class="outer-box sec-padd event-style2">
                                        {this.renderEvents(events)}
                                        <ul class="page_pagination">
                                            <li><a href="#" class="tran3s"><i class="fa fa-angle-left" aria-hidden="true"></i></a></li>
                                            <li><a href="#" class="active tran3s">1</a></li>
                                            <li><a href="#" class="tran3s">2</a></li>
                                            <li><a href="#" class="tran3s"><i class="fa fa-angle-right" aria-hidden="true"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="d-lg-block d-md-none col-lg-3 col-md-12">
                                    {this.renderSideBar()}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer
                    data={footerData}
                />
            </div>
        );
    }
    renderEvents(events) {
        const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();
        var events = Object.keys(events).map(key => {
            return events[key];
        });
        var sortedEvents = events.sort((eventA, eventB) => {
            const dateA = new Date(eventA.year, eventA.month - 1, eventA.day, eventA.hour, eventA.minute);
            const dateB = new Date(eventB.year, eventB.month - 1, eventB.day, eventB.hour, eventB.minute);
            if (((dateA - now) > 0 || this.isToday(dateA)) && ((dateB - now) > 0 || this.isToday(dateB))) {
                return dateA - dateB; //if both dates are coming up (or are today), sort by oldest(closest to current date) to newest (furthest away from current date)
            }
            return (dateB - now) - (dateA - now); //otherwise sort newest(most recently occured or upcoming) to oldest(least recently occured)
        });
        return sortedEvents.map(event => {
            const date = new Date(event.year, event.month - 1, event.day, event.hour, event.minute);
            if (this.shouldRender(event)) {
                return (
                    <div class="item style-1 clearfix">
                        <div class="img-column float_left">
                            <figure class="img-holder">
                                <a href="single-event.html"><img src="images/event/1.jpg" alt="" /></a>
                                {/* if the date has passed already the calender div should be all gray */}
                                <div class={(date - now > 0 || this.isToday(date)) ? "date" : "date old"}><span>{months[event.month]}<br />{event.day}</span></div>
                            </figure>
                        </div>
                        <div class="text-column float_left">
                            <div class="lower-content">
                                <p> {event.organizer} </p>
                                <a href="single-event.html"><h4> {event.title} </h4></a>
                                <div class="text">
                                    <p> {event.description} </p>
                                </div>
                            </div>
                            <ul class="post-meta list_inline">
                                <li><i class="fa fa-clock-o"></i> {date.toLocaleString()} </li> |&nbsp;&nbsp;&nbsp;
                                    <li><i class="fa fa-map-marker"></i> {event.address}</li>
                            </ul>
                        </div>
                    </div>
                );
            } else return null;
        });
    }

    isToday(someDate) {
        const today = new Date()
        return someDate.getDate() == today.getDate() &&
            someDate.getMonth() == today.getMonth() &&
            someDate.getFullYear() == today.getFullYear()
    }
    selectStartDate(newdate) {
        this.setState({
            startDate: newdate
        });
        if (newdate > this.state.endDate)
            this.setState({
                endDate: newdate
            });
    }
    selectEndDate(newdate) {
        this.setState({
            endDate: newdate
        });
    }
    shouldRender(event) {

        return true;
    }

    renderSideBar() {
        return (<div class="blog-sidebar sec-padd">
            <div class="event-filter">
                <div class="section-title style-2">
                    <h4>Event Filter</h4>
                </div>
                <div class="tabs-outer">
                    {/* <!--Tabs Box--> */}
                    <div class="tabs-box tabs-style-one">
                        {/* <!--Tab Buttons--> */}
                        <form class="tab-buttons">
                            <div class="tab-btn"><input type="radio" name="tabs" /> All</div>
                            <div class="tab-btn"><input type="radio" name="tabs" /> Upcoming</div>
                        </form>

                        {/* <!--Tabs Content--> */}
                        <div class="tabs-content">
                            {/* <!--Tab / Active Tab--> */}
                            <div class="tab active-tab" id="tab-two" style={{ display: 'block' }}>
                                <div class="default-form-area all">
                                    <form id="contact-form" name="contact_form" class="default-form style-5" action="inc/sendmail.php" method="post">
                                        <div class="clearfix">
                                            <div class="form-group">
                                                <DatePicker
                                                    selected={this.state.startDate}
                                                    selectsStart
                                                    startDate={this.state.startDate}
                                                    endDate={this.state.endDate}
                                                    onChange={this.selectStartDate}
                                                />
                                                <DatePicker
                                                    selected={this.state.endDate}
                                                    selectsEnd
                                                    startDate={this.state.startDate}
                                                    endDate={this.state.endDate}
                                                    onChange={this.selectEndDate}
                                                    minDate={this.state.startDate}
                                                />
                                                <input type="text" placeholder="Search...." />
                                                <button class="tran3s"><i class="fa fa-search" aria-hidden="true"></i></button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <SideBar
                    filters={this.state.pageData.sidebar}
                />
            </div>
        </div>);
    }

} export default EventsPage;