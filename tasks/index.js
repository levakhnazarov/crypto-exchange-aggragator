import gulp from 'gulp'
import gulpif from 'gulp-if'
import clean from 'gulp-clean'

import stylus from 'gulp-stylus'
import autoprefixer from 'autoprefixer-stylus'
import rev from 'gulp-rev'
import svgSprite from 'gulp-svg-sprite'
import webpack from 'webpack-stream'
import webpackBase from 'webpack'
import browserSync from 'browser-sync'
const bro = browserSync.create()
const reload = bro.reload
const stream = bro.stream
const concat = require('gulp-concat');
import path from 'path'

const isProd = (process.env.NODE_ENV === 'production')

gulp.task('browser-sync', () => {
  bro.init({
    proxy: 'localhost:3000',
    open: false,
    port: 1337
  })
})

gulp.task('webpack', () => {
  return gulp.src('resources/js/app.js')
    .pipe(webpack({
      output: {
        filename: 'bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/assets/js/"
      },
        resolve: {
            modules: ['node_modules'],
            alias: {
                'TweenLite': 'gsap/src/minified/TweenLite.min.js',
                'TweenMax': 'gsap/src/minified/TweenMax.min.js',
                'TimelineLite': 'gsap/src/minified/TimelineLite.min.js',
                'TimelineMax': 'gsap/src/minified/TimelineMax.min.js',
                'ScrollMagic': 'scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
                'animation.gsap': 'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js',
                'debug.addIndicators': 'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js'
            }
        },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015'],
              plugins: ['syntax-dynamic-import']
            }
          }
        ]
        // rules: [
        // rules: [
        //   {
        //     test: /\.jsx?/i,
        //     loader: 'babel-loader',
        //     options: {
        //       presets: [
        //         'es2015'
        //       ],
        //       plugins: [
        //         ['transform-react-jsx', { pragma: 'h' }]
        //       ]
        //     }
        //   }
        // ]
      }
      // plugins: [ new webpackBase.optimize.UglifyJsPlugin() ]
    }))
    .pipe(gulp.dest('public/assets/js'));
})
gulp.task('webpack-watch', ['webpack'], () => reload());

gulp.task('styles', () => {
  return gulp.src('resources/stylus/main.styl')
    .pipe(stylus({
      'include css': true,
      use: [autoprefixer()]
    }))
    .pipe(gulp.dest('public/assets/css'))
    .pipe(stream());
})

//TODO
gulp.task('svg-sprite', () => {
  return gulp.src('./resources/images/currencies/**/*.svg',{base:'./resources/images/currencies/'})
    // .pipe(concat(''))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "../sprite.svg",
          render: {
            styl: {
              dest: '../../resources/stylus/sprite/sprite.styl',
              template: 'resources/stylus/sprite/template.styl'
            }
          }
        }
      }
    }))
    .pipe(gulp.dest('public/assets'));
});
// gulp.task('svg-currencies-sprite', () => {
//   return gulp.src('node_modules/cryptocurrency-icons/svg/color/*.svg')
//     .pipe(gulp.dest('public/assets/images/currencies'));
// })
// gulp.task('svg-currencies-sprite', () => {
//   return gulp.src('public/resources/images/currencies/*.svg')
//     .pipe(gulp.dest('public/assets/images/currencies'));
// })

gulp.task('watch', [
    'browser-sync', 
    'styles', 
    'svg-sprite', 
    // 'svg-currencies-sprite',
    'webpack'
  ], () => {
    gulp.watch('resources/views/**/*.pug').on('change', reload)
    gulp.watch('resources/stylus/**/*.styl', ['styles'])
    gulp.watch([
      'resources/images/svg/**/*.svg', 
      'resources/stylus/sprite/template.styl'
    ], ['svg-sprite'])
    gulp.watch(['resources/js/**/*.js'], ['webpack-watch'])
})

gulp.task('default', ['watch'])
// gulp.task('build', ['clean', 'styles-rev'])