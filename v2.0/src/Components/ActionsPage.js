import React from 'react'
import NavBar from './NavBar.js';
import Footer from './Footer';
import SideBar from './SideBar';

var apiurl = 'http://localhost:8000/user/actions'

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null
        }
    }
    componentDidMount() {
        fetch(apiurl).then(data => {
            return data.json()
        }).then(myJson => {
            console.log(myJson);
            this.setState({
                pageData: myJson.pageData,
                menuData: myJson.menuData
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
    }
    render() {
        if (!this.state.pageData) return <div>No Data</div>;
        const {
            navLinks,
            footerData
        } = this.state.menuData;
        const {
            actions,
            sidebar
        } = this.state.pageData;
        return (
            <div className="boxed_wrapper">
                <NavBar
                    navLinks={navLinks}
                />
                <div class="shop sec-padd">
                    <div class="container">
                        <div class="row">
                            <SideBar
                                categories={this.state.pageData.sidebar.categories}
                                tags={this.state.pageData.sidebar.tags}
                            ></SideBar>
                        </div>
                    </div>
                </div>

                <Footer
                    data={footerData}
                />
            </div>
        );
    }
}
export default HomePage;