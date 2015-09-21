/** TinyWFL - Tiny Web Font Loader
    1.0.0
    http://radiac.net/projects/tinywfl/
*/
function TinyWFL(fonts, callbackFn) {
    /** TinyWFL(fonts[, callbackFn])
        
        Sets CSS class names on the html tag:
            twfl            TinyWFL is enabled
            twfl-fontname   Lowercase name with non a-z0-9_- chars stripped
        
        Arguments:
            fonts       List of font face names
            callbackFn  Optional: function to call when a font is loaded
                        Arguments:
                            fontName    Name of font that has been loaded
    */
    
    // Polling constants and other variable definitions
    var doc = document,
        html = doc.documentElement,
        prefix = ' twfl',   // Class prefix, with space ready to concat
        pollFrequency = 25,
        pollTimeout = 5000,
        testEls = [],
        plainWidths = [],
        isLoaded = [],
        started, i, testEl, testWidth, allLoaded
    ;
    
    function setupTests() {
        started = (new Date()).getTime();
        
        // Create test elements
        for (i=0; i<fonts.length; i++) {
            // Create test element uses test string BESbswy with serif font
            // and add it to body
            testEl = doc.createElement('span');
            testEl.style.cssText = 'position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-family:serif;';
            testEl.appendChild(doc.createTextNode('BESbswy'));
            doc.body.appendChild(testEl);
            testEls[i] = testEl;
            
            // Get width of plain font
            plainWidths[i] = testEls[i].offsetWidth;
            
            // Change font to the target font
            testEls[i].style.fontFamily = '"' + fonts[i] + '",serif';
        }
        html.className += prefix;
        
        // Test fonts
        testFonts();
    }
        
    // Poll the DOM to see when the font has loaded
    function testFonts() {
        // Test for timeout
        if ((new Date()).getTime() - started >= pollTimeout) {
            // Failed to load the font
            return clean();
        }
        
        // Test for no change
        allLoaded = 1;
        for (i=0; i<fonts.length; i++) {
            if (isLoaded[i]) {
                continue;
            }
            testWidth = testEls[i].offsetWidth;
            if (testWidth && plainWidths[i] != testWidth) {
                // Width indicates font has changed; set truthy value
                isLoaded[i] = 1;
                html.className += prefix + '-' + fonts[i].toLowerCase().replace(/[^a-z0-9_\-]/, '');
                
                // Call callback function
                if (callbackFn) {
                    callbackFn(fonts[i]);
                }
            } else {
                // Hasn't loaded yet; set falsey value
                allLoaded = 0;
            }
        }
        
        if (allLoaded) {
            clean();
        } else {
            // Call again soon
            setTimeout(testFonts, pollFrequency);
        }
    }
    
    // Finished
    function clean() {
        for (i=0; i<fonts.length; i++) {
            testEls[i].parentNode.removeChild(testEls[i]);
        }
    }
    
    // Run the font loader function as soon as the body exists
    function waitBody() {
        if (doc.body) {
            setupTests();
        } else {
            setTimeout(waitBody, 0);
        }
    }
    waitBody();
}
