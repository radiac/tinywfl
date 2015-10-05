# TinyWFL - Tiny Web Font Loader

TinyWFL is a minimal web font loader which uses a similar approach to Google's
and Typekit's [webfontloader](https://github.com/typekit/webfontloader/) to
help you avoid the FOIT (flash of invisible text) and FOUT (flash of unstyled
text), except it does a lot less so it can stay tiny - it is 95% smaller, at
just 852 bytes.

TinyWFL will set CSS styles on your ``<html>`` tag when your fonts have loaded,
and call an optional callback function if you want to know about it in
JavaScript. It is self-contained and has no dependencies.

Version 1.0.0


## Usage

1. Load the script to add the global function TinyWFL, then call it with a list
   of web font names:

        <script src="tinywfl-min.js"></script>
        <script>
        TinyWFL(['Courgette', 'Open Sans']);
        </script>

   The order of the fonts doesn't matter.
   
   This code could go anywhere in your page, but TinyWFL will work best if this
   happens in the ``<head>`` - that way it can immediately disable your web
   fonts and try to re-enable them while the rest of the page loads, hopefully
   eliminating FOIT/FOUT altogether.

2. Now define your ``@font-face`` in CSS, using the font-face definition as
   supplied with your web font:
   
        @font-face {
            font-family: 'Courgette';
            src: url('fonts/courgette.eot');
            src: url('fonts/courgette.eot?#iefix') format('embedded-opentype'),
                 url('fonts/courgette.woff') format('woff'),
                 url('fonts/courgette.ttf') format('truetype');
        }

   Alternatively if you are using a hosted font service, add their stylesheet
   to your HTML:
   
        <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>

3. Now set up your CSS to use your fallback fonts when TinyWFL is running but
   your fonts are not yet available:
    
        /* Use your web font by default */
        body {
            font-family: "Open Sans", Verdana, sans-serif;
        }
        
        /* Turn it off when TinyWFL is present, but the font isn't available yet */
        html.tinywfl:not(.tinywfl-opensans) body {
            font-family: Verdana, sans-serif;
        }

   With that arrangement your web fonts can still be used if TinyWFL fails to
   load (eg if JavaScript isn't available) - albeit with a FOUT.


### Callbacks

You can also take actions when JavaScript loads by passing a callback function:

    TinyWFL(['Courgette', 'Open Sans'], resizeDoc);

The callback function will be called each time a font is loaded. If you need to
know which font was loaded, check the first argument:

    // Example callback function
    function resizeDoc(fontName) {
        resizeHeader();
        if (fontName === 'Open Sans') {
            resizeBody();
        }
    }


## How it works

TinyWFL doesn't actually do any font loading itself - you still need to add the
CSS to specify your font family, as you would without TinyWFL. That way your
web fonts will still work when JavaScript is disabled or fails to load for some
reason.

Instead, TinyWFL manages the loading process; it watches to see when the fonts
have loaded, and sets classes on ``<html>`` to allow your CSS to change based
on which fonts are available.

When it starts up, TinyWFL adds the ``twfl`` class to ``<html>``, then as
each of your fonts is loaded it will add a ``twfl-<safe-fontname>`` class,
where ``<safe-fontname>`` is a modified version of the font name you supplied -
it is in lowercase, with any characters other than ``a-z``, ``0-9`` and ``-``
or ``_`` removed.

For example, if your font is called ``Badger #27``, when it has loaded TinyWFL
will add the class ``twfl-badger27`` to ``<html>``.


For more information about TinyWFL and why it exists, see the blog post
[A Tiny Web Font Loader](http://radiac.net/blog/2015/09/tiny-web-font-loader/).


## Contributing

Contributions are welcome, preferably via pull request. However, given the
focus of the project is to be as small as possible, bug fixes are preferred
to new features.

### Credits

Although originally developed independently, TinyWFL has shamelessly
incorporated parts of webfontloader over the years to become a better WFL -
most notably the test element's CSS and the test string.
