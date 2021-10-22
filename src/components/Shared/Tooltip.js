import React from 'react';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

/**
 * Renders a page title with h1
 */
export default class Tooltip extends React.Component {
	render() {
		const popover = (
			<Popover title={(this.props.title) ? this.props.title : ""}>
				{this.props.text}
			</Popover>
		);
		return (
			<div>
				<OverlayTrigger trigger="hover focus"  placement={this.props.dir} overlay={popover}>
					{this.props.children}
				</OverlayTrigger>
			</div>
		);
	}
}