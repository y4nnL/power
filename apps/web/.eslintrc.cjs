module.exports = {
  root: true,
  extends: ["next", "next/core-web-vitals", "prettier"],
  ignorePatterns: ["*.config.cjs", "node_modules", ".next"],
  parserOptions: {
    tsconfigRootDir: __dirname
  }
};
