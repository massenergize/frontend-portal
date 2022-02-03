import React from "react";
import RegisterForm from "./RegisterForm";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import { connect } from "react-redux";

/**
 * WE DONT USE THIS ANYMORE
 * @deprecated
 */
class RegisterPage extends React.Component {
  render() {
    //avoids trying to render before the promise from the server is fulfilled
    const { auth } = this.props;
    return (
      <>
        <div className="boxed_wrapper">
          <BreadCrumbBar links={[{ name: "Sign Up" }]} />
          <section
            className="register-section sec-padd-top"
            style={{ paddingTop: 5 }}
          >
            <div className="container">
              <div className="row">
                {/* <!--Form Column--> */}
                <div className="form-column column col-md-8 col-12 offset-md-2">
                  {!auth?.isEmpty && !auth?.emailVerified && (
                    <p
                      style={{
                        fontWeight: "bold",
                        color: "#d84343",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      NB: Please verify your email
                    </p>
                  )}
                  <RegisterForm />
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
    links: store.links,
    auth: store.firebase.auth,
  };
};
export default connect(mapStoreToProps)(RegisterPage);
