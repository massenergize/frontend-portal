import React from 'react'
import URLS, {getJson} from '../../api_v2';
import LoadingCircle from '../../Shared/LoadingCircle';
import SideBar from '../../Menu/SideBar';
import Action from './Action';
import { connect } from 'react-redux'


/**
 * The Actions Page renders all the actions and a sidebar with action filters
 * @props none - fetch data from api instead of getting data passed to you from props
 * 
 * @todo change the columns for small sizes change button colors bars underneath difficulty and ease instead of "easy, medium, hard"
 */
class ActionsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        }
        this.handleChange = this.handleChange.bind(this);
    }
    //gets the data from the api url and puts it in pagedata and menudata
    componentDidMount() {
        Promise.all([
            getJson(URLS.USERS + "?email=" + this.props.auth.email),
            getJson(URLS.ACTIONS), //need to add community to this
        ]).then(myJsons => {
            this.setState({
                ...this.state,
                loaded:true,
                user: myJsons[0].data[0],
                actions: myJsons[1].data
            })
        }).catch(error => {
            console.log(error);
            return null;
        });
    }

    render() {
        //avoids trying to render before the promise from the server is fulfilled
        if (!this.state.loaded) return <LoadingCircle/>;
        return (
            <div className="boxed_wrapper">
                {/* main shop section */}
                <div className="shop sec-padd">
                    <div className="container">
                        <div className="row">
                            {/* renders the sidebar */}
                            <div className="col-md-3 col-sm-12 col-xs-12 sidebar_styleTwo">
                            {/* <SideBar
                                //filters={sidebar}
                                onChange={this.handleChange} //runs when any category is selected or unselected
                            ></SideBar> */}
                            </div>
                            {/* renders the actions */}
                            <div className="col-md-9 col-sm-12 col-xs-12">
                                <div className="row" id="actions-container">
                                    {this.renderActions(this.state.actions)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    // on change in any category or tag checkbox update the actionsPage
    handleChange() {
        this.forceUpdate();
    }
    // renders all the actions
    renderActions(actions) {
        if (!actions) {
            return <li>No actions to Display</li>;
        }
        //returns a list of action components
        return Object.keys(actions).map(key => {
            var action = actions[key];
            return <Action key= {key}
                id={action.id}
                title={action.title}
                description={action.description}
                image= {action.image? action.image.file : ""}
                match={this.props.match} //passed from the Route, need to forward to the action for url matching

                tags={action.tags}
                //filters={this.state.pageData.sidebar}
            />
        });
    }
}
const mapStoreToProps = (store) => {
    return {
        auth: store.firebase.auth
    }
}
export default connect(mapStoreToProps, null)(ActionsPage);
