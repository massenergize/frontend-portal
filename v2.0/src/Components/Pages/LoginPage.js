import React from 'react'
import CONST from '../Constants'
import LoadingPage from './LoadingPage'
import NavBarBurger from '../Menu/NavBarBurger'
import NavBarOffset from '../Menu/NavBarOffset'
import Footer from '../Menu/Footer'
import RegisterForm from '../PageSpecific/LoginPage/RegisterForm'
import LoginForm from '../PageSpecific/LoginPage/LoginForm'

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
        fetch(CONST.URL.MENU).then(data => {
            return data.json()
        }).then(myJson => {
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
        if (!this.state.menuData) return <LoadingPage />;
        const { //gets the navLinks and footer data out of menu data
            navLinks,
            navBarSticky,
            footerData
        } = this.state.menuData;
        return (
            <div className="boxed_wrapper">
                <NavBarBurger
                    navLinks={navLinks}
                    userData={this.state.userData}
                    sticky={navBarSticky}
                />
                <NavBarOffset sticky={navBarSticky} />
                <section class="register-section sec-padd-top">
                    <div class="container">
                        <div class="row">
                            {/* <!--Form Column--> */}
                            <div class="form-column column col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <LoginForm />
                            </div>
                            {/* <!--Form Column--> */}
                            <div class="form-column column col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <RegisterForm />
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