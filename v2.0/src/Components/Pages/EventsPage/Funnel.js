import React, { Component } from "react";
import { connect } from "react-redux";
import Accordion from "./../../Menu/Accordian";
import MESectionWrapper from "../Widgets/MESectionWrapper";
import MECheckBoxGroup from "../Widgets/MECheckBoxGroup";
import { getPropsArrayFromJsonArray } from "../../Utils";
import METextField from "../Widgets/METextField";
class EventFilter extends Component {
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
          onItemSelected ={(all,id)=> this.props.boxClick(id)}
        />
      );
    }
  }
  // All collections are created by admins
  //all collections have an array of tags
  getCollectionSetAccordingToPage (){
    const { type, tagCols } = this.props; 
    if(!type) return []; 
    if(type === "testimonial") return this.props.collection; //this.props.collection only brings the category collection
    if(!tagCols) return [];
    return tagCols;
  }
  renderDifferentCollections = () => {
    const collection = this.getCollectionSetAccordingToPage();
    const col = this.makeTagsSystematic(collection);
    const me = this;
    if (col) {
      return col.map((set, index) => {
        const header = (
          <div className="section-title w-100" style={{ margin: "0px" }}>
            <span>{set.name}</span>
          </div>
        );
        return (
          <div key={index.toString()}>
            <MESectionWrapper
              style={{ minWidth: "7rem", marginTop:8 }}
              headerText={set.name}
              collapsed={set.name !== "Category"}
            >
              {me.renderTagCheckBoxes(set.tags)}
            </MESectionWrapper>
          </div>
        );
      });
    }
  };
  render() {
    const found = this.props.foundNumber;
    const type = this.props.type;
    return (
      <div>
        {type !== "testimonial" ? (
          <div>
            <METextField
              onChange={(event) => {
                this.props.search(event);
              }}
              type="text"
              placeholder="Search..."
              value = {this.props.searchTextValue}
            />
            <small style={{ color: "#70a96f" }}>
              {found} {found === 1 ? this.props.type : this.props.type + "s "}{" "}
              found
            </small>
          </div>
        ) : null}
        {this.renderDifferentCollections()}
      </div>
    );
  }
}
const mapStoreToProps = (store) => {
  return {
    collection: store.page.collection,
  };
};

export default connect(mapStoreToProps)(EventFilter);
