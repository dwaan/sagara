
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

    eleventyConfig.setServerOptions({
        watch: ["sites/css/*", "sites/js/*"]
    });

    return {
        dir: {
            input: "src",
            output: "sites",
            includes: "_includes",
            layouts: "_layouts"
        },
        passthroughFileCopy: true
    }
};