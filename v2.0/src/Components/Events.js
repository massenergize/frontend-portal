import React from 'react'
/*
@props
    events
        title
        time
        day
        month
        year
        link
        image
        organizer
        address
*/
class Events extends React.Component{
    renderEvents(events){
        if(!events){
            return <div>No Events to Display</div>
        }
        return Object.keys(events).map(key=> {
            var event = events[key]

            var eventStyle = "item style-2";
            console.log(key);
            if(parseInt(key)%4 === 0){
                eventStyle = "item style-1";
            }
            return (
                <article className="col-md-6 col-sm-12 col-xs-12">
                    <div className= {eventStyle}>
                        <div className="clearfix">
                            <div className="img-column">
                                <figure className="img-holder">
                                    <a href={event.link}><img src={event.image} alt=""/></a>
                                </figure>
                            </div>
                            <div className="text-column">
                                <div className="lower-content">
                                    <p>Organizer: {event.organizer}</p>
                                    <a href={event.link}><h4>{event.title}</h4></a>
                                    <div className="text">
                                        <p>{event.text}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul className="post-meta list_inline">
                            <li><i class="fa fa-clock-o"></i>{event.time}</li>  |&nbsp;&nbsp;&nbsp;
                            <li><i className="fa fa-calendar"></i>{event.day} {event.month}, {event.year}</li> |&nbsp;&nbsp;&nbsp;
                            <li><i className="fa fa-map-marker"></i> {event.address}</li>
                        </ul>
                    </div>
                </article>
            );
        });
    }
    render(){
        return(
            <section className="event-style1">
                <div className="container">
                    <div className="row">
                        <div className="col-md-9 col-sm-10 col-xs-12">
                            <div className="section-title">
                                <h2>Upcoming Events</h2>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-2 col-xs-12">
                            <a href="#" className="thm-btn float_right">All Events</a>
                        </div>
                    </div>
                    <div className="row">
                        {this.renderEvents(this.props.events)}
                    </div>
                </div>
            </section>
        );
    }
}
export default Events;