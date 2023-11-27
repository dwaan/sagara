module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("_src/css/*.css");
    eleventyConfig.addPassthroughCopy("_src/js");
    eleventyConfig.addPassthroughCopy("_src/img");

    return {
        dir: {
            input: "_src",
            output: "sites",
            includes: "_includes",
            layouts: "_layouts"
        },
        passthroughFileCopy: true
    }
};