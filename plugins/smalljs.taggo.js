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

    function addToRemove(tag) {
        var removeIndex = tags.indexOf(tag);
        if (removeIndex === -1) {
            toRemove.push(tag);
        }
    }

    function loadTags(tagsParams) {
        sj(tagsParams.display).text("");
        var i = 0;
        for (var t in tags) {
            if (tags.hasOwnProperty(t)) {
                i++;
                (function(tag) {
                    var div = document.createElement("div");
                    div.innerHTML = tag;
                    sj(div).addClass(tagsParams.tagClass);
                    sj(div).onClick(function() {
                        remove(tag, tagsParams.display, tagsParams.tagClass);
                    });
                    sj(tagsParams.display).appendChild(div);
                })(tags[t]);
            }
        }
    }

    function remove(tag, displayId, tagClass) {
        var index = tags.indexOf(tag);
        if (index !== -1) {
            tags.splice(index, 1);
            addToRemove(tag);
        }
        loadTags({ display: displayId, tagClass: tagClass });
    }

    function deleteFromRemove(tag) {
        var index = toRemove.indexOf(tag);
        if (index !== -1) {
           toRemove.splice(index, 1);
        }
    }
   
    function add() {
        if (!sj(params.textbox).isEmpty()) {
            var fromText = $(params.textbox).value.split(",");
            for (var textLoop = 0; textLoop < fromText.length; textLoop++) {
                if (tags.indexOf(sj.trim(fromText[textLoop])) === -1 && sj.trim(fromText[textLoop]).length > 0) {
                    tags.push(sj.trim(fromText[textLoop]));
                    deleteFromRemove(sj.trim(fromText[textLoop])); //Remove from list is needed
                }
            }
            loadTags({ display: params.display, tagClass: params.tagClass }); //reload tags 
            sj(params.textbox).text("");
        }
    }

    function handleAdd(e) {
        var key;
        if (window.event) {
            key = window.event.keyCode;     //IE
        } else {
            key = e.which;     //firefox
        } 
        if (key === 188 || key === 13) {
            add(); 
            return false; 
        }
        return true;
    }

    sj.extend({
        taggo: {
            tags:tags,
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
                if (typeof (params.button) !== "undefined") {
                    sj(params.button).onClick(function () {
                        add();
                    });
                }
                sj(params.textbox).addEvent("onkeyup", function (event) {
                    return handleAdd(event);
                });

            },
            add:add,
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
                if (tagArray.constructor === Array) {
                    tags = tagArray;
                    loadTags({ display: params.display, tagClass: params.tagClass });
                }
                
            }
        }
    });

})(smalljs,smalljs.get);