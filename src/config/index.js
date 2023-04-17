var json = require('./config.json');
const { IS_LOCAL, IS_PROD, IS_CANARY, BUILD_VERSION } = json

export { IS_LOCAL, IS_PROD, IS_CANARY, BUILD_VERSION }
