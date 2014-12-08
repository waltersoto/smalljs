/*
The MIT License (MIT)

Copyright (c) 2014 Walter M. Soto Reyes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function (document, window) {
    if (!document.querySelectorAll) {
        //for IE6,IE7 compatibility include any of the following libraries:
        if (window.Sizzle) {
            //URL: http://sizzlejs.com
            document.querySelectorAll = Sizzle;
        } else if (window.Selector) {
            //URL: http://www.llamalab.com/js/selector/
            document.querySelectorAll = Selector;
        }
    }

    var UNDEFINED = 'undefined', FUNCTION = 'function';

    function isDefined(o) {
        return typeof o !== UNDEFINED;
    }
    function contains(str,substring) {
        return str.indexOf(substring) != -1;
    }
    function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    function fooVal(expression) {
        new Function("return " + expression)();
    }

    var get = function () {
        ///	<summary>
        /// 	1: Get DOM element by id, name, class name, or query selector
        ///	</summary>
        ///	<returns type="element" />
        var elements = [], doc = document, i = 0, m = 0;

        for (i = 0, m = arguments.length; i < m; i++) {
            var element = null, arg = arguments[i];
            if (typeof arg === 'string') {
                element = doc.getElementById(arg);
                if (element === null) {
                    element = doc.getElementsByTagName(arg);
                    if (element.length === 1) { element = element[0]; } else if (element.length > 1) { return element; }
                }
                if (element.length === 0) {
                    element = doc.getElementsByName(arg);
                    if (element.length === 1) { element = element[0]; } else if (element.length > 1) { return element; }
                }
                if (element.length === 0) {
                    if (arg.length > 0 && arg.charAt(0) == '.') {
                        if (doc.getElementsByClassName) {
                            element = doc.getElementsByClassName(arg.substring(1));
                            if (element.length === 1) { element = element[0]; }
                        }
                    }
                }
                if (element.length === 0) {
                    if (doc.querySelectorAll) {
                        try {
                            element = doc.querySelectorAll(arg);
                        } catch (e) {
                            //console.log(e);
                        }
                    }
                    return element;
                }
            } else {
                element = arg;
            }
            if (arguments.length === 1) {
                return element;
            }
            if (element !== null) {
                if (element.length) {
                    for (var s = 0, max = element.length; s < max; s++) {
                        elements.push(element[s]);
                    }
                } else {
                    elements.push(element);
                }
            }
        }
        return elements;
    };
  
    var onReady = null;
    var readyExecuted = false;
    var plugins = {
        me: null
    };

    function instance(plugins) {
        this.me = plugins.me;
        if (!(this instanceof instance)) {
            throw new Error('Constructor called as a function');
        }
        //Include plugins if any
        if (isDefined(plugins)) {
            for (var p in plugins) {
                if (isDefined(plugins[p])) {
                    if (!isDefined(instance.prototype[p])) {
                        instance.prototype[p] = plugins[p];
                    } else if (p == 'me') {
                        instance.prototype[p] = plugins[p];
                    }
                }
            }
        }
    };
 
   

    function sj() {
        /// <signature>
        ///   <summary>Accepts one or more object ids</summary>
        ///   <param name="id" type="DOM object">DOM object id or reference</param> 
        /// </signature>
        /// <signature>
        ///   <summary>Accepts one or more object names</summary>
        ///   <param name="name" type="DOM object">Form object name or reference</param> 
        /// </signature>
        /// <signature>
        ///   <summary>Accepts a query selector (Ex. div.class) </summary>
        ///   <param name="query selector" type="DOM object">Query selector (Note: works on IE8+)</param> 
        /// </signature>
        var o = [];
        if (arguments.length > 0) {
            for (var i = 0, m = arguments.length; i < m; i++) {
                var e = get(arguments[i]);
                if (isDefined(e)) {
                    if (isDefined(e.length) && e.length > 0 && e.tagName !== 'SELECT') {
                        for (var le = 0; le < e.length; le++) {
                            var lv = get(e[le]);
                            if (isDefined(lv)) { o.push(lv); }
                        }
                    } else {
                        if (isDefined(e.length) && e.length > 0 && e.tagName === 'SELECT') {
                            o.push(e);
                        } else if (isDefined(e.length) && e.length == 0) {
                        } else {
                            o.push(e);
                        }

                    }
                }
            }
        } else {
            return st;
        }
        plugins.me = o;
        return new instance(plugins);
    };

    sj.extend = function (extension) {
        ///	<summary>
        ///	Extend the object literal.
        ///	</summary>
        ///	<param name="extension" type="object">
        ///	 Object to be attached
        ///	</param>
        var p = null;
        for (p in extension) {
            if (isDefined(extension[p])) {
                sj[p] = extension[p];
            }
        }
    };
 
    sj.extend({
        get:get,
        plugin: function (extension) {
            ///	<summary>
            ///	Add a plugin method
            ///	</summary>
            ///	<param name="extension" type="object">
            ///	 {
            ///     method:function(){
            ///         this.forEach(function(){
            ///             console.log(this.innerHTML);
            ///         });
            ///      }
            ///  }
            ///	</param> 
            for (var p in extension) {
                if (isDefined(extension[p])) {
                    if (!isDefined(plugins[p])) {
                        plugins[p] = extension[p];
                    }
                }
            }
        }
    });

    sj.extend({
            onload: function (callback) {
                ///	<summary>
                /// Execute multiple functions in the window.onload method.
                ///	</summary>
                ///	<param name="callback" type="function">
                /// Function to execute.
                ///	</param>
                var cur = window.onload;
                if (typeof window.onload !== FUNCTION) {
                    window.onload = callback;
                } else {
                    if (typeof callback === FUNCTION) {
                        window.onload = function () {
                            if (cur) {
                                cur();
                            }
                            callback();
                        };
                    }
                }
            },
            ready: function (callback) {
                ///	<summary>
                /// Execute callback function when DOM is ready
                ///	</summary>
                ///	<param name="callback" type="function">
                /// Function to execute.
                ///	</param>
                if (typeof onReady !== FUNCTION) {
                    onReady = callback;
                } else {
                    var current = onReady;
                    onReady = function () {
                        if (current) {
                            current();
                        }
                        callback();
                    };
                }

                if (document.addEventListener) {
                    document.addEventListener('DOMContentLoaded', function () {
                        if (!readyExecuted) {
                            onReady();
                            readyExecuted = true;
                        }
                    }, false);
                } else {
                    this.onload(callback);
                }
            },
            wait: function (delay, fn) {
                ///<summary>
                /// Execute a function after a delay
                ///</summary>
                ///<param name="delay" type="milliseconds">
                /// Time to wait
                ///</param>
                ///<param name="fn" type="function">
                /// Function to execute after the delay
                ///</param>
                if (!isDefined(delay)) {
                    delay = 1000;
                }
                window.setTimeout(function () {
                    if (typeof (fn) === FUNCTION) {
                      fn();
                   }
                }, delay);
            }, 
            queryString: function (key) {
                ///<summary>
                /// Ready querystring value
                ///</summary>
                ///<param name="key" type="string">
                /// Querystring parameter name
                ///</param>
                ///	<returns type="string" /> 
                var args = window.location.href.split("?");
                if (args.length === 2) {
                    var arg;
                    if (args[1].indexOf("&") !== -1) {
                        arg = args[1].split("&");
                        if (arg.length > 0) {
                            for (var i = 0, m = arg.length; i < m; i++) {
                                var sArg = arg[i].split("=");
                                if (sArg.length > 0) {
                                    if ((sArg[0] == key)) {
                                        return sArg[1];
                                    }
                                }
                            }
                        }
                    } else {
                        arg = args[1].split("=");
                        if (arg.length > 0) {
                            if ((arg[0] === key)) {
                                return arg[1];
                            }
                        }
                    }
                }
                return "";
            }

        });
    

    instance.prototype.forEach = function (fn) {
        ///	<summary>
        ///	Iterate over objects  
        ///	</summary>
        ///	<param name="fn" type="function">
        ///	 Function to be executed for each element.
        ///	</param>
        ///	<returns type="this" />
        for (var i = 0, m = this.me.length; i < m; i++) {
            if (typeof fn === FUNCTION) {
                fn.call(this.me[i]);
            }
        }
        return this;
    };

    instance.prototype.addEvent = function (event, callback) {
        ///	<summary>
        /// Attach an event to an element
        ///	</summary> 
        ///	<param name="event" type="string">
        /// Event name
        ///	</param>
        ///	<param name="callback" type="function">
        /// Function to execute
        ///	</param>
        ///	<returns type="this" />
        this.forEach(function () {
            if (isDefined(this)) {
                if (this.addEventListener) {
                    if (event.substring(0, 2) === 'on') {
                        event = event.substring(2);
                    }
                    this.addEventListener(event, callback, false);
                } else if (this.attachEvent) {
                    if (event.length > 2) {
                        if (event.substring(0, 2) !== 'on') {
                            event = 'on' + event;
                        }
                    }
                    this.attachEvent(event, callback);
                }
            }
        });

        return this;
    };

    instance.prototype.removeEvent = function (event, callback) {
        ///	<summary>
        /// Detach an event from a element.
        ///	</summary> 
        ///	<param name="event" type="string">
        /// Event name
        ///	</param>
        ///	<param name="callback" type="function">
        /// Function to remove
        ///	</param>
        ///	<returns type="this" />
        this.forEach(function () {
            if (isDefined(this)) {
                if (this.removeEventListener) {
                    if (event.substring(0, 2) === 'on') {
                        event = event.substring(2);
                    }
                    this.removeEventListener(event, callback, false);
                } else if (this.detachEvent) {
                    if (event.length > 2) {
                        if (event.substring(0, 2) !== 'on') {
                            event = 'on' + event;
                        }
                    }
                    this.detachEvent(event, callback);
                }
            }
        });
        return this;
    };

    instance.prototype.delegate = function (child, delegatedEvent, callback) {
        ///	<summary>
        ///	Delegate event handling to a parent
        ///	</summary>
        ///	<param name="child" type="string">
        ///	 child tag, identifier, or selector
        ///	</param> 
        ///	<param name="delegatedEvent" type="string">
        ///	 Action or event to delegate
        ///	</param> 
        ///	<param name="callback" type="string">
        ///	 Function to execute
        ///	</param> 
        ///	<returns type="this" />
        this.forEach(function () {
            var p = this;
            sj(p).addEvent(delegatedEvent, function (event) {
                event = event || window.event;
                var target = event.target || event.srcElement;
                var children = get(p).getElementsByTagName(child);
                if (children.length == 0) {
                    if (get(p).querySelectorAll) {
                        children = get(p).querySelectorAll(child);
                    } 
                }
                if (children.length > 0) {
                    for (var i = 0, m = children.length; i < m; i++) {
                        if (target.id.length > 0) {
                            if (target.id == children[i].id) { callback.call(children[i]); }
                        } else {
                            if (target == get(children[i])) { callback.call(children[i]); }
                        }
                    }
                } else {
                    if (target.id.length > 0) {
                        if (target.id == children.id) { callback.call(children); }
                    } else {
                        if (target == children) { callback.call(children); }
                    }
                }
            }); 
        }); 
        return this;
    };

    instance.prototype.onClick = function (callback) {
        ///	<summary>
        ///	Add an onclick event
        ///	</summary>
        ///	<param name="callback" type="function">
        ///	 Callback function
        ///	</param>
        ///	<returns type="this" /> 
        this.forEach(function () {
            sj(this).addEvent('click', callback);
        });
        return this;
    };

    instance.prototype.onMouseover = function (callback) {
        ///	<summary>
        ///	Add an onclick event
        ///	</summary>
        ///	<param name="callback" type="function">
        ///	 Callback function
        ///	</param>
        ///	<returns type="this" /> 
        this.forEach(function () {
            sj(this).addEvent('mouseover', callback);
        });
        return this;
    };

    instance.prototype.onMouseout = function (callback) {
        ///	<summary>
        ///	Add an onclick event
        ///	</summary>
        ///	<param name="callback" type="function">
        ///	 Callback function
        ///	</param>
        ///	<returns type="this" /> 
        this.forEach(function () {
            sj(this).addEvent('mouseout', callback);
        });
        return this;
    };

    instance.prototype.att = function (name, value) {
        /// <signature>
        ///   <summary>Read attribute from element</summary>
        ///   <param name="name" type="string">Attribute name</param> 
        ///	  <returns type="string|string[]" /> 
        /// </signature>
        /// <signature>
        ///   <summary>Set attribute value</summary>
        ///   <param name="name" type="string">Attribute name</param>
        ///   <param name="value" type="string">Attribute value</param> 
        ///	  <returns type="this" /> 
        /// </signature> 
        var r = [];
        this.forEach(function () {
            if (isDefined(value)) {
                get(this).setAttribute(name, value);
            } else {
                var t = get(this).getAttribute(name);
                if (t) {
                    r.push(t);
                }
            }
        });

        if (isDefined(value)) {
            return this;
        }

        if (r.length > 1) {
            return r;
        }

        if (r.length == 1) {
            return r[0];
        }

        return "";
    };

    instance.prototype.removeAtt = function (name) {
        ///	<summary>
        ///	Remove an attribute from element
        ///	</summary>
        /// <param name="name" type="string">Attribute name</param>
        this.forEach(function () {
            get(this).removeAttribute(name);
        });
    };

    instance.prototype.checkAtt = function (name) {
        ///	<summary>
        ///	Check if attribute exists
        ///	</summary>
        /// <param name="name" type="string">Attribute name</param>
        ///	<returns type="boolean" /> 
        var result = false;
        this.forEach(function () {
            var t = get(this).getAttribute(name);
            if (t) {
                result = true;
            }
        });
        return result;
    };

    instance.prototype.text = function (content) {
        /// <signature>
        ///	<summary>
        ///	Read content from innerHTML or value
        ///	</summary> 
        ///	<returns type="string|string[]" /> 
        /// </signature>
        /// <signature>
        ///	<summary>
        ///	Set content to an element's innerHTML or value.
        ///	</summary>
        ///	<param name="content" type="string">
        ///	 Content to be set
        ///	</param>
        ///	<returns type="this" /> 
        /// </signature>

        var result = [];
        var returnVal = (typeof content === UNDEFINED);

        this.forEach(function () {
            var t = this;
            var usevalue = (t.tagName.toLowerCase() === 'input' || t.tagName.toLowerCase() === 'textarea');
            var isSelect = (t.tagName === 'SELECT');
            if (returnVal) {
                if (isSelect) {
                    //Read select/option value:
                    if (get(t).multiple) {
                        for (var i = 0, m = get(t).length; i < m; i++) {
                            if (get(t).options[i].selected) {
                                result.push(get(t).options[i].value);
                            }
                        }
                    } else {
                        result.push(get(t).options[get(t).selectedIndex].value);
                    }
                } else {
                    result.push(usevalue ? t.value : t.innerHTML);
                }
                    
            } else {
                if (usevalue) {
                    t.value = content;
                } else {
                    t.innerHTML = content;
                }
            }
        });
             
        if (returnVal) {
            if (result.length > 0) {
                if (result.length > 1) {
                    return result;
                }
                return result[0];
            }
            return '';
        }

        return this;
    };

    instance.prototype.appendText = function (content) {
        ///	<summary>
        ///	Append text to an element
        ///	</summary>
        ///	<param name="content" type="string">
        ///	 Content to append
        ///	</param>  
        this.forEach(function () { sj(this).text(sj(this).text() + content); });
        return this;
    };

    instance.prototype.isEmpty = function () {
        ///	<summary>
        ///	Is innerHTML or Value empty
        ///	</summary> 
        ///	<returns type="Boolean" /> 
        var r = false;
        this.forEach(function () { r = sj(this).text().replace(/^\s+|\s+$/g, '').length == 0; });
        return r;
    };
 
    instance.prototype.style = function () {
        ///	<summary>
        ///	Add CSS style elements as parameters.
        /// Example:
        /// .style('width:100px',
        ///      'border:1px solid #333333',
        ///      'color:#dddddd');
        ///	</summary>
        ///	<returns type="this" />    
        if (arguments.length >= 1) {
            var newstyle = [];
            for (var i = 0, m = arguments.length; i < m; i++) {
                if (contains(arguments[i],':')) {
                    newstyle.push(arguments[i]);
                }
            }
            this.forEach(function () {
                var current = (window.attachEvent) ? get(this).style.cssText : get(this).getAttribute('style');
                if (current == null) { current = ''; }
                var txt = '';
                var sc = current.split(';');
                var exclude = [];
                for (var i = 0, mi = sc.length; i < mi; i++) {
                    var term = sc[i].split(':');
                    for (var ns = 0, nsm = newstyle.length; ns < nsm; ns++) {
                        var nterm = newstyle[ns].split(':');
                        if (nterm[0] == term[0]) {
                            sc[i] = newstyle[ns];
                            exclude.push(ns);
                        }
                    }
                    if (sc[i].length > 1) {
                        txt += sc[i].replace(';', '') + ';';
                    }
                }
                for (var en = 0, enm = exclude.length; en < enm; en++) {
                    newstyle.splice(exclude[en], 1);
                }
                for (var ns = 0, nsm = newstyle.length; ns < nsm; ns++) {
                    if (newstyle[ns].length > 1) {
                        txt += newstyle[ns].replace(';', '') + ';';
                    }
                }
                if (window.attachEvent) {
                    get(this).style.cssText = txt;
                } else {
                    get(this).setAttribute('style', txt);
                }

            });

        }

        return this;
    };

    instance.prototype.hasStyle = function(style) {
        ///	<summary>
        ///	Returns true is style exists in the element.
        /// Example:
        /// Is style 'width:100px' defined in element 'id'?
        /// smalljs('id').hasStyle('width:100px'); 
        ///
        /// Is style 'width' defined in element 'id'?
        /// smalljs('id').hasStyle('width');
        ///	</summary>
        ///	<returns type="Boolean" /> 
        var result = false;

        if (this.me.length == 0) { return result; }
                        

        this.forEach(function () {

            var current = (window.attachEvent) ? get(this).style.cssText : get(this).getAttribute('style');
            if (current == null) { return false; }
            var sc = current.split(';');
            var to = '';
            var val = '*';
            if (contains(style,':')) {
                var spl = style.split(':');
                to = spl[0];
                val = spl[1];
            } else {
                to = style;
            }
            for (var i = 0, m = sc.length; i < m; i++) {
                var term = sc[i].split(':');
                if (term.length == 2) {
                    if (val != '*') {
                        if (trim(term[0].toLowerCase()) === trim(to.toLowerCase()) && trim(term[1].toLowerCase()) === trim(val.toLowerCase())) {
                            result = true;
                        }
                    } else {
                        if (trim(term[0].toLowerCase()) === trim(to.toLowerCase())) {
                            result = true;
                        }
                    }
                }
            }

        });
         
        return result; 
    };

    instance.prototype.show = function (inherit) {
        ///	<summary>
        /// Set 'display' style to 'block' or 'inherit'
        ///	</summary>
        ///	<param name="inherit" type="boolean">
        /// Use 'inherit' instead of 'block'
        ///	</param> 
        ///	<returns type="this" />

        this.forEach(function () {
            get(this).style.display = inherit ? 'inherit' : 'block';
        });

        return this;
    };

    instance.prototype.hide = function () {
        ///	<summary>
        /// Set 'display' style to 'none'
        ///	</summary> 
        ///	<returns type="this" /> 
        this.forEach(function () {
            get(this).style.display = 'none';
        });
        return this;
    };

    var startClass = '(?:^|\\s)';
    var endClass = '(?!\\S)'

    instance.prototype.classExists=function (className) {
        ///	<summary>
        /// Does css class already exists?
        ///	</summary>
        ///	<param name="className" type="string">
        /// CSS class name
        ///	</param> 
        ///	<returns type="Boolean" /> 
        var result = false;

        this.forEach(function () {
            var i = get(this);
            if (isDefined(i)) {
                result = new RegExp(startClass + className + endClass).test(i.className);
            }
        });

        return result;
    };

    instance.prototype.addClass = function (className) {
        ///	<summary>
        /// Add a css class
        ///	</summary>
        ///	<param name="className" type="string">
        /// CSS class name
        ///	</param> 
        ///	<returns type="this" /> 
        this.forEach(function () {
            if (isDefined(this.className)) {
                if (this.className.length <= 0) {
                    this.className = className;
                } else {
                    if (!sj(this).classExists(className)) {
                        var current = this.className;
                        this.className = className + ' ' + current;
                    }
                }
            } 
        });

        return this;
    };
     
    instance.prototype.removeClass = function (className) {
        ///	<summary>
        /// Remove CSS class
        ///	</summary>
        ///	<param name="className" type="string">
        /// CSS class name
        ///	</param> 
        ///	<returns type="this" /> 
        this.forEach(function () {
            if (isDefined(this.className)) {
                if (sj(this).classExists(className)) {
                    this.className = this.className.replace(new RegExp(startClass + className + endClass), '');
                }
            }
        });
        return this;
    };

    instance.prototype.replaceClass = function (originalClass, newClass) {
        ///	<summary>
        /// Replace a CSS class
        ///	</summary>
        ///	<param name="originalClass" type="string">
        /// Original class name
        ///	</param> 
        ///	<param name="newClass" type="string">
        /// New class name
        ///	</param> 
        ///	<returns type="this" /> 
        this.removeClass(originalClass);
        this.addClass(newClass);
    };

    instance.prototype.toggleClasses = function(fromClass, toClass) {
        ///	<summary>
        /// Toggle between two CSS classes
        ///	</summary>
        ///	<param name="fromClass" type="string">
        /// CSS class name
        ///	</param> 
        ///	<param name="toClass" type="string">
        /// CSS class name
        ///	</param> 
        ///	<returns type="this" /> 
        this.forEach(function () {

            if (sj(this).classExists(fromClass)) {
                sj(this).replaceClass(fromClass, toClass);
            } else {
                sj(this).replaceClass(toClass, fromClass);
            }
        });
    };

    instance.prototype.remove = function () {
        ///	<summary>
        ///	Remove element from DOM
        ///	</summary>
        this.forEach(function () {
            this.parentNode.removeChild(this);
        });
        return this;
    };

    instance.prototype.removeChildren = function (selector) {
        /// <signature>
        ///	<summary>
        ///	Remove all children nodes
        ///	</summary> 
        /// <returns type="this" /> 
        /// </signature>
        /// <signature>
        ///	<summary>
        ///	Remove all children nodes that match the selector
        ///	</summary>
        ///	<param name="selector" type="string">
        /// Selection expression (ex. .className or ul.className)
        ///	</param> 
        /// <returns type="this" />  
        /// </signature>  
        this.forEach(function () {
            if (get(this).hasChildNodes()) {
                if (typeof selector === UNDEFINED) {
                    while (get(this).childNodes.length >= 1) {
                        get(this).removeChild(get(this).firstChild);
                    }
                } else {
                    sj(this).children(selector, function (o) {
                        sj(o).remove();
                    });
                }
               
            }
        });

    };

    instance.prototype.children = function (selector, callback) {
        /// <signature>
        ///	<summary>
        ///	Find child elements and return them as an array
        ///	</summary>
        ///	<param name="selector" type="string">
        ///	 Selection expression (ex. .className or ul.className)
        ///	</param>
        /// <returns type="array" /> 
        /// </signature>
        /// <signature>
        ///	<summary>
        ///	Find child elements and return them as an array
        ///	</summary>
        ///	<param name="selector" type="string">
        ///	 Selection expression (ex. .className or ul.className)
        ///	</param>
        ///	<param name="callback" type="function">
        ///	 Callback function to process each child before adding it to the array.
        ///	</param>
        /// <returns type="array" />  
        /// </signature> 
        var o = [];
                
        if (this.me.length > 0) {
            var ch = get(this.me[0]).querySelectorAll(selector);
            for (var i = 0, max = ch.length; i < max; i++) {
                if (typeof callback === FUNCTION) {
                    o.push(callback(ch[i]));
                } else {
                    o.push(ch[i]);
                }
                
            }
        } 
        return o;
    };

    instance.prototype.select = function (selector) {
        ///	<summary>
        ///	Select elements and return them as an array of smalljs() objects
        ///	</summary>
        ///	<param name="selector" type="string">
        ///	 Selection expression (ex. .className or ul.className)
        ///	</param>
        /// <returns type="array" />  
        var r = [];
        if (this.me.length > 0) {
            r = sj(this.me[0]).children(selector, function (o) {
                return sj(o);
            });
        }

        return r;
    };

    instance.prototype.insertChildBefore = function (node) {
        ///	<summary>
        ///	Insert node before (this node)
        ///	</summary>
        ///	<param name="node" type="Node object">
        ///	Required. The node object you want to insert
        ///	</param>
        /// <returns type="this" />  
        this.forEach(function () {
            var c = node.cloneNode(true);
            this.parentNode.insertBefore(c, this); 
        });
        return this;
    };

    instance.prototype.insertChildAfter = function (node) {
        ///	<summary>
        ///	Insert node after (this node)
        ///	</summary>
        ///	<param name="node" type="Node object">
        ///	Required. The node object you want to insert
        ///	</param>
        /// <returns type="this" />
        this.forEach(function () {
            this.parentNode.insertBefore(node, this.nextSibling);
        });
        return this;
    };

    instance.prototype.hasChildNodes = function () {
        ///	<summary>
        ///	Does the DOM element has child nodes?
        ///	</summary>
        if (this.me.length > 0) {
            return get(this.me[0]).hasChildNodes();
        }
        return false;
    };

    instance.prototype.appendChild = function (node) {
        ///	<summary>
        ///	Shortcut to node.appendChild(node)
        ///	</summary>
        ///	<param name="node" type="Node object">
        ///	Required. The node object you want to append
        ///	</param>
        /// <returns type="this" />
        this.forEach(function () {
            get(this).appendChild(node);
        });
        return this;
    };

    instance.prototype.clone = function (deep) {
        ///	<summary>
        ///	Abstracting cloneNode(true)
        ///	</summary>
        ///	<param name="deep" type="boolean">
        ///	True if the children of the node should also be cloned, or false to clone only the specified node.
        ///	</param>
        /// <returns type="clone" />
        if (this.me.length > 0) {
            if (!isDefined(deep)) {
                deep = true;
            }
            return get(this.me[0]).cloneNode(deep);
        }
        return null;
    };
     
    if (!window.smalljs) {
        window.smalljs = window['smalljs'] = sj;
    }
    //alias
    if (!window.sj) {
        window.sj = window['sj'] = sj;
    }
    


     
})(document,this);