import React from "react";
import "./site-maintenance.css";
import img from "./maintenance.png";
import Seo from "../../Shared/Seo";

const SiteUnderMaintenance = () => {
	return (
		<>
			{Seo({
				title: "Site Maintenance",
				description: "Site under Maintenance Page",
				url: `${window.location.href}`,
				site_name: "MassEnergize Communities",
			})}
			<div className="main-cont-">
				<div className="inner-cont-">
					<div className="text-div">
						<h1
							style={{
								lineHeight: 1,
								fontWeight: 600,
								marginBottom: "1rem",
								fontSize: "2rem",
								textTransform: "none !important",
								display: "flex",
								alignItems: "center",
								justifyContent: "start",
								gap: 5,
							}}
						>
							<span><svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 6C12.5523 6 13 6.44772 13 7V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V7C11 6.44772 11.4477 6 12 6Z" fill="currentColor"></path><path d="M12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z" fill="currentColor"></path></svg></span>
							Apologies!
						</h1>
						<h1 className="title-txt">
							Site Under <span style={{ color: "red" }}>Maintenance</span>
						</h1>
						<p className="exp-text">
							<b style={{ fontWeight: 600 }}>'MassEnergize Communities' </b>
							is undertaking a planned system upgrade to improve your experience
							on the platform. As a result, the platform will not be accessible
							until the maintenance is complete. <br />
							We sincerely apologize for any inconvenience this may cause you.{" "}
							<br /> Thank you.
						</p>
					</div>
					<div>
						<img src={img} alt="maintenance" className="image-img" />
					</div>
				</div>
			</div>
		</>
	);
};

export default SiteUnderMaintenance;
