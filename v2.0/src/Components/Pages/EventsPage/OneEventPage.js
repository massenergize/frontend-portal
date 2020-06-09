import React from "react";
import LoadingCircle from "../../Shared/LoadingCircle";
import { connect } from "react-redux";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import Error404 from "./../Errors/404";
import { apiCall } from "../../../api/functions";
import notFound from "./not-found.jpg";
import { dateFormatString, locationFormatJSX } from "../../Utils";
import oops from "./oops.png";

class OneEventPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      event: null
    }
    this.loading = true;
  }

  fetch(id) {
    apiCall('events.info', { event_id: id }).then(json => {
      if (json.success) {
        this.setState({
          event: json.data,
        })
      }
      this.loading = false;
    }).catch(err => {
        this.setState({ error: err.message });
        this.loading = false;
    })
    
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.fetch(id);
  }

  render() {

    const event = this.state.event;

    if (this.loading) {
      return <LoadingCircle />;
    }
    if (!event) {
      return <Error404 />;
    }

    return (
      <>
        <div className="boxed_wrapper">
          <BreadCrumbBar
            links={[
              { link: this.props.links.events, name: "Events" },
              { name: `Event ${event ? event.id : "..."}` },
            ]}
          />
          <section className="shop-single-area" style={{ paddingTop: 0 }}>
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
    if (!event)
      return (
        <div style={{ height: window.screen.height - 120 }}>
          {" "}
          <center>
            <img src={oops} alt="" style={{ width: "20%", marginTop: '10%' }} />
            <h4 style={{ marginTop: 15, color: "rgb(155, 155, 155)" }}>
              ...oops, couldn't find this event
            </h4>
            <small style={{ color: '#ffa4ad' }}>Look into > <i>event id: {this.props.match.params.id}</i></small>
          </center>
        </div>
      );
    let dateString = dateFormatString(
      new Date(event.start_date_and_time),
      new Date(event.end_date_and_time)
    );
    const location = event.location;

    return (
      <section className="event-section style-3">
        <div className="container">
          <h3
            className="cool-font text-center"
            style={{ textTransform: "capitalize" }}
          >
            {event.name}
          </h3>
          <div className="single-event sec-padd" style={{ borderWidth: 0 }}>
            <div className="row">
              <div className="col-12 col-lg-6">
                <div
                  className="img-box raise"
                  style={{ height: 340, borderRadius: 10 }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={event.image ? event.image.url : notFound}
                    alt=""
                  />
                </div>
                <div
                  className="event-timeline "
                  style={{ margin: "10px 0px", borderRadius: 12 }}
                >
                  {/* <div className="section-title style-2">
                                            <h3>Event Schedule</h3>
																				</div> */}
                  <ul>
                    {/* <li key='time'><i className="fa fa-clock-o"></i><b>Date: </b> {date.toLocaleString()}
												<b> - </b>{endDate.toLocaleString()}
											</li> */}
                    <li key="time">
                      <b>
                        Date
                        <br />{" "}
                      </b>
                      <div style={{ paddingLeft: 20 }}>
                        <span className="make-me-dark">{dateString}</span>
                      </div>
                    </li>
                    {location ? (
                      <li>
                        {/* House Number, Street Name, Town, State */}
                        <i className="fa fa-map-marker" />
                        <b>Venue:</b>{" "}
                        <span className="make-me-dark">
                          {locationFormatJSX(location)}
                        </span>
                      </li>
                    ) : null}
                  </ul>
                </div>
                {/* <center><h1><span style={{margin:5}} className="fa fa-arrow-down"></span></h1></center> */}
              </div>
              <div className="col-12 col-lg-6">
                <div className="text">
                  <h5 className="cool-font" style={{ color: "lightgray" }}>
                    About
                  </h5>
                  <p
                    className="cool-font make-me-dark"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  ></p>
                  <br />
                  <p className="cool-font">{event.moreinfo}</p>
                </div>
              </div>
            </div>

            <div className="content">
              <div className="row">
                <div className="col-md-6 col-sm-6 col-xs-12">
                  {/* <div className="event-timeline " style={{ margin: '10px 0px', borderRadius: 12 }}>
										<div className="section-title style-2">
                                            <h3>Event Schedule</h3>
																				</div>
										<ul>
											<li key='time'><i className="fa fa-clock-o"></i><b>Date: </b> {date.toLocaleString()}
												<b> - </b>{endDate.toLocaleString()}
											</li>
											<li key='time'><b>Date<br /> </b>
												<div style={{ paddingLeft: 20 }}>
													{textyStart}<br />
													<b><span className="text text-success"> TO </span> </b><br />
													{textyEnd}
												</div>
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
									</div> */}
                </div>
                {event.details ? (
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <div className="section-title style-2">
                      <h3>Event Details</h3>
                    </div>

                    <ul className="list2">
                      {this.renderDetails(event.details)}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  renderDetails(details) {
    return Object.keys(details).map((key) => {
      return (
        <li key={key}>
          <i className="fa fa-check-circle"></i>
          {details[key]}
        </li>
      );
    });
  }
}
const mapStoreToProps = (store) => {
  return {
    auth: store.firebase.auth,
    user: store.user.info,
    events: store.page.events,
    links: store.links,
  };
};
export default connect(mapStoreToProps, null)(OneEventPage);
