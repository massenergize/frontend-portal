import React from "react";
import LoadingCircle from "../../Shared/LoadingCircle";
import { connect } from "react-redux";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import ErrorPage from "./../Errors/ErrorPage";
import { apiCall } from "../../../api/functions";
import notFound from "./not-found.jpg";
import { dateFormatString, locationFormatJSX } from "../../Utils";
import ShareButtons from "../../Shared/ShareButtons";
import { Helmet } from "react-helmet";

class OneEventPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: null,
      loading: true,
    };
  }

  async fetch(id) {
    try {
      const json = await apiCall("events.info", { event_id: id });
      if (json.success) {
        this.setState({ event: json.data });
      } else {
        this.setState({ error: json.error });
      }
    } catch (err) {
      this.setState({ error: err.toString() });
    } finally {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.fetch(id);
  }

  render() {
    const event = this.state.event;

    if (this.state.loading) {
      return <LoadingCircle />;
    }
    if (!event || this.state.error) {
      return (
        <ErrorPage
          errorMessage="Unable to load this Event"
          errorDescription={
            this.state.error ? this.state.error : "Unknown cause"
          }
        />
      );
    }

    return (
      <>
        <Helmet>
          <meta property="og:title" content={event.name} />
          <meta property="og:image" content={event.image && event.image.url} />
          <meta property="og:description" content={event.featured_summary} />
          <meta property="og:url" content={window.location.href} />
        </Helmet>
        <div
          className="boxed_wrapper"
          style={{ marginBottom: 70, minHeight: window.screen.height - 200 }}
        >
          <BreadCrumbBar
            links={[
              { link: this.props.links.events, name: "Events" },
              { name: event ? event.name : "..." },
            ]}
          />
          <section className="shop-single-area" style={{ paddingTop: 0 }}>
            <div className="container">
              <div className="single-products-details">
                {this.renderEvent(event)}
              </div>
              <ShareButtons
                label="Share this event!"
                pageTitle={event.name}
                pageDescription={event.featured_summary}
                url={window.location.href}
              />
            </div>
          </section>
        </div>
      </>
    );
  }

  renderEvent(event) {
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
            style={
              {
                //textTransform: "capitalize",
              }
            }
          >
            {event.name}
          </h3>
          <div className="single-event sec-padd" style={{ borderWidth: 0 }}>
            <div className="row">
              <div className="col-12 col-lg-4">
                <img
                  style={{
                    width: "100%",
                    maxHeight: "250px",
                    objectFit: "contain",
                    borderRadius: 6,
                  }}
                  src={event.image ? event.image.url : notFound}
                  alt=""
                />

                <div
                  // className="event-timeline "

                  style={{ margin: "10px 0px", borderRadius: 12 }}
                >
                  <ul>
                    <li
                      key="time"
                      style={{ listStyle: "none", color: "rgb(128 177 61)" }}
                    >
                      <b>Date</b>
                      <div style={{ fontSize: 14, display: "block" }}>
                        <span className="make-me-dark">{dateString}</span>
                      </div>
                    </li>
                    {location ? (
                      <li
                        style={{
                          listStyle: "none",
                          marginTop: 10,
                          color: "rgb(128 177 61)",
                        }}
                      >
                        {/* House Number, Street Name, Town, State */}
                        <i
                          className="fa fa-map-marker"
                          style={{ marginRight: 6 }}
                        />
                        <b>Venue</b>{" "}
                        <div
                          className="make-me-dark"
                          style={{ fontSize: 14, display: "block" }}
                        >
                          {locationFormatJSX(location)}
                        </div>
                      </li>
                    ) : null}
                  </ul>
                </div>
                {/* <center><h1><span style={{margin:5}} className="fa fa-arrow-down"></span></h1></center> */}
              </div>
              <div className="col-12 col-lg-8">
                <div className="text">
                  {/* <h5 className="cool-font" style={{ color: "lightgray" }}>
                    About
                  </h5> */}
                  <p
                    className="cool-font make-me-dark events-about-content"
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
