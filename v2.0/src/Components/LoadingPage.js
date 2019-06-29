import React from 'react'

/**
 * Renders the loading screen that shows when server is still responding
 */
class LoadingPage extends React.Component {
    render() {
        let style = {
            width: "10em"
        };
        return (
            <div className="d-flex height-100vh justify-content-center align-items-center">
                <img src={require('../assets/images/other/loader.gif')} alt="Loading..." style={style}/>
            </div>
        );
    }
}
export default LoadingPage;