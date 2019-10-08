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
	renderBoxes(boxes) {
		if (!boxes) {
			return <div>No Icon Boxes to Display</div>
		}
		return Object.keys(boxes).map((key, index) => {
			var box = boxes[key];
			return <div className="col-lg-3 col-md-6 col-sm-6 col-12 d-flex flex-row" key={index}>
				<IconBox
					key={index}
					title={box.title}
					description={box.description}
					icon={box.icon}
					link={box.link}
				/>
			</div>
		});
	}
	render() {
		return (
			<section className="service p-5" style={{background:'white'}}>
				<div className="container">
					<div className="section-title center ">
						<h3 class="text-white cool-font m-service-title" >{this.props.title}</h3>
					</div>
					<div className="row d-flex flex-row">
						{this.renderBoxes(this.props.boxes)}
					</div>
				</div>
			</section>
		);
	}
}
export default IconBoxTable;