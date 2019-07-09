import React from 'react';
import IconBox from './IconBox';

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
    renderBoxes(boxes){
        if(!boxes){
            return <div>No Icon Boxes to Display</div>
        }
        return Object.keys(boxes).map(key=> {
            var box = boxes[key];
            return  <div className="col-lg-3 col-md-6 col-sm-6 col-12" key = {box.id}>
                        <IconBox
                            key = {box.id}
                            title = {box.title}
                            description = {box.description}
                            icon = {box.icon}
                            link = {box.link}
                        />
                    </div>
        });
    }
    render() {
        return(
            <section className="service p-5">
                <div className="container">
                    <div className="section-title center">
                        <h2>{this.props.title}</h2>
                    </div>
                    <div className="row">
                        {this.renderBoxes(this.props.boxes)}
                    </div>
                </div>
            </section>
        );
    }
}
export default IconBoxTable;