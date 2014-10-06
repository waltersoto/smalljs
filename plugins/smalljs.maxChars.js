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
(function (smalljs,$) {
    smalljs.plugin({

        maxChars: function (max, callback) {
            ///<summary>
            /// Limit maximun characters on a text field
            ///</summary>
            ///<param name="max" type="Number">
            /// Maximun number of characters permitted
            ///</param>
            ///<param name="callback" type="function">
            ///Call back function that will received a parameter with the number of characters left (Ex. function(r){  })
            ///</param>
            ///	<returns type="this" />
            this.forEach(function () {
                (function (id) {
                    smalljs(id).addEvent('keyup', (function () {
                        var len = $(id).value.length;
                        if (len >= max) {
                            $(id).value = $(id).value.substring(0, max);
                        }
                        if (typeof (callback) === 'function') {
                            callback((max - len > -1) ? max - len : 0);
                        }
                    }));
                })(this);
            });

            return this;
        }
    });

})(smalljs,smalljs.get);