const shared = require("@power/config/tailwind");

module.exports = {
  ...shared,
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
    "../**/src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ]
};
