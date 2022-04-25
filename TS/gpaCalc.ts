interface cumlGpaFldMsgs {
  allInputs: string,
  noCourses: string,
  noCumlGpa: string,
  noInputs: string,
  noTotCreds: string,
  onlyCourses: string,
  onlyCumlGpa: string,
  onlyTotCreds: string,
}

interface gpaCalcOpts {
  $: JQueryStatic;
  courseFldsSel: string;
  cumlGpaFldSel: string;
  cumlGpaMsgs: cumlGpaFldMsgs;
  curCumlGpaFldSel: string;
  formSel: string;
  sbmtBtnSel: string;
  semGpaCoursesListStr: string;
  semGpaFldSel: string;
  semGpaNoCoursesMsg: string;
  totCredsFldSel: string;
}

interface gradeLookup {
  [key: string]: number
}

/*-*************************************************************************************************
 * █▀▀▀ █▀▀▄ ▄▀▀▄ ▄▀▀▀ ▄▀▀▄ █    ▄▀▀▀   ▐▀█▀▌▄▀▀▀
 * █ ▀▄ █▄▄▀ █▄▄█ █    █▄▄█ █  ▄ █        █  ▀▀▀█
 * ▀▀▀▀ █    █  ▀  ▀▀▀ █  ▀ ▀▀▀   ▀▀▀ ▀   █  ▀▀▀
 *
 * Custom JS script module for functionalizing the Cougar Success website's GPA calculator built in
 *   the Gravity Forms.
 *
 * @version 0.3.0
 *
 * @author Daniel C. Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/cougarsuccess.wsu.edu/blob/main/JS/gpaCalc.js
 * @license MIT - Copyright (c) 2022 Washington State University
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *     and associated documentation files (the “Software”), to deal in the Software without
 *     restriction, including without limitation the rights to use, copy, modify, merge, publish,
 *     distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
 *     Software is furnished to do so, subject to the following conditions:
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
// §1: PERSISTENT DOCUMENTATION for final output................................................52
// §2: SETUPGPACALC class.......................................................................70
//   §2.1: Constructor initiated operations....................................................140
//   §2.2: Event initiated operations..........................................................211
//   §2.3: Utility methods.....................................................................294
// §3: Code execution TRIGGERED BY GRAVITY FORM RENDERING......................................327////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: PERSISTENT DOCUMENTATION for final output

/*!***
 * gpaCalc.js - v0.3.0
 * Custom JS script module for functionalizing the Cougar Success website's GPA calculator built in the Gravity Forms.
 * By Daniel C. Rieck (daniel.rieck@wsu.edu). See [GitHub](https://github.com/invokeImmediately/cougarsuccess.wsu.edu/blob/main/JS/gpaCalc.js) for more info.
 * Copyright (c) 2022 Washington State University and governed by the MIT license.
 ****/

