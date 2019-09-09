import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import LoadingCircle from '../Shared/LoadingCircle';
import logo from '../../logo.png'

class CommunitySelectPage extends React.Component {
    render() {
        if(!this.props.communities) return <LoadingCircle/>;
        return (
        <div className="boxed_wrapper">
            <img className='text-center' style={{margin:'auto', display:'block', maxWidth:'500px'}} src={logo}/>
            <h1 className='text-center'> Welcome to the Community Portal </h1>
            <h3 className='text-center'> Select Your Community Below</h3>
            <ul className='text-center'>
                {Object.keys(this.props.communities).map(key => {
                    const com = this.props.communities[key];
                    return <li key={key}> <a href={`/${com.subdomain}`}>{com.name}</a></li>
                })}
            </ul>
            <h3 className='text-center'> Or go to our main site</h3>
                <p  className='text-center'><a href='https://massenergize.org'>MassEnergize</a> </p>
        </div>
        );
    }
}
const mapStoreToProps = (store) => {
    return {
        communities:store.page.communities
    }
}
export default connect(mapStoreToProps)(CommunitySelectPage);