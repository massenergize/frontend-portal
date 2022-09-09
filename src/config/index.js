var json = require('./config.json');
const { IS_LOCAL, IS_PROD, IS_CANARY, BUILD_VERSION } = json;
// module.exports = { IS_LOCAL, IS_PROD, IS_CANARY, BUILD_VERSION }
export default { IS_LOCAL, IS_PROD, IS_CANARY, BUILD_VERSION };
