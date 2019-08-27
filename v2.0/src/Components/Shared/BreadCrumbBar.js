import React from 'react'
import { Link } from 'react-router-dom'
class BreadCrumbWrapper extends React.Component {
    render() {
        return (
            <div class="breadcumb-wrapper">
                <div class="container">
                    <div class="pull-left">
                        <ul class="list-inline link-list">
                            <li>
                                <Link to="/home" className='link'> Home </Link>
                            </li>
                            {Object.keys(this.props.links).map(key => {
                                const link = this.props.links[key];
                                if (link.link) {
                                    return (
                                        <li key={key}>
                                            <Link to={link.link} className='link'>{link.name}</Link>
                                        </li>
                                    );
                                } else if (link.name) {
                                    return (
                                        <li key={key}>
                                            {link.name}
                                        </li>
                                    );
                                }
                            })}
                        </ul>
                    </div>

                </div>
            </div>
            // <div class="breadcumb-wrapper">
            //     <div class="container">
            //         <div class="pull-left">
            //             <ul class="list-inline link-list">
            //                 <li>
            //                     <a href="index.html">Home</a>
            //                 </li>

            //                 <li>
            //                     about us
            //     </li>
            //             </ul>
            //         </div>
            //         <div class="pull-right">
            //             <a href="#" class="get-qoute"><i class="fa fa-arrow-circle-right"></i>Become a Volunteer</a>
            //         </div>
            //     </div>
            // </div>


        );
    }
}
export default BreadCrumbWrapper;

