import React from "react";
import MEModal from "./MEModal";
import MESectionWrapper from "./MESectionWrapper";
export default class MobileModeFilterModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      data,
      currentSelectedVal,
      clearAll,
      onItemSelected,
      NONE,
      close,
    } = this.props;
    return (
      <MEModal
        size="lg"
        showCloseBtn={false}
        containerClassName="filter-full-page-settings"
        className="filter-custom-modal-tweaks"
      >
        <div className="modal-title-bar">
          <h3>Filter Available Actions</h3>
          <button
            className=""
            style={{ marginLeft: "auto" }}
            onClick={() => close()}
          >
            <i
              className="fa fa-times"
              style={{ fontSize: 17, marginTop: 9, marginRight: 5 }}
            ></i>
          </button>
        </div>
        <div style={{ overflowY: "scroll", marginBottom: 130 }}>
          {(data || []).map((set, index) => {
            const tags = set.tags.sort((a, b) => a.rank - b.rank);
            const selected = currentSelectedVal(set);
            return (
              <div className="filter-modal-content" key={index.toString()}>
                <MESectionWrapper
                  headerText={selected ? selected.value : set.name}
                  style={{
                    borderRadius: 0,
                  }}
                  containerStyle={{ padding: 0, border: 0 }}
                >
                  <p
                    className={` accordion-clear`}
                    key={index.toString()}
                    onClick={() =>
                      onItemSelected(NONE, selected && selected.collectionName)
                    }
                  >
                    {NONE}
                  </p>
                  {(tags || []).map((tag, index) => {
                    const isSelected = (selected || {}).value === tag.name;
                    return (
                      <p
                        className={`accordion-item ${
                          isSelected ? "accordion-item-active" : ""
                        }`}
                        key={index.toString()}
                        onClick={() => onItemSelected(tag.name, set.name)}
                      >
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
            <button
              className="line-me flat-btn close-flat"
              onClick={(e) => clearAll(e)}
            >
              CLEAR ALL
            </button>
            <button className="line-me flat-btn" onClick={() => close()}>
              DONE
            </button>
          </div>
        </div>
      </MEModal>
    );
  }
}
