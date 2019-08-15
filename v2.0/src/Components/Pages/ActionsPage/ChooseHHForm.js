import React from 'react';

/********************************************************************/
/**                        RSVP FORM                               **/
/********************************************************************/
const INITIAL_STATE = {
    error: null,
    choice: null,
};

class ChooseHHForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
        }
        this.onChange = this.onChange.bind(this);
    }

    render() {
        return (
            <>
                {this.props.open ?
                    <div>
                        {this.state.error ? <p className='text-danger'> {this.state.error} </p> : null}
                        <form onSubmit={this.handleSubmit}>
                            {this.renderRadios(this.props.user.households)}
                            
                            <button className='thm-btn style-4' type='submit'>Submit</button>
                            <button className='thm-btn style-4 red' onClick={this.props.closeForm}> Cancel </button>
                        </form>
                    </div>
                    :
                    null
                }
            </>
        );
    }


    handleSubmit = (event) => {
        event.preventDefault();

        console.log(this.props.aid)
        console.log(this.state.choice)
        console.log(this.props.status)

        if(!this.state.choice){
            this.setState({
                error: "Please select a household"
            })
            return;
        }

        if (this.props.status === "TODO") {
            if(!this.props.inCart(this.props.aid, this.state.choice)){
                console.log('adding to todo')
                this.props.addToCart(this.props.aid, this.state.choice, this.props.status);
                this.props.closeForm();
            }
        } else if (this.props.status === "DONE") {
            if(!this.props.inCart(this.props.aid, this.state.choice)){
                console.log('adding to done')
                this.props.addToCart(this.props.aid, this.state.choice, this.props.status);
                this.props.closeForm();
            }else if (this.props.inCart(this.props.aid, this.state.choice, "TODO")){
                console.log('moving to done')
                this.props.moveToDone(this.props.aid, this.state.choice);
                this.props.closeForm();

            }
        }
    }
    renderRadios(households) {
        return Object.keys(households).map(key => {
            const household = households[key];
            return (
                <div key={key} style ={{display: 'inline-block'}}>
                    <input id ={''+ household.name + key} type='radio' value={household.id} name='hhchoice' onChange={this.onChange} style={{ display: 'inline-block' }} />
                    &nbsp;
                    <label for={''+ household.name + key}> {household.name} </label>
                    &nbsp;&nbsp;&nbsp;
                </div>
            );
        })
    }
    //updates the state when form elements are changed
    onChange(event) {
        this.setState({
            error: null,
            choice: event.target.value,
        });
    };

}
export default (ChooseHHForm);