( function( opts: gpaCalcOpts ) {
  const $: JQueryStatic = opts.$;
  const courseFldsSel: string = opts.courseFldsSel;
  const cumlGpaFldSel: string = opts.cumlGpaFldSel;
  const cumlGpaMsgs: cumlGpaFldMsgs = opts.cumlGpaMsgs;
  const curCumlGpaFldSel: string = opts.curCumlGpaFldSel;
  const formSel: string = opts.formSel;
  const sbmtBtnSel: string = opts.sbmtBtnSel;
  const semGpaCoursesListStr: string = opts.semGpaCoursesListStr;
  const semGpaFldSel: string = opts.semGpaFldSel;
  const semGpaNoCoursesMsg: string = opts.semGpaNoCoursesMsg;
  const totCredsFldSel: string = opts.totCredsFldSel;

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // §2: SETUPGPACALC class

// ---»  Declare the setUpGpaCalc class. «---
class setUpGpaCalc {
    $courseFlds: JQuery;
    $cumlGpa: JQuery;
    $cumlGpaLbl: JQuery;
    $curCumlGpa: JQuery;
    $form: JQuery;
    $sbmtBtn: JQuery;
    $semGpa: JQuery;
    $semGpaLbl: JQuery;
    $totCreds: JQuery;
    clMissingInp: string;
    courseFldsSel: string;
    cumlGpaFldSel: string;
    cumlGpaMsgs: string[];
    curCumlGpaFldSel: string;
    formSel: string;
    gradeLookupTbl: gradeLookup;
    sbmtBtnSel: string;
    semGpaCoursesListStr: string;
    semGpaFldSel: string;
    semGpaNoCoursesMsg: string;
    totCredsFldSel: string;

    // ---»  Construct a setUpGpaCalc object.  «---
    constructor (
      formSel: string,
      sbmtBtnSel: string,
      curCumlGpaFldSel: string,
      totCredsFldSel: string,
      courseFldsSel: string,
      semGpaFldSel: string,
      semGpaNoCoursesMsg: string,
      semGpaCoursesListStr: string,
      cumGpaFldSel: string,
      cumlGpaMsgs: cumlGpaFldMsgs,
    ) {
      // Store a copy of selector strings with the instance.
      this.formSel = formSel;
      this.sbmtBtnSel = sbmtBtnSel;
      this.curCumlGpaFldSel = curCumlGpaFldSel;
      this.totCredsFldSel = totCredsFldSel;
      this.courseFldsSel = courseFldsSel;
      this.semGpaFldSel = semGpaFldSel;
      this.semGpaNoCoursesMsg = semGpaNoCoursesMsg;
      this.semGpaCoursesListStr = semGpaCoursesListStr;
      this.cumlGpaFldSel = cumlGpaFldSel;
      this.cumlGpaMsgs = [
        cumlGpaMsgs.noInputs,
        cumlGpaMsgs.onlyCumlGpa,
        cumlGpaMsgs.onlyTotCreds,
        cumlGpaMsgs.noCourses,
        cumlGpaMsgs.onlyCourses,
        cumlGpaMsgs.noTotCreds,
        cumlGpaMsgs.noCumlGpa,
        cumlGpaMsgs.allInputs,
      ];

      // Class for marking missing inputs.
      this.clMissingInp = "gpa-calc-gf__missing-inp";

      // Set up the grade lookup table.
      this.gradeLookupTbl = {
        "A": 4,
        "A-": 3.7,
        "B+": 3.3,
        "B": 3.0,
        "B-": 2.7,
        "C+": 2.3,
        "C": 2.0,
        "C-": 1.7,
        "D+": 1.3,
        "D": 1.0,
        "F": 0
      };

      // If it is present, obtain a reference to the GPA Calculator Gravity Forms form within the
      //   web page's DOM.
      this.$form = $( formSel );
      if ( this.$form.length !== 1 ) {
        return;
      }

      // Since a GPA Calculator was found, proceed with additional set up operations.
      this.disableSbmtBtn();
      this.disableSemGpaField();
      this.disableCumlGpaField();
      this.restrictCurGpaEntry();
      this.restrictTotCreditsEntry();
      this.restrictGradeEntry();
      this.restrictCreditsEntry();
      this.restrictRetakeEntry();
      this.restrictRetakeGradeEntry();
      this.setUpCalculations();
      this.addMoreInitialRows();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // §2.1: Constructor initiated operations

    // ---»  Add more rows to the course details list field.  «---
    addMoreInitialRows() {
      // Gravity forms starts list fields with one row, so add more to make it more convenient for 
      //   the user.
      // TODO: start with six rows.
      // TODO: Check the number of rows that are present before adding more.
      // TODO: Finish writing function
    }

    // ---»  The cumulative GPA field should be read-only to avoid confusion.  «---
    disableCumlGpaField() {
      // Find the semester GPA field and label within the DOM.
      this.$cumlGpa = this.$form.find( this.cumlGpaFldSel );
      this.$cumlGpaLbl = this.$cumlGpa.parents( '.gfield' ).first().find( '.gfield_description' );

      // Disable most keyboard-mediated editing of the cumulative GPA field's input.
      this.$cumlGpa.on( 'keydown', function( e ) {

        // Only allow ctrl + A, ctrl + C, and left/right arrow navigation.
        if ( !(
          ( e.key.toUpperCase() == "A" && e.ctrlKey ) ||
          ( e.key.toUpperCase() == "C" && e.ctrlKey ) ||
          ( e.key == "ArrowRight" ) ||
          ( e.key == "ArrowLeft" ) ||
          ( e.key == "Tab" )
        ) ) {
          e.preventDefault();
        }
      } );

      // Prevent cutting and pasting.
      this.$cumlGpa.on( 'cut', function( e ) { e.preventDefault(); } );
      this.$cumlGpa.on( 'paste', function( e ) { e.preventDefault(); } );

      // Use WAI-ARIA to inform the user that the field is disabled.
      this.$cumlGpa.attr( 'aria-disabled', 'true' );
    }

    // ---»  Since the form is a calculator, its submit button should not be used.  «---
    disableSbmtBtn() {
      // Find the submit button in the DOM.
      this.$sbmtBtn = $( this.sbmtBtnSel );

      // Disable click, tab navigation, and keyboard navigation.
      this.$sbmtBtn.on( 'click', function( e ) {
        e.preventDefault();
      } );
      this.$sbmtBtn.on( 'keydown', function( e ) {
        e.preventDefault();
      } );
      this.$sbmtBtn.attr( 'tabindex', '-1' );
      this.$sbmtBtn.prop( 'disabled', true );

      // Now that it is non-functional, hide the button from the person viewing the page.
      this.$sbmtBtn.css( 'display', 'none' );
    }

    // ---»  The semester GPA field should be read-only to avoid confusion.  «---
    disableSemGpaField() {
      // Find the semester GPA field and label within the DOM.
      this.$semGpa = this.$form.find( this.semGpaFldSel );
      this.$semGpaLbl = this.$semGpa.parents( '.gfield' ).first().find( '.gfield_description' );

      // Disable most keyboard-mediated editing of the semester GPA field's input.
      this.$semGpa.on( 'keydown', function( e ) {

        // Only allow ctrl + A, ctrl + C, and left/right arrow navigation.
        if ( !(
          ( e.key.toUpperCase() == "A" && e.ctrlKey ) ||
          ( e.key.toUpperCase() == "C" && e.ctrlKey ) ||
          ( e.key == "ArrowRight" ) ||
          ( e.key == "ArrowLeft" ) ||
          ( e.key == "Tab" )
        ) ) {
          e.preventDefault();
        }
      } );

      // Prevent cutting and pasting.
      this.$semGpa.on( 'cut', function( e ) { e.preventDefault(); } );
      this.$semGpa.on( 'paste', function( e ) { e.preventDefault(); } );

      // Use WAI-ARIA to inform the user that the field is disabled.
      this.$semGpa.attr( 'aria-disabled', 'true' );
    }

    // ---»  Relevant user input must follow a GPA format.  «---
    restrictCurGpaEntry() {
      this.$curCumlGpa = this.$form.find( this.curCumlGpaFldSel );
      // TODO: Finish writing function
    }

    // ---»  Relevant user input must follow a numerical credits format.  «---
    restrictCreditsEntry() {
      // TODO: Finish writing function
    }

    // ---»  Relevant user input must follow a letter grade format.  «---
    restrictGradeEntry() {
      // TODO: Finish writing function
    }

    // ---»  Relevant user input must follow acceptable course retake indicators.  «---
    restrictRetakeEntry() {
      // TODO: Finish writing function
    }

    // ---»  Relevant user input must follow a letter grade format.  «---
    restrictRetakeGradeEntry() {
      // TODO: Finish writing function
    }

    // ---»  Relevant user input must follow a numerical credits format.  «---
    restrictTotCreditsEntry() {
      this.$totCreds = this.$form.find( this.totCredsFldSel );
      // TODO: Finish writing function
    }

    // ---»  Automatically calculate GPAs when needed.  «---
    setUpCalculations() {
      this.$courseFlds = this.$form.find( this.courseFldsSel );
      this.$cumlGpa = this.$form.find( this.cumlGpaFldSel );
      const inst: setUpGpaCalc = this;
      this.$form.on( 'change', this.courseFldsSel + ' input', function ( e: Event ) {
        const $input: JQuery = $( this );
        inst.checkCourseDetailsRow( e, $input );
      } );
      // TODO: Finish writing function
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // §2.2: Event initiated operations

    // ---»  Respond intelligently to changes in course details input.  «---
    checkCourseDetailsRow( e: Event, $input: JQuery ) {
      const $prntFld: JQuery = $input.parent();
      const $prntRow: JQuery = $prntFld.parent();
      this.chkCourseNameAbs( $prntRow );
      // if ( $prntFld.hasClass( 'gfield_list_5_cell1' ) ) {
      //   this.chkCourseNameAbs( $prntRow );
      // } else if ( $prntFld.hasClass( 'gfield_list_5_cell2' ) ) {
      //   //this.chkCourseNameAbs( $prntRow );
      //   //this.chkCreditsMissing( $prntRow );
      // } else if ( $prntFld.hasClass( 'gfield_list_5_cell3' ) ) {
      //   //this.chkCourseNameAbs( $prntRow );
      //   //this.chkGradeMissing( $prntRow );
      // } else if ( $prntFld.hasClass( 'gfield_list_5_cell4' ) ) {
      //   //this.chkCourseNameAbs( $prntRow );
      //   //this.chkGradeAbs( $prntRow );
      //   //this.checkRetakeAbs( $prntRow );
      //   //this.checkRetakeGradeAbs( $prntRow );
      // } else {
      //   // TODO: Finish writing block.
      // }

      // TODO: Finish writing function

      // Now recalculate the GPAs.
      this.recalcGpas( e );
    }

    // ---»  When instructed, calculate all GPAs.  «---
    recalcGpas( e: Event ) {
      this.recalcSemGpa( e );
      this.recalcCumlGpa( e );
      // TODO: Finish writing function.
    }

    // ---»  When instructed, calculate the semester GPAs.  «---
    recalcSemGpa( e: Event ) {
      console.log( 'Recalculating semester GPA.' );
      let semGpa: number = 0;
      let totCredits: number = 0;
      const $rows: JQuery = this.$courseFlds.find( '.gfield_list_group' );
      const inst: setUpGpaCalc = this;
      const coursesUsed: string[] = [];

      // Run through the course details rows and add courses in the averaging calculation whose
      //   inputs have been completed by user.
      $rows.each( function() {
        const $this: JQuery = $( this );
        const $course: JQuery = $this.find( '.gfield_list_5_cell1 input' );
        const $grade: JQuery = $this.find( '.gfield_list_5_cell2 input' );
        const gradeStr: string = $grade.val().toString();
        const gradeVal: null | number = $grade.val() !== "" ?
          inst.gradeLookupTbl[ gradeStr ] :
          null;
        const $credits: JQuery = $this.find( '.gfield_list_5_cell3 input' );
        const credits: number = parseInt( $credits.val().toString(), 10 );
        if ( gradeVal !== null && credits > 0 ) {
          semGpa += gradeVal * credits;
          totCredits += credits;
          coursesUsed.push( $course.val().toString() );
        }
      } );

      // Complete the averaging calculation, if any, and report the result to the user.
      if( totCredits > 0 ) {

        // Before reporting results to reduce performance impacts, collapse the array of classes
        //   that will be included in the GPA calculation into a comma separated string.
        const courseList = coursesUsed.reduce( (
            prevRslt: string,
            curVal: string,
            curIdx: number
          ): string => {
            return curIdx === 0 ?
              curVal :
              prevRslt + ", " + curVal;
          }, '' );

        // Calculate and report the semester GPA rounded to the standard two decimal places.
        this.$semGpa.val( ( semGpa / totCredits ).toFixed( 2 ) );

        // Report the courses that were used in the GPA calculation.
        this.$semGpaLbl.html( this.semGpaCoursesListStr + courseList );
      } else {

        // Since there are no courses being used in the GPA calculation, report the default 
        //   "awaiting input" message to the user.
        this.$semGpaLbl.html( this.semGpaNoCoursesMsg );
      }
    }

    // ---»  When instructed, calculate the cumulative GPA.  «---
    recalcCumlGpa( e: Event ) {
      console.log( 'Recalculating cumulative GPA.' );
      let futCumlGpa: number = 0;
      let futCreds: number = 0;
      const inst: setUpGpaCalc = this; // «-- TODO: Needed?

      // Determine whether we have inputs in the fields we need to calculate the cumulative GPA.
      const semGpa: null | number = ( this.$semGpa.val().toString() !== "" ) ?
        parseFloat( this.$semGpa.val().toString() ) :
        null;
      const totCreds: null | number = ( this.$totCreds.val().toString() !== "" ) ?
        parseFloat( this.$totCreds.val().toString() ) :
        null;
      const curCumlGpa: null | number = ( this.$curCumlGpa.val().toString() !== "" ) ?
        parseFloat( this.$curCumlGpa.val().toString() ) :
        null;

      // Create an index whose value is mapped to the appropriate message in the array containing a 
      //   list of messages about how the cumulative GPA field is responding to form state.
      const msgIdx: number = ( ( semGpa !== null ? 1 : 0 ) << 2 ) |
        ( ( totCreds !== null ? 1 : 0 ) << 1 ) |
        ( curCumlGpa !== null ? 1 : 0 );

      // Use the message index to report field state to the
      this.$cumlGpaLbl.html( this.cumlGpaMsgs[ msgIdx ] );
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // §2.3: Utility methods

    // ---»  Deal with the case when a course's name is still missing.  «---
    chkCourseNameAbs( $row: JQuery ) {
      const $input: JQuery = $row.find( '.gfield_list_5_cell1 input' );
      const entry: string = $input.val().toString();
      if ( this.rowIsEmpty( $row ) ) {
        $row.find( 'input' ).removeClass( this.clMissingInp );
      } else if ( entry === '' ) {
        const ariaLbl: string = $input.attr( 'aria-label' ).toString();
        const needle: RegExp = /Course Name, Row ([0-9]+)/;
        const match = ariaLbl.match( needle );
        $input.val( `Course ${match[1]}` );
      }
    }

    // ---»  Mark an input as missing so the user can more easily spot it.  «---
    markInpAsMissing( $input: JQuery ) {
      // TODO: Finish writing function.
    }

    // ---»  Report on whether the inputs in a list field row are all totally empty.  «---
    rowIsEmpty( $row: JQuery ) {
      const $inputs: JQuery = $row.find( 'input' );
      let rowEmpty: boolean = true;
      $inputs.each( function() {
        const $this = $( this );
        if ( rowEmpty ) {
          rowEmpty = $this.val() === '';
        }
      } );
      return rowEmpty;
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // §3: Code execution TRIGGERED BY GRAVITY FORM RENDERING

  // ---»  Set up event handler to check for an instance of the GPA Calculator gravity form and set
  //   it up if it is present.  «---
  $( document ).on( 'gform_post_render', function () {
    const setUpInst = new setUpGpaCalc( formSel, sbmtBtnSel, curCumlGpaFldSel, totCredsFldSel, courseFldsSel, semGpaFldSel, semGpaNoCoursesMsg, semGpaCoursesListStr, cumlGpaFldSel, cumlGpaMsgs );
  } );
} )( {
  // Reference to the jQuery instance.
  $: jQuery,

  // Selector string for isolating the GPA calculator from the DOM.
  formSel: '.gpa-calc-gf',

  // Selector string for isolating the submit button within DOM.
  sbmtBtnSel: '.gform_button[type="submit"]',

  // Selector string for isolating the list field for collecting course details within the DOM.
  courseFldsSel: '.gfield.gpa-calc-gf__course-details',

  // Selector string for isolating the semester GPA field within the DOM.
  semGpaFldSel: '.gfield.gpa-calc-gf__sem-gpa input',

  // Default description for the semester GPA field when no courses have been entered.
  semGpaNoCoursesMsg: 'Waiting for course details to be entered.',

  // Description substring for the semester GPA field description for indicating to the user what
  //   courses have been factored into the calculation.
  semGpaCoursesListStr: 'This GPA is based on the details entered for courses: ',

  // Selector string for isolating the semester GPA field within the DOM.
  cumlGpaFldSel: '.gfield.gpa-calc-gf__cuml-gpa input',

  // Messages for issues with the cumulative GPA field.
  cumlGpaMsgs: {

    // Default description for the cumulative GPA field when no information has been entered.
    noInputs: "Waiting for current cumulative GPA, total credits earned, and this semester's course details to be entered.",

    // Default description for the cumulative GPA field when only the cumulative GPA has been
    //   provided by the user.
    onlyCumlGpa: "Waiting for total credits earned and this semester's course details to be entered.",

    // Default description for the cumulative GPA field when only the total credits has been
    //   provided by the user.
    onlyTotCreds: "Waiting for current cumulative GPA and this semester's course details to be entered.",

    // Default description for the cumulative GPA field when no details on courses for the current
    //   semester have been entered.
    noCourses: "Waiting for this semester's course details to be entered.",

    // Default description for the cumulative GPA field when only the cumulative GPA has been
    //   provided by the user.
    onlyCourses: "Waiting for current cumulative GPA and total credits earned to be entered.",

    // Default description for the cumulative GPA field when only the total credits still needs
    //   to be provided by the user.
    noTotCreds: "Waiting for total credits earned to be entered",

    // Default description for the cumulative GPA field when only the current cumulative GPA still
    //   needs to be provided by the user.
    noCumlGpa: "Waiting for total credits earned to be entered",

    // Description substring for the semester GPA field description for indicating to the user what
    //   courses have been factored into the calculation.
    allInputs: 'This anticipated future cumulative GPA is based on the current cumulative GPA, total earned credits, and the details for the courses used to calculate the anticipated GPA for this semester. ',
  },

  // Selector string for isolating the current cumulative GPA field within the DOM.
  curCumlGpaFldSel: '.gfield.gpa-calc-gf__cur-cuml-gpa input',

  // Selector string for isolating the total earned credits field within the DOM.
  totCredsFldSel: '.gfield.gpa-calc-gf__tot-creds input',
} );
