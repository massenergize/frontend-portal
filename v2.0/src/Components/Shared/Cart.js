import React from "react";
import { Link } from "react-router-dom";
import Tooltip from "./Tooltip";
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
import MEButton from "../Pages/Widgets/MEButton";
import METextView from "../Pages/Widgets/METextView";
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
      return (
        <div key={key.toString()}>
          <div>
            <MECard
              style={{ borderRadius: 10, padding: 10, fontSize: ".9rem" }}
            >
              <MELink to={`${this.props.links.actions}/${action.id}`}>
                {action.title}
                &nbsp;
              </MELink>
              <div className="">
                {actionRel.status.toLowerCase() === "todo" ? (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      this.moveToDone(actionRel);
                    }}
                    style={{ fontSize: ".8rem" }}
                  >
                    Done It
                  </a>
                ) : (
                  // <MEButton
                  //   onClick={() => this.moveToDone(actionRel)}
                  //   icon="fa fa-check"
                  //   iconStyle={{ margin: 0 }}
                  //   iconSize="large"
                  //   style={{ padding: "4px 8px" }}
                  // />
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      this.removeFromCart(actionRel);
                    }}
                    style={{ fontSize: ".8rem" }}
                  >
                    Remove
                  </a>
                  // <MEButton
                  //   onClick={() => this.removeFromCart(actionRel)}
                  //   className="me-delete-btn"
                  //   icon="fa fa-trash"
                  //   iconStyle={{ margin: 0 }}
                  //   iconSize="large"
                  //   style={{ padding: "4px 8px" }}
                  // />
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
          this.addToImpact(json.data.action);
          this.setState({ testimonialLink: actionRel.action.id });
        } else {
          console.log(json.error);
        }
        //just update the state here
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
            //this.removeFromImpact(actionRel.action);
            this.props.reduxLoadDone(remainder);
            //window.location.reload();
          }
        }
      }
    );
  };

  removeFromImpact = (action) => {
    this.changeDataByName("ActionsCompletedData", -1);
    action.tags.forEach((tag) => {
      if (tag.tag_collection && tag.tag_collection.name === "Category") {
        this.changeData(tag.id, -1);
      }
    });
    Object.keys(this.props.user.teams).forEach((key) => {
      this.props.reduxTeamRemoveAction(this.props.user.teams[key]);
    });
  };
  addToImpact(action) {
    this.changeDataByName("ActionsCompletedData", 1);
    action.tags.forEach((tag) => {
      if (tag.tag_collection && tag.tag_collection.name === "Category") {
        this.changeData(tag.id, 1);
      }
    });
    Object.keys(this.props.user.teams).forEach((key) => {
      this.props.reduxTeamAddAction(this.props.user.teams[key]);
    });
  }
  changeDataByName(name, number) {
    var data = this.props.communityData.filter((data) => {
      return data.name === name;
    })[0];

    const body = {
      data_id: data.id,
      value: data.value + number > 0 ? data.value + number : 0,
    };
    apiCall("data.update", body).then((json) => {
      if (json.success) {
        data = {
          ...data,
          value: data.value + number > 0 ? data.value + number : 0,
        };
        this.props.reduxChangeData(data);
      }
    });
  }
  changeData = (tagid, number) => {
    var data = this.props.communityData.filter((data) => {
      if (data.tag) {
        return data.tag === tagid;
      }
      return false;
    })[0];
    if (!data) {
      console.log("no data stored for tag " + tagid);
      return;
    }
    const body = {
      data_id: data.id,
      value: data.value + number > 0 ? data.value + number : 0,
    };
    apiCall("data.update", body).then((json) => {
      if (json.success) {
        data = {
          ...data,
          value: data.value + number > 0 ? data.value + number : 0,
        };
        this.props.reduxChangeData(data);
      }
    });
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
