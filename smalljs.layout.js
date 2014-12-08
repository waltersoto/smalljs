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
(function (document, global, smalljs, get) {

    var FUNCTION = 'function', UNDEFINED = 'undefined';

    smalljs.extend({
        animate: function (params) {
            ///	<summary>
            ///	Animation loop
            ///	</summary>
            ///	<param name="params" type="object">
            /// {
            ///     start:0,
            ///     end:100,
            ///     duration:500,
            ///     onStep:function(i){},
            ///     callback:function(){} //Executes until animation ends,
            ///     animation:(ex. function easeIn(tick){ Math.pow(tick, 0.1 * 2) }), 
            /// }
            ///	</param> 
            var duration = params.duration | 500,
             start = params.start,
             end = params.end,
             started = new Date(),
             id = setInterval(function () {
                 var progress = ((new Date() - started) / duration) > 1 ? 1 : (new Date() - started) / duration;
                 var diff = progress;
                 if (typeof (params.animation) === FUNCTION) {
                     diff = params.animation(progress);
                 }
                 var tick = Math.round((diff * (end - start)) + start);
                 params.onStep(tick);
                 if (progress === 1) {
                     if (typeof (params.callback) === FUNCTION) {
                         params.callback();
                     }
                     clearInterval(id);
                 }
             }, 1);

        },
        document: {
            width: function () {
                ///<summary>
                /// Return document width
                ///</summary>
                ///<returns type="number" /> 
                return Math.max(
                  Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                  Math.max(document.body.offsetWidth, document.documentElement.offsetWidth),
                  Math.max(document.body.clientWidth, document.documentElement.clientWidth)
              );
            },
            height: function () {
                ///<summary>
                /// Return document height
                ///</summary>
                ///<returns type="number" /> 
                return Math.max(
                    Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
                    Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
                    Math.max(document.body.clientHeight, document.documentElement.clientHeight)
                );
            }
        },
        mouse: {
            coords: function (e) {
                ///	<summary>
                ///	Get mouse coordinates
                ///	</summary>
                ///<param name="e" type="event">
                ///</param>
                ///<returns type="{x:'',y:''}" />
                if (e.pageX || e.pageY) {
                    return { x: e.pageX, y: e.pageY };
                }
                return {
                    x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
                    y: e.clientY + document.body.scrollTop - document.body.clientTop
                };
            },
            offset: function (elem, e) {
                ///	<summary>
                ///	Get mouse coordinates relative to another element
                ///	</summary>
                ///<param name="elem" type="element">
                ///</param>
                ///<param name="e" type="event">
                ///</param>
                ///<returns type="{x:'',y:''}" />
                var ePos = smalljs.page.pos(elem);
                var mPos = smalljs.mouse.coords(e || window.event);
                return { x: mPos.x - ePos.X, y: mPos.y - ePos.Y };
            },
            capture: function (callback) {
                ///	<summary>
                ///	Capture mouse position and pass it to a callback
                ///	</summary>
                ///<param name="callback" type="function">
                ///	 callback({x,y});
                ///</param> 
                document.onmousemove = function (e) {
                    var pos = smalljs.mouse.coords(e || window.event);
                    if (typeof callback === FUNCTION) {
                        callback(pos);
                    }
                };
            }
        },
        page: {
            onScroll: function (fn) {
                ///	<summary>
                ///	Attach an event when user scrolls.
                ///	</summary>
                ///<param name="fn" type="function">
                ///	 Function to be executed
                ///</param>
                smalljs(global).addEvent('scroll', fn);
            },
            onScrollToBottom: function (fn) {
                ///	<summary>
                ///	Attach an event when user scroll to the bottom of the page.
                ///	</summary>
                ///<param name="fn" type="function">
                ///	 Function to be executed
                ///</param>
                this.onScroll(function () {

                    if ((smalljs.document.height() - smalljs.page.height()) == smalljs.page.scrollOffSet(global).Y) {
                        if (typeof (fn) === FUNCTION) {
                            fn();
                        }
                    }
                });
            },
            height: function () {
                ///<summary>
                /// Return page height
                ///</summary>
                ///<returns type="number" />
                if (global.innerHeight) {
                    return global.innerHeight;
                } else {
                    return (document.documentElement.clientHeight ?
                        document.documentElement.clientHeight :
                        document.body.clientHeight);
                }
                return 0;
            },
            width: function () {
                ///<summary>
                ///	Return page width
                ///</summary>
                ///<returns type="number" />
                if (global.innerWidth) {
                    return global.innerWidth;
                } else {
                    return (document.documentElement.clientWidth ?
                        document.documentElement.clientWidth :
                        document.body.clientWidth);
                }
                return 0;
            },
            scrollOffSet: function (obj) {
                ///	<summary>
                ///	Get page offset X and Y for an object.
                ///	</summary>
                ///<param name="obj" type="DOM element">
                ///	 If object is undefined "window" will be assumed.
                ///</param>
                ///<returns type="page offset (X,Y)" />

                var r = { X: 0, Y: 0 };
                obj = obj || global;

                if (typeof (obj.pageXOffset) !== UNDEFINED) {
                    r.X = obj.pageXOffset;
                    r.Y = obj.pageYOffset;
                } else {
                    //use document
                    var doc = obj.document;
                    if (typeof (doc) !== UNDEFINED) {
                        if (doc.compatMode === 'CSS1Compat') {
                            r.X = doc.documentElement.scrollLeft;
                            r.Y = doc.documentElement.scrollTop;
                        } else {
                            r.X = doc.body.scrollLeft;
                            r.Y = doc.body.scrollTop;
                        }
                    }

                }
                return r;
            },
            pos: function (i) {
                ///	<summary>
                ///	Get position of an object in the screen.
                ///	</summary>
                ///<param name="id" type="identifier">
                ///	 Element id, name, or reference
                ///</param>
                ///<returns type="point" />

                var o = get(i),
                point = {
                    X: 0,
                    Y: 0
                };
                if (o.offsetParent) {
                    if (o.offsetParent) {
                        do {
                            point.X += o.offsetLeft;
                            point.Y += o.offsetTop;
                        } while (o = o.offsetParent)
                    }
                }
                return point;
            }
        }
    });

})(document, window, smalljs, smalljs.get);
