import React from "react";
import BreadCrumbBar from "../../../Shared/BreadCrumbBar";

export default function LoginAuth() {
  return (
    <div>
      <div className="boxed_wrapper" style={{ height: "100vh" }}>
        <BreadCrumbBar links={[{ name: "Sign In" }]} />
        <section
          className="register-section sec-padd-top"
          style={{ paddingTop: 5 }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-12 offset-md-2">
                <h2>I just wanna be where you are</h2>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
