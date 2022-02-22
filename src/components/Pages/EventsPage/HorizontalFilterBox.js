import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import {
  findMatchingTag,
  getPropsArrayFromJsonArray,
  putSearchTextFilterInURL,
  removeAllFiltersFromURL,
} from "../../Utils";
import MELightDropDown, { NONE } from "../Widgets/MELightDropDown";
import MobileModeFilterModal from "../Widgets/MobileModeFilterModal";
// import MEModal from "../Widgets/MEModal";
// import MEDropdown from "../Widgets/MEDropdown";
import METextField from "../Widgets/METextField";
import StoryFormButtonModal from "../StoriesPage/StoryFormButtonModal";
export const FILTER_BAR_VERSION = "filter_bar_version";
const OPTION2 = "option2";

class HorizontalFilterBox extends Component {
  constructor() {
    super();
    this.state = {
      activeTags: [],
      dropActive: false,
      showSearch: false,
      longHeight: false,
      selected_collection: null,
      mounted: false,
    };
    this.onItemSelectedFromDropDown =
      this.onItemSelectedFromDropDown.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.phoneMenuTextClick = this.phoneMenuTextClick.bind(this);
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
  onItemSelectedFromDropDown(value, type, collectionId) {
    const tag = findMatchingTag(value, this.props.tagCols, collectionId);
    const param = { collectionName: type, value, collectionId, tagId: tag?.id };
    this.props.boxClick(param);
    var { activeTags } = this.state;
    activeTags = (activeTags || []).filter(
      (item) => item.collectionName !== param.collectionName
    );
    if (param.value !== NONE) {
      activeTags.push(param);
      this.setState({ longHeight: false, activeTags }); // important in phone mode. ( For showing dropdowns )
      return;
    }
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
            this.onItemSelectedFromDropDown(
              NONE,
              tagObj.collectionName,
              tagObj?.collectionId
            )
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
    const version = this.getVersionToShow();

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

  static getDerivedStateFromProps = (props, state) => {
    if (!state.mounted)
      return {
        activeTags: props.filtersFromURL,
        mounted: props.doneProcessingURLFilter,
      };

    return null;
  };

  renderDifferentCollections = (style = { display: "inline-block" }) => {
    var { version } = this.props;
    version = this.getVersionToShow() || version;
    const col = this.getCollectionSetAccordingToPage();
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
                  {cat}
                  {/* {this.renderIcon(selected)} */}
                </span>
              }
              labelIcon={this.renderIcon(selected)}
              data={data}
              onItemSelected={this.onItemSelectedFromDropDown}
              categoryType={set.name}
              collectionId={set.id}
            />
          </div>
        );
      });
    }
  };

  renderBarsButton() {
    const col = this.getCollectionSetAccordingToPage();
    if (col.length > 3)
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
  phoneMenuTextClick(set) {
    if (this.state.longHeight && set.name === this.state.selected_collection)
      this.setState({ longHeight: false, selected_collection: null });
    else this.setState({ longHeight: true, selected_collection: set.name });
  }
  renderPhoneCollections = (style = { display: "inline-block" }) => {
    const { version } = this.props;
    var col = this.getCollectionSetAccordingToPage();
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
                  {cat?.length > 10 ? cat.slice(0, 7) + "..." : cat}
                  {/* {this.renderIcon(selected)} */}
                </span>
              }
              labelIcon={this.renderIcon(selected)}
              data={data}
              onItemSelected={this.onItemSelectedFromDropDown}
              categoryType={set.name}
              collectionId={set.id}
              menuTextClick={() => this.phoneMenuTextClick(set)}
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
    this.props.onSearchTextChange("");
    removeAllFiltersFromURL(this.props);
  };
  renderClearFilter() {
    const { activeTags } = this.state;
    return activeTags && activeTags.length > 0 ? (
      <center style={{ display: "inline-block" }}>
        <a
          className="filter-close me-open-in"
          href="#void"
          onClick={this.clearFilters}
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
    const version = this.getVersionToShow();
    if (version && version === 2)
      return <i className=" fa fa-angle-down" style={{ marginLeft: 5 }}></i>;
    if (selected && selected.value)
      return (
        <span
          onClick={() =>
            this.onItemSelectedFromDropDown(
              NONE,
              selected && selected.collectionName,
              selected?.collectionId
            )
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
  getVersionToShow() {
    const version = sessionStorage.getItem(FILTER_BAR_VERSION);
    if (version === OPTION2) return 2;
    return 1;
  }
  handleSearchTyping = (e) => {
    if (!this.props.search) return;
    this.props.onSearchTextChange(e.target.value,e);
    this.props.search(e);
    putSearchTextFilterInURL(this.props, e.target.value);
  };
  render() {
    const { longHeight } = this.state;
    return (
      <>
        {this.renderMoreModal()}
        <div className="hori-filter-container phone-vanish">
          {this.renderClearFilter()}
          {this.renderDifferentCollections()}
          <METextField
            id="test-filter-box-id"
            iconStyle={{
              position: "absolute",
              top: 10,
              fontSize: "medium",
              marginLeft: 31,
            }}
            onChange={this.handleSearchTyping}
            value={this.props.searchText}
            icon="fa fa-search"
            iconColor="rgb(210 210 210)"
            containerStyle={{ display: "inline-block", position: "relative" }}
            className="hori-search-box"
            placeholder="Search..."
          />
          {this.renderTagComponent()}
          {window.location.pathname.includes("testimonial") &&
          this.props.user ? (
            <StoryFormButtonModal>
              <div className="add-testimonial-container">
                <div className="add-testimonial touchable-opacity">
                  <i className="fa fa-plus" style={{ marginRight: 6 }} />
                  <p>Add Testimonial</p>
                </div>
              </div>
            </StoryFormButtonModal>
          ) : (
            <div />
          )}
        </div>
        {/* --------------------- PHONE MODE ----------------- */}
        <div className="pc-vanish" style={{ marginBottom: 10 }}>
          <input
            id="test-filter-box-id"
            className="phone-search-input "
            placeholder="Search..."
            onChange={this.handleSearchTyping}
            value={this.props.searchText}
          />

          <div
            className="hori-filter-container"
            style={{
              height: longHeight ? "100vh" : 50,
              overflowY: "hidden",
              overflowX:
                (this.getCollectionSetAccordingToPage() || []).length > 3
                  ? "scroll"
                  : "hidden",
            }}
          >
            {this.renderPhoneCollections()}
            <hr style={{ background: "white", marginTop: 0, width: "150%" }} />
            <div
              onClick={() => this.setState({ longHeight: false })}
              style={{ width: "150%", height: "100vh" }}
            ></div>
          </div>
        </div>
      </>
    );
  }
}

const mapStoreToProps = (store) => {
  return {
    collection: store.page.collection,
    user: store.user.info,
  };
};

HorizontalFilterBox.defaultProps = {
  version: 1,
};

export default withRouter(connect(mapStoreToProps)(HorizontalFilterBox));
