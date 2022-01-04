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
import { Dropdown } from 'react-bootstrap';
import moment from "moment";

//Initializing the choice variables for later reassignment
var Choice1 = ""
var Choice2 = ""
var Choice3 = ""
var Choice4 = ""

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
    this.ChangeCompDate = this.ChangeCompDate.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.status !== this.props.status) {
      this.setState({ error: null });
    }
  }
	RenderChoices() {		
//depending on the status and date, you can dynamicly building out the menu. As the years change, you don't have to change it manually
	if (this.props.status === "DONE") {
	 Choice1 =  "Just completed it!"
	 Choice2 =  "Earlier this year (" + moment().format('YYYY') + ")"
	 Choice3 =  "Last year (" + moment().subtract(1,"years").format("YYYY") + ")"
	 Choice4 =  "Before last year (" + moment().subtract(2,"years").format("YYYY") + ")"
} else if (this.props.status === "TODO") {
		 Choice1 =  "Very Soon"
		 Choice2 =  "Later this year (" + moment().add(3,"months").format("YYYY") + ")"
		 Choice3 =  "Next Few Years (" + moment().add(1,"years").format("YYYY") + ")"
		 Choice4 =  "Not planning but interested (" + moment().add(10,"years").format("YYYY") + ")"
	}
	}

  componentDidMount() {
    this.RenderChoices()
	this.checkForAlreadySelected();
		
  }

  render() {
    //I modified an existing modal to hide some elements if status is done and has single household instead of multiple
    var IsSingleHouse = this.props.user && this.props.user.households.length === 1 && this.props.open && this.props.status === 'DONE'
    this.checkHouseholds();
    return (
      <>
        <div className="act-modal-whole">
          <div className="act-title-bar">
            <h3>{IsSingleHouse ? "Please select when this action was completed":this.props.action.title}</h3>
          </div>

          <div className="act-modal-body">
            {this.props.open ? (
              <div>
                {this.state.error ? (
                  <METextView
                    mediaType="icon"
                    icon="fa fa-exclamation"
                    className="act-error"
                    containerStyle={{ display: "block" }}
                  >
                    {this.state.error}
                  </METextView>
                ) : null}
                <form
                  onSubmit={this.handleSubmit}
                  style={{ paddingBottom: 10 }}
                >
                  {this.renderHouseHoldsInLine(this.props.user.households, IsSingleHouse)}
                  <div className="act-status-bar">
                    <h4
                      style={{
                        margin: 20,
                        fontWeight: "bold",
                        color: "green",
                        textTransform: "capitalize",
                      }}
                    >
                      {IsSingleHouse ? "" :this.props.status}
                    </h4>
                    <div style={{ marginLeft: "auto", marginRight: 0 }}>
                      <button
                        className="flat-btn  flat-btn_submit btn-success"
                        type="submit"
                        disabled={
                          this.state.error
                            ? true
                            : !this.state.choice
                            ? true
                            : false
                        }
                      >
                        Submit
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
        if (!this.props.inCart(this.props.aid, choice) ||
				//if user selects diff date, it will submit to backend
				this.state.Dates[choice] !== this.state.DatesOnStart[choice]) {
          this.props.addToCart(this.props.aid, choice, this.props.status,this.state.Dates[choice][0]);
          this.props.closeForm();
        }
      });
    } else if (this.props.status === "DONE") {
      choices.forEach((choice) => {
        if (
          !this.props.inCart(this.props.aid, choice) ||
          //if user selects diff date, it will submit to backend
          this.state.Dates[choice] !== this.state.DatesOnStart[choice]
        ) {
          this.props.addToCart(
            this.props.aid,
            choice,
            this.props.status,
            this.state.Dates[choice][0]
          );
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
			todo.forEach((todo) => {
				//this if statement populates the data only for the selected action and households 
				if (todo.date_completed && Dates[todo.real_estate_unit.id] === -1 && aid === todo.action.id) {
					//function that dynamicly updates the selected option. Reason being is because if a user selects just completed it, a year later that option would have to reflect a
					//different value
					var DropdownHeader = () => {
						var Diff = moment().diff(todo.date_completed, "days")
						var CompYear = moment(todo.date_completed).year()
						var CurrYear = moment().year()
						if (Diff <= 90 && Diff >= 0 && CompYear === CurrYear) {
							return Choice1
						} else if (Diff < 0 && CompYear === CurrYear) {
							return Choice2
						} else if (CompYear  - CurrYear  === 1) {
							return Choice3
						} else if (CompYear  - CurrYear  >= 2) {
							return Choice4
						}
					}
					Dates[todo.real_estate_unit.id] = [todo.date_completed.substring(
							0,
							todo.date_completed.length
						),
						DropdownHeader()
					];
				}
			})
		} else {
			done.forEach((done) => {
				//this if statement populates the date data only for a the selected action and households 
				if (done.date_completed && Dates[done.real_estate_unit.id] === -1 && aid === done.action.id) {
					//function that dynamicly updates the selected option. Reason being is because if a user selects just completed it, a year later that option would have to reflect a
					//different value
					var DropdownHeader = () => {
						var Diff = moment().diff(done.date_completed, "days")
						var CompYear = moment(done.date_completed).year()
						var CurrYear = moment().year()
						if (Diff <= 2 && CompYear === CurrYear) {
							return Choice1
						} else if ((Diff > 90 && CompYear === CurrYear) || done.date_completed === '2022-01-01') {
							return Choice2
						} else if (CurrYear - CompYear === 1) {
							return Choice3
						} else if (CurrYear - CompYear <= 2) {
							return Choice4
						}
					}
					Dates[done.real_estate_unit.id] = [done.date_completed.substring(
							0,
							done.date_completed.length 
						),
						DropdownHeader()
					];
				}
			});
		}

    //creates an orginal for comparison later to determine what dates changed to submit to backend
    var DatesOnStart = { ...Dates };
    this.setState({ choice, choicesOnStart: choice, Dates, DatesOnStart: DatesOnStart });
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
        
				const {status} = this.props
		    var Dates = this.state.Dates;
        
				if (status === "TODO") {
					switch(CompStatus) {
						case Choice1:
							Dates[choice] = [moment().format('YYYY-MM-DD'),Choice1]
							break;
						case Choice2:
						//if option selected in Jan,Feb, or March it will default to the beginning of the year else it will subtract 3 months from current date
							if (moment().dayOfYear() < 90) {
								Dates[choice] = [moment().endOf('year').format("YYYY-MM-DD"),Choice2 ] 
							} else {
								Dates[choice] = [moment().add(3,"months").format('YYYY-MM-DD'),Choice2]
							}
							break
						case Choice3:
							Dates[choice] = [moment().add(1,"years").format("YYYY-MM-DD"),Choice3]
							break 
						case Choice4:
							Dates[choice] = [moment().add(10,"years").format("YYYY-MM-DD"), Choice4] 
							break
						default:
							console.log("just to make warning go away")
					}
				} else {
					switch(CompStatus) {
						case Choice1:
							Dates[choice] = [moment().format('YYYY-MM-DD'),Choice1]
							break;
						case Choice2:
						//if option selected in Jan,Feb, or March it will default to the beginning of the year else it will subtract 3 months from current date
							if (moment().dayOfYear() < 90) {
								Dates[choice] = [moment().startOf('year').format("YYYY-MM-DD"),Choice2 ] 
							} else {
								Dates[choice] = [moment().subtract(3,"months").format('YYYY-MM-DD'),Choice2]
							}
							break
						case Choice3:
							Dates[choice] = [moment().subtract(1,"years").format("YYYY-MM-DD"),Choice3]
							break 
						case Choice4:
							Dates[choice] = [moment().subtract(2,"years").format("YYYY-MM-DD"), Choice4] 
							break
						default:
							console.log("just to make warning go away")
					} 
				}

        this.setState({
          Dates: Dates,
          SelectedCompStatus: CompStatus
        });
  }
  renderHouseHoldsInLine(households,IsSingleHouse) {
    const { status } = this.props;
		const {Dates } = this.state
    if (!households) return <div />;
    var filteredHH = households;
    if (status === "TODO") {
      filteredHH = households.filter(
        (household) => !this.props.inCart(this.props.aid, household.id, "DONE")
      );
    }
    const names = getPropsArrayFromJsonArray(filteredHH, "name");
    //fixes a UI bug where if there are multiple houses, the last house gets cut off by the submitt button
    names.push("TestData")

		const values = getPropsArrayFromJsonArray(filteredHH, "id");
    return names.map((name, index) => {
      const all = this.state.choice || [];
      const selected = all.includes(values[index]);
		//when its done rendering the household lines, this puts some padding at the end so the submit button does not cut off the last house	
            if (name === "TestData") {
				return (<div><br/> <br/> <br/> <br/></div>)
			}
      return (
        <div id="act-item-Container">
          {IsSingleHouse ? <div id={"act-item-Container_SingleHouse"}><p>{name}</p> </div> :
          <div
          className={`act-item`}
          onClick={() => this.onChange(values[index])}
          key={index.toString()}
        >
           <div className={`act-rect ${selected ? "act-selected" : ""}`}></div>
          <p>{name}</p>
        </div>
    }
          {
            status === "TODO"  || status ===  "DONE"  ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip> {status === "TODO" ? "When are you planning complete the action?" : "When did you complete this action?" } </Tooltip>}
              >

                <div id="CompletionDate">						
                      <Dropdown>
                        <Dropdown.Toggle id="dropdown-button-dark-example1" variant="secondary">
												  {Dates[values[index]] ? Dates[values[index]][1] : "Completion Date"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu variant="dark">

                          <Dropdown.Item onClick={() => this.ChangeCompDate(Choice1,values[index] )}> {Choice1} </Dropdown.Item>
                          <Dropdown.Item onClick={() => this.ChangeCompDate(Choice2,values[index] )}>{Choice2}</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item onClick={() => this.ChangeCompDate(Choice3,values[index])}>{Choice3} </Dropdown.Item>
                          <Dropdown.Item onClick={() => this.ChangeCompDate(Choice4,values[index])}>{Choice4}</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      </div>	  
              </OverlayTrigger>
						) : (
							<div />
              )
          }
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
