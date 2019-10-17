import React from 'react'
class Accordian extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: props.open ? props.open : false
		}
		this.handleClick = this.handleClick.bind(this);
	}
	render() {
		return (
			<div>
				<div className="accordian-header d-flex flex-row align-items-center" onClick={this.handleClick}>
					{this.props.header}
					{this.state.open ?
						<i className="fa fa-caret-up"></i> : <i className="fa fa-caret-down"></i>
					}
				</div>
				<div className={this.state.open ? 'accordian-content' : 'accordian-content hidden'}>
					{this.props.content}
				</div>
			</div>
		)
	}
	handleClick() {
		this.setState({
			open: !this.state.open
		})
	}
} export default Accordian;