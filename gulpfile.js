/*
静态资源打包压缩流程
*/

'use strict';

// 加载插件
var gulp = require("gulp"),
    del = require("del"),
    jshintStyle = require("jshint-stylish"),
    gulpLoadPlugins = require("gulp-load-plugins"),
    $ = gulpLoadPlugins({
        rename: {
            'gulp-htmlmin': 'htmlmin',
            'gulp-clean-css': 'cleancss',
            'gulp-uglify': 'uglify',
            'gulp-sass': 'sass',
            'gulp-concat': 'concat',
            'gulp-watch': 'watch',
            'gulp-zip': 'zip',
            'gulp-size': 'size',
            'gulp-strip-debug': 'stripdebug',
            'gulp-jshint': 'jshint',
            'gulp-cache': 'cache',
            'gulp-plumber': 'plumber',
            'gulp-babel': 'babel'
        }
    });

// 加载路径配置
var path = require('./config.js')();

// 任务配置
var tasks = {
    // 代码检查
    jshint: function() {
        return gulp.src(path.jshint)
            .pipe($.jshint(".jshintrc"))
            // .pipe($.cache($.jshint('.jshintrc')))
            // .pipe($.jshint.reporter("default"))
            .pipe($.jshint.reporter(jshintStyle))
    },
    // sass编译
    sass: function() {
        return gulp.src(path.scss, {
                base: path.base
            })
            .pipe($.watch(path.scss))
            .pipe($.sass().on('error', sass.logError))
            .pipe(gulp.dest(path.dist));
    },
    // html压缩
    minifyhtml: function() {
        return gulp.src(path.html)
            .pipe($.htmlmin({
                ignoreCustomFragments: [
                    /<%inherit[\s\S]*\/>/,
                    /<%include[\s\S]*\/>/,
                    /<%block[\s\S]*?>/,
                    /<%[\s\S]*?%>/,
                    /^(\s)*(#){2,}[\s\S]*>/,
                    /%\s*(if|for|while)\s{1,}\S*:$/,
                    /%[\s]*endif\s$/,
                    /<\/%block[\s\S]*?>/
                ],
                removeComments: true,
                collapseWhitespace: false,
                collapseBooleanAttributes: true,
                removeEmptyAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                minifyJS: true,
                minifyCSS: true
            }))
            .pipe(gulp.dest(path.dist));
    },
    // js压缩
    minifyjs: function() {
        return gulp.src(path.js, {
                base: path.base
            })
            // .pipe($.concat("app.js"))
            // .pipe($.babel()) 
            // .pipe(gulp.dest(path.dist))
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
            .pipe(gulp.dest(path.static))
    },
    // css压缩
    cleancss: function() {
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
            .pipe($.cleancss())
            .pipe($.size({
                showFiles: true,
                pretty: true
            }))
            .pipe(gulp.dest(path.dist))
            .pipe(gulp.dest(path.static))
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
        console.log('create release package: ' + zipFile);
        return gulp.src(path.zip)
            .pipe($.plumber())
            .pipe($.zip(zipFile))
            .on("error", function() {
                console.error("zip error!")
            })
            .pipe(gulp.dest(path.dist))
            .pipe(gulp.dest(path.static))
    },
    // 清理dist
    clean: function() {
        del(path.clean);
        return $.cache.clearAll();
    }
};

// 代码检查
gulp.task("jshint", tasks.jshint);

// sass编译
gulp.task('sass', tasks.sass);

// css压缩
gulp.task("cleancss", tasks.cleancss);

// html压缩(慎重，若Html中掺杂其他模板语法，可能出现问题，建议只压缩内嵌css/js)
gulp.task("minifyhtml", tasks.minifyhtml);

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
gulp.task("build", ["minifyjs", "cleancss"]);

// 清理dist目录+静态资源压缩
gulp.task("rebuild", function() {
    return del(path.clean).then(function(paths) {
        console.log('delete files:\n', paths.join('\n'));
        gulp.start('build');
    });
});

// 压缩后打包
gulp.task("default", ["build"], function() {
    gulp.start("zip");
});


// 帮助说明
gulp.task("help", function() {
    var helpInfo = "step1. npm install\n" +
        "step2. npm install -g gulp\n" +
        "step3. gulp <help|build|rebuild|zip|minifyjs|cleancss|minifyhtml|jshint|minifyjs6|sass>";
    console.log(helpInfo)
});
