const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Suppress specific warnings
config.resolver.silentWarnings = [
  /Require cycle: node_modules\/protobufjs\/src\/util\/minimal\.js/,
];

module.exports = config;