/**
 * ������ĸ��Ի�����·��
 * */

module.exports = function () {
    var path = {
        // js-glob���������jsѹ���ļ�·��
        html: [
            "templates/**/*.html",
            "!templates/**/*.part"
        ],
        // js-glob���������jsѹ���ļ�·��
        js: [
            "static/js/**/*.js",
            "!static/js/**/*.min.js",
            "!static/js/**/*.es6.js"
        ],
        // .es6.js-glob���������jsת���ļ�·��
        es6js: [
            "static/js/**/*.es6.js",
            "!static/js/**/*.min.js"
        ],
        // jshint-glob���������js����ļ�·��
        jshint: [
            "static/js/**/app.js",
            "static/js/**/app-config.js",
            "static/js/**/proxy-agent.js",
            "static/js/**/operation-record.js"
        ],
        // css-glob���������cssѹ���ļ�·��
        css: [
            "static/css/*.css",
            "!static/css/*.min.css"
        ],
        // zip-glob��������Ĵ��·��
        zip: [
            "dist/**/*.*",
            "!dist/**/*.zip"
        ],
        // clean-glob��������������ļ�·��
        clean: [
            // "dist/**/*.zip",
            "dist"
        ],
        // scss-glob���������scss�ļ�·��
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