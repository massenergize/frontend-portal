import React from 'react'

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
            <div class="cart-outer">
                <h1 class="center">{this.props.title}</h1>
                <div class="table-outer">
                    <table class="cart-table">
                        <thead class="cart-header">
                            <tr>
                                <th class="prod-column">Image</th>
                                <th class="prod-column">Action</th>
                                <th class="prod-column"></th>
                                <th class="prod-column">Remove</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td colspan="1" class="prod-column">
                                    <div class="column-box">
                                        <figure class="prod-thumb"><a href="#"><img src="https://images.unsplash.com/photo-1497211419994-14ae40a3c7a3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" alt="" /></a></figure>
                                    </div>
                                </td>
                                <td colspan="2" class="prod-column">
                                    <div class="column-box">
                                        <h4 class="prod-title padd-top-20">I'd like to learn more about heating and cooling with heat pumps</h4>
                                    </div>
                                </td>
                                <td colspan="1" class="prod-column">
                                    <a href="#" class="done-btn"> <i class="fa fa-check"></i> </a>
                                    <a href="#" class="remove-btn"> <i class="fa fa-trash"></i> </a>
                                </td>
                            </tr>

                            <tr>
                                <td colspan="1" class="prod-column">
                                    <div class="column-box">
                                        <figure class="prod-thumb"><a href="#"><img src="https://images.unsplash.com/photo-1497211419994-14ae40a3c7a3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" alt="" /></a></figure>
                                    </div>
                                </td>
                                <td colspan="2" class="prod-column">
                                    <div class="column-box">
                                        <h4 class="prod-title padd-top-20">Good to Great Look</h4>
                                    </div>
                                </td>
                                <td colspan="1" class="prod-column">
                                    <a href="#" class="done-btn"><i class="fa fa-check"></i>
                                        
                                    </a>
                                    <a href="#" class="remove-btn"><i class="fa fa-trash"></i>
                                        <span class="tooltiptext">FUCKKKK</span>
                                    </a>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
} export default Cart;