// https://youtu.be/YX5yoApjI3M?t=580
// https://www.npmjs.com/package/next-transpile-modules
const withTM = require("next-transpile-modules")(["ui"]);

module.exports = withTM({
  reactStrictMode: true,
});
