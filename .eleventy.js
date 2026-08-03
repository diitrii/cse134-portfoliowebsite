module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ "src/css": "css" });
    eleventyConfig.addPassthroughCopy({ "src/js": "js" });
    eleventyConfig.addPassthroughCopy({ "src/fonts": "fonts" });
    eleventyConfig.addPassthroughCopy({ "src/about/bio/images": "about/bio/images" });
    return {
        dir: {
            input: "src",
            output: "public",
        },
    };
};