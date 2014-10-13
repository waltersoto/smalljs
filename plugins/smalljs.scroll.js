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
/* Required: smalljs.js and smalljs.layout.js */
(function (sj,$) {
    var scrl = {
        scrolling: false,
        bind: function (onScrollEnd) {
            ///	<summary>
            /// Bind scroll.to() function to all "same page" anchor tags. 
            ///	</summary>
            /// <param name="onScrollEnd" type="function([element id])">function to execute after the scroll completes</param> 
            ///	<returns type="element" />
            sj('[href^="#"]').forEach(function () {
                var index = this.href.indexOf('#') + 1;
                var id = this.href.substring(index);
                this.href = '#';
                sj(this).onClick(function () {
                    scrl.to(id, onScrollEnd);
                });
            });

        },
        to: function (id, onScrollEnd) {
            ///	<summary>
            /// Scroll to an element within the page
            ///	</summary>
            /// <param name="id" type="string">id of the element</param>
            /// <param name="onScrollEnd" type="function([element id])">function to execute after the scroll completes</param> 
            ///	<returns type="element" />
            var o = $(id);
            if (typeof o !== 'undefined') { 
                var point = sj.page.pos(o);
                var c = sj.page.scrollOffSet(window);
                scrl.scrolling = true;
                sj.animate({
                    start: c.Y,
                    duration: 1000,
                    end: point.Y - 70,
                    onStep: function (i) {
                        window.scrollTo(0, i);
                    },
                    callback: function () {
                        scrl.scrolling = false;
                        if (typeof (onScrollEnd) === 'function') {
                            onScrollEnd(id);
                        }
                    },
                    animation: function (tick) { return 1 - Math.cos(tick * Math.PI / 2); }
                });
            }
        }
    };




    sj.extend({
        scroll: scrl
    });


})(smalljs,smalljs.get);