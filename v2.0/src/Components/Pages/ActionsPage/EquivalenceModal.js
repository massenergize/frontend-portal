import React, { useState } from "react";
import { calcEQ, getPropsArrayFromJsonArray, PREFERRED_EQ } from "../../Utils";
import MEDropdown from "../Widgets/MEDropdown";
import MEModal from "../Widgets/MEModal";

const getEqData = (eqs) => {
  const labels = getPropsArrayFromJsonArray(eqs || [], "name");
  const values = getPropsArrayFromJsonArray(eqs || [], "id");
  return [labels, values];
};

const findAndSetUnit = ({ id, eqs, setUnit }) => {
  if (!eqs || !setUnit) return;
  if (!id) return setUnit(null); // When the user intentionally chooses null
  const found = eqs?.find((eq) => eq.id === id);
  setUnit(found);
};

const setUnitAsDefault = (unitObj, setInRedux) => {
  if (!unitObj) return;
  setInRedux(unitObj);
  const parsed = JSON.stringify(unitObj || {});
  localStorage.setItem(PREFERRED_EQ, parsed);
};
export default function EquivalenceModal({
  toggleModal,
  eqs,
  pref_eq,
  carbonScore,
  reduxSetPreference,
}) {
  const [chosenUnit, setUnit] = useState(null);
  var unit = chosenUnit || pref_eq;
  const [labels, values] = getEqData(eqs);
  const eqValue = calcEQ(carbonScore, unit?.value);
  return (
    <MEModal
      size="sm"
      contentStyle={{ minWidth: "100%" }}
      closeModal={() => toggleModal(false)}
      style={{ padding: 0 }}
      showCloseBtn={false}
    >
      <div style={{ position: "relative" }}>
        <div style={{ padding: 30 }}>
          <h4>
            <b>EQUIVALENCES</b>
          </h4>

          <h5>See how your carbon footprint measures to other equivalences</h5>
          <MEDropdown
            data={[MEDropdown.NONE, ...labels]}
            dataValues={[null, ...values]}
            value={unit?.name}
            placeholder="Choose equivalence unit..."
            onItemSelected={(item) =>
              findAndSetUnit({ id: item, eqs, setUnit })
            }
          />
          <p style={{ color: "black", marginTop: 10 }}>
            Your Carbon Footprint: <b>{carbonScore} lbs</b>
          </p>

          {unit && (
            <div>
              <p style={{ color: "black", marginTop: 10 }}>
                <b>Is Equivalent to</b>
                <hr />
              </p>
              <p style={{ color: "black", marginTop: 10 }}>
                <span style={{ color: "var(--app-theme-orange)" }}>
                  <i
                    className={`fa ${unit?.icon}`}
                    style={{ marginRight: 8 }}
                  ></i>
                  {unit?.name || "..."}
                </span>
                <i
                  className="fa fa-arrow-right"
                  style={{ marginRight: 8, marginLeft: 8 }}
                ></i>
                <b>
                  {eqValue} ({unit?.title || `Number of ${unit?.name}`})
                </b>
              </p>

              <small>{unit?.explanation}</small>
              <hr />
              {unit?.reference && (
                <>
                  <h6>
                    <b>Source</b>
                  </h6>
                  <a
                    href={`${unit?.reference}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <small>{unit?.reference}</small>
                  </a>
                </>
              )}
            </div>
          )}
        </div>
        <div className="act-status-bar" style={{ position: "relative" }}>
          <div style={{ marginLeft: "auto", marginRight: 0 }}>
            {chosenUnit && (
              <button
                className="flat-btn"
                onClick={() => {
                  setUnitAsDefault(unit, reduxSetPreference);
                  toggleModal(false);
                }}
              >
                Set this unit as your default
              </button>
            )}
            <button
              className="flat-btn close-flat"
              onClick={() => toggleModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </MEModal>
  );
}
