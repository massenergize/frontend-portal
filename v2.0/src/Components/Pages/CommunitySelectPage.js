import React from "react";
import { connect } from "react-redux";
import LoadingCircle from "../Shared/LoadingCircle";
import logo from "../../logo.png";
import MEButton from "./Widgets/MEButton";
import { getRandomIntegerInRange } from "../Utils";
import { Link } from "react-router-dom";

class CommunitySelectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mirror_communities: [],
    };
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
    if (this.props.communities.length >= 50) {
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
              {this.showSearchBar()}
              <ul className="text-center" style={{ marginBottom: 10 }}>
                {Object.keys(communities).map((key) => {
                  const com = communities[key];
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
                      <a className={`com-domain-link ${this.getAnimationClass()}` }href={`/${com.subdomain}`}>
                        {com.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <h3
                className="text-center"
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(195, 195, 195)",
                  margin: 15,
                }}
              >
                {" "}
                Or go to our main site
              </h3>
              <p className="text-center">
                <MEButton
                className="me-anime-open-in"
                  href="https://massenergize.org"
                  variation="accent"
                  target="_blank"
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
export default connect(mapStoreToProps)(CommunitySelectPage);
