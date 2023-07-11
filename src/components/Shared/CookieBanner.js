import React from "react";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import { get_cookie, setCookieInAPi } from "../../api/functions";

class CookieBanner extends React.Component {
  constructor(props) {
    super(props);
    this.policyPath = props.policyPath;
    this.cookies = new Cookies();
    var displayCookieBanner;

    var accepted = get_cookie(this.cookies, "acceptsCookies");
    if (accepted === undefined) {
      displayCookieBanner = true;
    } else {
      displayCookieBanner = false;
    }

    this.state = {
      displayCookieBanner: displayCookieBanner,
    };
  }

  acceptCookies = () => {
    this.setState({ displayCookieBanner: false });
    setCookieInAPi(this.cookies);
    // set_cookie(this.cookies, "acceptsCookies", 1);
  };

  render() {
    return (
      this.state.displayCookieBanner &&
      !this.props.showTour && (
        <div
          className="cookie-banner"
          style={{
            position: "sticky",
            zIndex: "10",
            bottom: "0",
            width: "100%",
            padding: "10px",
            background: "#8DC62E",
          }}
        >
          <div className="container-fluid" style={{ padding: "0px" }}>
            <div className="row ml-auto cookie-container" style={{ margin: "0px" }}>
              <div className="mr-auto cookie-content">
                <div style={{ color: "white" }}>
                  This website uses cookies to provide the best user experience
                  we can. We share no data with third parties or for any
                  commercial purpose. By using this site, you accept this use of
                  cookies as outlined in our{" "}
                  <a
                    href={this.policyPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "grey" }}
                  >
                    data privacy policy.
                  </a>
                </div>
              </div>
              <div
                className="ml-auto cookie-btn-area"
                style={{ alignItems: "center" }}
              >
                <button
                  id="test-cookie-banner-okay"
                  onClick={this.acceptCookies}
                  className="cool-font new-sign-in float-right round-me z-depth-float "
                  style={{ background: "white", color: "black" }}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }
}
const mapStateToProps = (store) => {
  return { showTour: store.page.showTour };
};
export default connect(mapStateToProps)(CookieBanner);
