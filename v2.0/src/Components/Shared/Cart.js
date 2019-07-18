import React from 'react'
import { Link } from 'react-router-dom'

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
                <h3 className="center">{this.props.title}</h3>
                <div className="table-outer">
                    {this.props.actions ?
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
                                {this.renderActions(this.props.actions)}
                            </tbody>
                        </table> : null
                    }
                </div>
            </div>
        );
    }
    renderActions(actions) {
        if (!actions) {
            return <li>Empty</li>;
        }
        //returns a list of action components
        return Object.keys(actions).map(key => {
            var action = actions[key];
            return (
                <tr key={key}>
                    <td colSpan="1" className="prod-column">
                        <div className="column-box">
                            <figure className="prod-thumb"><Link to={"/actions/" + action.id}><img src={action.image} alt="" /></Link></figure>
                        </div>
                    </td>
                    <td colSpan="2" className="prod-column">
                        <div className="column-box">
                            <h4 className="prod-title padd-top-20">{action.title}</h4>
                        </div>
                    </td>
                    <td colSpan="1" className="prod-column">
                        <Link to="#" className="done-btn"> <i className="fa fa-check"></i> </Link>
                        <Link to="#" className="remove-btn"> <i className="fa fa-trash"></i> </Link>
                    </td>
                </tr>
            );
        });
    }
} export default Cart;