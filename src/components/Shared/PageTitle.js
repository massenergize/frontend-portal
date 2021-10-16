import React from "react";

/**
 * Renders a page title with h1
 */
export default class PageTitle extends React.Component {
  render() {
    const { style, className } = this.props;
    return (
      <div className="row text-center justify-content-center mb-5 zero-margin-btm">
        <h2
          className={`cool-font phone-big-title ${className}`}
          style={{ marginBottom: 10, ...style }}
        >
          {this.props.children}
        </h2>
      </div>
    );
  }
}

PageTitle.defaultProps = {
  style: {},
};
