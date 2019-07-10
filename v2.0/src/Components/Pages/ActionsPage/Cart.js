import React from 'react'
import {Link} from 'react-router-dom'

/**
 * Cart component
 * renders a list of actions
 * @props title
 *      action list: title, image, id
 */
class Cart extends React.Component {
    render() {
        return (
            // <!--Cart Outer-->
            <div className="cart-outer">
                <h1 className="center">{this.props.title}</h1>
                <div className="table-outer">
                    <table className="cart-table">
                        <thead className="cart-header">
                            <tr>
                                <th className="prod-column">Image</th>
                                <th className="prod-column">Action</th>
                                <th className="prod-column"></th>
                                <th className="prod-column">Remove</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td colSpan="1" className="prod-column">
                                    <div className="column-box">
                                        <figure className="prod-thumb"><Link to="#"><img src="https://images.unsplash.com/photo-1497211419994-14ae40a3c7a3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" alt="" /></Link></figure>
                                    </div>
                                </td>
                                <td colSpan="2" className="prod-column">
                                    <div className="column-box">
                                        <h4 className="prod-title padd-top-20">I'd like to learn more about heating and cooling with heat pumps</h4>
                                    </div>
                                </td>
                                <td colSpan="1" className="prod-column">
                                    <Link to="#" className="done-btn"> <i className="fa fa-check"></i> </Link>
                                    <Link to="#" className="remove-btn"> <i className="fa fa-trash"></i> </Link>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="1" className="prod-column">
                                    <div className="column-box">
                                        <figure className="prod-thumb"><Link to="#"><img src="https://images.unsplash.com/photo-1497211419994-14ae40a3c7a3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" alt="" /></Link></figure>
                                    </div>
                                </td>
                                <td colSpan="2" className="prod-column">
                                    <div className="column-box">
                                        <h4 className="prod-title padd-top-20">Good to Great Look</h4>
                                    </div>
                                </td>
                                <td colSpan="1" className="prod-column">
                                    <Link to="#" className="done-btn"><i className="fa fa-check"></i>
                                        {/* <span className="tooltiptext">Click to mark as done</span> */}
                                    </Link>
                                    <Link to="#" className="remove-btn"><i className="fa fa-trash"></i>
                                        {/* <span className="tooltiptext">Click to remove from the cart</span> */}
                                    </Link>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
} export default Cart;