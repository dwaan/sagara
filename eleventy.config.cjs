
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

	eleventyConfig.setServerOptions({
		watch: ["sites/js/*"]
	});

	//
	//! Custom shortcodes to be use in templete, reload 11ty after editing
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
	eleventyConfig.addPairedShortcode("selection", function (content, size, view, icon, symbol, alt) {
		size = size.toString().toLowerCase();
		view = view.toString().toLowerCase();

		let width = size;
		let height = size;
		let viewWidth = view;
		let viewHeight = view;

		if (size.includes('x')) {
			size = size.split('x');
			width = size[0];
			height = size[1];
		}
		if (view.includes('x')) {
			view = view.split('x');
			viewWidth = view[0];
			viewHeight = view[1];
		}

		return `
			<li>
				<div class="img">
					<svg width="${width}" height="${height}" viewBox="0 0 ${viewWidth} ${viewHeight}" aria-label="${alt}">
					<use href="/img/icons/${icon}.svg#${symbol}" />
					</svg>
				</div>
				<div class="text">
					${content}
				</div>
			</li>`;
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