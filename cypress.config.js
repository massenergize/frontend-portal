const { defineConfig } = require("cypress");
const execa = require('execa')
const findBrowser = () => {
  // the path is hard-coded for simplicity
  const browserPath =
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'

  return execa(browserPath, ['--version']).then((result) => {
    // STDOUT will be like "Brave Browser 77.0.69.135"
    const [, version] = /Brave Browser (\d+\.\d+\.\d+\.\d+)/.exec(result.stdout)
    const majorVersion = parseInt(version.split('.')[0])

    return {
      name: 'Brave',
      channel: 'stable',
      family: 'chromium',
      displayName: 'Brave',
      version,
      path: browserPath,
      majorVersion,
    }
  })
}

module.exports = defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 6000,
  projectId: 'rg6xop',

  retries: {
    openMode: 0,
    runMode: 2,
  },

  video: false,
  viewportHeight: 1600,
  viewportWidth: 1800,

  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    charts: true,
    json: true,
    reportPageTitle: "MassEnergize Community Portal Frontend Testing Report",
    embeddedScreenshots: true,
    inlineAssets: true,
  },

  e2e: {
    testIsolation: false,
    setupNodeEvents(on, config) {
      return findBrowser().then((browser) => {
        return {
          browsers: config.browsers.concat(browser),
        }
      })
    },
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",

  },


  // e2e: {
  //   // We've imported your old cypress plugins here.
  //   // You may want to clean this up later by importing these.
  //   testIsolation: false,
  //   setupNodeEvents(on, config) {
  //     return require("./cypress/plugins/index.js")(on, config);
  //   },
  //   specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  // },

  // e2e: {
  //   // ... other configurations
  //   setupNodeEvents(on, config) {
  //     if (require('path').existsSync('node_modules/webpack')) {
  //       on('file:preprocessor', require('@cypress/webpack-preprocessor'));
  //     }
  //   },
  // },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
  experimentalStudio: true,
});
