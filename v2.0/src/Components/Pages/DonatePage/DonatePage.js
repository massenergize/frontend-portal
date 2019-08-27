import React from 'react';
import PageTitle from '../../Shared/PageTitle';
import { section } from '../../../api/functions';
import { connect } from 'react-redux';
import LoadingCircle from '../../Shared/LoadingCircle';
import BreadCrumbBar from '../../Shared/BreadCrumbBar'

class DonatePage extends React.Component {
    
    render() {
        if(!this.props.donatePage) return <LoadingCircle/>;

        const pageSections = this.props.donatePage.sections;
        if(pageSections == null) return <LoadingCircle/>

        const header = section(pageSections, "DonatePageHeader", true);
        const button = section(pageSections, "DonatePageButton", true);
        return (
            <>
            <BreadCrumbBar links={[{ name: 'Donate' }]} />
            <div className='boxed-wrapper'>
                <div className="container p-5">
                    <PageTitle>{header.title}</PageTitle>
                    <p>{header.description}</p>
                    <br/>
                    <div class="row text-center justify-content-center">
                        <div class="col-3">
                            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                                <input type="hidden" name="cmd" value="_donations" />
                                <input type="hidden" name="business" value={button.info.business} />
                                <input type="hidden" name="currency_code" value="USD" />
                                <input type="image" className="w-100" src="https://i.imgur.com/CwBgXO2.png" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                                <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                            </form>
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
        donatePage: store.page.donatePage,
    }
}
export default connect(mapStoreToProps, null)(DonatePage);