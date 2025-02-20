import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
class BreadCrumbBar extends React.Component {
  render() {
    const { community } = this.props;
    const customHomeLink = community?.community_logo_link;
    return (
      <div className="breadcumb-wrapper responsive-bread-crumb">
        <div className="container">
          <div className="pull-left">
            <ul className="list-inline link-list">
              <li>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    if (customHomeLink)
                      return (window.location.href = customHomeLink);
                    this.props.history.push(this.props.reduxLinks.home);
                  }}
                  to={this.props.reduxLinks.home}
                  className="link"
                >
                  {" "}
                  Home{" "}
                </Link>
              </li>
              {Object.keys(this.props.links).map((key) => {
                const link = this.props.links[key];
                if (link.link) {
                  return (
                    <li key={key}>
                      <Link to={`${link.link}`} className="link">
                        {link.name}
                      </Link>
                    </li>
                  );
                } else if (link.name) {
                  return (
                    <li key={key} style={{ color: "#333" }}>
                      {link.name}
                    </li>
                  );
                } else {
                  return <div />;
                }
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
const mapStoreToProps = (store) => {
  return {
    reduxLinks: store.links,
	community: store.page.community,
  };
};
export default connect(mapStoreToProps)(BreadCrumbBar);
