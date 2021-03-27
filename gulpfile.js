const { src, dest, series, watch} = require('gulp') // gulp包中本身带有的几个方法
const browserSync = require('browser-sync').create()
const reload = browserSync.reload // 热加载
const del = require('del')
// gulp-uglify => plugins.uglify = require('gulp-uglify')
const plugins = require('gulp-load-plugins')()
// 压缩js、uglifyjs文件
function js (callback) {
    // 指定源文件的一个目录
    // *.js通配符
    src('js/*.js')
        // 下一个处理环节
        .pipe(plugins.uglify()) //处理
        .pipe(dest('./dist/js')) // 输出
        .pipe(reload({ stream:true })) // 自动刷新，热加载
    callback() // 告诉gulp主进程，方法执行完成
}
// 对css/less编译，压缩，输出css文件???
function css(callback) {
    src('css/*.scss')
        .pipe(plugins.sass({ outputStyle: 'compressed' })) // 压缩输出的css代码
        // package.json中配置browserslist
        .pipe(plugins.autoprefixer({
            cascade: false,
            remove: false
        }))
        .pipe(dest('./dist/css'))
        .pipe(reload({ stream:true }))
    callback()
}
// 监听文件的变化
function watcher() {
    watch('js/*.js',js)
    watch('css/*.scss',css)
}
// 清除dist目录中的内容
function clean(callback) {
    del('./dist')
    callback()
}

// server任务
function serve(callback){
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
    callback()
}

// 默认的处理方式方法
exports.js = js
exports.clean = clean
exports.css = css
exports.default = series([
    clean,
    js,
    css,
    serve,
    watcher
])
