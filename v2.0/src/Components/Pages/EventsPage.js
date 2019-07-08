import React from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import SideBar from '../Menu/SideBar';
import CONST from '../Constants';
import LoadingPage from './LoadingPage'
import {Link} from 'react-router-dom'

/**
 * Renders the event page
 */
class EventsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: null, //these start and end dates are selected by the datepickers in the sidebar
            endDate: null,   //when selected, they filter the actions to be between them
            pageData: null,
            userData: null,
        }
        this.selectStartDate = this.selectStartDate.bind(this);
        this.selectEndDate = this.selectEndDate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.resetDates = this.resetDates.bind(this);
    }
    //gets the data from the api url and puts it in pagedata and menudata
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
        //avoids trying to render before the promise from the server is fulfilled
        if (!this.state.pageData) return <LoadingPage />;
        const { //gets the actions and sidebar data out of page data
            events
        } = this.state.pageData;
        return (
            <div className="boxed_wrapper">
                {/* renders the sidebar and events columns */}
                <div className="boxed-wrapper">
                    <section class="eventlist">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-3 col-md-5 col-12">
                                    {this.renderSideBar()}
                                </div>
                                <div class="col-lg-9 col-md-7 col-12">
                                    <div class="outer-box sec-padd event-style2">
                                        {this.renderEvents(events)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    /**
     * Renders all the events on the page,
     * before rendering, pulls the list of event from the server and sorts the list
     * 
     *  Sort:
     *      if the event is coming up,
     *          it is sorted old-new (coming soon - coming later)
     *      if the event has already passed
     *          it is sorted new-old (most recently occured - oldest)
     *      all past events are put after all upcoming events
     *      if an event is today it is considered an upcoming event even if the start time has past
     * 
     *  Filter:
     *      filter by all/upcoming/ between two dates (also does before one date or after one date)
     *      filter by search
     *      filter by category tags 
     * @param events - json list of events
     */
    renderEvents(events) {
        const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();
        //reads events into a list
        var events = Object.keys(events).map(key => {
            return events[key];
        });
        //sorts the list
        var sortedEvents = events.sort((eventA, eventB) => {
            const dateA = new Date(eventA.year, eventA.month - 1, eventA.day, eventA.hour, eventA.minute);
            const dateB = new Date(eventB.year, eventB.month - 1, eventB.day, eventB.hour, eventB.minute);
            if (((dateA - now) > 0 || this.isToday(dateA)) && ((dateB - now) > 0 || this.isToday(dateB))) {
                return dateA - dateB; //if both dates are coming up (or are today), sort by oldest(closest to current date) to newest (furthest away from current date)
            }
            return (dateB - now) - (dateA - now); //otherwise sort newest(most recently occured or upcoming) to oldest(least recently occured)
        });
        //maps the list to react/html code that renders each element
        return sortedEvents.map(event => {
            const date = new Date(event.year, event.month - 1, event.day, event.hour, event.minute);
            if (this.shouldRender(event)) {
                return (
                    <div class="item style-1 clearfix">
                        <div class="row no-gutter">
                            {/* renders the image */}
                            <div class="col-lg-4 col-12">
                                <figure class="img-holder">
                                    <Link to={this.props.match.url + "/" + event.id}><img src={event.image} alt="" /></Link>
                                    {/* if the date has passed already the calender div should be all gray */}
                                    <div class={(date - now > 0 || this.isToday(date)) ? "date" : "date old"}><span>{months[event.month]}<br />{event.day}</span></div>
                                </figure>
                            </div>
                            {/* renders the event text */}
                            <div class=" col-lg-8 col-12">
                                <div class="lower-content">
                                    <p> Organizer: {event.organizer} </p>
                                    <Link to={this.props.match.url + "/" + event.id}><h4> {event.title} </h4></Link>
                                    <div class="text">
                                        <p> {event.description} </p>
                                    </div>
                                </div>
                            </div>
                            {/* renders the  date time and location of the event */}
                            <div class="col-12">
                                <ul class="post-meta list_inline">
                                    <li><i class="fa fa-clock-o"></i> {date.toLocaleString()} </li> |&nbsp;&nbsp;&nbsp;
                                    <li><i class="fa fa-map-marker"></i> {event.address}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            } else return null;
        });
    }
    /**
     * checks if a date is today ignoring time
     * @param  someDate 
     */
    isToday(someDate) {
        const today = new Date()
        return someDate.getDate() == today.getDate() &&
            someDate.getMonth() == today.getMonth() &&
            someDate.getFullYear() == today.getFullYear()
    }
    /**
     * changes the start date to the date chosen by the date selector
     * also removes checks from the radio buttons all and upcoming
     * @param {*} newdate 
     */
    selectStartDate(newdate) {
        this.setState({
            startDate: newdate
        });
        if (this.state.endDate) { //if the end date is smaller than the start date, remove the end date
            if (newdate > this.state.endDate) {
                this.setState({
                    endDate: null
                });
            }
        }
        document.getElementById('show-all-button').checked = false;
        document.getElementById('show-upcoming-button').checked = false;
    }
    /**
     * changes the end date to the date chosen by the date selector
     * also removes checks from the radio buttons all and upcoming
     * @param {*} newdate 
     */
    selectEndDate(newdate) {
        this.setState({
            endDate: newdate
        });
        document.getElementById('show-all-button').checked = false;
        document.getElementById('show-upcoming-button').checked = false;
    }

    /**
     * checks the filters in the sidebar to see if an event should render or not
     * @param {*} event 
     */
    shouldRender(event) {
        var date = new Date(event.year, event.month - 1, event.day, event.hour, event.minute);

        if (!(this.searchFits(event.title) || this.searchFits(event.description)))
            return false;
        if (!this.showButtonFits(date))
            return false;
        if (!this.dateFits(date))
            return false;

        var tagSet = new Set(); //create a set of the action's tag ids
        event.tags.forEach(tag => {
            tagSet.add(tag.id);
        });
        for (var i in this.state.pageData.sidebar) {
            var filter = this.state.pageData.sidebar[i]; //if any filter does not fit, return false
            if (!this.filterFits(filter.tags, tagSet)) { //only one tag in a filter collection needs to fit to make the filter fit
                return false;
            }
        }
        return true;
    }
    //checks if the value of the search bar is in the title of the action
    searchFits(string) {
        var searchbar = document.getElementById('action-searchbar');
        if (!searchbar) //if cant find the search bar just render everything
            return true;
        if (searchbar.value === '')
            return true;
        if ((string.toLowerCase()).includes((searchbar.value.toLowerCase())))
            return true;

        return false;
    }
    showButtonFits(date) {
        var now = new Date();
        var showAll = document.getElementById('show-all-button');
        var showUpcoming = document.getElementById('show-upcoming-button');
        if (!showAll || !showUpcoming)
            return true; //if can't find the buttons they haven't rendered yet, just default true
        if ((!showUpcoming.checked && !showAll.checked) || showAll.checked)
            return true;
        else if (showUpcoming.checked)
            return (date - now > 0 || this.isToday(date));
        return false;
    }
    dateFits(date) {
        if (!this.state.startDate && !this.state.endDate)
            return true;
        if (!this.state.endDate)
            return date.setHours(0, 0, 0, 0) >= this.state.startDate.setHours(0, 0, 0, 0);
        if (!this.state.startDate)
            return date.setHours(0, 0, 0, 0) <= this.state.endDate.setHours(0, 0, 0, 0);
        return date.setHours(0, 0, 0, 0) >= this.state.startDate.setHours(0, 0, 0, 0) && date.setHours(0, 0, 0, 0) <= this.state.endDate.setHours(0, 0, 0, 0)
    }
    //checks if any of the options are checked off in the filter
    //takes in the the filter and the actions' options for that filter
    filterFits(filtertags, tagSet) {
        var noFilter = true; //go through the filters and check if any of them fit or if none are checked
        for (var i in filtertags) {
            var checkbox = document.getElementById("filtertag" + filtertags[i].id);
            if (checkbox && checkbox.checked) {
                noFilter = false;
                if (tagSet.has(filtertags[i].id))
                    return true;
            }
        }
        return noFilter;
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
                            <div class="tab-btn"><input type="radio" name="tabs" id="show-all-button" onClick={this.resetDates} /> All</div>
                            <div class="tab-btn"><input type="radio" name="tabs" id="show-upcoming-button" onClick={this.resetDates} /> Upcoming</div>
                        </form>

                        {/* <!--Tabs Content--> */}
                        <div class="tabs-content">
                            {/* <!--Tab / Active Tab--> */}
                            <div class="tab active-tab" id="tab-two" style={{ display: 'block' }}>
                                <div class="default-form-area all">
                                    <form id="contact-form" name="contact_form" class="default-form style-5" action="inc/sendmail.php" method="post">
                                        <div class="clearfix">
                                            <div class="form-group">
                                                <p>
                                                    Find events between:
                                                </p>
                                                <DatePicker
                                                    selected={this.state.startDate}
                                                    selectsStart
                                                    startDate={this.state.startDate}
                                                    endDate={this.state.endDate}
                                                    onChange={this.selectStartDate}
                                                    placeholderText="Enter a starting date"
                                                />
                                                <DatePicker
                                                    selected={this.state.endDate}
                                                    selectsEnd
                                                    startDate={this.state.startDate}
                                                    endDate={this.state.endDate}
                                                    onChange={this.selectEndDate}
                                                    minDate={this.state.startDate}
                                                    placeholderText="Enter an ending date"
                                                />
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
                    onChange={this.handleChange} //runs when any category is selected or unselected
                />
            </div>
        </div>);
    }
    handleChange() {
        this.forceUpdate();
    }
    resetDates(){
        this.setState({
            endDate: null,
            startDate: null,
        });
        this.forceUpdate();
    }

} export default EventsPage;