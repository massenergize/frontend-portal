import React from 'react'
import Cookies from 'universal-cookie';
import { set_cookie,  get_cookie } from '../../api/functions'

class CookieBanner extends React.Component {

  constructor(props) {
    super(props);
    this.policyPath = props.policyPath;
    this.cookies = new Cookies();
    var displayCookieBanner;

    var accepted = get_cookie(this.cookies, "acceptsCookies");
    if (accepted === undefined) {
      displayCookieBanner = true;
    } else {
      displayCookieBanner = false;
    }

    this.state = {
      displayCookieBanner: displayCookieBanner
    };
  }
  
  acceptCookies = () => {
    this.setState({displayCookieBanner: false});
    set_cookie(this.cookies, "acceptsCookies", 1)
  }
    
  render() {
    return (
      (this.state.displayCookieBanner ? (<div className="cookie-banner" style={{
        position:'sticky',
        zIndex:'10',
        bottom:'0',
        width:'100%',
        padding:'10px',
        background:'#8DC62E'}}>
        <div className="container-fluid" style={{padding:'0px'}}>
          <div className="row ml-auto" style={{margin:'0px'}}>
            <div className="mr-auto" style={{width:'70%'}}>
              <div style={{color:'white', padding:'10px 15px'}}>
                This website uses cookies to provide the best user experience we can. We share no data with third parties or for any commercial purpose. 
                By using this site, you accept this use of cookies as outlined in our <a href={this.policyPath} target="_blank" 
                  rel="noopener noreferrer" style={{color:'grey'}}>data privacy policy.</a>
              </div>
            </div>
            <div className="ml-auto" style={{alignItems:'center'}}>
              <button onClick={this.acceptCookies} 
                  className="cool-font new-sign-in float-right round-me z-depth-float" 
                  style={{background:'white', color:'black'}}>
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>) : null)
    );
  }
}

export default CookieBanner;
