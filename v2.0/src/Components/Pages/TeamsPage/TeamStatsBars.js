import React from "react";
import { calcEQ } from "../../Utils";
export const DEFAULT = "DEFAULT";
export const PACKED = "PACKED";
class TeamStatsBars extends React.Component {
  render() {
    const { teamStats, type, pref_eq } = this.props;

    let membersJSX, actionsJSX, carbonJSX;

    if (!teamStats) {
      membersJSX =
        actionsJSX =
        carbonJSX =
          (
            <p style={{ color: "darkgray" }}>
              {" "}
              stats will display after team approval
            </p>
          );
    } else {
      const actions = teamStats.actions_completed;
      const carbonSaved = teamStats.carbon_footprint_reduction;

      let actionsPerMember, carbonSavedPerMember;
      const members = teamStats.members;

      if (members !== 0) {
        if (actions !== 0) {
          actionsPerMember = actions / members;
          actionsPerMember =
            actionsPerMember % 1 !== 0
              ? Number(actionsPerMember.toFixed(1))
              : Number(actionsPerMember.toFixed(0));
        }
        if (carbonSaved !== 0) {
          carbonSavedPerMember = Number((carbonSaved / members).toFixed(0));
        }
      }
      membersJSX = (
        <p>
          <span className="phone-vanish">
            <b>{members.toLocaleString()}</b> member{members !== 1 && "s"}
          </span>
          <span className="pc-vanish" style={{ fontSize: 10 }}>
            <b>{members.toLocaleString()}</b> member{members !== 1 && "s"}
          </span>
        </p>
      );

      actionsJSX = (
        <p>
          <span className="phone-vanish">
            <b>{actions.toLocaleString()}</b> action{actions !== 1 && "s"}{" "}
            completed
            {actionsPerMember && (
              <span>
                {" "}
                (<b>{actionsPerMember.toLocaleString()}</b> / member)
              </span>
            )}
          </span>
          <span className="pc-vanish" style={{ fontSize: 10 }}>
            <b>{actions.toLocaleString()}</b> act. comp.
            {actionsPerMember && (
              <span>
                {" "}
                (<b>{actionsPerMember.toLocaleString()}</b>/mem)
              </span>
            )}
          </span>
        </p>
      );

      const eqValue = {
        saved: calcEQ(carbonSaved, pref_eq?.value),
        perMember: calcEQ(carbonSavedPerMember, pref_eq?.value),
      };
      carbonJSX = (
        <p>
          <span className="phone-vanish">
            <b>{(pref_eq && eqValue.saved) || carbonSaved.toLocaleString()}</b>{" "}
            {(pref_eq && (pref_eq?.title || `Number of ${pref_eq?.name}`)) || (
              <>
                lb{carbonSaved !== 1 && "s"}.<b> C</b>.
              </>
            )}
            {carbonSavedPerMember && (
              <span>
                {" "}
                (
                <b>
                  {(pref_eq && eqValue.perMember) ||
                    carbonSavedPerMember.toLocaleString()}
                </b>{" "}
                / member)
              </span>
            )}
          </span>
          <span className="pc-vanish" style={{ fontSize: 10 }}>
            {" "}
            <b>
              {(pref_eq && eqValue.saved) || carbonSaved.toLocaleString()}
            </b>{" "}
            {(pref_eq && (
              <i
                className={` fa ${pref_eq?.icon}`}
                style={{ marginRight: 3 }}
              ></i>
            )) || (
              <>
                lb{carbonSaved !== 1 && "s"}.<b> C</b>. saved
              </>
            )}
            {carbonSavedPerMember && (
              <span>
                (
                <b>
                  {(pref_eq && eqValue.perMember) ||
                    carbonSavedPerMember.toLocaleString()}
                </b>
                /mem)
              </span>
            )}
          </span>
        </p>
      );
    }

    return (
      <>
        {type === DEFAULT && (
          <div className="team-card-content">
            <div className="info-section members">{membersJSX}</div>
            <div
              className="info-section data"
              style={{ background: "#fce6c0" }}
            >
              {actionsJSX}
            </div>
            <div className="info-section data">{carbonJSX}</div>
          </div>
        )}

        {type === PACKED && (
          <div className="row" style={{ padding: "0px 10px" }}>
            <div className="stats-bar-container z-depth-sticker">
              <div
                className="stats-q-box"
                style={{
                  background: "#fafbf8",
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
                }}
              >
                {membersJSX}
              </div>
              <div
                className="stats-q-box"
                style={{ background: "rgb(252, 230, 192)" }}
              >
                {actionsJSX}
              </div>
              <div
                className="stats-q-box"
                style={{
                  background: "#f2ffe0",
                  borderTopRightRadius: 6,
                  borderBottomRightRadius: 6,
                }}
              >
                {carbonJSX}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

TeamStatsBars.defaultProps = {
  type: DEFAULT,
};
export default TeamStatsBars;
