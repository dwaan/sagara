
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

    eleventyConfig.setServerOptions({
        watch: ["sites/css/*", "sites/js/*"]
    });

    //
    //! Custom shortcodes to be use in templete, reload 11ty after editinf
    //
    eleventyConfig.addShortcode("svg", function (icon, size, view, alt) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 ${view} ${view}" aria-label="${alt}"> <use href="/img/icons/${icon}}" /></svg>`;
    });
    eleventyConfig.addShortcode("a_menu", function (title, url, page_url) {
        return `<a href="${url}"` + (page_url == url ? ` aria-current="page"` : ``) + `>${title}</a>`;
    });
    eleventyConfig.addShortcode("a_arrow", function (title, url, classes, page_url) {
        return `<a href="${url}"` + (classes ? ` class="${classes}"` : ``) + (page_url == url ? ` aria-current="page"` : ``) + `>${title} <i class="arrow"></i></a>`;
    });
    eleventyConfig.addShortcode("aria_current_page", function (url, page_url, now) {
        return page_url == url || now ? ` aria-current="page"` : ``;
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