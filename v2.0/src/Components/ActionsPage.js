import React from 'react'
import { Switch, Route } from 'react-router-dom'
import NavBar from './NavBar.js';
import Footer from './Footer';
import SideBar from './SideBar';
import Action from './Action';

var apiurl = 'http://api.massenergize.org/user/actions'

class ActionsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null,
        }
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        fetch(apiurl).then(data => {
            return data.json()
        }).then(myJson => {
            console.log(myJson);
            this.setState({
                pageData: myJson.pageData,
                menuData: myJson.menuData
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
    }

    render() {
        if (!this.state.pageData) return <div>Waiting for a response from the server</div>;
        const {
            navLinks,
            footerData
        } = this.state.menuData;
        const {
            actions,
            sidebar
        } = this.state.pageData;
        return (
            <div className="boxed_wrapper">
                <NavBar
                    navLinks={navLinks}
                />
                <div className="breadcumb-wrapper">
                    <div className="container">
                        <div className="pull-left">
                            <ul className="list-inline link-list">
                                <li>
                                    <a href="/home">Home</a>
                                </li>
                                <li>
                                    Actions
                                </li>
                            </ul>
                        </div>
                        <div className="pull-right">
                            <a href="#" className="get-qoute"><i className="fa fa-arrow-circle-right"></i>Become a Volunteer</a>
                        </div>
                    </div>
                </div>
                <div className="shop sec-padd">
                    <div className="container">
                        <div className="row">
                            <SideBar
                                categories={sidebar.categories}
                                tags={sidebar.tags}
                                impacts={sidebar.impacts}
                                difficulties={sidebar.difficulties}
                                onChange={this.handleChange}
                            ></SideBar>
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
        return Object.keys(actions).map(key => {
            var action = actions[key];
            return <Action
                id={action.id}
                title={action.title}
                description={action.description}
                image={action.image}
                match={this.props.match}

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