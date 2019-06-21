import React from 'react'

/*
@props
    events
        title
        day
        month
        year
        link
        image
*/
class FooterEvents extends React.Component{
    renderEvents(events){
        if(!events){
            return <div>No Events to Display</div>
        }
        return Object.keys(events).map(key=> {
            var event = events[key];
            return (
                <li>
                    <div className="post">
                            <div className="post-thumb"><a href={event.link}><img src={event.image} alt=""/></a></div>
                            <a href="/"><h5>{event.title}</h5></a>
                            <div className="post-info"><i className="fa fa-calendar"></i>{event.day} {event.month}, {event.year}</div>
                        </div>
                </li>
            );
        });
    }
    render(){
        return(
            <div className="col-md-6 col-sm-6 col-xs-12">
                <div className="footer-widget post-column">
                    <div className="section-title">
                        <h4>Upcoming Events</h4>
                    </div>
                    <div className="post-list">
                        {this.renderEvents(this.props.events)}
                    </div>
                </div>
            </div>
        );
    }
}
export default FooterEvents;