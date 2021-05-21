import React from "react";
import { connect } from "react-redux";
import LoadingCircle from "../Shared/LoadingCircle";
import logo from "../../logo.png";
import MEButton from "./Widgets/MEButton";
import { getPropsArrayFromJsonArray, getRandomIntegerInRange } from "../Utils";
import MEAutoComplete from "./Widgets/MEAutoComplete";
import { withRouter } from "react-router";
// import { Link } from "react-router-dom";
const MOST_VISITED = "most_visited";
class CommunitySelectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mirror_communities: [],
    };
    this.handleCommunitySelected = this.handleCommunitySelected.bind(this);
  }

  handleSearch(event) {
    var text = event.target.value.toLowerCase();
    var similar = [];
    for (let i = 0; i < this.props.communities.length; i++) {
      const el = this.props.communities[i];
      if (el.name.toLowerCase().includes(text)) {
        similar.push(el);
      }
    }
    this.setState({ mirror_communities: similar });
  }
  transfer() {
    if (this.props.communities) {
      this.setState({ mirror_communities: [...this.props.communities] });
    }
  }

  showSearchBar() {
    if (this.props.communities.length >= 300) {
      return (
        <input
          onChange={(event) => {
            this.handleSearch(event);
          }}
          type="text"
          placeholder="Search for your community..."
          className="form-control font-textbox round-me land-textbox"
        />
      );
    }
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
    const exists = mostVisited.filter((item) => item === id)[0];
    if (exists) return;
    else mostVisited.push(id);
    localStorage.setItem(
      MOST_VISITED,
      JSON.stringify([id, mostVisited.slice(1, 5)])
    ); // Just a way to keep  the record limit up to 6
  }

  getMostVisited() {
    var mostVisited = localStorage.getItem(MOST_VISITED);
    mostVisited = JSON.parse(mostVisited) || [];
    return mostVisited;
  }
  showAutoComplete() {
    const data = getPropsArrayFromJsonArray(this.props.communities, "name");
    const values = getPropsArrayFromJsonArray(this.props.communities, "id");
    return (
      <>
        <MEAutoComplete
          showItemsOnStart={true}
          useCaret={true}
          data={data}
          dataValues={values}
          style={{
            border: "2px solid #ed5c17",
            borderRadius: 55,
            paddingLeft: 25,
          }}
          containerClassName="com-select-auto-edits"
          placeholder="What community do you belong to?"
          onItemSelected={this.handleCommunitySelected}
        />
      </>
    );
  }

  /**
   *  In summary, the displayed bubbles look best when its only 6 items.
   * Always display most visited communities, if they are not up to 6, take more from
   * the general community list to drive it up to 6 items
   * @param {*} communities
   * @returns
   */
  renderCommunityBubbles(communities) {
    const visited = this.getMostVisited();
    var coms = [];
    if (visited.length < 6) {
      communities = communities.filter((com) => {
        if (visited.contains(com.id) !== false) coms.push(com);
        else return com;
      });
      coms = [...coms, communities.slice(0, 6 - visited.length)];
    }

    console.log("I am the coms", coms);

    return (
      <ul className="text-center" style={{ marginBottom: 10 }}>
        <center>
          <small style={{ color: "#c5c5c5" }}>Most Visited</small>
        </center>
        {Object.keys(coms).map((key) => {
          const com = coms[key];
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
                className={`com-domain-link ${this.getAnimationClass()}`}
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
    const communities =
      this.state.mirror_communities.length === 0
        ? this.props.communities
        : this.state.mirror_communities;

    if (!this.props.communities) return <LoadingCircle />;
    return (
      <div className="">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-12 col-md-12 col-sm-10 col-xs-12  "
              style={{ paddingTop: "" }}
            >
              <img
                alt="IMG"
                className="text-center"
                style={{
                  margin: "auto",
                  display: "block",
                  maxWidth: "200px",
                  marginTop: "16%",
                  marginBottom: 10,
                }}
                src={logo}
              />
              <h1 className="text-center raise-my-text me-anime-open-in">
                {" "}
                <span style={{ color: "#ed5a14" }}>Welcome to </span>our{" "}
                <span style={{ color: "green" }}>Community Portal</span>{" "}
              </h1>
              <p
                className="text-center"
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(195, 195, 195)",
                  fontWeight: "400",
                }}
              >
                {" "}
                Select Your Community Below
              </p>
              {/* {this.showSearchBar()} */}
              {this.showAutoComplete()}
              {this.renderCommunityBubbles(communities)}
              <h3
                className="text-center"
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(195, 195, 195)",
                  margin: 15,
                }}
              >
                {" "}
                Go To Our Main Site
              </h3>
              <p className="text-center">
                <MEButton
                  className="me-anime-open-in"
                  href="//massenergize.org"
                  variation="accent"
                  target="_blank"
                  style={{ padding: "7px 30px" }}
                >
                  MassEnergize
                </MEButton>{" "}
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
