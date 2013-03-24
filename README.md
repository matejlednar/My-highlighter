My-highlighter
==============

Syntax Highlighter for JS, HTML, XML and DOM. 
My highlighter
Version 1.32
(c) 2012-2013
 Author: PhDr. Matej Lednár, PhD.
 
JavaScript simple syntax highlighter with support XML, HTML, Javascript, and DOM languages.
This library supports only latest web browsers. 
User can use universal highlighter with class code, or special 
highlighters for HTML and JavaScript
 
My highlighter features:
- user can use own library prefix,
- user can use own class name prefix,
- user can run library manually or automatic,
- user can define colors and statements for HTML, XML, JavaScript and DOM,
- user can use own CSS rules,
- user can display and highlight website's source code (must be a descendant of the <body> element),
- user can display and highlight inserted content into &lt;textarea> element,
- user can define the content that may displays only once, add data-code="once" to the target element,
- inserted code is valid html document

TODO:
- add JS/DOM support - more statements,
- new option - change display order: output source &lt;--> source output,
- highlight defined lines, e.g. data-highlight="2,5,6-8,11",
- display plain text,

Prohibited string:
- ^^|^ - semicolon replacer


Use HTML script element for library activation.

&lt;script [data-code="false|true"] [data-class="className"] [data-indent="true"]
[data-conflict="libraryPrefix"] [data-highlight-only="false|true"] src="my-highlighter.js">&lt; /script>

User can invoke _.showCode() method unlimited times and defines elements that will be highlighted only once.
&lt;element data-code="once"> content &lt;/element>

Default library settings.

 &lt;link rel="StyleSheet" type="text/css" href="default.css"/>
 &lt;script src="my-highlighter.js">&lt;/script>

Recommended settings for JavaScript frameworks (e.g. Dojo).
 Run showCode(); manually. showCode() method will be deleted from the output.

 <script src="my-highlighter.js" data-code="false"></script>
 _.showCode();  // see demos


 HTML attributes description:
- data-code="false"          - disables automatic highlighting, user can run the highlighter manually.
- data-class="className"     - changes highlighter's class name.
- data-conflict="prefix"     - changes library's prefix.
- data-highlight-only="true" - highlights only elements with class="code", no node clone.
- data-indent="true"         - allows left indentation of the content

Library's functions overview
  
   This is a part of the mllibrary.js (author: Matej Lednár)
   
   The library prefix is _ (underscore).

   Method name   		          Method description

- _.tag(element, index)		     gets an element from nodelist by index
- _.log(data)				             writes an argument into console
- _.regEvent(element, event, function, phase)  registers an event listener
- _.showCode()                if the script element contains data-code="true", displays content of all elements with 
                             class="code" 
- _.initLibrary()  			        allows change the library prefix via data-conflict attribute and enable / disable invoke 
                             _.showCode() automatically.
- _.runLibrary()              runs showCode() and defines prefix of the library


Web sites: 
- work.mldgroup.com
- how-to.mldgroup.com 
