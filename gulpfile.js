const gulp = require("gulp");
const ts = require("gulp-typescript");
const path = require("path");
const rimraf = require('rimraf');

const cwd = process.cwd();
const through2 = require("through2");
const tsConfig = require("./tsconfig.json");
const libDir = path.join(cwd, "lib");
const srcDir = path.join(cwd, "src");
const tsFiles = [
  "**/*.ts",
  "**/*.tsx",
  "!node_modules/**/*.*",
  "typings/**/*.d.ts"
];

function compileTs(stream) {
  return stream
    .pipe(ts(tsConfig.compilerOptions))
    .js.pipe(
      through2.obj(function(file, encoding, next) {
        file.path = file.path.replace(/\.[jt]sx$/, '.js');
        this.push(file);
        next();
      })
    )
    .pipe(gulp.dest(libDir));
}
gulp.task('clean', () => {
  rimraf.sync(libDir);
});
gulp.task('typings', () => {
  return gulp
    .src(['src/**/*.d.ts'], {
      base: srcDir
    })
    // .pipe(postcss(plugins))
    .pipe(gulp.dest(libDir));
})
gulp.task('styles', () => {
  return gulp
    .src(['src/components/**/*.css', 'src/styles/**/*.css'], {
      base: srcDir
    })
    // .pipe(postcss(plugins))
    .pipe(gulp.dest(libDir));
});
gulp.task('tsc', () => {
  return compileTs(
    gulp.src(tsFiles, {
      base: srcDir
    })
  );
});

gulp.task('build', ['clean', 'tsc', 'typings'], () => {});
