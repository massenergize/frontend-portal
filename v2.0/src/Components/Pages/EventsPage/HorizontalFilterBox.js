import React, { Component } from "react";
import { connect } from "react-redux";
// import MECheckBoxGroup from "../Widgets/MECheckBoxGroup";
import { getPropsArrayFromJsonArray } from "../../Utils";
import MELightDropDown, { NONE } from "../Widgets/MELightDropDown";
// import MEModal from "../Widgets/MEModal";
// import MEDropdown from "../Widgets/MEDropdown";
import METextField from "../Widgets/METextField";
import MobileModeFilterModal from "../Widgets/MobileModeFilterModal";
export const NO_BUBBLE_VERSION = 1;
export const BUBBLE_VERSION = 2;
class HorizontalFilterBox extends Component {
  constructor() {
    super();
    this.state = {
      activeTags: [],
      dropActive: false,
    };
    this.onItemSelectedFromDropDown = this.onItemSelectedFromDropDown.bind(
      this
    );
    this.clearFilters = this.clearFilters.bind(this);
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
  onItemSelectedFromDropDown(value, type) {
    const param = { collectionName: type, value };
    this.props.boxClick(param);
    var { activeTags } = this.state;
    activeTags = (activeTags || []).filter(
      (item) => item.collectionName !== param.collectionName
    );
    if (param.value !== NONE) activeTags.push(param);
    this.setState({ activeTags });
  }

  renderActiveTags() {
    const { activeTags } = this.state;
    if (!activeTags || activeTags.length === 0)
      return <small>No filters have been applied yet</small>;
    return activeTags.map((tagObj, index) => {
      return (
        <small
          // style={{ fontWeight: "600", color: "#7cb331" }}
          className="round-me h-cat-select z-depth-float-half"
          key={index.toString()}
          onClick={() =>
            this.onItemSelectedFromDropDown(NONE, tagObj.collectionName)
          }
        >
          <span>{tagObj.collectionName}</span> : <span>{tagObj.value}</span>{" "}
          <i className="fa fa-close" style={{ marginLeft: 3 }} />
          {/* {index + 1 !== activeTags.length ? " , " : ""} */}
        </small>
      );
    });
  }

  renderTagComponent = (style = { padding: 10, background: "#fffbf1" }) => {
    const { version } = this.props;
    if (!version || version !== 2) return <></>;
    return <div style={style}>{this.renderActiveTags()}</div>;
  };
  /**
   * Returns the current selected item of the category that matches @set
   * @param {*} set  Where @set = any tag under a tagCollection
   * @returns
   */
  currentSelectedVal = (set) => {
    const { activeTags } = this.state;
    if (!activeTags) return;
    return activeTags.filter((item) => item.collectionName === set.name)[0];
  };

  /**
   * This method loops over the available tagCollections and
   * returns an HTML representation of categories and the tags associated with each
   * as dropdown
   * @returns
   */
  renderDifferentCollections = (style = { display: "inline-block" }) => {
    const { version } = this.props;
    const col = this.getCollectionSetAccordingToPage();
    if (col) {
      return [...col, ...col].map((set, index) => {
        const selected = this.currentSelectedVal(set);
        const tags = set.tags.sort((a, b) => a.rank - b.rank);
        const data = getPropsArrayFromJsonArray(tags, "name");
        const selectedName = selected ? selected.value : set.name;
        const cat = version && version === 2 ? set.name : selectedName;
        return (
          <div key={index.toString()} style={style}>
            <MELightDropDown
              style={{ background: "transparent", marginBottom: 4 }}
              label={
                <span className="h-f-label" style={{ textDecoration: "none" }}>
                  {cat}
                  {/* {this.renderIcon(selected)} */}
                </span>
              }
              labelIcon={this.renderIcon(selected)}
              data={data}
              onItemSelected={this.onItemSelectedFromDropDown}
              categoryType={set.name}
            />
          </div>
        );
      });
    }
  };

  renderBarsButton() {
    const col = this.getCollectionSetAccordingToPage();
    if (col.length > 3 || true)
      // @TODO remove true when you are done
      return (
        <button
          className="custom-bars-btn"
          onClick={() => this.setState({ showMore: true })}
        >
          <i className="fa fa-bars"></i> <small>More</small>
        </button>
      );
  }

  renderMoreModal() {
    const { showMore } = this.state;
    if (showMore)
      return (
        <MobileModeFilterModal
          data={this.getCollectionSetAccordingToPage()}
          activeTags={this.state.activeTags}
          currentSelectedVal={this.currentSelectedVal}
          onItemSelected={this.onItemSelectedFromDropDown}
          clearAll={this.clearFilters}
          NONE={NONE}
          close={() => this.setState({ showMore: false })}
        />
      );
  }
  renderPhoneCollections = (style = { display: "inline-block" }) => {
    const { version } = this.props;
    var col = this.getCollectionSetAccordingToPage();
    col = (col || []).length > 3 ? col.slice(0, 2) : col;
    if (col) {
      return col.map((set, index) => {
        const selected = this.currentSelectedVal(set);
        const tags = set.tags.sort((a, b) => a.rank - b.rank);
        const data = getPropsArrayFromJsonArray(tags, "name");
        const selectedName = selected ? selected.value : set.name;
        const cat = version && version === 2 ? set.name : selectedName;
        return (
          <div key={index.toString()} style={style}>
            <MELightDropDown
              style={{ background: "transparent", marginBottom: 4 }}
              label={
                <span className="h-f-label" style={{ textDecoration: "none" }}>
                  {cat.length > 10 ? cat.slice(0, 7) + "..." : cat}
                  {/* {this.renderIcon(selected)} */}
                </span>
              }
              labelIcon={this.renderIcon(selected)}
              data={data}
              onItemSelected={this.onItemSelectedFromDropDown}
              categoryType={set.name}
            />
          </div>
        );
      });
    }
  };

  clearFilters = (e) => {
    e.preventDefault();
    this.setState({ activeTags: [] });
    this.props.boxClick(null, true);
  };
  renderClearFilter() {
    const { activeTags } = this.state;
    return activeTags && activeTags.length > 0 ? (
      <center style={{ display: "inline-block" }}>
        <a
          className="filter-close me-open-in"
          href="#void"
          onClick={this.clearFilters}
          // style={{ position: "absolute", left: 28, top: -5 }}
        >
          Clear Filters{" "}
          <i className="fa fa-times-circle" style={{ marginLeft: 2 }}></i>
        </a>
      </center>
    ) : (
      <div style={{ width: 113, display: "inline-block" }}></div>
    );
  }

  renderIcon(selected) {
    const { version } = this.props;
    if (version && version === 2)
      return <i className=" fa fa-angle-down" style={{ marginLeft: 5 }}></i>;
    if (selected && selected.value)
      return (
        <span
          onClick={() =>
            this.onItemSelectedFromDropDown(NONE, selected.collectionName)
          }
        >
          <i
            className="fa fa-times-circle filter-close"
            style={{ marginLeft: 5, textDecoration: "none" }}
          ></i>
        </span>
      );
    return <i className=" fa fa-angle-down" style={{ marginLeft: 5 }}></i>;
  }

  render() {
    return (
      <>
        {this.renderMoreModal()}
        <div className="hori-filter-container phone-vanish">
          {this.renderClearFilter()}
          {this.renderDifferentCollections()}
          <METextField
            iconStyle={{
              position: "absolute",
              top: 10,
              fontSize: "medium",
              marginLeft: 31,
            }}
            onChange={(event) => {
              if (!this.props.search) return;
              this.props.search(event);
            }}
            icon="fa fa-search"
            iconColor="rgb(210 210 210)"
            containerStyle={{ display: "inline-block", position: "relative" }}
            className="hori-search-box"
            placeholder="Search..."
          />
          {this.renderTagComponent()}
        </div>
        {/* --------------------- PHONE MODE ----------------- */}
        <div className="hori-filter-container pc-vanish">
          {/* {this.renderClearFilter()} */}
          {/* <div style={{ overflowX:"scroll" }}> */}
          {this.renderPhoneCollections()}
          {this.renderBarsButton()}
          {/* </div> */}

          {/* <METextField
            iconStyle={{
              position: "absolute",
              top: 10,
              fontSize: "medium",
              marginLeft: 31,
            }}
            onChange={(event) => {
              if (!this.props.search) return;
              this.props.search(event);
            }}
            icon="fa fa-search"
            iconColor="rgb(210 210 210)"
            containerStyle={{ display: "block", position: "relative" }}
            className="hori-search-box"
            placeholder="Search..."
          /> */}
          {this.renderTagComponent()}
        </div>
      </>
    );
  }
}
const mapStoreToProps = (store) => {
  return {
    collection: store.page.collection,
  };
};

HorizontalFilterBox.defaultProps = {
  version: 1,
};

export default connect(mapStoreToProps)(HorizontalFilterBox);
