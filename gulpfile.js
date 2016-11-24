/*
静态资源打包压缩流程
*/

'use strict'

// 加载插件
var gulp = require("gulp"),
    del = require("del"),
    //vinylPaths = require("vinyl-paths"),
    jshintStyle = require("jshint-stylish"),
    gulpLoadPlugins = require("gulp-load-plugins"),
    $ = gulpLoadPlugins({
        rename: {
            'gulp-minify-css': 'minifycss',
            'gulp-uglify': 'uglify',
            'gulp-sass': 'sass',
            'gulp-concat': 'concat',
            'gulp-watch': 'watch',
            'gulp-zip': 'zip',
            'gulp-size': 'size',
            'gulp-strip-debug': 'stripdebug',
            'gulp-jshint': 'jshint',
            'gulp-plumber': 'plumber',
            'gulp-babel': 'babel',
            'babel-preset-es2015': 'es2015'
        }
    });

// 路径配置
var path = {
    // js-glob，js压缩文件路径
    js: [
        "static/js/**/*.js",
        "!static/js/**/*.min.js",
        "!static/js/**/*.es6.js"
    ],
    // .es6.js-glob，js转码文件路径
    es6js: [
        "static/js/**/*.es6.js",
        "!static/js/**/*.min.js"
    ],
    // jshint-glob，js检查文件路径
    jshint: [
        "static/js/**/app.js",
        "static/js/**/app-config.js",
        "static/js/**/proxy-agent.js",
        "static/js/**/operation-record.js"
    ],
    // css-glob，css压缩文件路径
    css: [
        "static/css/*.css",
        "!static/css/*.min.css"
    ],
    // zip-glob，打包路径
    zip: [
        "dist/**/*.*",
        "!dist/**/*.zip"
    ],
    // clean-glob，清理文件路径
    clean: [
        // "dist/**/*.zip",
        "dist"
    ],
    // scss-glob，scss文件路径
    scss: [
        "static/sass/**/*.scss"
    ],
    base: "static",
    dist: "dist",
    static: "static"
};

// 任务配置
var tasks = {
    // 代码检查
    jshint: function() {
        return gulp.src(path.jshint)
            .pipe($.jshint({
                lastsemic: false,
                asi: true,
                sub: true,
                eqeqeq: false,
            }))
            // .pipe($.jshint.reporter("default"))
            .pipe($.jshint.reporter(jshintStyle))
    },
    // sass编译
    sass: function() {
        return gulp.src(path.scss, {
                base: path.base
            })
            .pipe(watch(path.scss))
            .pipe($.sass().on('error', sass.logError))
            .pipe(gulp.dest(path.dist));
    },
    // js压缩
    minifyjs: function() {
        return gulp.src(path.js, {
                base: path.base
            })
            // .pipe($.concat("app.js"))
            // .pipe($.babel()) 
            // .pipe(gulp.dest("dist/js"))
            .pipe($.size({
                showFiles: true,
                pretty: true
            }))
            .pipe($.rename({
                suffix: ".min"
            }))
            .pipe($.stripdebug())
            .pipe($.uglify())
            .pipe($.size({
                showFiles: true,
                pretty: true
            }))
            .pipe(gulp.dest(path.dist))
    },
    // css压缩
    minifycss: function() {
        return gulp.src(path.css, {
                base: path.base
            })
            .pipe($.size({
                showFiles: true,
                pretty: true
            }))
            .pipe($.rename({
                suffix: ".min"
            }))
            .pipe($.minifycss())
            .pipe($.size({
                showFiles: true,
                pretty: true
            }))
            .pipe(gulp.dest(path.dist))
    },
    // es6转换
    minifyjs6: function() {
        return gulp.src(path.es6js, {
                base: path.base
            })
            .pipe($.babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(path.dist))
            .pipe($.rename({
                suffix: ".min"
            }))
            .pipe($.stripdebug())
            .pipe($.uglify())
            .pipe(gulp.dest(path.dist))
    },
    // 打包发布
    zip: function() {
        var zipFile = 'dist-' + new Date().getTime() + '.zip';
        var staticZipFile = 'dist.zip';
        console.log('create release package: ' + zipFile);
        return gulp.src(path.zip)
            .pipe($.plumber())
            .pipe($.zip(zipFile))
            .on("error", function() {
                console.error("zip error!")
            })
            .pipe(gulp.dest(path.dist))
            .pipe($.rename(staticZipFile))
            .pipe(gulp.dest(path.static))
    },
    // 清理dist
    clean: function() {
        return del(path.clean);
        // return gulp.src(path.clean)
        // .pipe(vinylPaths(del));
    }

};

// 代码检查
gulp.task("jshint", tasks.jshint);

// sass编译
gulp.task('sass', tasks.sass);

// css压缩
gulp.task("minifycss", tasks.minifycss);

// es6转换
gulp.task("minifyjs6", tasks.minifyjs6);

// js压缩
gulp.task("minifyjs", ["jshint"], tasks.minifyjs);

// 清理dist
gulp.task("clean", tasks.clean);

// 打包发布
gulp.task("zip", tasks.zip);

// 监听变化
// gulp.task('sass:watch', function() {
//     gulp.watch(path.scss, ['sass']);
// });

// 静态资源压缩
gulp.task("build", ["minifyjs", "minifycss"])

// 清理dist目录+静态资源压缩
gulp.task("rebuild", function() {
    return del(path.clean).then(function(paths) {
        console.log('delete files:\n', paths.join('\n'));
        gulp.start('build')
    });
});

// 压缩后打包
gulp.task("default", ["build"], function() {
    console.log('before start zip' + new Date())
    gulp.start("zip")
    console.log('after start zip' + new Date())
});