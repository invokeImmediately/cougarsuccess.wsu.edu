/*!*************************************************************************************************
 * █▀▀▀ █  █ █    █▀▀▄ █▀▀▀ ▀█▀ █    █▀▀▀      █ ▄▀▀▀
 * █ ▀▄ █  █ █  ▄ █▄▄▀ █▀▀▀  █  █  ▄ █▀▀    ▄  █ ▀▀▀█
 * ▀▀▀▀  ▀▀  ▀▀▀  █    ▀    ▀▀▀ ▀▀▀  ▀▀▀▀ ▀ ▀▄▄█ ▀▀▀ 
 *
 * Gulp automation task definition file for setting up tasks that build CSS and JS files for use on
 *   the Cougar Success website, which is maintained in WSUWP.
 *
 * @version 0.1.0
 *
 * @link https://github.com/invokeImmediately/cougarsuccess.wsu.edu/blob/main/gulpfile.js
 * @author Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @license MIT - Copyright (c) 2022 Washington State University
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *     and associated documentation files (the “Software”), to deal in the Software without
 *     restriction, including without limitation the rights to use, copy, modify, merge, publish,
 *     distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom
 *     the Software is furnished to do so, subject to the following conditions:
 *   The above copyright notice and this permission notice shall be included in all copies or
 *     substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 *     BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 *     DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *     FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **************************************************************************************************/

////////////////////////////////////////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS
// -----------------
// §1: Gulp task dependencies..................................................................40
// §2: Specification of build settings.........................................................62
//   §2.1: logUpdate().........................................................................65
// §3: Entry point: Set up of tasks............................................................77
//   §3.1: Compile TS into JS..................................................................80
//   §3.2: Merge JS modules into single source file...........................................135
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: Gulp task dependencies

// —» Import Node.js package modules for task automation «—
const gulp = require( "gulp" );
const pump = require( "pump" );

// —» Import Node.js package modules for working with TypeScript and JavaScript «—
const ts = require( "gulp-typescript" );
const tsProject = ts.createProject( "tsconfig.json" );
const preserveTsWs = require( "gulp-preserve-typescript-whitespace" );
const prettier = require( "gulp-prettier" );
const terser = require( 'gulp-terser' );
const extName = require( 'gulp-extname' );
const concat = require( 'gulp-concat' );
const replace = require( 'gulp-replace' );

// —» Define task names «—
const compTsTaskNm = "compileTs"
const combJsModlTaskNm = "combineJs"


////////////////////////////////////////////////////////////////////////////////////////////////////
// §2: Additional operations performed by task

//////////
//// §2.1: logUpdate()

// -------»  Declare process for logging updates on task progress to the terminal  «-------
function logUpdate( msg ) {
  let now = new Date();
  console.log( '[\x1b[1;30m%s\x1b[0m] ' + msg,
    now.getHours().toString().padStart( 2, '0' ) + ':' +
    now.getMinutes().toString().padStart(2, '0') + ':' +
    now.getSeconds().toString().padStart( 2, '0' ) );
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// §3: Execution entry point: Set up of build task

//////////
//// §3.1: Compile TS into JS

// -------»  Define the task for compiling TS into JS  «-------
gulp.task( compTsTaskNm, function ( cb ) {
  const tsResult = pump( [
    tsProject.src(),
    preserveTsWs.saveWhitespace().on( 'end', () => {
      logUpdate( 'Whitespace was preserved before compiling TS into JS.' );
    } ),
    tsProject()
  ], cb );
  pump( [
    tsResult.js,
    preserveTsWs.restoreWhitespace().on( 'end', () => {
      logUpdate( 'Whitespace was restored to the compiled JS.' );
    } ),
    prettier( { tabWidth: 2 } ).on( 'end', () => {
      logUpdate( 'Compiled JS has been prettified.' );
    } ),
    gulp.dest( 'JS' ).on( 'end', () => {
      logUpdate( 'Unminified JS file has been written.' );
    } ),
    terser( { output: { comments: /^!/ } } ).on( 'end', () => {
      logUpdate( 'Finished minifying JS with Terser.' );
    } ),
    extName( '.min.js' ),
    gulp.dest( 'JS' ).on( 'end', () => {
      logUpdate( "Minified JS file has been written; task '\u001b[36m" + compTsTaskNm + "\u001b[39m' now truly finished." );
    } )
  ], cb );
} );

// gulp.task("compileTs", function () {
//   return tsProject.src().pipe(tsProject()).js.pipe(prettier({tabWidth:2})).pipe(gulp.dest("JS"));
// });

// gulp.task("compileTs", function ( cb ) {
//   pump( [
//     gulp.src('TS/*.ts'),
//     preserveTsWs.saveWhitespace(),
//     ts( {
//       allowSyntheticDefaultImports: true,
//       noImplicitAny: true,
//       removeComments: false,
//       target: "es6",
//       types: ["jquery"]
//     } ),
//     //preserveTsWs.restoreWhitespace(),
//     prettier( { tabWidth: 2 } ),
//     gulp.dest( "JS" )
//     ], cb
//   );
// });

//////////
//// §3.2: Merge JS modules into single source file for distribution to Custom JavaScript Editor

function fixFileHeaderComments( match, p1, offset, string ) {
  var replacementStr = match;
  if ( offset == 0 ) {
    replacementStr = '/*!';
  }
  return replacementStr;
}

gulp.task( combJsModlTaskNm, function ( cb ) {
  pump( [
    gulp.src( [
      'JS/stageUrlPatcher.js',
      'JS/gpaCalc.js',
    ] ),
    replace( /^(\/\*)(?!!)(?!-)/g, fixFileHeaderComments ).on( 'end', () => {
      logUpdate( 'Removed comments not marked as persistent.' );
    } ),
    concat( 'cust-js-ed-src.js' ).on( 'end', () => {
      logUpdate( 'Finished combining separate script modules into a single file.');
    } ),
    gulp.dest( 'JS' ).on( 'end', () => {
      logUpdate( 'Unminified JS file has been written.' );
    } ),
    terser( { output: { comments: /^!/ } } ).on( 'end', () => {
      logUpdate( 'Finished minifying JS with Terser.' );
    } ),
    extName( '.min.js' ),
    gulp.dest( 'JS' ).on( 'end', () => {
      logUpdate( "Minified JS file has been written; task '\u001b[36m" + compTsTaskNm + "\u001b[39m' now complete." );
    } )
  ], cb );
} );
