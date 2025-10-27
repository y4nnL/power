module.exports = {
  root: false,
  extends: ["next", "next/core-web-vitals"],
  plugins: ["simple-import-sort"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "@next/next/no-html-link-for-pages": "off"
  }
};
