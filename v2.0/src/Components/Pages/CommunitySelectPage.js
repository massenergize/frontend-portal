import React from "react";
import { connect } from "react-redux";
import LoadingCircle from "../Shared/LoadingCircle";
import logo from "../../logo.png";
// import MEButton from "./Widgets/MEButton";
import {
  getPropsArrayFromJsonArray,
  getPropsArrayFromJsonArrayAdv,
  getRandomIntegerInRange,
} from "../Utils";
import MEAutoComplete from "./Widgets/MEAutoComplete";
import { withRouter } from "react-router";
import { ME_STATES } from "./ProfilePage/States";

const meStatesData = getPropsArrayFromJsonArray(ME_STATES, "name");
const meStatesDataValues = getPropsArrayFromJsonArray(ME_STATES, "value");

const MOST_VISITED = "most_visited";
class CommunitySelectPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleCommunitySelected = this.handleCommunitySelected.bind(this);
  }

  handleCommunitySelected(value) {
    const { communities } = this.props;
    const com = communities.filter((item) => item.id === value)[0];
    this.saveSelectedToStorage(value); // Save selected community's id to localStorage before moving
    this.props.history.push(`/${com.subdomain}`);
  }

  /**
   * The function is in charge of adding the ids of values of selected communities and
   * saving it in storage
   * @param {*} id
   * @returns
   *
   */
  saveSelectedToStorage(id) {
    var mostVisited = this.getMostVisited();
    mostVisited = mostVisited.filter((item) => item !== id);
    localStorage.setItem(
      MOST_VISITED,
      JSON.stringify([id, ...mostVisited.slice(0, 5)])
    ); // Just a way to keep  the record limit up to 6
  }

  getMostVisited() {
    var mostVisited = localStorage.getItem(MOST_VISITED);
    mostVisited = JSON.parse(mostVisited) || [];
    return mostVisited;
  }
  showAutoComplete() {
    var communities = [];

    (this.props.communities || []).forEach((com) => {
      communities.push(this.locationInformation(com));
    });
    communities.sort((a, b) =>
      a.name_with_community
        .trim()
        .toUpperCase()
        .localeCompare(b.name_with_community.trim().toUpperCase())
    );

    const data = getPropsArrayFromJsonArrayAdv(
      communities,
      (obj) => obj.name_with_community
    );
    const values = getPropsArrayFromJsonArrayAdv(
      communities,
      (obj) => obj.community.id
    );
    return (
      <>
        <MEAutoComplete
          textStyle={{ textTransform: "capitalize" }}
          useCaret={true}
          data={data}
          dataValues={values}
          style={{
            border: "2px solid #ed5c17",
            borderRadius: 55,
            paddingLeft: 25,
          }}
          containerClassName="com-select-auto-edits"
          placeholder="Choose your community"
          onItemSelected={this.handleCommunitySelected}
        />
      </>
    );
  }

  /**
   * A function that checks for appropriate location fields and returns each community with a prefix of
   * its location if available
   * @param {*} community
   * @returns
   */
  locationInformation(community) {
    const location = community.location;
    const res = {
      has_location: location,
    };
    res.location = location;
    if (res.has_location) {
      const state = location.state ? meStatesDataValues[meStatesData.indexOf(location.state)] : "";
      

      // Only add the County-State prefix when there is a location, and the community is geographically focused
      const prefix = `${location.city || ""}${
        location.city ? ", " : ""
      } ${state || ""}`;
      res.name_with_community = `${prefix} ${prefix.trim() ? " - " : ""} ${
        community.name
      }`;
    } else res.name_with_community = community.name;

    res.community = community;
    return res;
  }

  /**
   *  In summary, the displayed bubbles look best when its only 6 items.
   * Always display 6 most visited communities, if they are not up to 6, take more from
   * the general community list to drive it up to 6 items
   * @param {*} communities
   * @returns
   */
  renderCommunityBubbles(communities) {
    const visited = this.getMostVisited();
    var coms = [];
    if (visited.length < 6) {
      communities = communities.filter((com) => {
        if (visited.includes(com.id) !== false) {
          coms[visited.indexOf(com.id)] = com; // To keep the most recently clicked community arrangement
          return null;
        } else return com;
      });
      coms = [...coms, ...communities.slice(0, 6 - visited.length)];
    } else
      communities.forEach((com) => {
        if (visited.includes(com.id) === true)
          coms[visited.indexOf(com.id)] = com;
      });
    return (
      <ul className="text-center" style={{ marginBottom: 10 }}>
        {/* <center>
          <small style={{ color: "#c5c5c5" }}>
            Select Your Community or Visit Any Community Site
          </small>
        </center> */}
        {coms.map((com, key) => {
          // const com = coms[key];
          return (
            <li
              key={key}
              style={{
                display: "inline-block",
                margin: "5px",
                fontSize: 15,
              }}
            >
              {" "}
              <a
                className={`com-domain-link ${this.getAnimationClass()} bubble-communities`}
                href={`/${com.subdomain}`}
              >
                {com.name}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
  getAnimationClass() {
    const classes = ["me-open-in", "me-open-in-slower", "me-open-in-slowest"];
    const index = getRandomIntegerInRange(3);
    return classes[index];
  }
  render() {
    // const communities = this.props.communities;
    if (!this.props.communities) return <LoadingCircle />;
    return (
      <div className="">
        <div className="container" style={{ height: "100vh" }}>
          <div
            className="row"
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <div
              className="col-lg-12 col-md-12 col-sm-10 col-xs-12  "
              style={{ marginTop: "-20vh" }}
            >
              <img
                alt="IMG"
                className="text-center"
                style={{
                  margin: "auto",
                  display: "block",
                  maxWidth: "200px",
                  marginTop: "0px",
                  marginBottom: 10,
                }}
                src={logo}
              />
              <h1
                className="text-center raise-my-text me-anime-open-in"
                style={{ marginBottom: 15 }}
              >
                {" "}
                <span style={{ color: "#ed5a14" }}>Welcome to </span>our{" "}
                <span style={{ color: "#49ac23" }}>Community Portal</span>{" "}
              </h1>
              {/* <p
                className="text-center"
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(195, 195, 195)",
                  fontWeight: "400",
                }}
              >
                {" "}
                Select Your Community Below
              </p> */}
              {/* {this.showSearchBar()} */}
              {this.showAutoComplete()}
              {/* {this.renderCommunityBubbles(communities)} */}
              {/* <h3
                className="text-center"
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(195, 195, 195)",
                  margin: 15,
                }}
              >
                Find Out More About MassEnergize and Starting Your Community
                Site
              </h3> */}
              <p className="text-center">
                {/* <MEButton
                  className="me-anime-open-in"
                  href="//massenergize.org"
                  variation="accent"
                  target="_blank"
                  style={{ padding: "7px 30px" }}
                >
                  MassEnergize
                </MEButton>{" "} */}

                <a
                  href="http://www.massenergize.org"
                  className=""
                  style={{
                    margin: 20,
                    color: "#49ac23",
                    textDecoration: "underline",
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Find out how to start your own MassEnergize community site
                  here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStoreToProps = (store) => {
  return {
    communities: store.page.communities,
  };
};
export default connect(mapStoreToProps)(withRouter(CommunitySelectPage));
