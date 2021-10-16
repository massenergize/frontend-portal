import React from "react";
import IconBox from "./IconBox";

/**
 * Renders all the Icon boxs into a row with 3 columns
 * @props
 *      title
 *      boxes
 *          id
 *          title
 *          description
 *          icon
 *          link
 */
class IconBoxTable extends React.Component {
  actionFirst = (boxes) => {
    const action = boxes.filter((item) =>
      item.title.toLowerCase().includes("action")
    )[0];
    if (action) {
      var rest = boxes.filter((item) => item.title !== action.title);
      var newB = [action, ...rest];
      return newB;
    }
    return boxes;
  };
  renderBoxes(boxes) {
    // for now we won't want to do this because of issue:
    // https://github.com/massenergize/frontend-admin/issues/226
    // boxes = this.actionFirst(boxes);
    if (!boxes) {
      return <div>No Icon Boxes to Display</div>;
    }
    return Object.keys(boxes).map((key, index) => {
      var box = boxes[key];
      return (
        <div
          className="col-lg-3 col-6 d-flex flex-row"
          key={index}
        >
          <IconBox
            key={index}
            title={box.title}
            description={box.description}
            icon={box.icon}
            link={`${this.props.prefix}${box.link}`}
          />
        </div>
      );
    });
  }
  render() {
    const boxes = this.props.boxes;
    return (
      <section className="service mob-icon-white-fix pc-icon-div-container-fix">
        <div className="container">
          <div className="section-title center ">
            {/* <h4 className="phone-vanish text-white cool-font m-service-title" >{boxes.length ===0?'': this.props.title}</h4> */}
          </div>
          <div className="row d-flex flex-row">{this.renderBoxes(boxes)}</div>
        </div>
      </section>
    );
  }
}
export default IconBoxTable;
