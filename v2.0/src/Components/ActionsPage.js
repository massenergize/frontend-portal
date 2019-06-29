import React from 'react'
import CONST from './Constants.js';
import { Switch, Route } from 'react-router-dom'
import NavBar from './NavBar.js';
import Footer from './Footer';
import SideBar from './SideBar';
import Action from './Action';

/**
 * The Actions Page renders all the actions and a sidebar with action filters
 * @props none - fetch data from api instead of getting data passed to you from props
 */
class ActionsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null,
            userData: null,
            menuData: null,
        }
        this.handleChange = this.handleChange.bind(this);
    }
    //gets the data from the api url and puts it in pagedata and menudata
    componentDidMount() {
        fetch(CONST.URL.ACTIONS).then(data => {
            return data.json()
        }).then(myJson => {
            console.log(myJson);
            this.setState({
                pageData: myJson.pageData,
                menuData: myJson.menuData,
                userData: myJson.userData,
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
    }

    render() {
        //avoids trying to render before the promise from the server is fulfilled
        if (!this.state.pageData) return <div>Waiting for a response from the server</div>;
        const { //gets the navLinks and footer data out of menu data
            navLinks,
            footerData
        } = this.state.menuData;
        const { //gets the actions and sidebar data out of page data
            actions,
            sidebar
        } = this.state.pageData;
        return (
            <div className="boxed_wrapper">
                <NavBar
                    navLinks={navLinks}
                    userData={this.state.userData}
                />
            
                {/* main shop section */}
                <div className="shop sec-padd">
                    <div className="container">
                        <div className="row">
                            {/* renders the sidebar */}
                            <SideBar
                                categories={sidebar.categories}
                                tags={sidebar.tags}
                                impacts={sidebar.impacts}
                                difficulties={sidebar.difficulties}
                                onChange={this.handleChange} //runs when any category is selected or unselected
                            ></SideBar>
                            {/* renders the actions */}
                            <div className="col-md-9 col-sm-12 col-xs-12">
                                <div className="row" id="actions-container">
                                    {this.renderActions(actions)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer
                    data={footerData}
                />
            </div>
        );
    }
    // on change in any category or tag checkbox update the actionsPage
    handleChange() {
        console.log("fuck");
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

                categories={action.categories}
                tags={action.tags}
                difficulty={action.difficulty}
                impact={action.impact}

                // noFilter={this.noFilter}
                allcategories={this.state.pageData.sidebar.categories}
                alltags={this.state.pageData.sidebar.tags}
                alldifficulties={this.state.pageData.sidebar.difficulties}
                allimpacts={this.state.pageData.sidebar.impacts}
            />
        });
    }
}
export default ActionsPage;