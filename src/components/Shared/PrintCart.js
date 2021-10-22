import React from "react";
import ReactToPrint from "react-to-print";
import { connect } from "react-redux";
import logo from "../../logo.png";

import Cart from "./Cart";
import EventCart from "../Pages/ProfilePage/EventCart";
import MEButton from "../Pages/Widgets/MEButton";
import MECard from "../Pages/Widgets/MECard";

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div style={{ padding: "30px" }}>
        <img
          alt="IMG"
          src={logo}
          style={{
            width: "50%",
            margin: "auto",
            display: "block",
            paddingBottom: "20px",
          }}
        ></img>
        <Cart
          title="To Do List"
          actionRels={this.props.todo}
          status="TODO"
          info={true}
        />
        <Cart
          title="Completed Actions"
          actionRels={this.props.done}
          status="DONE"
          info={true}
        />
        {this.props.rsvps ? (
          <EventCart
            title="Event RSVPs"
            eventRSVPs={this.props.rsvps.filter(
              (rsvp) => rsvp.attendee && rsvp.attendee.id === this.props.user.id
            )}
            info={true}
          />
        ) : null}
      </div>
    );
  }
}

class PrintCart extends React.Component {
  render() {
    return (
      <div>
        <MECard className="me-anime-open-in">
          <ComponentToPrint
            ref={(el) => (this.componentRef = el)}
            todo={this.props.todo}
            done={this.props.done}
            rsvps={this.props.rsvps}
            user={this.props.user}
          />
          <ReactToPrint
            content={() => this.componentRef}
            trigger={() => (
              <center>
                <MEButton icon="fa fa-print">Print your Actions</MEButton>
              </center>
            )}
          />
        </MECard>
      </div>
    );
  }
}

const mapStoreToProps = (store) => {
  return {
    todo: store.user.todo,
    done: store.user.done,
    rsvps: store.page.rsvps,
    user: store.user.info,
  };
};
export default connect(mapStoreToProps)(PrintCart);
