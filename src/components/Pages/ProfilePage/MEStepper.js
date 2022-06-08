import React from "react";

function MEStepper({ steps, checked, active }) {
  if (!steps || !steps.length) return <> </>;
  return (
    <div className="stepper-container">
      {steps.map((step, index) => {
        const lastItem = index === steps.length - 1;
        const isActive = step.key === active;
        const isChecked = (checked || []).includes(step.key);
        return (
          <React.Fragment key={index.toString()}>
            <div className="step-wrap">
              <div
                className={`stepper-ball z-depth-1 ${
                  isActive || isChecked ? "stepper-ball-has-state " : ""
                }`}
              >
                {isChecked ? (
                  <span className="fa fa-check"></span>
                ) : (
                  <small>{index + 1}</small>
                )}
              </div>
              <small className="step-name">{step.name}</small>
            </div>
            {!lastItem && <div className="stepper-line"></div>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default MEStepper;
