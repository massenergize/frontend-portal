import React from 'react'
import { Link } from 'react-router-dom'
import Tooltip from '../Shared/Tooltip'
import { connect } from 'react-redux'
import {reduxMoveToDone, reduxRemoveFromTodo } from '../../redux/actions/userActions'
import URLS from '../../api/urls'
import {postJson, deleteJson} from '../../api/functions'

/**
 * Cart component
 * renders a list of actions
 * @props title
 *      action list: title, image, id
 * 
 */
class Cart extends React.Component {
    render() {
        return (
            // <!--Cart Outer-->
            <div className="cart-outer mb-5">
                <h3 className="center m-0">{this.props.title}</h3>
                <div className="table-outer">
                    {this.props.actionRels ?
                        <table className="cart-table" style={{ width: '100%' }}>
                            <tbody>
                                {this.renderActions(this.props.actionRels)}
                            </tbody>
                        </table> : null
                    }
                </div>
            </div>
        );
    }
    renderActions(actionRelations) {
        if (!actionRelations || actionRelations.length <= 0) {
            return (
                <tr key="1"><td colSpan="100%"><p className="m-0 p-2 w-100 text-center">Nothing here, yet! See all <Link to='/actions'> actions </Link></p></td></tr>
            );
        }
        //returns a list of action components
        return Object.keys(actionRelations).map(key => {
            var actionRel = actionRelations[key];
            var action = actionRel.action;
            return (
                <tr key={key}>
                    {/* <td colSpan="2" className="prod-column">
                        <img className="thumbnail" src={action.image? action.image.url : null} alt="" />
                    </td> */}
                    <td>
                        <Tooltip title='Household' text={actionRel.real_estate_unit.name}>
                            <div className="column-box">
                                <span className='has-tooltip fa fa-home' style={{ textAlign: 'center', fontSize: '18px' }}></span>
                            </div>
                        </Tooltip>
                    </td>
                    <td className="prod-column">
                        <div className="column-box">
                            <Link to={'/actions/' + action.id}>
                                <h4 className="prod-title padd-top-20">{action.title}</h4>
                            </Link>
                        </div>
                    </td>
                    <td className="prod-column">
                        {actionRel.status.toLowerCase() === "todo" ?
                            <div>
                                <Tooltip text='Move to Done'>
                                    <button onClick={() => this.moveToDone(actionRel)} className="done-btn has-tooltip"> <i className="fa fa-check"></i> </button>
                                </Tooltip>
                                <Tooltip text='Remove from Todo'>
                                    <button className="remove-btn has-tooltip" onClick ={() => this.removeFromTodo(actionRel)}> <i className="fa fa-trash"></i> </button>
                                </Tooltip>
                            </div>
                            :
                            null
                        }
                    </td>

                </tr>
            );
        });
    }

    /**
     * Cart Functions
     */
    moveToDone = (actionRel) => {
        const body = {
            status: "DONE",
            action: actionRel.action.id,
            real_estate_unit: actionRel.real_estate_unit.id,
        }
        postJson(URLS.USER + "/" + this.props.user.id + "/action/" + actionRel.id, body).then(json => {
            console.log(json);
            if (json.success) {
                this.props.reduxMoveToDone(json.data);
            }
            //just update the state here
        }).catch(err => {
            console.log(err)
        })
    }

    removeFromTodo = (actionRel) => {
        deleteJson(`${URLS.USER}/${this.props.user.id}/action/${actionRel.id}`).then(json => {
            console.log(json);
            if(json.success){
                this.props.reduxRemoveFromTodo(actionRel);
            }
        })
    }
}
const mapStoreToProps = (store) => {
    return {
        user: store.user.info, 
        todo: store.user.todo,
        done: store.user.done
    }
} 

const mapDispatchToProps = {
    reduxMoveToDone, reduxRemoveFromTodo
}

export default connect(mapStoreToProps, mapDispatchToProps)(Cart);