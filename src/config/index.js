var json = require('./config.json');
const { IS_LOCAL, IS_PROD, IS_CANARY, BUILD_VERSION } = json;
// module.exports = { IS_LOCAL, IS_PROD, IS_CANARY, BUILD_VERSION }
module.exports = IS_LOCAL;
module.exports = IS_PROD;
module.exports = IS_CANARY;
module.exports = BUILD_VERSION;
