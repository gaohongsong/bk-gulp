/**
 * 定义你的个性化工程路径
 * */

module.exports = function () {
    var path = {
        // js-glob，定义你的js压缩文件路径
        html: [
            "templates/**/*.html",
            "!templates/**/*.part"
        ],
        // js-glob，定义你的js压缩文件路径
        js: [
            "static/js/**/*.js",
            "!static/js/**/*.min.js",
            "!static/js/**/*.es6.js"
        ],
        // .es6.js-glob，定义你的js转码文件路径
        es6js: [
            "static/js/**/*.es6.js",
            "!static/js/**/*.min.js"
        ],
        // jshint-glob，定义你的js检查文件路径
        jshint: [
            "static/js/**/app.js",
            "static/js/**/app-config.js",
            "static/js/**/proxy-agent.js",
            "static/js/**/operation-record.js"
        ],
        // css-glob，定义你的css压缩文件路径
        css: [
            "static/css/*.css",
            "!static/css/*.min.css"
        ],
        // zip-glob，定义你的打包路径
        zip: [
            "dist/**/*.*",
            "!dist/**/*.zip"
        ],
        // clean-glob，定义你的清理文件路径
        clean: [
            // "dist/**/*.zip",
            "dist"
        ],
        // scss-glob，定义你的scss文件路径
        scss: [
            "static/sass/**/*.scss"
        ],
        base: "static",
        static: "static",
        templates: "templates",
        dist: "dist"
    };
    return path;
};