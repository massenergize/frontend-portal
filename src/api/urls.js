// Defining URLS object for manipulation...
import { IS_PROD, IS_CANARY, IS_LOCAL } from '../config'

let URLS = {}
if(IS_LOCAL){	
	URLS["ROOT"] = "http://localhost:8000"
	URLS["COMMUNITIES"] = "http://community.massenergize.dev"
} else if(IS_CANARY){
	URLS["ROOT"] =  "https://api-canary.massenergize.org"
	URLS["COMMUNITIES"] =  "https://community-canary.massenergize.org"
}else if(IS_PROD) {
	URLS["ROOT"] =  "https://api.massenergize.org"
	URLS["COMMUNITIES"] =  "https://community.massenergize.org"
} else{
	URLS["ROOT"] =  "https://api.massenergize.dev"
	URLS["COMMUNITIES"] =  "https://community.massenergize.dev"
}

export default URLS;


