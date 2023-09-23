import React from "react";
import { calcEQ, sumOfCarbonScores } from "../../Utils";

function ActionMobileStats({ todo, done, user, eq }) {
  const thereHasBeenNoActivity = !todo?.length && !done?.length;
  if (!user || thereHasBeenNoActivity) return <></>;

  const doneCount = done?.length || 0;
  const todoCount = todo?.length || 0;
  //console.log("=== eq ==", eq);
  const treeEq = eq?.find((_eq) => _eq.name.toLowerCase().trim() === "trees");
  const doneValue = calcEQ(sumOfCarbonScores(done), treeEq?.value) || 0;
  const todoValue = calcEQ(sumOfCarbonScores(todo), treeEq?.value) || 0;

  return (
    <div className="action-mob-stats-container pc-vanish stick-mob-stats z-depth-1 tablet-force-show">
      <div className="act-stats-item">
        <small>
          DONE: <b>{doneCount}</b>
        </small>
        {treeEq && (
          <small className="stats-eq">
            <i className={`fa ${treeEq?.icon}`} />{" "}
            <b>
              {doneValue} {treeEq?.name || "..."}
            </b>
          </small>
        )}
      </div>
      <div className="act-stats-item">
        <small>
          TODO: <b>{todoCount}</b>
        </small>
        {treeEq && (
          <small className="stats-eq">
            <i className={`fa ${treeEq?.icon}`} />{" "}
            <b>
              {todoValue} {treeEq?.name || "..."}
            </b>
          </small>
        )}
      </div>
    </div>
  );
}

export default ActionMobileStats;
