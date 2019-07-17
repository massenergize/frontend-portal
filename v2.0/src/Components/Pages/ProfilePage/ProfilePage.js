import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import SignOutButton from './SignOutButton'
import Cart from '../../Shared/Cart'
import Counter from './Counter'



class ProfilePage extends React.Component {
    render() {
        const { auth } = this.props;
        if (!auth.uid) return <Redirect to='/login' />
        return (
            <div className='boxed_wrapper'>
                <div className="container">
                    <div className="row" style={{ paddingRight: "0px", marginRight: "0px" }}>
                        <div className="col-lg-8 col-md-7  col-12">
                            <h3> <span style={{ color: "#8dc63f" }}>Welcome</span> {"Kieran O'Day"} </h3>
                            <section className="fact-counter style-2 sec-padd" >
                                <div className="container">
                                    <div className="counter-outer" style={{ background: "#333", width: "100%" }}>
                                        <div className="row no-gutter">
                                            <div className="column counter-column col-lg-4 col-6 ">
                                                <Counter end={12} icon={"icon-money"} title={"Actions Completed"} />
                                            </div>
                                            <div className="column counter-column  d-lg-block d-none col-4 ">
                                                <Counter end={3} icon={"icon-money"} title={"Actions To Do"} />
                                            </div>
                                            <div className="column counter-column col-lg-4 col-6"  >
                                                <Counter end={123} unit={"tons"} icon={"icon-money"} title={"Tons of Carbon Saved"} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-6 col-12">
                                        <table className="profile-table">
                                            <th> Your Communities </th>
                                            <th></th>
                                            <tr>
                                                <td>Wayland</td>
                                                <td><button className="remove-btn"> <i className="fa fa-trash"></i> </button></td>
                                            </tr>
                                            <tr>
                                                <td>Concord</td>
                                                <td><button className="remove-btn"> <i className="fa fa-trash"></i> </button></td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}><button className="thm-btn">Join another Community</button></td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <table className="profile-table">
                                            <th> Your Households </th>
                                            <th></th>
                                            <th></th>
                                            <tr>
                                                <td>Home</td>
                                                <td><button className="edit-btn"> <i className="fa fa-edit"></i> </button></td>
                                                <td><button className="remove-btn"> <i className="fa fa-trash"></i> </button></td>
                                            </tr>
                                            <tr>
                                                <td>Guest</td>
                                                <td><button className="edit-btn"> <i className="fa fa-edit"></i> </button></td>
                                                <td><button className="remove-btn"> <i className="fa fa-trash"></i> </button></td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3}><button className="thm-btn">Add Another Household</button></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <br />
                            <SignOutButton className="float_right" />
                        </div>
                        {/* makes the todo and completed actions carts */}
                        <div className="col-lg-4 col-md-5 col-12" style={{ paddingRight: "0px", marginRight: "0px" }}>
                            <Cart title="To Do List" />
                            <Cart title="Completed Actions" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStoreToProps = (store) => {
    return {
        auth: store.firebase.auth
    }
}
export default connect(mapStoreToProps, null)(ProfilePage);