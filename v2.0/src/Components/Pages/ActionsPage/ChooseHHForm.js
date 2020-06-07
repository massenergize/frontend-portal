import React from "react";

/********************************************************************/
/**                        RSVP FORM                               **/
/********************************************************************/

class ChooseHHForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      choice: null,
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.status !== this.props.status) {
      this.setState({ error: null });
    }
  }
  render() {
    //Dont show anything if the user has only one household
    if (this.props.user && this.props.user.households.length === 1) {
      if (this.props.open) {
        this.handleSubmit(null);
        return <div></div>;
      }
    }
    this.checkHouseholds();
    return (
      <>
        {this.props.open ? (
          <div>
            {this.state.error ? (
              <p className="text-danger"> {this.state.error} </p>
            ) : null}
            <form onSubmit={this.handleSubmit}>
              {this.renderRadios(this.props.user.households)}
              <div>
                <button
                  style={{padding:'2px 11px',marginRight: 7}}
                  className="thm-btn style-4 round-me"
                  type="submit"
                  disabled={
                    this.state.error ? true : !this.state.choice ? true : false
                  }
                >
                  Submit
                </button>
                <button
                style={{padding:'2px 11px'}}
                  className="thm-btn style-4 red round-me"
                  onClick={this.props.closeForm}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </>
    );
  }

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
    // this.setState({
    //   choice: null
    // });
  };
  renderRadios(households) {
    if (!households) return <div />;

    return households
      .filter(
        (household) =>
          (this.props.status === "DONE" &&
            !this.props.inCart(this.props.aid, household.id, "DONE")) ||
          (this.props.status === "TODO" &&
            !this.props.inCart(this.props.aid, household.id))
      )
      .map((household) => (
        <div key={household.id} style={{ display: "inline-block" }}>
          <input
            id={"" + household.name + household.id}
            type="checkbox"
            value={household.id}
            name="hhchoice"
            onChange={this.onChange}
            checked={
              this.state.choice
                ? this.state.choice.includes(household.id)
                : false
            }
            style={{ display: "inline-block" }}
          />
          &nbsp;
          <label htmlFor={"" + household.name + household.id}>
            {" "}
            {household.name}{" "}
          </label>
          &nbsp;&nbsp;&nbsp;
        </div>
      ));
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
  onChange(event) {
    var content = this.state.choice;
    var init = [Number(event.target.value)];
    this.setState({
      error: null,
      choice: content ? this.addIn(event.target.value) : init,
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
            error: `You have already added this action for all of your households`,
          });
        } else {
          // this.setState({ choice: housesAvailable[0] });
        }
      }
    }
  };
}
export default ChooseHHForm;
