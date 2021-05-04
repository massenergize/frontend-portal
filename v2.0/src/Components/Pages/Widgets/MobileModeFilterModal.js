import React from "react";
import MEModal from "./MEModal";
import MESectionWrapper from "./MESectionWrapper";
export default class MobileModeFilterModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data , activeTags, currentSelectedVal } = this.props;
    return (
      <MEModal
        size="lg"
        closeModal={() => this.setState({ showMore: false })}
        showCloseBtn={false}
        containerClassName="filter-full-page-settings"
        className="filter-custom-modal-tweaks"
      >
        <div className="modal-title-bar">
          <h3>MassEnergize Filter Bar Options</h3>
          <button className="" style={{ marginLeft: "auto" }}>
            <i
              className="fa fa-times"
              style={{ fontSize: 17, marginTop: 9, marginRight: 5 }}
            ></i>
          </button>
        </div>
        <div style={{ overflowY: "scroll" }}>
          {(data || []).map((set, index) => {
            const tags = set.tags.sort((a, b) => a.rank - b.rank);
            return (
              <div className="filter-modal-content" key={index.toString()}>
                <MESectionWrapper
                  headerText={set.name}
                  style={{
                    // background: "#e4e4e4",
                    // color: "black",
                    borderRadius: 0,
                  }}
                  containerStyle={{ padding: 0, border: 0 }}
                >
                  {(tags || []).map((tag, index) => {
                    return (
                      <p className="accordion-item" key={index.toString()}>
                        {tag.name}
                      </p>
                    );
                  })}
                </MESectionWrapper>
              </div>
            );
          })}
        </div>

        {/* -------- FOOTER ------------------- */}
        <div className="filter-modal-footer">
          <div style={{ marginLeft: "auto" }}>
            <button className="line-me flat-btn close-flat">CLEAR ALL</button>
            <button className="line-me flat-btn">DONE</button>
          </div>
        </div>
      </MEModal>
    );
  }
}
