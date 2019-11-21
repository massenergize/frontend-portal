import React from 'react'
import URLS from '../../../api/urls';
import { getJson, section } from '../../../api/functions'
import LoadingCircle from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux'
import { reduxLoadCommunityAdmins } from '../../../redux/actions/pageActions'
import ContactPageForm from './ContactPageForm';
class ContactUsPage extends React.Component {

  ejectAdmins(admins) {
    if (admins.length > 0) {
      const adminsMapped = admins.map((admin, index) => { return (<div><a style={{ fontSize: 17, color: 'green' }} href={`mailto:${admin.email}`}>{admin.full_name}</a></div>) })
      return (
        <div>
          <h4>Admins</h4>
          {adminsMapped}
        </div>
      )
    }
    else {
      return (
        <div>
          <h4>Admins</h4>
          <p>No admins are in charge yet!</p>
        </div>
      )
    }
  }
  ejectLocation(location) {
    if (location) {
      return (
        <div>
          <h4>Location</h4>
          <p>{location.city? `${location.city}` : ''} <b>{location.unit? `, ${location.unit}` : ''} </b> {location.state? `, ${location.state}` : ''}  <b>{location.address? `, ${location.address}` : ''}</b> {location.country? `, ${location.country}` : ''}  <b>{location.zipcode? `, ${location.zipcode}` : ''}</b></p>
        </div>
      )
    } else {
      return (<div>
        <h4>Location</h4>
        <p>No location was provided by admin!</p>
      </div>)
    }
  }
  render() {
    if (!this.props.user)
      return <Redirect to={this.props.links.signin}> </Redirect>;

    if (!this.props.pageData || !this.props.community) {
      return (
        <div className="boxed_wrapper" >
          <h2 className='text-center' style={{ color: '#9e9e9e', margin: "190px 150px", padding: "30px", border: 'solid 2px #fdf9f9', borderRadius: 10 }}> Sorry, it looks like this community has no contact information :( </h2>
        </div>
      )
    }
    const pageData = this.props.pageData;
    const {
      id,
      name,
      owner_name,
      owner_email,
      owner_phone_number,
      location,
      admins
    } = pageData;
    return (
      <>
        <div className="boxed_wrapper" style={{ marginBottom: 300 }}>
          <BreadCrumbBar links={[{ name: 'Contact Us' }]} />
          <div className="col-md-10 col-lg-10 offset-md-1 col-sm-10 col-xs-12">
            <div style={{ marginTop: 70 }}></div>

            <div className="container" >
              <div className="row">
                <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12">
                  <h3>Contact <b>{name}</b> </h3>
                  <p>Use this page to get key information and in touch with {name}</p>
                  {this.ejectLocation(location)}
                  {this.ejectAdmins(admins)}
                </div>
                <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12">
                  <ContactPageForm admins={admins} community_id={id} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </>
    );
  }
}

const mapStoreToProps = (store) => {

  return {
    user:store.user.info,
    links: store.links,
    community: store.page.community,
    communityAdmins: store.page.communityAdmins,
    pageData: store.page.comInformation
  }
}

export default connect(mapStoreToProps, { reduxLoadCommunityAdmins })(ContactUsPage);