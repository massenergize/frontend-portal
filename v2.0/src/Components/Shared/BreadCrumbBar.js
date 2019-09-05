import React from 'react'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
class BreadCrumbBar extends React.Component {
    render() {
        return (
            <div class="breadcumb-wrapper">
                <div class="container">
                    <div class="pull-left">
                        <ul class="list-inline link-list">
                            <li>
                                <Link to={this.props.reduxLinks.home} className='link'> Home </Link>
                            </li>
                            {Object.keys(this.props.links).map(key => {
                                const link = this.props.links[key];
                                if (link.link) {
                                    return (
                                        <li key={key}>
                                            <Link to={`${link.link}`} className='link'>{link.name}</Link>
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
        );
    }
}
const mapStoreToProps = (store) => {
    return({
        reduxLinks: store.links
    });
}
export default connect(mapStoreToProps)(BreadCrumbBar);
