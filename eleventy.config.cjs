
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

    eleventyConfig.setServerOptions({
        watch: ["sites/css/*", "sites/js/*"]
    });

    eleventyConfig.addShortcode("svg", function (icon, size, view, alt) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 ${view} ${view}" aria-label="${alt}"> <use href="/img/icons/${icon}}" /></svg>`;
    });

    return {
        dir: {
            input: "src",
            output: "sites",
            includes: "_includes",
            layouts: "_layouts",
            shortcode: "_shortcode"
        },
        passthroughFileCopy: true
    }
};