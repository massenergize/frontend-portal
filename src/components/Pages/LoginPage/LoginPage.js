import React from "react";
import LoginForm from "./LoginForm";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import ProductTour from "react-joyride";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tryingToLogin: false,
    };
  }
  render() {
    //avoids trying to render before the promise from the server is fulfilled
    //pull form from the url
    // const params = new URLSearchParams(this.props.location.search)
    // const returnpath = params.get('returnpath');
    const last_visited = localStorage.getItem("last_visited");
    if (!this.state.tryingToLogin) {
      if (this.props.user.info) {
        return (
          <Redirect
            to={last_visited ? last_visited : this.props.links.profile}
          />
        );
      }
      if (this.props.auth.isLoaded && !this.props.auth.isEmpty)
        return <Redirect to={this.props.links.signup} />;
    }

    const steps = [
      {
        target: "body",
        title: "Sign In",
        content:
          "Click here and follow the instructions! Then come back and let us know what you’ve done already to protect this place we love, and we’ll help you make a plan to keep on acting on climate, because together we make a difference!",
        placement: "center",
        spotlightClicks: true,
        disableBeacon: true,
        hideFooter: false,
      },
    ];

    return (
      <>
        <ProductTour
          steps={steps}
          showSkipButton
          hideFooter={true}
          // spotlightPadding={-5}
          spotlightClicks={true}
          // disableOverlay
          // showProgress
          styles={{
            options: {
              // modal arrow and background color
              arrowColor: "#eee",
              backgroundColor: "#eee",
              // page overlay color
              //  overlayColor: "rgba(79, 26, 0, 0.1)",
              //button color
              primaryColor: "#8CC43C",
              //text color
              textColor: "black",
              //width of modal
              width: 500,
              //zindex of modal
              zIndex: 1000,
              beaconSize: 36,
            },
          }}
        />
        <div className="boxed_wrapper">
          <BreadCrumbBar links={[{ name: "Sign In" }]} />
          <section
            className="register-section sec-padd-top"
            style={{ paddingTop: 5 }}
          >
            <div className="container">
              <div className="row">
                {/* <!--Form Column--> */}
                <div className="form-column column col-md-8 col-12 offset-md-2">
                  <LoginForm
                    tryingToLogin={(status) =>
                      this.setState({ tryingToLogin: status })
                    }
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }
}

const mapStoreToProps = (store) => {
  return {
    auth: store.firebase.auth,
    user: store.user,
    links: store.links,
  };
};
export default connect(mapStoreToProps)(LoginPage);
