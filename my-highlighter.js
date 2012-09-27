// My highlighter
// Version 1.17
// (c) 2012
// Author: PhDr. Matej Lednár, PhD.
// 
// JavaScript simple syntax highlighter with support XML, HTML, Javascript, and DOM languages.
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
// HTML and XML elements - better identification

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

// Prohibited string
// ^^|^ - semicolon replacer

/* Library's functions overview
  
   This is a part of the mllibrary.js (author: Matej Lednár)
   
   The library prefix is _ (underscore).

   Method name				Method description

 _.tag(element, index)		// gets an element from nodelist by index
 _.log(data)				// writes an argument into console
 _.regEvent(element, event, 
   function, phase)         // registers an event listener
 _.showCode()               // if the script element contains data-code="true", displays content of all elements with class="code" 
 _.initLibrary()  			// allows change the library prefix via data-conflict attribute and enable / disable run _.showCode() automatically.
 _.runLibrary()             // runs showCode() and defines prefix of the library

 */

(function(){

  // The library prefix is _ (underscore).

  var _ = {};

  _.prefix = "_";           // default library prefix
  _.code = true;            // runs highlighter automatically for all elements with code class
  _.className = "code";     // defualt class for highlighter
  _.highlightOnly = false;  // default settings for automatic highlighter run
  _.classCode = false;
  _.classCodeHTML = false;
  _.classCodeJS = false;
  _.classCodeXML = false;
  _.counter = 0;
  
  /** _.tag
  * gets an element from nodelist by index
  * @param {String} element - the name of the element
  * @param {Number} index - index of the element in the nodelist
  */ 
  _.tag = function(element, index) {
    return document.getElementsByTagName(element)[index];
  };
  
  /** _.log
  * writes an argument into console
  * @param {String} data - text for the console
  */
  _.log = function(data) {
    console.log(data);
  };
   
  /**_.regEvent
  * create event listener
  * @param {String} element - DOM node
  * @param {String} event - name of the event
  * @param {Function} fun - name of the registered function
  * @param {Boolean} phase - has capture phase? [true | false]
  */
  _.regEvent = function(element, event, fun, phase) {
    phase = !!phase;
    if(element.addEventListener == undefined) {
      element.attachEvent("on" + event, fun);
    } else {
      element.addEventListener(event, fun, phase);
    }
  };

  /** _.unregEvent
  * remove event listener 
  * @param {String} element - DOM node
  * @param {String} event - name of the event
  * @param {Function} fun - name of the registered function
  * @param {Boolean} phase - has capture phase? [true | false]
  */
  _.unregEvent = function(element, event, fun, phase) {
    phase = !!phase;
    if(element.removeEventListener == undefined)
      element.detachEvent("on" + event, fun);
    else {
      element.removeEventListener(event, fun, phase);
    }
  };
  
  /** _.showCode() content highlighter
  * highlights element's conntent
  * default class: code
  * data-code attribute with false value deactivates highlighting
  * @param {String} className - value of the data-class attribute if was set
  */
  _.showCode = function(className) {
    var self = this;
    // set class for highlighter
    if (!className) {
      className = this.className;
    }
    else {
      this.className = className;
    }
    
    className = "." + className;
    var highlightOnly = this.highlightOnly;
    
    var codeElements = document.querySelectorAll(className);
    var numberOfCodeElements = codeElements.length;
    
    var htmlElements = document.querySelectorAll(className + "-html");
    var numberOfHTMLElements = htmlElements.length;
    
    var jsElements = document.querySelectorAll(className + "-js");
    var numberOfJSElements = jsElements.length;

    var xmlElements = document.querySelectorAll(className + "-xml");
    var numberOfXMLElements = xmlElements.length;

    function highlight(code, background, self) {
      var classCode = self.classCode;
      var classCodeJS = self.classCodeJS;
      var classCodeHTML = self.classCodeHTML;
      var classCodeXML = self.classCodeXML;
      
      function highlightCode(data) {
        if (classCodeJS || classCode) {
          var JSObjects = ["RegExp", "Object", "Array", "Math", "Boolean", 
          "Date", "Function", "Number", "String"];
        
          var JSProperties = ["search", "replace"];
            
          var JSStatements =  ["var", "function", "if", "else", "switch", "case", "return", 
          "for"];
        
          var DOMObjects = ["this", "document", "window", "history", "console"];
      
          var DOMProperties = ["write", "submit", "reset", "forms", "writeln", 
          "getElementById", "childNodes", "value", "nodeValue", "innerText", 
          "innerHTML", "firstChild", "createElement", "log", "style"];
      
          // \s as a first char, \s as a last char
          var JSOperators1 = ["/", "-", "\\?", "\\*", "\\+", "in", 
          "==", "&gt;", "&lt;", "&gt;=", "&lt;=", "=", "\\!==", "===", "\\|\\|"];
      
          // \( | \s | ^ as a first char, \s as a last char
          var JSOperators2 = ["delete", "typeof", "instanceof", "new"];
      
          // no \s | ^
          var JSOperators3 = ["\\.", "\\(", "\\)", "\\[", "\\]", "\\{", "\\}"];
        }
        
        var regexp;
        
        var Fix = "class";  // safety class attribute declaration
        regexp = new RegExp(" " + Fix + "=", "g");
        data = data.replace(regexp, " <span class='my-highlight-attribute'>" + Fix + "=</span>");
        
        // marks elements
        function highlightElements(classPostfix) {
          data = data.replace(/(&lt;\/?[a-zA-Z-0-9\s-\";:,\.'\(\)=\^\|]*&gt;)/g, "<span class='my-highlight-tag" + classPostfix + "'>$1</span>");
        }
        
        if (classCodeHTML) {
          highlightElements("-html");          
        }
        
        if (classCode) {
          highlightElements("");          
        }

        if (classCodeXML) {
          highlightElements("-xml");          
        }

        // marks semicolon ;
        data = data.replace(/\^\^\|\^/g, "<span class='my-highlight-semicolon'>;</span>");

        // marks atributtes
        function highlightAttributes(classPostfix) {
          data = data.replace(/\s([a-z-]+=)\"/g, "<span class='my-highlight-attribute" + classPostfix + "'> $1</span>\"");
        }        
        
        if (classCodeHTML) {
          highlightAttributes("-html");
        }
        
        if (classCode) {
          highlightAttributes("");
        }
        
        if (classCodeXML) {
          highlightAttributes("-xml");
        }
      
        // marks strings, user can define special colors for code, JS and HTML
        function highlightString(classPostfix) {
          data = data.replace(/\"([a-zA-Z0-9;<\-\/\.':,\s\(\)\[\]\+=\?>#\$&\^%]+)\"/g, "\"<span class='my-highlight-string" + classPostfix + "'>$1</span>\"");
        }
        if (classCodeHTML) {
          highlightString("-html");
        }

        if (classCode) {
          highlightString("");
        }

        if (classCodeJS) {
          highlightString("-js");
        }
        
        if (classCodeXML) {
          highlightString("-xml");
        }

        // mark quotation marks
        data = data.replace(/\"/g, "<span class='my-highlight-quotation'>\"</span>");

        if (classCodeJS || classCode) {
          
          var arrLength = JSObjects.length;
          var index = 0;
          
          // JavaScript objects          
          for (index = 0; index < arrLength; index ++) {
            // with || without whitespace as a first char, .|;|( as a last char 
            regexp = new RegExp("(\\(|\\s|^)"+ JSObjects[index] + "(\\.|;|\\(|$)", "g");
            data = data.replace(regexp, "$1<span class='my-highlight-js-object'>" + JSObjects[index] + "</span>$2");
          }

          // JavaScript statements
          arrLength = JSStatements.length;
          for (index = 0; index < arrLength; index ++) {
            regexp = new RegExp("(\\(|\\s|^)" + JSStatements[index] + "(\\s|\\()", "g");
            data = data.replace(regexp, "$1<span class='my-highlight-js-statement'>" + JSStatements[index] + "</span>$2");
          }

          // JavaScript properties
          arrLength = JSProperties.length;
          for (index = 0; index < arrLength; index ++) {
            // .property | .property; | .method( | .property) - condition | .property = | .property
            regexp = new RegExp("<\\/span>\\." + JSProperties[index] + "(\\)|\\(|;|\\s|<span|\\.|$)", "g");
            data = data.replace(regexp, "</span>.<span class='my-highlight-js-property'>" + JSProperties[index] + "</span>$1");
          }

          // DOM objects
          arrLength = DOMObjects.length;
          for (index = 0; index < arrLength; index ++) {
            // with || without whitespace as a first char, .|; as a last char 
            regexp = new RegExp("(\\(|\\s|^)"+ DOMObjects[index] + "(\\.|;)", "g");
            data = data.replace(regexp, "$1<span class='my-highlight-dom-object'>" + DOMObjects[index] + "</span>$2");
          }

          // DOM properties
          arrLength = DOMProperties.length;
          for (index = 0; index < arrLength; index ++) {
            // .property | .property; | .method( | .property) - condition | .property = | .property
            regexp = new RegExp("<\\/span>\\." + DOMProperties[index] + "(\\)|\\(|;|\\s|<span|\\.|$)", "g");
            data = data.replace(regexp, "</span>.<span class='my-highlight-dom-property'>" + DOMProperties[index] + "</span>$1");
          }

          // JavaScript operators
          arrLength = JSOperators1.length;         
          for (index = 0; index < arrLength; index ++) {
            regexp = new RegExp("(\\s)" + JSOperators1[index] + "(\\s)", "g");
            data = data.replace(regexp, "$1<span class='my-highlight-javascript-operator'>" + JSOperators1[index].replace(/\\/g, "") + "</span>$2");
          }
          
          arrLength = JSOperators2.length;
          for (index = 0; index < arrLength; index ++) {
            regexp = new RegExp("(\\(|\\s|^)" +JSOperators2[index] + "(\\s)", "g");
            data = data.replace(regexp, "$1<span class='my-highlight-javascript-operator'>" + JSOperators2[index] + "</span>$2");
          }
          
          arrLength = JSOperators3.length;
          for (index = 0; index < arrLength; index ++) {
            regexp = new RegExp(JSOperators3[index], "g");
            data = data.replace(regexp, "<span class='my-highlight-javascript-operator'>" + JSOperators3[index].replace(/\\/g, "") + "</span>");
          }
        }
      
        if (classCodeJS || classCode) {
          // JavaScript single line comments
          // checks if comment exists
          if (data.indexOf("//") != -1) {
            var tmp = data.split("//");   // checks for statements before comments
            var firstPart = tmp.shift();  // removes highlighted statements
            var lastPart = "//" + tmp.join("//");
          
            // removes highlighting after //
            lastPart = lastPart.replace(/my-highlight-/g, "my-highlight--");
          
            // highlights comment
            data = firstPart + "<span class='my-highlight-comment'>" + lastPart + "</span>";
          }
        }
        
        // string fix, removes words highlighting from strings  
        tmp = data.split("\"");
        tmpLength = tmp.length;
        for (var tmpPart = 0; tmpPart < tmpLength; tmpPart++) {
          // every second part is string
          if (tmpPart % 2 == 1) {
            tmp[tmpPart] = tmp[tmpPart].replace(/my-highlight-semicolon/g, "my-highlight--").
            replace(/my-highlight-tag/g, "my-highlight--").
            replace(/my-highlight-attribute/g, "my-highlight--").
            replace(/my-highlight-javascript-operator/g, "my-highlight--").
            replace(/my-highlight-javascript/g, "my-highlight--").
            replace(/my-highlight-dom/g, "my-highlight--").
            replace(/my-highlight-comment/g, "my-highlight--");
          }
        }
        
        data = tmp.join("\"");
        return data;
      }
      
      // delete left indentation
      code = code.replace(/\t/g,"");  // removes tabs
      code = code.replace(/(^\s{6})|(^\s{4})/,""); // removes spaces 4 or 6
      code = highlightCode(code); // invoke highlighter
      code = "<tr class='" + background + "'><td class='my-table-right-column-content'>" + code + "&nbsp;</td></tr>";
      return code;
    }

    // delete empty lines before and after the content
    function deleteEmptyLinesEnds() {
      var code = source.innerHTML;
      var first_new_line_flag = code.indexOf("\n");
      var last_new_line_flag = code.lastIndexOf("\n");
      // checks if exists any text after the last \n 
      function isCode(text) {
        var regExp = /[a-zA-Z;\.0-9\()\{\}<>\"]/g;
        return regExp.test(text);
      }
      var blankLines;
      
      // delete empty lines at the start
      do  {
        blankLines = isCode(code.slice(0, first_new_line_flag));
        if (!blankLines) {
          source.innerHTML = code.slice(first_new_line_flag + 1, code.length);
          // removes first \n
          code = source.innerHTML;
          first_new_line_flag = code.indexOf("\n");
        }
        else {
          blankLines = true;
        }
      } while (!blankLines);
      
      // delete empty lines at the end
      do  {
        blankLines = isCode(code.slice(last_new_line_flag, code.length));
        if (!blankLines) {
          source.innerHTML = code.slice(0, last_new_line_flag);
          // delete last \n
          code = source.innerHTML;
          last_new_line_flag = code.lastIndexOf("\n");
        }
        else {
          blankLines = true;
        }
      } while (!blankLines);      
    }
    
    function runHighlighterCore(className, self) {
        
      if (highlightOnly == false) {
        var target = self.tag("body", 0);
        var pre_element = document.createElement("pre");
        pre_element.setAttribute("class", "show-code-" + self.counter);
        target.appendChild(pre_element);

        target.insertBefore(document.querySelector(".show-code-" + self.counter), document.querySelectorAll(className)[(i)]);
    
        target = document.querySelector(".show-code-" + self.counter);
        var code_element = document.createElement("code");
        code_element.setAttribute("class", "code-element-" + self.counter);
        target.appendChild(code_element);
      }
      
      var content = document.querySelectorAll(className)[(i)].innerHTML;
      
      // delete showCode() statement from content
      var tmpRegExp = new RegExp(self.prefix + "\\.showCode\\(\\);\\n?", "g");
      content = content.replace(tmpRegExp, "");
      content = content.replace(/(_\.showCode\()\);\n?/g, "");      

      // escaping HTML/XML elements
      content = content.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      content = content.replace(/;/g, "^^|^").replace(/&amp;/g, "&").replace(/</g, "&lt;").replace(/>/g, "&gt;");

      if (highlightOnly == false) {
        source = document.querySelector(".code-element-" + self.counter)
      }
      else {
        source = document.querySelectorAll(className)[(i)]
      }
        
      source.innerHTML = content;

      // delete empty first and last lines
      deleteEmptyLinesEnds();
     
      // display numbers
      content = source.innerHTML;
      
      var numberOfLines = content.match(/\n/g);
      
      // checks if element is empty
      if (numberOfLines == null) {
        numberOfLines = 1;
      }
      else {
        numberOfLines = numberOfLines.length + 1;
      }
      
      // displays numbers and tables
      function getTableOpenTag(id) {
        var tableOpenTag = "<table class='my-table-column-" + id + 
        " my-table-cell-spacing'>";  
        return tableOpenTag
      }
      
      var tableCloseTag = "</table>";
      // column 1
      var table = getTableOpenTag(1);
      
      // sets background colors 
      var  backgroundColor1 = "my-line-background-color-1 my-odd";
      var  backgroundColor2 = "my-line-background-color-2 my-even";
         
      // creates line numbers
      for (var line = 1; line < numberOfLines + 1; line++) {
        if ((line % 2) == 1) {
          background = backgroundColor1;
        }
        else {
          background = backgroundColor2;
        }
        
        // sets a special class e.g. for line spacing
        
        if (line == 1) {
          background = background + " my-special-begin";
        }
        
        if (line > 1 && line < numberOfLines) {
          background = background + " my-special";
        }

        if (line == numberOfLines) {
          background = background + " my-special-end";
        }

        table = table + "<tr class='" + background + "'><td class='my-table-left-column-numbers'>" 
        + line + "</td></tr>";
      }
      var numbersTable = table + tableCloseTag;
      
      // split content into lines
      var ContentLines = content.split(/\n/g);

      // column 1
      table = getTableOpenTag(2);

      // removes first indentation and creates table line
      for (line = 0; line < numberOfLines; line++) {
        
        if ((line % 2) == 0) {
          background = backgroundColor1;
        }
        else {
          background = backgroundColor2;
        }
        
        // sets a special class e.g. for line spacing
        
        if (line == 0) {
          background = background + " my-special-begin";
        }
        
        if (line > 0 && line < (numberOfLines - 1)) {
          background = background + " my-special";
        }

        if (line == (numberOfLines - 1)) {
          background = background + " my-special-end";
        }
 
        ContentLines[line] = highlight(ContentLines[line], background, self);
      }
      // joins lines into the final content and creates table
      var codeTable  = table + ContentLines.join("") + tableCloseTag;
      
      // displays final result (number and content)
      source.innerHTML = "<table class='my-highlighter my-table-cell-spacing'><tr><td class='my-table-left-column'>" + numbersTable  
      + "</td><td class='my-columns-separator'>" + codeTable + "</td></tr></table>";
      
      // memory "clean"
      content = "";
      table = "";
    }
    
    // variable for source code
    var source = null;
    
    // highlights each element's content with code class
    if (numberOfCodeElements) {
      this.classCode = true;
      for(var i = 0; i < numberOfCodeElements; i++) {
        this.counter++;
        // display once checker, if data-code="once", sets data-code-done="true"
        if (!codeElements[i].getAttribute("data-code-done")) {
          if (codeElements[i].getAttribute("data-code") == "once") {
            codeElements[i].setAttribute("data-code-done", "true");
          }
          runHighlighterCore("." + this.className, self);
        }
      }
      this.classCode = false;
    }
    
    // highlights each element's content with code-html class
    if (numberOfHTMLElements) {
      this.classCodeHTML = true;
      for(var i = 0; i < numberOfHTMLElements; i++) {
        this.counter++;
        // display once checker, if data-code="once", sets data-code-done="true"
        if (!htmlElements[i].getAttribute("data-code-done")) {
          if (htmlElements[i].getAttribute("data-code") == "once") {
            htmlElements[i].setAttribute("data-code-done", "true");
          }        
          runHighlighterCore("." + this.className + "-html", self);
        }
      }
      this.classCodeHTML = false;
    }
     
    // highlights each element's content with code-js class
    if (numberOfJSElements) {
      this.classCodeJS = true;
      for(var i = 0; i < numberOfJSElements; i++) {
        this.counter++;
        // display once checker, if data-code="once", sets data-code-done="true"
        if (!jsElements[i].getAttribute("data-code-done")) {
          if (jsElements[i].getAttribute("data-code") == "once") {
            jsElements[i].setAttribute("data-code-done", "true");
          }
          runHighlighterCore("." + this.className + "-js", self);
        }
      }
      this.classCodeJS = false;
    }
    
    // highlights each element's content with code-xml class
    if (numberOfXMLElements) {
      this.classCodeXML = true;
      for(var i = 0; i < numberOfXMLElements; i++) {
        this.counter++;
        // display once checker, if data-code="once", sets data-code-done="true"
        if (!xmlElements[i].dataset.codeDone) {
          if (xmlElements[i].dataset.code == "once") {
            xmlElements[i].dataset.codeDone = "true";
          }
          runHighlighterCore("." + this.className + "-xml", self);
        }
      }
      this.classCodeXML = false;
    }
    
  };
  
  // load settings for library
  _.initLibrary = function() {
    var script_elements = document.getElementsByTagName("script");
    var script_elements_number = script_elements.length;
  
    for (var i = 0; i < script_elements_number; i++) {
      var srcAttr = script_elements[i].getAttribute("src");
      if (srcAttr) {
        var is_my_libary = srcAttr.lastIndexOf("my-highlighter");
        if (srcAttr && is_my_libary != -1) {
          
          this.prefix = script_elements[i].getAttribute("data-conflict");
          
          // if code is false user will call _.showCode(); manually
          var code = script_elements[i].getAttribute("data-code");
          if (code == "false") {
            this.code = false; 
          }

          var highlightOnly = script_elements[i].getAttribute("data-highlight-only");
          if (highlightOnly == "true") {
            this.highlightOnly = true; 
          }
          
          var className = script_elements[i].getAttribute("data-class");
          if (className != null) {
            console.log(className);
            this.className = className; 
          }
        }
      }
    }
  }

  // gets library setting and creates global object _ or object 
  // defined by data-conflict attribute
  _.runLibrary = function  () {
    this.initLibrary();

    // displays all elements content with class="code"
    function showCode(className) {
      return function() {
        _.showCode(className);
      }
    }

    if (this.code) {
      this.regEvent(window, "load", showCode(this.className), true);  
    }
    // get library prefix, default is _
    var prefix = this.prefix;
  
    if (prefix != null) {
      _.log("My highlighter is loaded with prefix " + prefix);
      window[prefix] = _;
    }
    else {
      _.log("My highlighter is loaded with prefix _");
      window["_"] = _;
    }
  };

  _.runLibrary();
   
})();

  



