import React, { Component } from 'react'
import { connect } from 'react-redux'
import Accordion from './../../Menu/Accordian';
class EventFilter extends Component {
  constructor(props) {
    super(props)


  }

  makeTagsSystematic = (tagCols) => {
    //arrange side filters in this order: Categories, Impact, difficulty
    if (!tagCols) return tagCols;
    var arr = [];
    arr[0] = tagCols.filter(item => item.name === "Category")[0];
    arr[1] = tagCols.filter(item => item.name === "Impact")[0];
    arr[2] = tagCols.filter(item => item.name === "Difficulty")[0];
    var the_rest = tagCols.filter(item => {
      return item.name !== "Category" && item.name !== "Impact" && item.name !== "Difficulty";
    });
    var available = arr.filter(item => item !== undefined);
    return [...available, ...the_rest];
  }

  renderTagCheckBoxes(tags) {
    if (tags) {
      return tags.map(tag => {
        return (
          <label style={{ marginBottom: "0px", marginTop: "0px" }} className="checkbox-container" >
            <p style={{
              marginLeft: "25px",
              marginBottom: "0px",
              marginTop: "0px",
              padding: "4px 0 5px 0"
            }}>{tag.name}</p>
            <input className="checkbox" type="checkbox" onChange={(event) => { this.props.boxClick(event) }} name="boxes" value={tag.id} />
            <span className="checkmark"></span>
          </label>
        )
      })
    }
  }
  // All collections are created by admins 
  //all collections have an array of tags
  renderDifferentCollections = () => {
    const col = this.makeTagsSystematic(this.props.collection);
    const me = this;
    if (col) {
      return col.map(set => {
        const header = (
          <div className="section-title w-100" style={{ margin: "0px" }}>
            <span>{set.name}</span>
          </div>
        );
        return (<div>
          <Accordion
            open={set.name === "Category"}
            header={header}
            content={me.renderTagCheckBoxes(set.tags)}
          />
        </div>
        )
      })
    }
  }
  render() {
    const found = this.props.foundNumber;
    const type = this.props.type;
    return (
      <div>
        {type !== "testimonial" ? (
          <div>
            <input onChange={(event) => { this.props.search(event) }} type="text" placeholder="Search..." className="filter-search-input" />
            <small style={{ color: '#70a96f' }}>{found} {found === 1 ? this.props.type : this.props.type + "s "} found</small>
          </div>
        )
          :
          null}
        {this.renderDifferentCollections()}
      </div>
    )
  }
}
const mapStoreToProps = (store) => {
  return {
    collection: store.page.collection,
  }
}

export default connect(mapStoreToProps)(EventFilter);
