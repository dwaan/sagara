
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");

module.exports = function (eleventyConfig) {
	function selection(content, size, view, icon, symbol, alt) {
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
	}


	eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

	eleventyConfig.setServerOptions({
		watch: ["sites/js/*"]
	});

	//
	//! Shortcodes
	//
	eleventyConfig.addShortcode("svg", function (icon, size, view, alt) {
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

		return `<svg width="${width}" height="${height}" viewBox="0 0 ${viewWidth} ${viewHeight}" aria-label="${alt}"> <use href="/img/icons/${icon}" /></svg>`;
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
	eleventyConfig.addShortcode("selection_logo", function (symbol, name) {
		return selection(`<p>${name}</p>`, "202x150", "186x150", "logos", symbol, name + " Logo");
	});
	eleventyConfig.addShortcode("selection_icon_plain", function (title, content) {
		const symbol = title.toLowerCase().replace(/ /g, "-");
		const finalContent= `<h3>${title}</h3><p>${content}</p>`;
		return selection(finalContent, 128, 128, "plain", symbol, title + " Icon");
	});

	//
	//! Paired shortcodes
	//
	eleventyConfig.addPairedShortcode("selection", selection);
	eleventyConfig.addPairedShortcode("selection_icon_shadow", function (content, symbol, alt) {
		return selection(content, 160, 128, "shadow", symbol, alt);
	});
	eleventyConfig.addPairedShortcode("h2", function (content, svg, alt) {
		let icon = `
		<div class="icon">
			<svg width="112" height="112" viewBox="0 0 128 128" aria-label="${alt}">
				<use href="/img/icons/plain.svg#${svg}" />
			</svg>
		</div>`;
		if (svg.toLowerCase() == 'none') icon = ``;

		return `
			<div class="text">
				${icon}
				${content}
			</div>`;
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