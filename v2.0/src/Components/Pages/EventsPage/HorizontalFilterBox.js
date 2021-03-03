import React, { Component } from "react";
import { connect } from "react-redux";
// import Accordion from "./../../Menu/Accordian";
import MESectionWrapper from "../Widgets/MESectionWrapper";
import MECheckBoxGroup from "../Widgets/MECheckBoxGroup";
import { getPropsArrayFromJsonArray } from "../../Utils";
import METextField from "../Widgets/METextField";
import MELightDropDown from "../Widgets/MELightDropDown";
class HorizontalFilterBox extends Component {
  makeTagsSystematic = (tagCols) => {
    //arrange side filters in this order: Categories, Impact, difficulty
    if (!tagCols) return tagCols;
    var arr = [];
    arr[0] = tagCols.filter((item) => item.name === "Category")[0];
    arr[1] = tagCols.filter((item) => item.name === "Impact")[0];
    arr[2] = tagCols.filter((item) => item.name === "Difficulty")[0];
    var the_rest = tagCols.filter((item) => {
      return (
        item.name !== "Category" &&
        item.name !== "Impact" &&
        item.name !== "Difficulty"
      );
    });
    var available = arr.filter((item) => item !== undefined);
    return [...available, ...the_rest];
  };

  renderTagCheckBoxes(tags) {
    const tagNames = getPropsArrayFromJsonArray(tags, "name");
    const tagIds = getPropsArrayFromJsonArray(tags, "id");
    if (tags) {
      return (
        <MECheckBoxGroup
          data={tagNames}
          dataValues={tagIds}
          className="filter-check-text-font"
          onItemSelected={(all, id) => this.props.boxClick(id)}
          style={{ display: "inline-block" }}
        />
      );
    }
  }
  // All collections are created by admins
  //all collections have an array of tags
  getCollectionSetAccordingToPage() {
    const { type, tagCols } = this.props;
    if (!type) return [];
    if (type === "testimonial" || type === "service" || type === "event")
      return this.props.collection; //this.props.collection only brings the category collection
    if (!tagCols) return [];
    return tagCols;
  }
  renderDifferentCollections = () => {
    const collection = this.getCollectionSetAccordingToPage();
    const col = this.makeTagsSystematic(collection);
    const me = this;
    if (col) {
      return col.map((set, index) => {
        // if (set.name === "Category") {
        const data = getPropsArrayFromJsonArray(set.tags, "name");
        return (
          <div key={index.toString()} style={{ display: "inline-block" }}>
            <MELightDropDown
              label={<span className="h-f-label">{`Sort By ${set.name}`}</span>}
              data={data}
            />

            {/* //   <MESectionWrapper */}
            {/* //     style={{ minWidth: "7rem", marginTop: 8 }}
            //     headerText={set.name}
            //     collapsed={set.name !== "Category"}
            //   > */}
            {/* <div style={{ textAlign: "center" }}> */}
            {/* <p style={{ fontSize: "medium" }}>Sort These Actions By</p> */}
            {/* {me.renderTagCheckBoxes(set.tags ? set.tags.slice(0, 6) : [])} */}
            {/* </div> */}
            {/* //   </MESectionWrapper> */}
          </div>
        );
        // }
      });
    }
  };
  render() {
    const found = this.props.foundNumber;
    const type = this.props.type;
    return (
      <div style={{ textAlign: "center" }}>
        {/* {type !== "testimonial" ? (
          <div>
            <METextField
              onChange={(event) => {
                this.props.search(event);
              }}
              type="text"
              placeholder="Search..."
              value={this.props.searchTextValue}
            />
            <small style={{ color: "#70a96f" }}>
              {found} {found === 1 ? this.props.type : this.props.type + "s "}{" "}
              found
            </small>
          </div>
        ) : null} */}
        {this.renderDifferentCollections()}
        <div>
          <small className="round-me h-cat-select">
            Demonstration <i className="fa fa-close"></i>
          </small>
          <small className="round-me h-cat-select">
            Demonstration <i className="fa fa-close"></i>
          </small>
          <small className="round-me h-cat-select">
            Demonstration <i className="fa fa-close"></i>
          </small>
        </div>
      </div>
    );
  }
}
const mapStoreToProps = (store) => {
  return {
    collection: store.page.collection,
  };
};

export default connect(mapStoreToProps)(HorizontalFilterBox);
