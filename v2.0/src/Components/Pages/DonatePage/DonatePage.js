import React from 'react';
import PageTitle from '../../Shared/PageTitle';

class DonatePage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='boxed-wrapper'>
                <div className="container p-5">
                    <PageTitle>{this.props.donatePage.title}</PageTitle>
                    <p>{this.props.donatePage.description}</p>
                    <br/>
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                        <input type="hidden" name="cmd" value="_donations" />
                        <input type="hidden" name="business" value="limingle5@gmail.com" />
                        <input type="hidden" name="currency_code" value="USD" />
                        <input type="image" src="https://i.imgur.com/CwBgXO2.png" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                        <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                    </form>
                </div>
            </div>
        );
    }
}


const mapStoreToProps = (store) => {
    return {
        donatePage: store.page.donatePage,
    }
}
export default connect(mapStoreToProps, null)(RegisterForm);