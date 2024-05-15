import React from "react";
import { Switch, Route } from "react-router-dom";

import "./assets/css/style.css";
import SiteUnderMaintenance from "./components/Pages/site-under-maintenance/SiteUnderMaintenance";
function App() {

	return (
		<Switch>
			<Route path="*" component={SiteUnderMaintenance} />
		</Switch>
	);
}

export default App
