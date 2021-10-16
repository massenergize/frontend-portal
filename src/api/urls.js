// Defining URLS object for manipulation...
import { IS_PROD, IS_CANARY, IS_LOCAL } from '../config'

let URLS = {}
if(IS_LOCAL){	
	URLS["ROOT"] = "http://massenergize.test:8000"
	URLS["COMMUNITIES"] = "http://communities.massenergize.test:8000"
} else if(IS_CANARY){
	URLS["ROOT"] =  "https://api-canary.massenergize.org"
	URLS["COMMUNITIES"] =  "https://community-canary.massenergize.org"
}else if(IS_PROD) {
	URLS["ROOT"] =  "https://api.massenergize.org"
	URLS["COMMUNITIES"] =  "https://communities.massenergize.org"
} else{
	URLS["ROOT"] =  "https://api.massenergize.dev"
	URLS["COMMUNITIES"] =  "https://communities.massenergize.dev"
}

export default URLS;


