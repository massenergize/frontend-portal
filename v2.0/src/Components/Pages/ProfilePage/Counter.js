import React from "react";
import CountUp from "react-countup";
import Tooltip from "../Widgets/CustomTooltip";


class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: 3000,
      count: 0
    };
  }

  render() {
    return (
      <div className="item count-cardy z-depth-float mob-profile-card-fix me-anime-open-in">
        <br className="phone-vanish" />
        <br className="phone-vanish" />
        <div className="icon mob-icon-fix">
          <i className={this.props.icon}></i>
        </div>
        <div className="count-outer">
          <CountUp end={this.props.end} duration={3} />
        </div>
        {this.props.info ? (
          <Tooltip text={this.props.info} paperStyle={{left:-80}} dir="right">
            <h6 className="h6-card-fix">
              {this.props.title} {this.props.unit && `(in ${this.props.unit})`}
              <span
                className="fa fa-info-circle"
                style={{ color: "#428a36", padding:5 }}
              ></span>
            </h6>
          </Tooltip>
        ) : (
          <h6 className="h6-card-fix">
            {this.props.title} {this.props.unit && `(in ${this.props.unit})`}
          </h6>
        )}
      </div>
    );
  }
}
export default Counter;
