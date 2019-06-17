import React from 'react';
import IconBox from './IconBox.js/index.js';

class IconBoxTable extends React.Component {
    renderBoxes(boxes){
        if(!boxes){
            return <div>No Icon Boxes to Display</div>
        }
        return Object.keys(boxes).map(key=> {
            var box = boxes[key];
            return <IconBox
                key = {box.id}
                title = {box.title}
                description = {box.description}
                icon = {box.icon}
                link = {box.link}
                />
        });
    }
    render() {
        return(
            <section class="service sec-padd3">
                <div class="container">
                    <div class="section-title center">
                        <h2>{this.props.title}</h2>
                    </div>
                    <div class="row">
                        {this.renderBoxes(this.props.boxes)}
                    </div>
                </div>
            </section>
        );
    }
}
export default ActionTable;