import React from 'react';
import PageTitle from '../../Shared/PageTitle';
import { connect } from 'react-redux';
import ReactPlayer from "react-player"
import LoadingCircle from '../../Shared/LoadingCircle';
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import Tooltip from "../Widgets/CustomTooltip";

class DonatePage extends React.Component {

	render() {
		
		const pageData = this.props.donatePage;
		if (pageData == null) return <LoadingCircle />
		const title = pageData && pageData.title ? pageData.title : 'Support Us!'
		const videoLink = pageData ? pageData.featured_video_link : null;
		const sub_title = pageData && pageData.sub_title ? pageData.sub_title : null
		const description = pageData.description ? pageData.description : null;
		//const button = section(pageSections, "DonatePageButton", true);

		return (
			<>

				<div className='boxed_wrapper' >
					<BreadCrumbBar links={[{ name: 'Donate' }]} />

					<div className="container p-5">

						<div className="text-center">
                    	  {description ? (
                    	  <Tooltip
                    	    text={description}
                    	    paperStyle={{ maxWidth: "100vh" }}
                    	  >
						  
                    	    <PageTitle style={{ fontSize: 24 }}>
                    	    {title}
                    	      <span
                    	        className="fa fa-info-circle"
                    	        style={{ color: "#428a36", padding: "5px" }}
                    	      ></span>

                    	    </PageTitle>
                    	  </Tooltip>
                    	  ) : (
                    	  <PageTitle style={{ fontSize: 24 }}>
                    	    {title}
                    	  </PageTitle>
                    	  )}
                    	</div>

						<center>
						        {
							        sub_title? 
							        <p>{sub_title}</p>
							        :null
						        }
						</center>

						{/*<PageTitle>{title}</PageTitle>
						<center>
							<p className="make-me-dark">{pageData && pageData.description ? pageData.description : 'Your contribution will support our MassEnergize initiative greatly. Feel free to donate any amount by clicking the button below!'}</p>
						{
							pageData.sub_title? 
							<small>{pageData.sub_title}</small>
							:null
						}
						</center>
						*/}

						{videoLink ?
						<div className={videoLink ? "col-sm-12 col-md-10 offset-md-1" : "d-none"}>
							{/* <Video link={videoLink} /> */}
							<ReactPlayer url={videoLink} />
						</div>
						: null
						}

						<br />
						<div className="row text-center justify-content-center">
							<div className="col-12 col-md-6 col-lg-4">
								<div  target="_top">
								<a rel="noopener noreferrer" href="https://paypal.me/massenergize?locale.x=en_US" target="_blank" ><input type="image" className="w-100" src="https://i.imgur.com/CwBgXO2.png" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" /></a>

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
		homePageData: store.page.homePageData,
		donatePage: store.page.donatePage,
	}
}
export default connect(mapStoreToProps, null)(DonatePage);