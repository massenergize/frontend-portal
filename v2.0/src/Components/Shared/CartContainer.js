import React from 'react'
import URLS, { getJson } from '../api_v2'
import LoadingCircle from './LoadingCircle'
import Cart from './Cart'

class CartContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        }
    }
    componentDidMount() {
        if (this.props.user) {
            Promise.all([
                getJson(URLS.USER + "/" + this.props.user.id + "/actions" + "?status=TODO"),
                getJson(URLS.USER + "/" + this.props.user.id + "/actions" + "?status=DONE"),
            ])
            .then(myJsons => {
                this.setState({
                    todo: myJsons[0].data,
                    done: myJsons[1].data,
                    loaded: true
                })
            }).catch(err => {
                console.log(err)
            });
        }
    }
    render() {
        if (!this.state.loaded) return <LoadingCircle />;
        return (
            <div>
                <Cart title="To Do List" actionRels={this.state.todo} status="TODO" moveToDone={this.moveToDone}/>
                <Cart title="Completed Actions" actionRels={this.state.done} status="DONE" moveToDone={this.moveToDone}/>
            </div>
        );
    }
    moveToDone = (actionRel) => {
        console.log(URLS.USER + "/" + this.props.user.id + "/action/" + actionRel.id);
        fetch(URLS.USER + "/" + this.props.user.id + "/action/" + actionRel.id, {
            method: 'post',
            body: JSON.stringify({
                status: "DONE",
                action: actionRel.action.id,
                real_estate_unit: actionRel.real_estate_unit.id,
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            console.log(json);
            this.componentDidMount();
        }).catch(err => {
            console.log(err)
        })
    }
}
export default CartContainer;