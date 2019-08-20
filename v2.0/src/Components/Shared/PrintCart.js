import React from 'react'
import ReactToPrint from 'react-to-print'
import { connect } from 'react-redux'
import logo from '../../logo.svg'


import Cart from './Cart';

class ComponentToPrint extends React.Component {
    render() {
        return (
            <div style={{padding: "30px"}}>
                <img src={logo} style={{width: "50%", margin:"auto", display:"block", paddingBottom:"20px"}}></img>
                <Cart title="To Do List" actionRels={this.props.todo} status="TODO" info={true}/>
                <Cart title="Completed Actions" actionRels={this.props.done} status="DONE" info={true}/>
            </div>
        );
    }
}

class PrintCart extends React.Component {
    render() {
        return (
            <div>
                <ComponentToPrint ref={el => (this.componentRef = el)} todo={this.props.todo} done={this.props.done}/>
                <ReactToPrint
                    content={() => this.componentRef}
                    trigger={() => <button className='thm-btn'> <i className="fa fa-print"/> Print your Actions</button>}
                />
            </div>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        todo: store.user.todo,
        done: store.user.done
    }
}
export default connect(mapStoreToProps)(PrintCart)