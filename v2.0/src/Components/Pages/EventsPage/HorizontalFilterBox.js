import React, { Component } from "react";
import { connect } from "react-redux";
// import MECheckBoxGroup from "../Widgets/MECheckBoxGroup";
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
  onItemSelectedFromDropDown(name, value, type) {
    const param = { collectionName: type, value };
    this.props.boxClick(param);
    var { activeTags } = this.state;
    activeTags = (activeTags || []).filter(
      (item) => item.collectionName !== param.collectionName
    );
    if (param.value !== "None") activeTags.push(param);
    this.setState({ activeTags });
    // if (isAlreadyIn.length === 0) {
    //   this.setState({ activeTags: [...activeTags, [name, value]] }); // save the name of the tag, and the value of the tag together in an arr for easy access later
    // }
  }


  renderActiveTags() {
    const { activeTags } = this.state;
    if (!activeTags || activeTags.length === 0)
      return <small>No filters have been applied yet</small>;
    return activeTags.map((tagObj, index) => {
      return (
        <small
          style={{ fontWeight: "600", color: "#7cb331" }}
          // className="round-me h-cat-select"
          key={index.toString()}
          onClick={() => this.deselectTags(tagObj)}
        >
          <span style={{ color: "black" }}>{tagObj.collectionName}</span> :{" "}
          <span>{tagObj.value}</span>
          {index + 1 !== activeTags.length ? " , " : ""}
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
        // const dataValues = getPropsArrayFromJsonArray(set.tags, "id");
        return (
          <div key={index.toString()} style={{ display: "inline-block" }}>
            <MELightDropDown
              style={{ background: "transparent", marginBottom: 4 }}
              label={<span className="h-f-label">{`${set.name}`}</span>}
              data={data}
              // dataValues={dataValues}
              onItemSelected={this.onItemSelectedFromDropDown}
              categoryType={set.name}
            />
          </div>
        );
        // }
      });
    }
  };
  render() {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3px 0px 0px",
          marginBottom: 10,
          borderRadius: 10,
          background: "#f1f1f1",
          marginTop: -20,
        }}
        className="z-depth-sticker"
      >
        {this.renderDifferentCollections()}
        <div
          style={{
            width: "100%",
            padding: 10,
            background: "white",
            minHeight: 40,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
          }}
        >
          {this.renderActiveTags()}
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
