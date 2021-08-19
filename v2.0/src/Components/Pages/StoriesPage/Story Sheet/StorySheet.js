import React, { Component } from "react";
import "./StorySheet.css";
import DefaultClass from "../../../Shared/Classes/DefaultClass";

export default class StorySheet extends Component {
  render() {
    return (
      <div>
        <div className="root-story-sheet z-depth-float">
          <img
            src={DefaultClass.getTestimonialsDefaultPhoto()}
            className="sheet-image"
            alt="sheet media"
          />
          <div className="sheet-content-area">
            <h4>Bradley Lorem Ipsum</h4>
            <div className="sheet-details">
              <p>21st July 2021</p>

              <p style={{ marginLeft: "auto" }} className="sheet-link">
                {" "}
                <i className="fa fa-copy" style={{ marginRight: 6 }}></i>21st
                July 2021
              </p>
            </div>
            <div>
              <h6
                style={{
                  textTransform: "uppercase",
                  color: "var(--app-theme-orange)",
                }}
              >
                Lets try this new interface
              </h6>
              <p className="sheet-text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
                mollitia, molestiae quas vel sint commodi repudiandae
                consequuntur voluptatum laborum numquam blanditiis harum
                quisquam eius sed odit fugiat iusto fuga praesentium optio,
                eaque rerum! Provident similique accusantium nemo autem.
                Veritatis obcaecati tenetur iure eius earum ut molestias
                architecto voluptate aliquam nihil, eveniet aliquid culpa
                officia aut! Impedit sit sunt quaerat, odit, tenetur error,
                harum nesciunt ipsum debitis quas aliquid.{" "}
              </p>
            </div>
            <div style={{ display: "flex" }}>
              <a href="#" className="sheet-link">
                Read more...
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
