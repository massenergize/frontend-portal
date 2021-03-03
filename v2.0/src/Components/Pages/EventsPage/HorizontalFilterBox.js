import React, { Component } from "react";
import { connect } from "react-redux";
import MECheckBoxGroup from "../Widgets/MECheckBoxGroup";
import { getPropsArrayFromJsonArray } from "../../Utils";
import MELightDropDown from "../Widgets/MELightDropDown";
class HorizontalFilterBox extends Component {
  constructor() {
    super();
    this.state = {
      activeTags: [],
    };
    this.onItemSelectedFromDropDown = this.onItemSelectedFromDropDown.bind(
      this
    );
    this.deselectTags = this.deselectTags.bind(this);
  }
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
  onItemSelectedFromDropDown(name, value) {
    this.props.boxClick(value);
    const { activeTags } = this.state;
    const isAlreadyIn = activeTags.filter(
      (item) => name === item[0] && value === item[1]
    );
    if (isAlreadyIn.length === 0) {
      this.setState({ activeTags: [...activeTags, [name, value]] }); // save the name of the tag, and the value of the tag together in an arr for easy access later
    }
  }

  deselectTags(tag) {
    const { activeTags } = this.state;
    const rem = activeTags.filter(
      (item) => tag[0] !== item[0] && tag[1] !== item[1]
    );
    this.props.boxClick(tag[1]);
    this.setState({ activeTags: rem });
  }

  renderActiveTags() {
    const { activeTags } = this.state;
    return activeTags.map((tagArr, index) => {
      return (
        <small
          className="round-me h-cat-select"
          key={index.toString()}
          onClick={() => this.deselectTags(tagArr)}
        >
          {tagArr[0]} <i className="fa fa-close"></i>
        </small>
      );
    });
  }
  renderDifferentCollections = () => {
    const collection = this.getCollectionSetAccordingToPage();
    const col = this.makeTagsSystematic(collection);
    if (col) {
      return col.map((set, index) => {
        // if (set.name === "Category") {
        const data = getPropsArrayFromJsonArray(set.tags, "name");
        const dataValues = getPropsArrayFromJsonArray(set.tags, "id");
        return (
          <div key={index.toString()} style={{ display: "inline-block" }}>
            <MELightDropDown
              label={<span className="h-f-label">{`Sort By ${set.name}`}</span>}
              data={data}
              dataValues={dataValues}
              onItemSelected={this.onItemSelectedFromDropDown}
            />
          </div>
        );
        // }
      });
    }
  };
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        {this.renderDifferentCollections()}
        <div>{this.renderActiveTags()}</div>
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
