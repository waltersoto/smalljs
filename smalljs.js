(function (document,global) {
   
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

    function isDefined(o) {
        return typeof o !== 'undefined';
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
            throw new Error("Constructor called as a function");
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

        this.forEach = function (fn) {
            ///	<summary>
            ///	Iterate over objects  
            ///	</summary>
            ///	<param name="fn" type="function">
            ///	 Function to be executed for each element.
            ///	</param>
            ///	<returns type="this" />
            for (var i = 0, m = this.me.length; i < m; i++) {
                if (typeof fn === 'function') {
                    fn.call(this.me[i]);
                }
            }
            return this;
        };


        this.addEvent = function (event, callback) {
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
                        if (event.substring(0, 2) === "on") {
                            event = event.substring(2);
                        }
                        this.addEventListener(event, callback, false);
                    } else if (this.attachEvent) {
                        if (event.length > 2) {
                            if (event.substring(0, 2) !== "on") {
                                event = 'on' + event;
                            }
                        }
                        this.attachEvent(event, callback);
                    }
                }
            });

            return this;
        };

        this.removeEvent = function (event, callback) {
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
                        if (event.substring(0, 2) === "on") {
                            event = event.substring(2);
                        }
                        this.removeEventListener(event, callback, false);
                    } else if (this.detachEvent) {
                        if (event.length > 2) {
                            if (event.substring(0, 2) !== "on") {
                                event = 'on' + event;
                            }
                        }
                        this.detachEvent(event, callback);
                    }
                }
            });
            return this;
        };

        this.delegate = function (child, delegatedEvent, callback) {
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

        this.onClick = function (callback) {
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

        this.onMouseover = function (callback) {
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

        this.onMouseout = function (callback) {
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

        this.att = function (name, value) {
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

        this.removeAtt = function (name) {
            ///	<summary>
            ///	Remove an attribute from element
            ///	</summary>
            /// <param name="name" type="string">Attribute name</param>
            this.forEach(function () {
                $(this).removeAttribute(name);
            });
        }

        this.checkAtt = function (name) {
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

        this.text = function (content) {
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
            var returnVal = (typeof content === 'undefined');

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

        this.appendText = function (content) {
            ///	<summary>
            ///	Append text to an element
            ///	</summary>
            ///	<param name="content" type="string">
            ///	 Content to append
            ///	</param>  
            this.forEach(function () { sj(this).text(sj(this).text() + content); });
            return this;
        };

        this.isEmpty = function () {
            ///	<summary>
            ///	Is innerHTML or Value empty
            ///	</summary> 
            ///	<returns type="Boolean" /> 
            var r = false;
            this.forEach(function () { r = sj(this).text().replace(/^\s+|\s+$/g, "").length == 0; });
            return r;
        };

        this.style = function () {
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
                    if (arguments[i].contains(':')) {
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

        this.hasStyle = function (style) {
            ///	<summary>
            ///	Returns true is style exists in the element.
            /// Example:
            /// Is style 'width:100px' defined in element 'id'?
            /// sj('id').hasStyle('width:100px'); 
            ///
            /// Is style 'width' defined in element 'id'?
            /// sj('id').hasStyle('width');
            ///	</summary>
            ///	<returns type="Boolean" /> 
            var result = false;

            if (this.me.length == 0) { return result; }
                        

            this.forEach(function () {

            });

            var current = (window.attachEvent) ? get(this.me[0]).style.cssText : get(this.me[0]).getAttribute('style');
            if (current == null) { return false; }
            var sc = current.split(';');
            var to = '';
            var val = '*';
            if (style.contains(':')) {
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
                        if (term[0].toLowerCase().trim() === to.toLowerCase().trim() && term[1].toLowerCase().trim() === val.toLowerCase().trim()) {
                            return true;
                        }
                    } else {
                        if (term[0].toLowerCase().trim() === to.toLowerCase().trim()) {
                            return true;
                        }
                    }
                }
            }
            return false;

        };

        this.classExists = function (className) {
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
                    result = new RegExp('(?:^|\\s)' + className + '(?!\\S)').test(i.className);
                }
            });

            return result;
        };


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
                if (typeof window.onload !== 'function') {
                    window.onload = callback;
                } else {
                    if (typeof callback === 'function') {
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
                if (typeof onReady !== 'function') {
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

        });
    

    if (!global.smalljs) {
        global.smalljs = global['smalljs'] = sj;
    }
    //alias
    if (!global.sj) {
        global.sj = global['sj'] = sj;
    }
    


     
})(document,this);