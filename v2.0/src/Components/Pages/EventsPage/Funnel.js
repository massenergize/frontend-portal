import React, { Component } from 'react'
import { connect } from 'react-redux'
import Accordion from './../../Menu/Accordian';
class EventFilter extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
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
          <label className="checkbox-container" >
            <p style={{
              marginLeft: "25px",
              marginBottom: "0",
              padding: "4px 0 5px 0"
            }}>{tag.name}</p>
            <input className="checkbox" type="checkbox" onChange={(event)=>{this.props.boxClick(event)}}name="boxes" value={tag.id} />
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
          <div className="section-title w-100" style={{margin:"0px"}}>
            <span>{set.name}</span>
          </div>
        );
        return (<div>
          <Accordion
          open={set.name==="Category"}
            header={header}
            content={me.renderTagCheckBoxes(set.tags)}
          />
        </div>
        )
      })
    }
  }
  render() {

    console.log("I am the collection in funnel ", this.props.collection);
    return (
      <div>
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
