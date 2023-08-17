const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const postCss = require('postcss');
const cssnano = require('cssnano');

const postcssFilter = (cssCode, done) => {
	// we call PostCSS here.
	postCss(cssnano({ preset: 'default' }))
		.process(cssCode, {
			// path to our CSS file
			from: './src/_includes/css/styles.css'
		})
		.then(
			(r) => done(null, r.css),
			(e) => done(e, null)
		);
};

module.exports = 
function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy('./src/static/');

    // Watch for changes to css file
    eleventyConfig.addWatchTarget('./src/_includes/css/styles.css');
    eleventyConfig.addNunjucksAsyncFilter('postcss', postcssFilter);


    // Post image shortcode
    eleventyConfig.addShortcode("img", function(src, alt, myClass) {
        return `<img class="${myClass}" data-blink-uuid="${src}" alt="${alt}" width="2496" height="1664">`;
    });

    // Minify and inline CSS
    eleventyConfig.addFilter("cssmin", function(code) {
        return new CleanCSS({}).minify(code).styles;
      });

    // Minify HTML
    eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if( outputPath && outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        continueOnParseError: true
      });
      return minified;
    }
    return content;
    });

    // Set default folders
    return {
        dir: {
            input: "src",
            output: "public"
        }
    };
}