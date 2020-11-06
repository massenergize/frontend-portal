import React from "react";
import { connect } from "react-redux";
import {
  reduxRemoveFromDone,
  reduxRemoveFromTodo,
} from "../../../redux/actions/userActions";
import { getPropsArrayFromJsonArray } from "../../Utils";
import MEButton from "../Widgets/MEButton";
import MECheckBoxGroup from "../Widgets/MECheckBoxGroup";
import { apiCall } from "./../../../api/functions";

/********************************************************************/
/**                        RSVP FORM                               **/
/********************************************************************/

class ChooseHHForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      choice: null,
      toBeRemoved: [],
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.status !== this.props.status) {
      this.setState({ error: null });
    }
  }

  componentDidMount() {
    this.checkForAlreadySelected();
  }
  render() {
    //Dont show anything if the user has only one household
    if (this.props.user && this.props.user.households.length === 1) {
      if (this.props.open) {
        this.handleSubmit(null);
        return <div>Finished!</div>;
      }
    }
    this.checkHouseholds();
    return (
      <>
        {this.props.open ? (
          <div>
            {this.state.error ? (
              <p style={{ color: "#e89898" }}> {this.state.error} </p>
            ) : null}
            <form onSubmit={this.handleSubmit} style={{ paddingBottom: 10 }}>
              {this.renderRadios(this.props.user.households)}
              <div style={{ paddingBottom: 20, paddingTop: 10 }}>
                <MEButton
                  style={{
                    padding: "2px 11px",
                    marginRight: 7,
                    // fontSize: "small",
                  }}
                  type="submit"
                  disabled={
                    this.state.error ? true : !this.state.choice ? true : false
                  }
                >
                  Submit
                </MEButton>
                <MEButton
                  style={{
                    padding: "2px 11px",
                    // fontSize: "small"
                  }}
                  onClick={this.props.closeForm}
                  variation="accent"
                >
                  {" "}
                  Cancel{" "}
                </MEButton>
              </div>
            </form>
          </div>
        ) : null}
      </>
    );
  }

  removeFromCart = (actionRel) => {
    if (!actionRel) return;
    const status = actionRel.status;
    apiCall("users.actions.remove", { user_action_id: actionRel.id }).then(
      (json) => {
        if (json.success) {
          if (status === "TODO") this.props.reduxRemoveFromTodo(actionRel);
          if (status === "DONE") {
            this.props.done.filter((item) => item.id !== actionRel.id);
            this.props.reduxRemoveFromDone(actionRel);
            //this.props.reduxLoadDone(remainder);
          }
        }
      }
    );
  };



  handleSubmit = (event) => {
    const houses = this.props.user.households;
    var choices = this.state.choice;
    if (event) event.preventDefault();
    if (houses.length === 1) {
      choices = [houses[0].id];
    } else {
      if (!this.state.choice) {
        this.setState({
          choice: null,
          error: "Please select a household",
        });
        return;
      }
    }

    if (this.props.status === "TODO") {
      choices.forEach((choice) => {
        if (!this.props.inCart(this.props.aid, choice)) {
          this.props.addToCart(this.props.aid, choice, this.props.status);
          this.props.closeForm();
        }
      });
    } else if (this.props.status === "DONE") {
      choices.forEach((choice) => {
        if (!this.props.inCart(this.props.aid, choice)) {
          this.props.addToCart(this.props.aid, choice, this.props.status);
          this.props.closeForm();
        } else if (this.props.inCart(this.props.aid, choice, "TODO")) {
          this.props.moveToDone(this.props.aid, choice);
          this.props.closeForm();
        }
      });
    }

    this.removeHouseholdsThatWereUnselected();
    this.props.closeForm();
  };

  findTodoOrDoneItem(householdID, status) {
    var { aid, todo, done } = this.props;
    todo = todo || [];
    done = done || [];
    if (status === "DONE") {
      const found = done.filter(
        (item) =>
          item.action.id === aid && item.real_estate_unit.id === householdID
      )[0];
      return found;
    } else {
      const found = todo.filter(
        (item) =>
          item.action.id === aid && item.real_estate_unit.id === householdID
      )[0];
      return found;
    }
    return null;
  }
  removeHouseholdsThatWereUnselected() {
    // check the difference between the selected households on start and now, and remove the ones that the user unchecked
    const { toBeRemoved } = this.state;
    const { status, aid } = this.props;
    // const left = choices && choices.filter( choice => !choicesOnStart.includes(choice));
    toBeRemoved.forEach((choice) => {
      const actionRel = this.findTodoOrDoneItem(choice, status);
      this.removeFromCart(actionRel);
    });
  }

  checkForAlreadySelected() {
    const { status, done, todo, user, selectedAction, aid } = this.props;

    const action = selectedAction || {};
    const households = (user && user.households) || [];
    const choice = [];
    households.forEach(
      (house) =>
        this.props.inCart(aid, house.id, status) && choice.push(house.id)
    );
    this.setState({ choice, choicesOnStart: choice });
    return;
  }
  findAvailableHouses() {
    var households = this.state.choice || [];
    const housesAvailable = [];
    const { status, aid } = this.props;
    for (var i = 0; i < households.length; i++) {
      var household = households[i];
      if (
        (status === "DONE" && !this.props.inCart(aid, household, "DONE")) ||
        (status === "TODO" && !this.props.inCart(aid, household, "TODO"))
      ) {
        housesAvailable.push(household);
      }
    }

    console.log("LE HOUSES", housesAvailable);
    return housesAvailable;
  }
  renderRadios(households) {
    const { status } = this.props;
    if (!households) return <div />;
    var filteredHH = households;
    if (status === "TODO") {
      filteredHH = households.filter(
        (household) => !this.props.inCart(this.props.aid, household.id, "DONE")
      );
    }
    const names = getPropsArrayFromJsonArray(filteredHH, "name");
    const values = getPropsArrayFromJsonArray(filteredHH, "id");
    var stateChoices = this.state.choice || [];
    // remove houses if action is already done  in the household

    return (
      <div
        style={{
          columns: 2,
          textAlign: "left",
          maxWidth: "80%",
          alignContent: "center",
        }}
      >
        <MECheckBoxGroup
          // style={{ height: 400 }}
          fineTuneSquare={{ left: 7, bottom: 8 }}
          data={names}
          dataValues={values}
          value={stateChoices ? stateChoices : []}
          name="hhchoice"
          onItemSelected={this.onChange}
        />
      </div>
    );
  }

  addIn(householdID) {
    var content = this.state.choice;
    if (!content) return null;
    if (content.includes(Number(householdID))) {
      content = content.filter((item) => item !== Number(householdID));
      return content.length > 0 ? content : null;
    } else {
      return [...content, Number(householdID)];
    }
  }
  //updates the state when form elements are changed
  onChange(all, justSelected) {
    const oldChoice = this.state.choice;
    const rem = this.state.toBeRemoved || [];
    // var content = this.state.choice;
    // var init = [Number(value)];
    this.setState({
      error: null,
      choice: all,
      toBeRemoved: oldChoice.includes(justSelected)
        ? [...rem, justSelected]
        : rem, // if the just selected item is inside the state already, it means the user just deselected, so add to removable
    });
  }

  checkHouseholds = () => {
    if (this.props.open) {
      var housesAvailable = [];
      for (var i = 0; i < this.props.user.households.length; i++) {
        var household = this.props.user.households[i];
        if (
          (this.props.status === "DONE" &&
            !this.props.inCart(this.props.aid, household.id, "DONE")) ||
          (this.props.status === "TODO" &&
            !this.props.inCart(this.props.aid, household.id))
        ) {
          housesAvailable.push(household.id);
        }
      }

      if (!this.state.error && !this.state.choice) {
        if (housesAvailable.length === 0) {
          this.setState({
            error: `You have  added this action for all of your households`,
          });
        } else {
          // this.setState({ choice: housesAvailable[0] });
        }
      }
    }
  };
}
const mapStoreToProps = (store) => {
  return {
    todo: store.user.todo,
    done: store.user.done,
  };
};

const mapDispatchToProps = {
  reduxRemoveFromDone,
  reduxRemoveFromTodo,
};

export default connect(mapStoreToProps, mapDispatchToProps)(ChooseHHForm);
