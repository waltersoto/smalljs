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
/* Required: smalljs.js */
(function (sj,$) {
 
    var tags = [];
    var toRemove = [];
    var params = null;

    function remove(tag, displayId, tagClass) {
        var index = tags.indexOf(tag);
        if (index != -1) {
            tags.splice(index, 1);
            addToRemove(tag);
        }
        loadTags({ display: displayId, tagClass: tagClass });
    }

    function deleteFromRemove(tag) {
        var index = toRemove.indexOf(tag);
        if (index != -1) {
           toRemove.splice(index, 1);
        }
    }

    function addToRemove(tag) {
        var removeIndex = tags.indexOf(tag);
        if (removeIndex == -1) {
            toRemove.push(tag);
        }
    }

    function handleAdd(e) {
        var key;
        if (window.event) {
            key = window.event.keyCode;     //IE
        } else {
            key = e.which;     //firefox
        }

        if (key == 44 || key == 13) {
            add();
            return false;
        }
        return true;
    }

    function add() { 
        if (!sj(params.textbox).isEmpty()) {
            var fromText = $(params.textbox).value.split(',');
            for (var textLoop = 0; textLoop < fromText.length; textLoop++) {
                if (tags.indexOf(fromText[textLoop].trim()) === -1 && fromText[textLoop].trim().length > 0) {
                    tags.push(fromText[textLoop].trim());
                    deleteFromRemove(fromText[textLoop].trim()); //Remove from list is needed
                }
            }
            loadTags({ display: params.display, tagClass: params.tagClass }); //reload tags 
            sj(params.textbox).text('');
        }
    }

    function loadTags(params) {
        sj(params.display).text('');
        var i = 0;
        var first = true;
        for (var t in tags) {
            i++;
            (function (tag) {
                var div = document.createElement('div');
                div.innerHTML = tag;
                sj(div).addClass(params.tagClass);
                sj(div).onClick(function () {
                    remove(tag, params.display, params.tagClass);
                });
                sj(params.display).appendChild(div);
            })(tags[t]);
           
        }
    }

    function nodeinsert(newElement, parent) { 
        if (typeof (parent) === 'undefined') {
            document.body.appendChild(newElement);
        } else {
            sj(parent).appendChild(newElement);
        }
    }

    sj.extend({
        taggo: {
            bind: function (parameters) {
                ///	<summary>
                /// Bind taggo script to a textbox, display div, css class, and/or button
                ///	</summary> 
                ///	<param name="parameters" type="object">
                ///{
                ///  textbox:'textbox id',
                ///  button:'button name or id'
                ///  display:'display object id',
                ///  tagClass:'tag css class'
                ///}
                ///	</param>
                params = parameters;
                if (typeof (params.button) !== 'undefined') {
                    sj(params.button).onClick(function () {
                        add();
                    });
                }
                sj(params.textbox).addEvent('keypress', function (event) {
                    return handleAdd(event);
                });

            },
            read: function () {
                ///	<summary>
                /// Read tags
                ///	</summary> 
                return tags;
            },
            load: function (tagArray) {
                ///	<summary>
                /// Load an array of tags
                ///	</summary>
                ///	<param name="tagArray" type="array"></param>
                params = param
                if (tagArray.constructor === Array) {
                    tags = tagArray;
                    loadTags({ display: params.display, tagClass: params.tagClass });
                }
                
            }
        }
    });

})(smalljs,smalljs.get);