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
(function (sj) {
 
    function contains(arr, substring) {
        if (typeof arr == 'undefined') {
            return false;
        }
        return arr.indexOf(substring) != -1;
    };

    var TAG = {
        ANCHOR: 'A',
        IMAGE: 'IMG',
        DIV: 'DIV',
        SPAN: 'SPAN',
        PARAGRAPH:'P'
    };

    var ATT = {
        BIND: 'sj-bind',
        CLONED: 'sj-cloned',
        REPEAT: 'sj-repeat',
        NO_CHILDREN: 'sj-no-children',
        TEMPLATE: 'sj-template'
    };

   var binder = {
        sources: {},
        addSource: function (source) {
            ///	<summary>
            /// Add sources to the binder
            ///	</summary> 
            /// <param name="source" type="json">{ array:[], array2:[], arrayN:[] }</param> 
            var p = null;
            for (p in source) {
                if (typeof (source[p]) !== 'undefined') {
                    this.sources[p] = source[p];
                }
            } 
        },
        readPattern:function(txt){
              
            var pattern = /{([^}]+)}/g, val, o = [];

            while (val = pattern.exec(txt)) {
                o.push(val[1]);
            }

            return o;
        },
        apply: function () {
            ///	<summary>
            /// Apply binder
            ///	</summary> 
            this.model();
            this.repeater();
        },
        updateSource: function (name, source) {
            ///	<summary>
            /// Update sources
            ///	</summary> 
            /// <param name="name" type="string">Source array name</param> 
            /// <param name="source" type="json">{ array:[] }</param>
            this.sources[name] = source;
            this.apply();
        },
        removeSource: function (name) {
            ///	<summary>
            /// Delete resource
            ///	</summary> 
            /// <param name="name" type="string">Source array name</param> 
            delete binder.sources[name];
            this.apply();
        },
        model: function () {
            ///	<summary>
            /// Bind a model
            ///	</summary> 
            (function ($) {
                for (var p in $.sources) {
                    if ($.sources[p].constructor !== Array) {
                        sj('[' + ATT.BIND + '*=' + p + ']').forEach(function () {
                            var att = sj(this).att(ATT.BIND);
                            att = att.replace(p + '.', '');
                            sj(this).att(ATT.NO_CHILDREN, true);
                            sj(this).text($.sources[p][att]);
                        });
                    }
                }
            })(binder);
        },
        repeater: function () {
            ///	<summary>
            /// Bind a repeater
            ///	</summary>
            (function ($) {
                sj('['+ATT.CLONED+']').remove();

                sj('[' + ATT.REPEAT + ']').forEach(function () {
                    if (sj(this).checkAtt(ATT.NO_CHILDREN)) {
                        if (this.tagName === TAG.DIV || this.tagName === TAG.SPAN || this.tagName === TAG.PARAGRAPH) {
                            sj(this).removeChildren();
                        }  
                    } else {
                        if (sj(this).hasChildNodes()) {
                            if (this.firstElementChild !== null) {
                                var first = this.firstElementChild.cloneNode(true);
                                if (first.style.display == 'none') {
                                    sj(first).show(true);
                                } 
                                sj(this).removeChildren();
                                sj(this).appendChild(first);
                            }

                        }
                    }

                    var data = sj(this).att(ATT.REPEAT);
                    var temp = sj(this).att(ATT.REPEAT);

                    var prop = [];
                    if (contains(data,'.')) {
                        var modelData = data.split(' ');

                        for (var mdIndex in modelData) {
                            var md = modelData[mdIndex];
                            if (md.trim().length > 0) {
                                var split = md.split('.');
                                if (split.length > 0) {
                                    prop.push(split[1]);
                                    data = split[0];
                                }
                            }
                        }

                    }

                    var d = $.sources[data];
                    var arr = [];
                    
                   
                    if (typeof d !== 'undefined') {
                        
                        var template = this.firstElementChild !== null? sj(this.firstElementChild).clone() : sj(this).clone();

                        if (this.firstElementChild !== null) {
                            sj(this.firstElementChild).hide();
                        }
                         
                        for (var copyCounter = 0, max = d.length; copyCounter < max; copyCounter++) {
                            var copy = template.cloneNode(true);
                            for (var p in d[copyCounter]) { 
                                if (sj(this).hasChildNodes() && this.tagName !== TAG.ANCHOR && copy.hasChildNodes()) {
                                    if (isNaN(p)) {
                                        var list = sj(copy).children('[' + ATT.BIND + '=' + p + ']');
                                        for (var l = 0, lmax = list.length; l < lmax; l++)
                                        {
                                            if (list[l].tagName === TAG.IMAGE) {
                                                sj(copy).show(true);
                                                list[l].src = d[copyCounter][p];
                                                var alt = list[l].alt;
                                                if (contains(alt, '{') && contains(alt, '}')) {
                                                    alt = alt.replace('{', '').replace('}', '');
                                                    list[l].alt = d[copyCounter][alt];
                                                }
                                            } else if (list[l].tagName === TAG.ANCHOR) {
                                                sj(copy).show(true);
                                                list[l].href = d[copyCounter][p];
                                                var innera = list[l].text;
                                                if (contains(innera, '{') && contains(innera, '}')) {
                                                    innera = innera.replace('{', '').replace('}', '');
                                                    sj(list[l]).text(d[copyCounter][innera]);
                                                } 
                                            } else {
                                               sj(list[l]).text(d[copyCounter][p]);
                                            }
                                             
                                            //Read patterns
                                            if (list[l].attributes.length > 0) {
                                                for (var attIndex = 0, attmax = list[l].attributes.length; attIndex < attmax; attIndex++) {
                                                    
                                                    if (contains(list[l].attributes.item(attIndex).value, '{')) {
                                                        var val = list[l].attributes.item(attIndex).value;
                                                        var name = list[l].attributes.item(attIndex).name;
                                                        var attCmd = binder.readPattern(list[l].attributes.item(attIndex).value);
                                                        if (attCmd.length > 0) {
                                                            for (var attCmdIndex = 0, acMax = attCmd.length; attCmdIndex < acMax ; attCmdIndex++) {
                                                                val = val.replace('{' + attCmd[attCmdIndex] + '}', d[copyCounter][attCmd[attCmdIndex]]);
                                                               
                                                            } 
                                                        }
                                                        list[l].attributes.item(attIndex).value = val;
                                                    }

                                                }
                                            }
                                        }
                                    }
                                    //Check for wildcard binds
                                    //Ex. <div sj-template='true' onclick='alert({id})'>{name}</div>
                                    var cmdList = sj(copy).children('['+ATT.TEMPLATE+']');
                                    for (var cmd = 0, cmdMax = cmdList.length; cmd < cmdMax; cmd++) {
                                        //Read patterns
                                        if (cmdList[cmd].attributes.length > 0) {
                                            for (var attCmdIndex = 0, attMax = cmdList[cmd].attributes.length; attCmdIndex < attMax; attCmdIndex++) {
                                                if (contains(cmdList[cmd].attributes.item(attCmdIndex).value, '{')) {

                                                    var bindValue = cmdList[cmd].attributes.item(attCmdIndex).value;
                                                  
                                                    var attributePattern = binder.readPattern(cmdList[cmd].attributes.item(attCmdIndex).value);

                                                    if (attributePattern.length > 0) {
                                                        for (var cmdBindIndex = 0, cmdBindMax = attributePattern.length; cmdBindIndex < cmdBindMax ; cmdBindIndex++) {
                                                            bindValue = bindValue.replace('{' + attributePattern[cmdBindIndex] + '}', d[copyCounter][attributePattern[cmdBindIndex]]);
                                                        }
                                                    }
                                                    cmdList[cmd].attributes.item(attCmdIndex).value = bindValue;
                                                } else {
                                                    if (sj(cmdList[cmd]).text().length > 0) {
                                                        var templatePattern = binder.readPattern(sj(cmdList[cmd]).text());
                                                        var pattVal = sj(cmdList[cmd]).text();
                                                        if (templatePattern.length > 0) {
                                                            for (var cbi = 0, acmax = templatePattern.length; cbi < acmax ; cbi++) {
                                                                pattVal = pattVal.replace('{' + templatePattern[cbi] + '}', d[copyCounter][templatePattern[cbi]]);
                                                            }
                                                        }
                                                    }
                                                    sj(cmdList[cmd]).text(pattVal);
                                                }
                                            }
                                        }  
                                    }
                                } else {
                                    if (!sj(this).hasChildNodes()) {
                                        sj(this).att(ATT.NO_CHILDREN, true);
                                    } else {
                                        if (prop.length == 0) {
                                            if (!sj(copy).hasChildNodes() && sj(copy).checkAtt(ATT.BIND)) {
                                                prop.push(sj(copy).att(ATT.BIND));
                                            }
                                        }
                                    }
                                    if (prop.length > 0) {
                                        if (prop.length == 1) { 
                                            if (copy.tagName === TAG.IMAGE) {
                                                sj(copy).displayDefault();
                                                copy.src = d[copyCounter][prop[0]];
                                                var alt = copy.alt; 
                                                if (contains(alt, '{') && contains(alt, '}')) {
                                                    alt = alt.replace('{', '').replace('}', '');
                                                    copy.alt = d[copyCounter][alt];
                                                }
                                            } else if (copy.tagName === TAG.ANCHOR) {
                                                sj(copy).displayDefault();
                                                copy.href = d[copyCounter][prop[0]];
                                                var innera = copy.text; 
                                                if (contains(innera, '{') && contains(innera, '{')) {
                                                    innera = innera.replace('{', '').replace('}', '');
                                                    var innArr = innera.split('.');
                                                    if (innArr.length > 0) {
                                                        innera = innArr[1];
                                                    }
                                                    sj(copy).text(d[copyCounter][innera]);
                                                }
                                            } else { 
                                                sj(copy).text(d[copyCounter][prop[0]]);
                                            }
                                        } else {
                                            var line = ''; 
                                            for (var pindex in prop) {
                                                line += d[copyCounter][prop[pindex]] + ' ';
                                            } 
                                            sj(copy).text(line);
                                        } 
                                    } else {  
                                        sj(copy).text(d[copyCounter]);
                                    }
                                }

                            }

                            arr.push(copy);
                        }

                    }

                    for (var a = 0, max = arr.length; a < max; a++) {
                        if (arr[a].tagName === TAG.IMAGE || arr[a].tagName === TAG.ANCHOR) {
                            sj(this).displayOff();
                            sj(arr[a]).att(ATT.CLONED, true); 
                            sj(this).insertChildAfter(arr[a]);
                        } else {
                            sj(this).appendChild(arr[a]);
                        } 
                    }

                });
            })(binder);
        }
    };

   sj.extend({
       binder:binder
   });

})(smalljs);