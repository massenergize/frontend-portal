import React from "react";
import FooterInfo from "./FooterInfo";
import FooterLinks from "./FooterLinks";
import { Link } from "react-router-dom";
import SubscribeForm from "./SubscribeForm";
import { connect } from "react-redux";
import {
  IS_PROD,
  IS_CANARY,
  IS_SANDBOX,
  BUILD_VERSION,
} from "../../config/config";
import CommunitySocials from "./CommunitySocials";
/**
 * Footer section has place for links,
 */
class Footer extends React.Component {
  getMoreInfo() {
    const { community } = this.props;
    var moreInfo = community && community.more_info;
    try {
      if (moreInfo) moreInfo = JSON.parse(moreInfo);
    } catch (error) {
      console.log("Error getting more info");
    } finally {
      return moreInfo || { wants_socials: false };
    }
  }
  render() {
    // console.log("I am the community", this.props.community);
    let BUILD_VERSION_TEXT = BUILD_VERSION;
    if (IS_PROD && IS_SANDBOX) {
      // prod sandbox
      BUILD_VERSION_TEXT = "Production Build (Sandbox) " + BUILD_VERSION_TEXT;
    } else if (IS_PROD && !IS_SANDBOX) {
      //prod main
      BUILD_VERSION_TEXT = "Production Build " + BUILD_VERSION_TEXT;
    } else if (IS_CANARY && IS_SANDBOX) {
      // prod sandbox
      BUILD_VERSION_TEXT = "Canary Build (Sandbox) " + BUILD_VERSION_TEXT;
    } else if (IS_CANARY && !IS_SANDBOX) {
      //prod main
      BUILD_VERSION_TEXT = "Canary Build " + BUILD_VERSION_TEXT;
    } else if (!IS_PROD && IS_SANDBOX) {
      // dev sandbox
      BUILD_VERSION_TEXT = "Development Build (Sandbox) " + BUILD_VERSION_TEXT;
    } else {
      // dev sandbox
      BUILD_VERSION_TEXT = "Development Build " + BUILD_VERSION_TEXT;
    }

    const moreInfo = this.getMoreInfo();

    return (
      <div className="d-flex flex-column">
        <footer className="main-footer m-footer-color">
          {/* <!--Widgets Section--> */}
          <div className="widgets-section">
            <div className="container">
              {/* <!--Big Column--> */}
              <div className="big-column">
                <div className="row clearfix">
                  {/* <!--Footer Column--> */}
                  <FooterInfo
                    info={this.props.footerInfo ? this.props.footerInfo : {}}
                  />
                  {/* <!--Footer Column--> */}
                  <FooterLinks
                    title="Quick Links"
                    links={this.props.footerLinks}
                  />
                  {/* <!--Footer Column--> */}
                  <div className="col-12 col-md-4">
                    {moreInfo.wants_socials ==="true" ? (
                      <CommunitySocials community={this.props.community} moreInfo={moreInfo} />
                    ) : (
                      <SubscribeForm />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
        <section className="footer-bottom m-footer-color">
          <div className="container">
            <div className="pull-left copy-text">
              <p className="cool-font">
                <a
                  target="_blank"
                  href="https://massenergize.org"
                  rel="noopener noreferrer"
                >
                  Copyright © 2020
                </a>{" "}
                All Rights Reserved. Powered by{" "}
                <a
                  target="_blank"
                  href="https://massenergize.org"
                  rel="noopener noreferrer"
                >
                  MassEnergize
                </a>
              </p>
            </div>
            <div className="pull-right get-text">
              <Link to={this.props.links.donate}>Donate Now</Link>
            </div>
          </div>
        </section>
        <section className="coders " style={{ background: "black" }}>
          <div className="container">
            <p className="m-0" style={{ fontSize: "12px" }}>
              Made with &nbsp;
              <span className="fa fa-heart text-danger"></span> by &nbsp;
              <u>Samuel Opoku-Agyemang</u>
              &nbsp;&nbsp;
              <u>Kieran O'Day</u>
              &nbsp;&nbsp;
              <u>Mingle Li</u>
              &nbsp;&nbsp;
              <u>Frimpong Opoku-Agyemang</u>
              &nbsp;&nbsp;
              <u>Josh Katofsky</u>
              <br />
              <u>{BUILD_VERSION_TEXT}</u>
            </p>
          </div>
        </section>
      </div>
    );
  }
}
const mapStoreToProps = (store) => {
  return {
    community: store.page.community,
    links: store.links,
  };
};
export default connect(mapStoreToProps)(Footer);
