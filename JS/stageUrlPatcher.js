/*!*************************************************************************************************
 * Patch Cougar Success Staging Site's URLs
 *
 * @version 0.0.0
 * @author Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @license MIT
 */
( function( $ ) {
    $( function() {
        const $hlinks = $( '#wsu-content a' );
        console.log( 'A total of ' + $hlinks.length + ' hyperlinks were found.' );
        $hlinks.each( function() {
            const $this = $( this );
            const needle1 = /(https:\/\/daesa\.wsu\.edu\/(?!coug-succ-wds\/))(.+)/;
            const needle2 = /(^\/(?!coug-succ-wds\/))(.*)$/;
            let href = $this.attr( 'href' );
            console.log( 'Evaluating link href ' + href + '.' );
            if( href.match( needle1 ) !== null ) {
                console.log( 'Replacing link href ' + href + '.' );
                href = href.replace( needle1, '$1coug-succ-wds/$2' );
                $this.attr( 'href',  href );
            }
            if( href.match( needle2 ) !== null ) {
                console.log( 'Replacing link href ' + href + '.' );
                href = href.replace( needle2, '$1coug-succ-wds/$2' );
                $this.attr( 'href',  href );
            }
        } );
    } );
} )( jQuery );

