import React from 'react'
import SignOutButton from '../PageSpecific/ProfilePage/SignOutButton'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

class ProfilePage extends React.Component {
    render() {
        const { auth } = this.props;
        if( !auth.uid ) return <Redirect to='/login' />
        return (
            <div>
                <SignOutButton />
                <p>
                    {JSON.stringify(this.props.auth)}
                </p>
            </div>
        );
    }
}
const mapStoreToProps = (store) => {
    return {
        auth: store.firebase.auth
    }
}
export default connect(mapStoreToProps, null)(ProfilePage);