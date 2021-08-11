//Babel allows us to convert modern js code into backwards compatible versions
//This includes converting jsx into browser-readable code

// const es2015 = require('babel-preset-env');
// const presetReact = require('babel-preset-react');


// require('@babel/plugin-transform-template-literals')
// require('@babel/plugin-transform-arrow-functions')
// require( "@babel/plugin-syntax-dynamic-import")
require("@babel/register")

// ({
//   presets: ["@babel/preset-react", '@babel/preset-env' ],
//   // plugins: [
//   //   "transform-object-rest-spread",
//   //   // '@babel/plugin-transform-template-literals',
//   //   ["transform-es2015-arrow-functions"],
//   //   '@babel/plugin-transform-arrow-functions'
//   // ]

// });

// require("babel-register")({
//   presets: ['@babel/preset-env', "@babel/preset-react" ],
//   plugins: [
//     "transform-object-rest-spread",
//     '@babel/plugin-transform-template-literals',
//     '@babel/plugin-transform-arrow-functions'
//   ]
// });

require.extensions['.jpg'] = () => {};
require.extensions['.jpeg'] = () => {};
require.extensions['.gif'] = () => {};
require.extensions['.png'] = () => {};
require.extensions['.svg'] = () => {};

// require("babel-core").transform("code", {
//   plugins: ["transform-object-rest-spread"]
// });

//Import our routes
const router = require("./src/AppRouter2").default;
// const Sitemap = require("react-router-sitemap").default;

// function generateSitemap() {
//   return (
//   new Sitemap(router())
//   .build("https://www.example.com")
//  //Save it wherever you want
//   .save("../public/sitemap.xml")
//   );
// }

// generateSitemap();