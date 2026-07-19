/** @type {(config: import('@bacons/apple-targets').ConfigFunction) => object} */
module.exports = (config) => ({
  type: "widget",
  icon: "../../assets/icon.png",
  deploymentTarget: "16.0",
  entitlements: {
    "com.apple.security.application-groups":
      config.ios.entitlements["com.apple.security.application-groups"],
  },
});
