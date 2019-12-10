import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as moment from 'moment';
import defaultImg from './../../../../src/assets/images/blog/i9.jpg';
/**
 * Events section displays upcoming events,
 * @props
    events: list of the events to show
        title
        time
        day
        month
        year
        link //may need to rethink this/do it more like actions so it links to a single event view by id
        image
        organizer
        address
        //may need to add in id
 */ 

class Events extends React.Component {
  renderEvents() {
    const events = this.props.events;

    if( !events){
      return <div><p>No upcoming events. See <Link to={this.props.links.events}>all events</Link> </p></div>
    }
    if (events.length !== 0) {
      return events.map((event, index) => {
        const format = "MMMM Do YYYY, h:mm a";
				const date = new Date(event.start_date_and_time);
				const endDate = new Date(event.end_date_and_time);
				const textyStart = moment(date).format(format);
				const textyEnd = moment(endDate).format(format);
        const location = event.location;
        const img = event.image.url ? event.image.url : defaultImg;
        return (
          <article key = {index.toString()} className="cursor home-events-hover col-md-4 col-lg-4 col-sm-6 col-xs-12" style={{marginBottom:10,marginTop:10}} onClick ={()=>{window.location = this.props.links.events + "/"+event.id}}>
            <div className="z-depth-1"style={{borderRadius:15}}>
              <img alt="IMG" src={img} className="home-events-img" />
              <div style={{ padding: 11,paddingLeft:17,height:120 }}>
                <h6 className="zero-margin-btm">{event.name}</h6>
                {/* <p className="zero-margin-btm" style={{fontSize:11}} dangerouslySetInnerHTML={{__html: desc}}></p> */}
               
                {location ?
                  <small style={{fontSize:11}} className="text text-default text-sm-right"> <b>{location.unit? `, ${location.unit}` : ''} </b> <b>{location.address? `, ${location.address}` : ''}</b> {location.city? `, ${location.city}` : ''}{location.state? `, ${location.state}` : ''}</small>
                  :
                  null
                }
                <p style={{fontSize:12}}className="text text-success zero-margin-btm">{`${textyStart} - ${textyEnd}`}</p>
              </div>
            </div>
          </article>
        )
      })
    }
    else{
      return <div><p>No upcoming events. See <Link to={this.props.links.events}>all events</Link> </p></div>
    }
  }
  render() {

    return (
      <section className="event-style1" style={{ background: 'white' }}>
        <div className="container">
        <h3 className="cool-font text-center" style={{fontSize:20}}>Upcoming Events and Campaigns</h3>
          <div className="row">
          
            <div className="col-md-9 col-sm-10 col-xs-12 text-center text-sm-left">
              {/* <div className="section-title m-0">
                <h3 className="cool-font">Upcoming Events</h3>
              </div> */}
            </div>
            <div style={{marginLeft:-64}} className="col-md-3 col-sm-2 col-xs-12 text-sm-right">
            {/* <div className="pull-right">  */}
              <Link to={`${this.props.links.events}`} className="cool-font thm-btn mb-4 btn-finishing raise pull-right float-right">All Events</Link>
            </div>
          </div>
          <div className="row">
            {this.renderEvents()}
          </div>
        </div>
      </section>
    );
  }
}
const mapStoreToProps = (store) => {
  return ({
    links: store.links
  });
}
export default connect(mapStoreToProps)(Events);