
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

    eleventyConfig.addPassthroughCopy("cache/css/*");
    eleventyConfig.addPassthroughCopy("cache/fonts");
    eleventyConfig.addPassthroughCopy("cache/js");
    eleventyConfig.addPassthroughCopy("cache/img");
    eleventyConfig.addPassthroughCopy({ "src/meta/*": "./" });

    eleventyConfig.setUseGitIgnore(false);
    eleventyConfig.setServerOptions({
        watch: ["cache/css/*", "cache/js/*"]
    });

    return {
        dir: {
            input: "cache",
            output: "sites",
            includes: "_includes",
            layouts: "_layouts"
        },
        passthroughFileCopy: true
    }
};