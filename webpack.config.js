const webpack = require("@cypress/webpack-preprocessor");

module.exports = (on, config) => {
  const options = {
    webpackOptions: {
      resolve: {
        extensions: [".ts", ".js"],
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            exclude: [/node_modules/],
            use: [
              {
                loader: "ts-loader",
              },
            ],
          },
        ],
      },
    },
  };

  on("file:preprocessor", webpack(options));

  return Object.assign({}, config, {
    fixturesFolder: "test/fixtures",
    integrationFolder: "test/integration",
    screenshotsFolder: "test/screenshots",
    videosFolder: "test/videos",
    supportFile: "test/support/index.ts",
  });
};
