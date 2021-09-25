// Defining URLS object for manipulation...
import { IS_PROD, IS_CANARY, IS_LOCAL } from '../config'

let URLS = {}
if(IS_LOCAL){	
	URLS["ROOT"] = "http://localhost:8000"
} else if(IS_CANARY){
	URLS["ROOT"] =  "https://api-canary.massenergize.org"
}else if(IS_PROD) {
	URLS["ROOT"] =  "https://api.massenergize.org"
} else{
	URLS["ROOT"] =  "https://api-dev.massenergize.org"
}
URLS["ROOT"] = "https://6a6126d5f08b.ngrok.io"


export default URLS;


