const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
const withCSS = require('@zeit/next-css');
const withSCSS = require('@zeit/next-sass');

module.exports = withPlugins([
  [withCSS, {
    cssModules: true,
  }],
  [withSCSS, {
    cssModules: true,
  }],
  [optimizedImages],
]);
