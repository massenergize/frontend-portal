import React from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import SideBar from './SideBar';

class EventsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            endDate: new Date()
        }
        this.selectStartDate = this.selectStartDate.bind(this);
        this.selectEndDate = this.selectEndDate.bind(this);

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
    render() {
        return (
            <div className="boxed-wrapper">
                <section class="eventlist">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-9 col-sm-12 col-xs-12">
                                <div class="outer-box sec-padd event-style2">
                                    <div class="item style-1 clearfix">
                                        <div class="img-column float_left">
                                            <figure class="img-holder">
                                                <a href="single-event.html"><img src="https://images.unsplash.com/photo-1561832469-637830b89468?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80" /></a>
                                                <div class="date"><span>21 <br />Mar</span></div>
                                            </figure>
                                        </div>
                                        <div class="text-column float_left">
                                            <div class="lower-content">
                                                <p>Organizer: Tom Maddy</p>
                                                <a href="single-event.html"><h4>A Walk for Healthy Environment</h4></a>
                                                <div class="text">
                                                    <p>This mistaken idea of denouncing pleasure and praising pain was <br /> born and I will give you a complete account of the systemexpound <br />the actual teachings of the great explorer...</p>
                                                </div>
                                            </div>
                                            <ul class="post-meta list_inline">
                                                <li><i class="fa fa-clock-o"></i>Started On: 11.00am </li> |&nbsp;&nbsp;&nbsp;
                                                <li><i class="fa fa-map-marker"></i> New Grand Street, California</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="item style-1 clearfix">
                                        <div class="img-column float_left">
                                            <figure class="img-holder">
                                                <a href="single-event.html"><img src="https://images.unsplash.com/photo-1561832469-637830b89468?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80" /></a>
                                                <div class="date"><span>07 <br />Mar</span></div>
                                            </figure>
                                        </div>
                                        <div class="text-column float_left">
                                            <div class="lower-content">
                                                <p>Organizer: Darren Fletcher</p>
                                                <a href="single-event.html"><h4>Recycling Plastic Bottles</h4></a>
                                                <div class="text">
                                                    <p>This mistaken idea of denouncing pleasure and praising pain was <br /> born and I will give you a complete account of the systemexpound <br />the actual teachings of the great explorer...</p>
                                                </div>
                                            </div>
                                            <ul class="post-meta list_inline">
                                                <li><i class="fa fa-clock-o"></i> Started On: 09.00am   </li> |&nbsp;&nbsp;&nbsp;
                                                <li><i class="fa fa-map-marker"></i> Behind Alias Street, Melbourne</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="item style-1 clearfix">
                                        <div class="img-column float_left">
                                            <figure class="img-holder">
                                                <a href="single-event.html"><img src="https://images.unsplash.com/photo-1561832469-637830b89468?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80" /></a>
                                                <div class="date"><span>28 <br />Feb</span></div>
                                            </figure>
                                        </div>
                                        <div class="text-column float_left">
                                            <div class="lower-content">
                                                <p>Organizer: Nathan Bond</p>
                                                <a href="single-event.html"><h4>Keep Nation Beautiful</h4></a>
                                                <div class="text">
                                                    <p>This mistaken idea of denouncing pleasure and praising pain was <br /> born and I will give you a complete account of the systemexpound <br />the actual teachings of the great explorer...</p>
                                                </div>
                                            </div>
                                            <ul class="post-meta list_inline">
                                                <li><i class="fa fa-clock-o"></i>Started On: 11.00am </li> |&nbsp;&nbsp;&nbsp;
                                                <li><i class="fa fa-map-marker"></i> Collins Street West, Victoria</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="item style-1 clearfix">
                                        <div class="img-column float_left">
                                            <figure class="img-holder">
                                                <a href="single-event.html"><img src="https://images.unsplash.com/photo-1561832469-637830b89468?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80" /></a>
                                                <div class="date"><span>10 <br />Feb</span></div>
                                            </figure>
                                        </div>
                                        <div class="text-column float_left">
                                            <div class="lower-content">
                                                <p>Organizer: Tom Maddy</p>
                                                <a href="single-event.html"><h4>Green Construction Practice</h4></a>
                                                <div class="text">
                                                    <p>This mistaken idea of denouncing pleasure and praising pain was <br /> born and I will give you a complete account of the systemexpound <br />the actual teachings of the great explorer...</p>
                                                </div>
                                            </div>
                                            <ul class="post-meta list_inline">
                                                <li><i class="fa fa-clock-o"></i>Started On: 11.00am </li> |&nbsp;&nbsp;&nbsp;
                                                <li><i class="fa fa-map-marker"></i> New Grand Street, California</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="item style-1 clearfix">
                                        <div class="img-column float_left">
                                            <figure class="img-holder">
                                                <a href="single-event.html"><img src="https://images.unsplash.com/photo-1561832469-637830b89468?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80" /></a>
                                                <div class="date"><span>30 <br />Jn</span></div>
                                            </figure>
                                        </div>
                                        <div class="text-column float_left">
                                            <div class="lower-content">
                                                <p>Organizer: Darren Fletcher</p>
                                                <a href="single-event.html"><h4>Saving Energy In Home</h4></a>
                                                <div class="text">
                                                    <p>This mistaken idea of denouncing pleasure and praising pain was <br /> born and I will give you a complete account of the systemexpound <br />the actual teachings of the great explorer...</p>
                                                </div>
                                            </div>
                                            <ul class="post-meta list_inline">
                                                <li><i class="fa fa-clock-o"></i>Started On: 11.00am </li> |&nbsp;&nbsp;&nbsp;
                                                <li><i class="fa fa-map-marker"></i> New Grand Street, California</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="item style-1 clearfix">
                                        <div class="img-column float_left">
                                            <figure class="img-holder">
                                                <a href="single-event.html"><img src="https://images.unsplash.com/photo-1561832469-637830b89468?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80" /></a>
                                                <div class="date"><span>15 <br />Jan</span></div>
                                            </figure>
                                        </div>
                                        <div class="text-column float_left">
                                            <div class="lower-content">
                                                <p>Organizer: Tom Maddy</p>
                                                <a href="single-event.html"><h4>Save African Elephant</h4></a>
                                                <div class="text">
                                                    <p>This mistaken idea of denouncing pleasure and praising pain was <br /> born and I will give you a complete account of the systemexpound <br />the actual teachings of the great explorer...</p>
                                                </div>
                                            </div>
                                            <ul class="post-meta list_inline">
                                                <li><i class="fa fa-clock-o"></i>Started On: 11.00am </li> |&nbsp;&nbsp;&nbsp;
                                                <li><i class="fa fa-map-marker"></i> New Grand Street, California</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <ul class="page_pagination">
                                        <li><a href="#" class="tran3s"><i class="fa fa-angle-left" aria-hidden="true"></i></a></li>
                                        <li><a href="#" class="active tran3s">1</a></li>
                                        <li><a href="#" class="tran3s">2</a></li>
                                        <li><a href="#" class="tran3s"><i class="fa fa-angle-right" aria-hidden="true"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-12 col-xs-12">
                                <div class="blog-sidebar sec-padd">
                                    <div class="event-filter">
                                        <div class="section-title style-2">
                                            <h4>Event Filter</h4>
                                        </div>
                                        <div class="tabs-outer">
                                            {/* <!--Tabs Box--> */}
                                            <div class="tabs-box tabs-style-one">
                                                {/* <!--Tab Buttons--> */}
                                                <ul class="tab-buttons clearfix">
                                                    <li><input type="radio" name="tabs" />ALL</li>
                                                    <li><input type="radio" name="tabs" />UPCOMING</li>
                                                </ul>

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
                                            categories={["Home Energy", "Clean Transportation", "Lighting", "Solar", "Food", "Water", "Trash and Recycling", "Activism and Education"]}
                                            tags={[]}
                                            difficulties={[]}
                                            impacts={[]}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>


            </div>
        );
    }
} export default EventsPage;