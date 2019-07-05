import React from 'react'
class Accordian extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
        this.handleClick = this.handleClick.bind(this);
    }
    render() {
        return (
            <div>
                <div className="accordian-header" onClick={this.handleClick}>
                    {this.state.open ?
                        <i className="fa fa-caret-up"></i> : <i className="fa fa-caret-down"></i>
                    }
                    {this.props.header}

                </div>
                <div className= {this.state.open? 'accordian-content':'accordian-content hidden' }>
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