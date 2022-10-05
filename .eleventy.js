const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");

module.exports = 
function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy('./src/static/css');
    eleventyConfig.addPassthroughCopy('./src/static/img');
    eleventyConfig.addPassthroughCopy('./src/static/fonts');

    // Post image shortcode
    eleventyConfig.addShortcode("img", function(src, alt) {
        return `<figure>
        <img data-blink-uuid="${src}" alt="${alt} width="1500" height="1000"">
        </figure>`;
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