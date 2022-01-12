import React from "react";
import { Link } from "react-router-dom";
// import Tooltip from "./Tooltip";
import { connect } from "react-redux";
import {
  reduxLoadDone,
  reduxMoveToDone,
  reduxRemoveFromTodo,
  reduxRemoveFromDone,
} from "../../redux/actions/userActions";
import {
  reduxChangeData,
  reduxTeamAddAction,
  reduxTeamRemoveAction,
} from "../../redux/actions/pageActions";
import { apiCall } from "../../api/functions";
import MESectionWrapper from "../Pages/Widgets/MESectionWrapper";
import MECard from "../Pages/Widgets/MECard";
// import MEButton from "../Pages/Widgets/MEButton";
// import METextView from "../Pages/Widgets/METextView";
import MELink from "../Pages/Widgets/MELink";

/**
 * Cart component
 * renders a list of actions
 * @props title
 *      action list: title, image, id
 *
 */
class Cart extends React.Component {
  render() {
    return (
      // <!--Cart Outer-->
      <div className="cart-outer mb-5">
        {/* <h3 className="center m-0 cool-font m-cart-header">{this.props.title}</h3> */}
        <MESectionWrapper headerText={this.props.title}>
          <div className="table-outer">
            <table className="cart-table" style={{ width: "100%" }}>
              {this.props.info ? (
                <thead className="cart-header">
                  <tr>
                    <th>Household</th>
                    <th>Action</th>
                    <th>Vendors</th>
                    <th>Vendors' Phone</th>
                    <th>Vendors' Email</th>
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {this.props.info
                  ? this.renderActionsMoreInfo(this.props.actionRels)
                  : this.renderActions(this.props.actionRels)}
              </tbody>
            </table>
          </div>
        </MESectionWrapper>
      </div>
    );
  }
  renderActions(actionRelations) {
    if (!actionRelations || actionRelations.length <= 0) {
      return (
        <tr key="1">
          <td colSpan="100%">
            <p
              className="m-0 p-2 w-100 text-center cool-font"
              style={{ fontSize: "1rem" }}
            >
              Nothing here, yet! See all{" "}
              <Link to={this.props.links.actions}> actions </Link>
            </p>
          </td>
        </tr>
      );
    }
    //returns a list of action components
    return Object.keys(actionRelations).map((key) => {
      var actionRel = actionRelations[key];
      var action = actionRel.action;
      var houseHold = actionRel.real_estate_unit;
      return (
        <div key={key.toString()}>
          <div>
            <MECard
              style={{ borderRadius: 10, padding: 10, fontSize: ".9rem" }}
            >
              <MELink to={`${this.props.links.actions}/${action.id}`}>
                {action.title}
                {houseHold && houseHold.name && (
                  <small style={{ display: "block" }}>
                    Household: {houseHold.name}
                  </small>
                )}
              </MELink>
              <div className="">
                {actionRel.status.toLowerCase() === "todo" ? (
                  <>
                    <a
                      href="##"
                      onClick={(e) => {
                        e.preventDefault();
                        this.moveToDone(actionRel);
                      }}
                      style={{ fontSize: ".8rem" }}
                    >
                      Done It
                    </a>
                    <a
                      href="##"
                      onClick={(e) => {
                        e.preventDefault();
                        this.removeFromCart(actionRel);
                      }}
                      style={{ fontSize: ".8rem", marginLeft:15, color:"maroon" }}
                    >
                      Remove
                    </a>
                  </>
                ) : (
                  <a
                    href="##"
                    onClick={(e) => {
                      e.preventDefault();
                      this.removeFromCart(actionRel);
                    }}
                    style={{ fontSize: ".8rem", color:"maroon" }}
                  >
                    Remove
                  </a>
                )}
              </div>
            </MECard>
          </div>
        </div>
      );
    });
  }

  renderActionsMoreInfo(actionRelations) {
    if (!actionRelations || actionRelations.length <= 0) {
      return (
        <tr key="1">
          <td colSpan="100%">
            <p
              className="m-0 p-2 w-100 text-center cool-font"
              style={{ fontSize: "1rem" }}
            >
              Nothing here, yet! See all{" "}
              <Link to={this.props.links.actions}> actions </Link>
            </p>
          </td>
        </tr>
      );
    }

    //returns a list of action components
    return Object.keys(actionRelations).map((key) => {
      var actionRel = actionRelations[key];
      var action = actionRel.action;
      return (
        <tr key={key}>
          <td>
            <div className="column-box">
              <p>{actionRel.real_estate_unit.name}</p>
            </div>
          </td>
          <td className="prod-column">
            <div className="column-box">
              <h4>{action.title}</h4>
            </div>
          </td>
          <td className="prod-column">
            <div className="column-box">
              {action.vendors
                ? Object.keys(action.vendors).map((key) => {
                    return <p> {action.vendors[key].name} </p>;
                  })
                : "MassEnergize"}
            </div>
          </td>
          <td className="prod-column">
            <div className="column-box">
              {action.vendors
                ? Object.keys(action.vendors).map((key) => {
                    return (
                      <p>
                        {" "}
                        {
                          <p>
                            {" "}
                            {action.vendors[key]
                              ? action.vendors[key].phone_number
                              : null}{" "}
                          </p>
                        }{" "}
                      </p>
                    );
                  })
                : "123-456-7890"}
            </div>
          </td>
          <td className="prod-column">
            <div className="column-box">
              {action.vendors
                ? Object.keys(action.vendors).map((key) => {
                    return (
                      <p>
                        {" "}
                        {
                          <p>
                            {" "}
                            {action.vendors[key]
                              ? action.vendors[key].email
                              : null}{" "}
                          </p>
                        }{" "}
                      </p>
                    );
                  })
                : "info@massenergize.org"}
            </div>
          </td>
        </tr>
      );
    });
  }

  // NOTE: Routine currently duplicated in ActionsPage, OneActionPage, Cart - preserve same functionality in each
  // except this version doesn't allow action date to be set
  moveToDone = (actionRel) => {
    const body = {
      user_id: this.props.user.id,
      action_id: actionRel.action.id,
      household_id: actionRel.real_estate_unit.id,
    };
    apiCall("users.actions.completed.add", body)
      .then((json) => {
        if (json.success) {
          this.props.reduxMoveToDone(json.data);
          this.setState({ testimonialLink: actionRel.action.id });
        } else {
          console.log(json.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // NOTE: This routine currently duplicated in ActionCard, ChooseHHForm, OneActionPage, Cart
  // any changes need to be same in all 4 locations
  removeFromCart = (actionRel) => {
    const status = actionRel.status;
    apiCall("users.actions.remove", { user_action_id: actionRel.id }).then(
      (json) => {
        if (json.success) {
          if (status === "TODO") this.props.reduxRemoveFromTodo(actionRel);
          if (status === "DONE") {
            const remainder = this.props.actionRels.filter(
              (item) => item.id !== actionRel.id
            );
            this.props.reduxRemoveFromDone(actionRel);
            this.props.reduxLoadDone(remainder);
          }
        }
      }
    );
  };
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    todo: store.user.todo,
    done: store.user.done,
    communityRawData: store.page.communityData,
    communityData: store.page.communityData
      ? store.page.communityData.data
      : null,
    links: store.links,
  };
};

const mapDispatchToProps = {
  reduxLoadDone,
  reduxMoveToDone,
  reduxRemoveFromTodo,
  reduxRemoveFromDone,
  reduxChangeData,
  reduxTeamAddAction,
  reduxTeamRemoveAction,
};

export default connect(mapStoreToProps, mapDispatchToProps)(Cart);
