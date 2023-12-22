const pluginTOC = require('eleventy-plugin-toc')
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");
const { EleventyI18nPlugin } = require("@11ty/eleventy");

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
					<svg width="${width}" height="${height}" viewBox="0 0 ${viewWidth} ${viewHeight}" aria-label="${alt}" style="width: ${width / 16}rem; height: ${height / 16}rem;">
					<use href="/img/icons/${icon}.svg#${symbol}" />
					</svg>
				</div>
				<div class="text">
					${content}
				</div>
			</li>`;
	}

	function convertToSlug(text) {
		return text
			.toLowerCase()
			.replace(/ /g, '-')
			.replace(/[^\w-]+/g, '');
	}


	eleventyConfig.addPlugin(pluginTOC, {
		tags: ['h2', 'h3'],
		wrapper: 'li',
		flat: true
	});
	eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: "en"
  });

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

		return `<svg width="${width}" height="${height}" viewBox="0 0 ${viewWidth} ${viewHeight}" aria-label="${alt}"style="width: ${width / 16}rem; height: ${height / 16}rem;"> <use href="/img/icons/${icon}" viewBox="0 0 ${viewWidth} ${viewHeight}" /></svg>`;
	});
	eleventyConfig.addShortcode("a_menu", function (title, url, page_url, now = false) {
		console.log(locale_url, page_url);
		if (now == "true") now = true;
		return `<a href="${url}"` + (page_url == url || now ? ` aria-current="page"` : ``) + `>${title}</a>`;
	});
	eleventyConfig.addShortcode("a_arrow", function (title, url, classes) {
		return `<a href="${url}"` + (classes ? ` class="${classes}"` : ``) + `>${title} <i class="arrow"></i></a>`;
	});
	eleventyConfig.addShortcode("label_checkbox", function (title, url, name) {
		const slug = convertToSlug(title);
		return `
			<input type="radio" name="${name}" id="menu-${slug}" hidden />
			<label for="menu-${slug}"><a href="${url}">${title} <i class="arrow"></i></a></label>
		`;
	});
	eleventyConfig.addShortcode("aria_current_page", function (url, page_url, now) {
		return page_url == url || now ? ` aria-current="page"` : ``;
	});
	eleventyConfig.addShortcode("selection_logo", function (symbol, name) {
		return selection(`<p>${name}</p>`, "202x150", "186x150", "logos", symbol, name + " Logo");
	});
	eleventyConfig.addShortcode("selection_icon_plain", function (title, content, symbol = "") {
		const finalContent = `<h3>${title}</h3><p>${content}</p>`;
		if (symbol == "") symbol = convertToSlug(title);

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
			<svg width="112" height="112" viewBox="0 0 128 128" aria-label="${alt}" style="width: 7rem; height: 7rem;">
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


	//
	//! Get career tags
	//

	// Filter to get tags list
	eleventyConfig.addFilter("getTagList", function (collection) {
		const tagSet = new Set();
		collection.getAll().forEach(item => {
			if ("tags" in item.data) {
				item.data.tags.forEach(tag => {
					if (tag.includes("careers-")) tagSet.add(tag);
				});
			}
		});
		return Array.from(tagSet);
	});

	// Create a collection for each tag
	eleventyConfig.addCollection("tagList", function (collection) {
		return eleventyConfig.getFilter("getTagList")(collection);
	});

	// Convert tag to title
	eleventyConfig.addFilter("makeTitleFromTag", function (value) {
		value = value.replace(/careers-/g, "").replace(/-/g, " ").replace(
			/\w\S*/g,
			function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			}
		);
		return value;
	});



	//
	//! Markdown Overrides
	//

	let markdownLibrary = markdownIt({
		html: true,
		breaks: true,
		linkify: true
	}).use(markdownItAnchor, {
		permalink: false
	});
	eleventyConfig.setLibrary("md", markdownLibrary);


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