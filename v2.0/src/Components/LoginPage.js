import React from 'react'
import NavBarBurger from './NavBarBurger'
import Footer from './Footer'

var apiurl = 'http://localhost:8000/user/menu'

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuData: null,
            userData: null,
        }
    }
    //gets the data from the api url and puts it in pagedata and menudata
    componentDidMount() {
        fetch(apiurl).then(data => {
            return data.json()
        }).then(myJson => {
            console.log(myJson);
            this.setState({
                menuData: myJson.menuData,
                userData: myJson.userData,
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
    }
    render() { //avoids trying to render before the promise from the server is fulfilled
        if (!this.state.menuData) return <div>Waiting for a response from the server</div>;
        const { //gets the navLinks and footer data out of menu data
            navLinks,
            footerData
        } = this.state.menuData;
        return (
            <div className="boxed_wrapper">
                <NavBarBurger
                    navLinks={navLinks}
                    userData={this.state.userData}
                />
                <section class="register-section sec-padd-top">
                    <div class="container">
                        <div class="row">
                            {/* <!--Form Column--> */}
                            <div class="form-column column col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div class="section-title style-2">
                                    <h3>Login Now</h3>
                                </div>
                                {/* <!--Login Form--> */}
                                <div class="styled-form login-form">
                                    <form method="post" action="index.html">
                                        <div class="form-group">
                                            <span class="adon-icon"><span class="fa fa-envelope-o"></span></span>
                                            <input type="email" name="useremil" placeholder="Enter Mail id *" />
                                        </div>
                                        <div class="form-group">
                                            <span class="adon-icon"><span class="fa fa-unlock-alt"></span></span>
                                            <input type="password" name="userpassword" placeholder="Enter Password" />
                                        </div>
                                        <div class="clearfix">
                                            <div class="form-group pull-left">
                                                <button type="button" class="thm-btn thm-tran-bg">login now</button>
                                            </div>
                                            <div class="form-group social-links-two padd-top-5 pull-right">
                                                Or login with <a href="#" class="img-circle facebook"><span class="fa fa-facebook-f"></span></a> <a href="#" class="img-circle twitter"><span class="fa fa-twitter"></span></a> <a href="#" class="img-circle google-plus"><span class="fa fa-google-plus"></span></a>
                                            </div>
                                        </div>
                                        <div class="clearfix">
                                            <div class="pull-left">
                                                <label className="checkbox-container">
                                                    <p style={{ marginLeft: "25px" }}>Remember Me</p>
                                                    <input className="checkbox" type="checkbox" name="boxes" id="remember-me" />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            {/* <!--Form Column--> */}
                            <div class="form-column column col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div class="section-title style-2">
                                    <h3>Register Now</h3>
                                </div>
                                {/* <!--Register Form--> */}
                                <div class="styled-form register-form">
                                    <form method="post" action="index.html">
                                        <div class="form-group">
                                            <span class="adon-icon"><span class="fa fa-user"></span></span>
                                            <input type="text" name="username" placeholder="Your Name *" />
                                        </div>
                                        <div class="form-group">
                                            <span class="adon-icon"><span class="fa fa-envelope-o"></span></span>
                                            <input type="email" name="useremil" placeholder="Enter Mail id *" />
                                        </div>
                                        <div class="form-group">
                                            <span class="adon-icon"><span class="fa fa-unlock-alt"></span></span>
                                            <input type="password" name="userpassword" placeholder="Enter Password" />
                                        </div>
                                        <div class="form-group">
                                            <span class="adon-icon"><span class="fa fa-unlock-alt"></span></span>
                                            <input type="password" name="userpassword" placeholder="Re-enter Password" />
                                        </div>
                                        <div class="clearfix">
                                            <div class="form-group pull-left">
                                                <button type="button" class="thm-btn thm-tran-bg">Register here</button>
                                            </div>
                                            <div class="form-group padd-top-15 pull-right">
                                                * Free registered user to submit content.
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer
                    data={footerData}
                />
            </div>
        );
    }
} export default LoginPage;