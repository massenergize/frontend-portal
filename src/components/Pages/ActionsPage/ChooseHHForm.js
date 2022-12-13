import React from "react";
import { connect } from "react-redux";
import {
  reduxRemoveFromDone,
  reduxRemoveFromTodo,
} from "../../../redux/actions/userActions";
import { getPropsArrayFromJsonArray } from "../../Utils";
import MECheckBoxGroup from "../Widgets/MECheckBoxGroup";
import METextView from "../Widgets/METextView";
import { apiCall } from "./../../../api/functions";
import "react-datepicker/dist/react-datepicker.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Dropdown } from "react-bootstrap";
import moment from "moment";

//Initializing the choice variables for later reassignment
var Choice1 = "";
var Choice2 = "";
var Choice3 = "";
var Choice4 = "";

class ChooseHHForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SelectedCompStatus: null,
      DatesOnStart: {},
      Dates: {},
      error: null,
      choice: null,
      toBeRemoved: [],
    };
    this.onChange = this.onChange.bind(this);
    this.ChangeCompDate = this.ChangeCompDate.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.status !== this.props.status) {
      this.setState({ error: null });
    }
  }
  RenderChoices() {
    //depending on the status and date, you can dynamicly building out the menu. As the years change, you don't have to change it manually
    if (this.props.status === "DONE") {
      Choice1 = "Just completed it!";
      Choice2 = "Earlier this year (" + moment().format("YYYY") + ")";
      Choice3 =
        "Last year (" + moment().subtract(1, "years").format("YYYY") + ")";
      Choice4 = "Before last year";
    } else if (this.props.status === "TODO") {
      Choice1 = "Very Soon";
      Choice2 =
        "Later this year (" + moment().add(3, "months").format("YYYY") + ")";
      Choice3 = "Next Few Years";
      Choice4 = "Not planning but interested";
    }
  }

  componentDidMount() {
    this.RenderChoices();
    this.checkForAlreadySelected();
  }

  render() {
    // Remove this check; if all households had action done, allow setting date.  this.checkHouseholds();
    return (
      <>
        <div className="act-modal-whole test-action-modal">
          <div className="act-title-bar">
            <h3>{this.props.action.title}</h3>
          </div>

          <div className="act-modal-body">
            {this.props.open ? (
              <div>
                {this.state.error && (
                  <METextView
                    mediaType="icon"
                    icon="fa fa-exclamation"
                    className="act-error"
                    containerStyle={{ display: "block" }}
                  >
                    {this.state.error}
                  </METextView>
                )}
                <form
                  className="choose-hh-form"
                  onSubmit={this.handleSubmit}
                  style={{ paddingBottom: 10 }}
                >
                  <small style={{ padding: "10px 15px", color: "grey" }}>
                    Click "Apply" after making changes
                  </small>
                  {this.renderHouseHoldsInLine(this.props.user.households)}
                  <div className="act-status-bar">
                    <h4
                      style={{
                        margin: 20,
                        fontWeight: "bold",
                        color: "green",
                        textTransform: "capitalize",
                        fontSize: 18,
                      }}
                    >
                      {this.props.status}
                    </h4>
                    <div style={{ marginLeft: "auto", marginRight: 0 }}>
                      <button
                        className="flat-btn  flat-btn_submit btn-success test-modal-submit"
                        type="submit"
                        disabled={
                          this.state.error
                            ? true
                            : !this.state.choice
                            ? true
                            : false
                        }
                      >
                        Apply
                      </button>
                      <button
                        className="flat-btn close-flat"
                        onClick={this.props.closeForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  }

  // NOTE: This routine currently duplicated in ActionCard, ChooseHHForm, OneActionPage, Cart
  // any changes need to be same in all 4 locations
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
          }
        }
      }
    );
  };

  handleSubmit = (event) => {
    const houses = this.props.user.households;
    var choices = this.state.choice;
    const actionId = this.props.aid;
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
      choices &&
        choices.forEach((choice) => {
          const dateChanged =
            this.state.Dates[choice] !== this.state.DatesOnStart[choice];
          if (!this.props.inCart(actionId, choice) || dateChanged) {
            //if user selects diff date, it will submit to backend
            const date =
              this.state.Dates[choice] !== undefined
                ? this.state.Dates[choice][0]
                : "";
            this.props.addToCart(actionId, choice, this.props.status, date);
            this.props.closeForm();
          }
        });
    } else if (this.props.status === "DONE") {
      choices &&
        choices.forEach((choice) => {
          const date =
            this.state.Dates[choice] !== undefined
              ? this.state.Dates[choice][0]
              : "";
          const dateChanged =
            this.state.Dates[choice] !== this.state.DatesOnStart[choice];
          const wasInDone = this.props.inCart(actionId, choice, "DONE");

          if (
            !this.props.inCart(actionId, choice) ||
            (wasInDone && dateChanged)
          ) {
            //if user selects diff date, it will submit to backend
            this.props.addToCart(actionId, choice, this.props.status, date);
            this.props.closeForm();
          } else if (this.props.inCart(actionId, choice, "TODO")) {
            this.props.moveToDone(actionId, choice, date);
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
  }

  removeHouseholdsThatWereUnselected() {
    // check the difference between the selected households on start and now, and remove the ones that the user unchecked
    const { toBeRemoved } = this.state;
    const { status } = this.props;
    // const left = choices && choices.filter( choice => !choicesOnStart.includes(choice));
    toBeRemoved.forEach((choice) => {
      const actionRel = this.findTodoOrDoneItem(choice, status);
      this.removeFromCart(actionRel);
    });
  }

  checkForAlreadySelected() {
    //Gets house IDs to build out date object
    const BuildDates = (HouseID) => {
      Dates[HouseID] = -1;
    };
    const { status, user, aid, done, todo } = this.props;

    // const action = selectedAction || {};
    const households = (user && user.households) || [];
    const choice = [];
    const Dates = {};

    households.forEach((house) => {
      this.props.inCart(aid, house.id, status) &&
        choice.push(house.id) &&
        BuildDates(house.id);
    });
    if (status === "TODO") {
      (todo || []).forEach((todo) => {
        //this if statement populates the data only for the selected action and households
        if (
          todo.date_completed &&
          Dates[todo.real_estate_unit.id] === -1 &&
          aid === todo.action.id
        ) {
          //function that dynamicly updates the selected option. Reason being is because if a user selects just completed it, a year later that option would have to reflect a
          //different value
          var DropdownHeader = () => {
            var Diff = moment().diff(todo.date_completed, "days");
            var CompYear = moment(todo.date_completed).year();
            var CurrYear = moment().year();
            if (Diff <= 90 && Diff >= 0 && CompYear === CurrYear) {
              return Choice1;
            } else if (Diff < 0 && CompYear === CurrYear) {
              return Choice2;
            } else if (CompYear - CurrYear === 1) {
              return Choice3;
            } else if (CompYear - CurrYear >= 2) {
              return Choice4;
            }
          };
          Dates[todo.real_estate_unit.id] = [
            todo.date_completed.substring(0, todo.date_completed.length),
            DropdownHeader(),
          ];
        }
      });
    } else {
      (done || []).forEach((done) => {
        //this if statement populates the date data only for a the selected action and households
        if (
          done.date_completed &&
          Dates[done.real_estate_unit.id] === -1 &&
          aid === done.action.id
        ) {
          //function that dynamicly updates the selected option. Reason being is because if a user selects just completed it, a year later that option would have to reflect a
          //different value
          var DropdownHeader = () => {
            var Diff = moment().diff(done.date_completed, "days");
            var CompYear = moment(done.date_completed).year();
            var CurrYear = moment().year();
            if (Diff <= 2 && CompYear === CurrYear) {
              return Choice1;
            } else if (
              (Diff > 90 && CompYear === CurrYear) ||
              done.date_completed === "2022-01-01"
            ) {
              return Choice2;
            } else if (CurrYear - CompYear === 1) {
              return Choice3;
            } else if (CurrYear - CompYear <= 2) {
              return Choice4;
            }
          };
          Dates[done.real_estate_unit.id] = [
            done.date_completed.substring(0, done.date_completed.length),
            DropdownHeader(),
          ];
        }
      });
    }

    //creates an orginal for comparison later to determine what dates changed to submit to backend
    var DatesOnStart = { ...Dates };
    this.setState({
      choice,
      choicesOnStart: choice,
      Dates,
      DatesOnStart: DatesOnStart,
    });
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
    return housesAvailable;
  }

  //function that sets the value of the completion date depending on the time of year and option selected
  ChangeCompDate(CompStatus, choice) {
    const { status } = this.props;
    var Dates = this.state.Dates;
    if (status === "TODO") {
      switch (CompStatus) {
        case Choice1:
          Dates[choice] = [moment().format("YYYY-MM-DD"), Choice1];
          break;
        case Choice2:
          //if option selected in Jan,Feb, or March it will default to the beginning of the year else it will subtract 3 months from current date
          if (moment().dayOfYear() < 90) {
            Dates[choice] = [
              moment().endOf("year").format("YYYY-MM-DD"),
              Choice2,
            ];
          } else {
            Dates[choice] = [
              moment().add(3, "months").format("YYYY-MM-DD"),
              Choice2,
            ];
          }
          break;
        case Choice3:
          Dates[choice] = [
            moment().add(1, "years").format("YYYY-MM-DD"),
            Choice3,
          ];
          break;
        case Choice4:
          Dates[choice] = [
            moment().add(10, "years").format("YYYY-MM-DD"),
            Choice4,
          ];
          break;
        default:
          break;
      }
    } else {
      switch (CompStatus) {
        case Choice1:
          Dates[choice] = [moment().format("YYYY-MM-DD"), Choice1];
          break;
        case Choice2:
          //if option selected in Jan,Feb, or March it will default to the beginning of the year else it will subtract 3 months from current date
          if (moment().dayOfYear() < 90) {
            Dates[choice] = [
              moment().startOf("year").format("YYYY-MM-DD"),
              Choice2,
            ];
          } else {
            Dates[choice] = [
              moment().subtract(3, "months").format("YYYY-MM-DD"),
              Choice2,
            ];
          }
          break;
        case Choice3:
          Dates[choice] = [
            moment().subtract(1, "years").format("YYYY-MM-DD"),
            Choice3,
          ];
          break;
        case Choice4:
          Dates[choice] = [
            moment().subtract(2, "years").format("YYYY-MM-DD"),
            Choice4,
          ];
          break;
        default:
          break;
      }
    }

    this.setState({
      Dates: Dates,
      SelectedCompStatus: CompStatus,
    });
  }

  renderHouseHoldsInLine(households) {
    const { status } = this.props;
    const { Dates } = this.state;
    const month = moment().format("MM");
    const IS_DONE = status === "DONE";
    const IS_IN_TODO = status === "TODO";

    if (!households) return <div />;
    var filteredHH = households;
    const userHasOnlyOneHouse = households?.length === 1;
    // if (IS_DONE) {
    //   filteredHH = households.filter(
    //     (household) => !this.props.inCart(this.props.aid, household.id, "DONE")
    //   );
    // }

    const names = getPropsArrayFromJsonArray(filteredHH, "name");
    //fixes a UI bug where if there are multiple houses, the last house gets cut off by the submitt button
    names.push("TestData");

    const values = getPropsArrayFromJsonArray(filteredHH, "id");
    return names.map((name, index) => {
      const all = this.state.choice || [];
      const selected = all.includes(values[index]);
      //when its done rendering the household lines, this puts some padding at the end so the submit button does not cut off the last house
      if (name === "TestData") {
        return (
          <div key={index?.toString()}>
            <br /> <br /> <br /> <br />
          </div>
        );
      }
      const toolTipText = IS_IN_TODO
        ? "When are you planning to complete the action?"
        : "When did you complete this action?";

      return (
        <div id="act-item-Container">
          {userHasOnlyOneHouse && !selected ? (
            <div className={`act-item`} key={index.toString()}>
              <p>{toolTipText}</p>
            </div>
          ) : (
            <div
              className={`act-item test-one-house`}
              onClick={() => this.onChange(values[index])}
              key={index.toString()}
            >
              <div
                className={`act-rect ${
                  selected ? "act-selected" : ""
                } test-household-uncheck-div`}
              ></div>
              <p>{userHasOnlyOneHouse ? "Uncheck this to remove" : name}</p>
            </div>
          )}
          {IS_DONE || IS_IN_TODO ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{toolTipText}</Tooltip>}
            >
              <div id="CompletionDate">
                <Dropdown>
                  <Dropdown.Toggle
                    className="test-modal-dropdown"
                    id="dropdown-button-dark-example1"
                    variant="success"
                    style={{ fontSize: 13 }}
                  >
                    {/*Show choice if value not -1 (selected choice but no selected date) or choice wasnt selected */}
                    {[-1, undefined, null].includes(Dates[values[index]])
                      ? "Completion Date"
                      : Dates[values[index]][1]}
                  </Dropdown.Toggle>

                  <Dropdown.Menu variant="dark">
                    <Dropdown.Item
                      className="test-one-modal-drop-item"
                      onClick={() =>
                        this.ChangeCompDate(Choice1, values[index])
                      }
                    >
                      {" "}
                      {Choice1}{" "}
                    </Dropdown.Item>
                    {(IS_DONE && month === "01") ||
                    (IS_IN_TODO && month === "12") ? (
                      <div />
                    ) : (
                      <Dropdown.Item
                        onClick={() =>
                          this.ChangeCompDate(Choice2, values[index])
                        }
                      >
                        {Choice2}
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item
                      onClick={() =>
                        this.ChangeCompDate(Choice3, values[index])
                      }
                    >
                      {Choice3}{" "}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        this.ChangeCompDate(Choice4, values[index])
                      }
                    >
                      {Choice4}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </OverlayTrigger>
          ) : (
            <div />
          )}
        </div>
      );
    });
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
        className="mob-check-fix"
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

  //Updates current date as it changes
  onChangeDate(Date, choice) {
    var Dates = this.state.Dates;
    Dates[choice] = Date.target.value;
    this.setState({
      Dates: Dates,
    });
  }
  //updates the state when form elements are changed
  // if selected exists, remove from selected, and add to the list of "tobeRemoved"
  onChange(justSelected) {
    const oldChoices = this.state.choice || [];
    const exists = oldChoices.includes(justSelected);
    const updatedChoices = exists
      ? oldChoices.filter((id) => id !== justSelected)
      : [...oldChoices, justSelected];
    const rem = this.state.toBeRemoved || [];
    // var content = this.state.choice;
    // var init = [Number(value)];
    this.setState({
      error: null,
      choice: updatedChoices,
      toBeRemoved: exists ? [...rem, justSelected] : rem, // if the just selected item is inside the state already, it means the user just deselected, so add to removable
    });
  }

  // NOTE: this routine is not currently used
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
            error: `You have added this action for all of your households`,
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
