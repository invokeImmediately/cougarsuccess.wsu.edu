interface gpaCalcOpts {
  $: JQueryStatic;
  courseFldsSel: string;
  cumlGpaFldSel: string;
  formSel: string;
  sbmtBtnSel: string;
  semGpaFldSel: string;
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
 * @version 0.0.3
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
// §1: PERSISTENT DOCUMENTATION for final output................................................51
// §2: SETUPGPACALC class.......................................................................69
//   §2.1: Constructor initiated operations....................................................135
//   §2.2: Event initiated operations..........................................................206
// §3: Code execution TRIGGERED BY GRAVITY FORM RENDERING......................................254////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: PERSISTENT DOCUMENTATION for final output

/*!***
 * gpaCalc.js - v0.0.3
 * Custom JS script module for functionalizing the Cougar Success website's GPA calculator built in the Gravity Forms.
 * By Daniel C. Rieck (daniel.rieck@wsu.edu). See [GitHub](https://github.com/invokeImmediately/cougarsuccess.wsu.edu/blob/main/JS/gpaCalc.js) for more info.
 * Copyright (c) 2022 Washington State University and governed by the MIT license.
 ****/

( function( opts: gpaCalcOpts ) {
  const $: JQueryStatic = opts.$;
  const formSel: string = opts.formSel;
  const sbmtBtnSel: string = opts.sbmtBtnSel;
  const courseFldsSel: string = opts.courseFldsSel;
  const cumlGpaFldSel: string = opts.cumlGpaFldSel;
  const semGpaFldSel: string = opts.semGpaFldSel;

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // §2: SETUPGPACALC class

  class setUpGpaCalc {
    courseFldsSel: string;
    cumlGpaFldSel: string;
    formSel: string;
    gradeLookupTbl: gradeLookup;
    sbmtBtnSel: string;
    semGpaFldSel: string;
    $courseFlds: JQuery;
    $cumGpa: JQuery;
    $form: JQuery;
    $sbmtBtn: JQuery;
    $semGpa: JQuery;

    constructor (
      formSel: string,
      sbmtBtnSel: string,
      courseFldsSel: string,
      semGpaFldSel: string,
      cumGpaFldSel: string
    ) {
      // Store a copy of selector strings with the instance.
      this.formSel = formSel;
      this.sbmtBtnSel = sbmtBtnSel;
      this.courseFldsSel = courseFldsSel;
      this.semGpaFldSel = semGpaFldSel;
      this.cumlGpaFldSel = cumlGpaFldSel;

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
      this.disableCumGpaField();
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

    addMoreInitialRows() {
      // TODO: Finish writing function
      // TODO: start with six rows.
      // TODO: Check the number of rows that are present before adding more
    }

    disableCumGpaField() {
      // TODO: Finish writing function
    }

    disableSbmtBtn() {
      // Find the submit button in the DOM.
      this.$sbmtBtn = $( this.sbmtBtnSel );

      // Disable click, tab navigation, and keyboard navigation.
      this.$sbmtBtn.on( 'click', function( e ) {
        e.preventDefault();
      } );
      this.$sbmtBtn.on( 'click', function( e ) {
        e.preventDefault();
      } );
      this.$sbmtBtn.attr( 'tabindex', '-1' );
      this.$sbmtBtn.prop( 'disabled', true );

      // Now that it is non-functional, hide the button from the person viewing the page.
      this.$sbmtBtn.css( 'display', 'none' );
    }

    disableSemGpaField() {
      // TODO: Finish writing function
    }

    restrictCurGpaEntry() {
      // TODO: Finish writing function
    }

    restrictCreditsEntry() {
      // TODO: Finish writing function
    }

    restrictGradeEntry() {
      // TODO: Finish writing function
    }

    restrictRetakeEntry() {
      // TODO: Finish writing function
    }

    restrictRetakeGradeEntry() {
      // TODO: Finish writing function
    }

    restrictTotCreditsEntry() {
      // TODO: Finish writing function
    }

    setUpCalculations() {
      this.$courseFlds = this.$form.find( this.courseFldsSel );
      this.$cumGpa = this.$form.find( this.cumlGpaFldSel );
      this.$semGpa = this.$form.find( this.semGpaFldSel );
      const inst: setUpGpaCalc = this;
      this.$form.on( 'change', this.courseFldsSel + ' input', function ( e: Event ) {
        const $input: JQuery = $( this );
        inst.checkCourseDetailsRow( e, $input );
      } );
      // TODO: Finish writing function
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // §2.2: Event initiated operations

    checkCourseDetailsRow( e: Event, $input: JQuery ) {
      // TODO: Finish writing function

      // Now recalculate the GPAs.
      this.recalcGpas( e );
    }

    recalcGpas( e: Event ) {
      this.recalcSemGpa( e );
      // TODO: Finish writing function.
    }

    recalcSemGpa( e: Event ) {
      console.log( 'Recalculating semester GPA.' );
      let semGpa: number = 0;
      let totCredits: number = 0;
      const $rows: JQuery = this.$courseFlds.find( '.gfield_list_group' );
      const inst: setUpGpaCalc = this;
      const coursesUsed: string[] = [];
      $rows.each( function() {
        const $this: JQuery = $( this );
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
        }
      } );
      if( totCredits > 0 ) {
        this.$semGpa.val( ( semGpa / totCredits ).toFixed( 2 ) );
      }
      // TODO: Finish writing function
    }

    recalcCumGpa( e: Event ) {
      console.log( 'Recalculating cumulative GPA.' );
      // TODO: Finish writing function.
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // §3: Code execution TRIGGERED BY GRAVITY FORM RENDERING

  // Set up event handler to check for an instance of the GPA Calculator gravity form and set it up
  //   if it is present.
  $( document ).on( 'gform_post_render', function () {
    const setUpInst = new setUpGpaCalc( formSel, sbmtBtnSel, courseFldsSel, semGpaFldSel,cumlGpaFldSel );
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

  // Selector string for isolating the semester GPA field within the DOM.
  cumlGpaFldSel: '.gfield.gpa-calc-gf__cuml-gpa input'
} );
