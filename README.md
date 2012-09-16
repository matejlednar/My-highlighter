My-highlighter
==============

Syntax Highlighter for JS, HTML, XML and DOM
// My highlighter
// Verzia 1.09
// (c) 2012
// Author: PhDr. Matej Lednár, PhD.
// 
// JavaScript simple syntax highlighter with support XML, HTML, Javascript and DOM languages.
// This library supports only latest web browsers. 
// User can use universal highlighter with class code, or special 
// highlighters for HTML and JavaScript
 
// My highlighter features
// User can use own library prefix
// User can use own class name prefix
// User can run library manually or automatic
// User can define colors and statements for HTML, XML, JavaScript and DOM
// User can use own CSS rules
// User can display and highlight website's source code (must be a descendant of the <body> element)
// User can display and highlight inserted content into <pre><code> elements
// User can define that content may displays only once, add data-code="once" to the target element

// TODO add JS/DOM support - more statements
// TODO new option - change display order: output source <--> source output
// TODO highlight defined lines, e.g. data-highlight="2,5,6-8,11"
// TODO display plain text

// Latest updates:
// bug fixes
// standalone syntax highlighting for HTML, JS, XML, and code (universal)
// own colors for string in code, HTML, XML, and JS
// display once function

// Use HTML script element for library activation.
// <script [data-code="false|true"] [data-class="className"] 
// [data-conflict="libraryPrefix"] [data-highlight-only="false|true"] src="my-highlighter.js"></script>

// Default library settings.
// <link rel="StyleSheet" type="text/css" href="default.css"/>
// <script src="my-highlighter.js"></script>

// Recommended settings for JavaScript frameworks (e.g. Dojo)
// Run showCode(); manually. showCode() method will be deleted from the output.
// <script src="my-highlighter.js" data-code="false"></script>
// _.showCode(); // see demos


// HTML attributes description:
// data-code="false"          - disables automatic highlighting, user can run the highlighter manually
// data-class="className"     - changes highlighter's class name
// data-conflict="prefix"     - changes library's prefix
// data-highlight-only="true" - highlight only elements with class="code", no node clone

/* Library's function overview
  
   This is a part of the mllibrary.js (author: Matej Lednár)
   
   The library prefix is _ (underscore).

   Method name  			Method description

 _.tag(element, index)		  // gets an element from nodelist by index
 _.log(data)				        // writes an argument into console
 _.regEvent(element, event, 
   function, phase)         // registers an event listener
 _.showCode()               // if the script element contains data-code="true", display content of all elements with class="code" 
 _.initLibrary()  			    // allows change the library prefix via data-conflict attribute and enable / disable run _.showCode() automatically.
 _.runLibrary()             // runs showCode() and defines prefix of the library

 */
