import React from 'react'
import CONST from '../Constants.js';
import LoadingPage from './LoadingPage';
import SideBar from '../Menu/SideBar';
import Action from '../PageSpecific/ActionsPage/Action';

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
            pageData: null,
            userData: null,
        }
        this.handleChange = this.handleChange.bind(this);
    }
    //gets the data from the api url and puts it in pagedata and menudata
    componentDidMount() {
        fetch(CONST.URL.ACTIONS).then(data => {
            return data.json()
        }).then(myJson => {
            this.setState({
                pageData: myJson.pageData,
                userData: myJson.userData,
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
    }

    render() {
        //avoids trying to render before the promise from the server is fulfilled
        if (!this.state.pageData) return <LoadingPage/>;
        const { //gets the actions and sidebar data out of page data
            actions,
            sidebar
        } = this.state.pageData;
        return (
            <div className="boxed_wrapper">
                {/* main shop section */}
                <div className="shop sec-padd">
                    <div className="container">
                        <div className="row">
                            {/* renders the sidebar */}
                            <div className="col-md-3 col-sm-12 col-xs-12 sidebar_styleTwo">
                            <SideBar
                                filters={sidebar}
                                onChange={this.handleChange} //runs when any category is selected or unselected
                            ></SideBar>
                            </div>
                            {/* renders the actions */}
                            <div className="col-md-9 col-sm-12 col-xs-12">
                                <div className="row" id="actions-container">
                                    {this.renderActions(actions)}
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
            return <Action
                id={action.id}
                title={action.title}
                description={action.description}
                image={action.image}
                match={this.props.match} //passed from the Route, need to forward to the action for url matching

                tags={action.tags}
                filters={this.state.pageData.sidebar}
            />
        });
    }
}
export default ActionsPage;