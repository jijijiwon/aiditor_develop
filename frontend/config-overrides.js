const path = require("path");
const { override, addWebpackAlias } = require("customize-cra");

module.exports = override(
  addWebpackAlias({
    config: path.resolve(__dirname, "aivoultion/config"),
  })
);
