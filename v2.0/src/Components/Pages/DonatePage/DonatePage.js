import React from 'react';
import PageTitle from '../../Shared/PageTitle';
import { section } from '../../../api/functions';
import { connect } from 'react-redux';
import LoadingCircle from '../../Shared/LoadingCircle';
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import Error404 from './../Errors/404';

class DonatePage extends React.Component {

	render() {
		// if(!this.props.homePageData) return <Error404 />
		if (!this.props.donatePage) return <p className='text-center'> <Error404 /></p>;
		const pageData = this.props.donatePage;
		const pageSections = this.props.donatePage.sections;
		if (pageData == null) return <LoadingCircle />

		const title = pageData && pageData.title ? pageData.title : 'Support Us!'
		//const button = section(pageSections, "DonatePageButton", true);
		return (
			<>

				<div className='boxed_wrapper' >
					<BreadCrumbBar links={[{ name: 'Donate' }]} />
					<div className="container p-5">
						<PageTitle>{title}</PageTitle>
						<center>
							<p>{pageData && pageData.description ? pageData.description : 'Your contribution will support our MassEnergize initiative greatly. Feel free to donate any amount by clicking the button below!'}</p>
						{
							pageData.sub_title? 
							<small>{pageData.sub_title}</small>
							:null
						}
						</center>
						<br />
						<div class="row text-center justify-content-center">
							<div class="col-12 col-md-6 col-lg-4">
								<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
									<input type="hidden" name="cmd" value="_donations" />
									<input type="hidden" name="business" value="Donate" />
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
		homePageData: store.page.homePageData,
		donatePage: store.page.donatePage,
	}
}
export default connect(mapStoreToProps, null)(DonatePage);