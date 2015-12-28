var gulp = require('gulp');
var allInOne = require("gulp-all-in-one");
var path = require("path");
var fs = require("fs");
var stylus = require("gulp-stylus");

gulp.task('default',function(){
    gulp.src("body/index.js")
	    .pipe(allInOne("MBody", function(filepath, callback){
	    	var ext = path.extname(filepath);
	    	switch(ext){
	    		case ".styl":
	    			gulp.src(filepath)
	    				.pipe(stylus())
	    				.pipe(callback({
	    					type: "style"
	    				}));
	    			break;
	    		case ".tpl":
	    			gulp.src(filepath)
	    				.pipe(callback({
	    					type: "text"
	    				}));
	    			break;
	    		default:
	    			gulp.src(filepath)
	    				.pipe(callback());
	    	}
	    }))
	    .pipe(gulp.dest("body/dist"));
});