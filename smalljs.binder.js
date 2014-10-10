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

   var binder = {
        sources: {},
        addSource: function (source) {
            var p = null;
            for (p in source) {
                if (typeof (source[p]) !== 'undefined') {
                    this.sources[p] = source[p];
                }
            }
            return this;
        },
        readPattern:function(txt){
              
            var pa = /{([^}]+)}/g, val, o = [];

            while (val = pa.exec(txt)) {
                o.push(val[1]);
            }

            return o;
        },
        apply: function () {
            this.model();
            this.repeater();
        },
        updateSource: function (name, source) {
            this.sources[name] = source;
            this.apply();
        },
        removeSource: function (name) {
            delete binder.sources[name];
            this.apply();
        },
        model: function () {
            (function ($) {
                for (var p in $.sources) {
                    if ($.sources[p].constructor !== Array) {
                        sj('[sj-bind*=' + p + ']').forEach(function () {
                            var att = sj(this).att('sj-bind');
                            att = att.replace(p + '.', '');
                            sj(this).att('no-children', true);
                            sj(this).text($.sources[p][att]);
                        });
                    }
                }
            })(binder);
        },
        repeater: function () {
            (function ($) {
                sj('[cloned]').remove();

                sj('[sj-repeat]').forEach(function () { 
                    if (smalljs(this).checkAtt('no-children')) { 
                        if (this.tagName === 'DIV' || this.tagName === 'SPAN' || this.tagName === 'P') {
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

                    var data = sj(this).att('sj-repeat');
                    var temp = sj(this).att('sj-repeat');

                    var prop = [];
                    if (contains(data,'.')) {
                        var mdata = data.split(' ');

                        for (var mdi in mdata) {
                            var md = mdata[mdi];
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
                         
                        for (var _lc = 0, max = d.length; _lc < max; _lc++) {
                            var copy = template.cloneNode(true);
                            for (var p in d[_lc]) { 
                                if (sj(this).hasChildNodes() && this.tagName !== 'A' && copy.hasChildNodes()) {
                                    if (isNaN(p)) {
                                        var list = sj(copy).children('[sj-bind=' + p + ']'); 
                                        for (var l = 0, lmax = list.length; l < lmax; l++)
                                        {
                                            if (list[l].tagName === 'IMG') {
                                                sj(copy).show(true);
                                                list[l].src = d[_lc][p];
                                                var alt = list[l].alt;
                                                if (contains(alt, '{') && contains(alt, '}')) {
                                                    alt = alt.replace('{', '').replace('}', '');
                                                    list[l].alt = d[_lc][alt];
                                                }
                                            } else if (list[l].tagName === 'A') {
                                                sj(copy).show(true);
                                                list[l].href = d[_lc][p];
                                                var innera = list[l].text;
                                                if (contains(innera, '{') && contains(innera, '}')) {
                                                    innera = innera.replace('{', '').replace('}', '');
                                                    sj(list[l]).text(d[_lc][innera]);
                                                } 
                                            } else {
                                               sj(list[l]).text(d[_lc][p]);
                                            }
                                             
                                            //Read patterns
                                            if (list[l].attributes.length > 0) {
                                                for (var atti=0, attmax = list[l].attributes.length; atti < attmax; atti++) {
                                                    
                                                    if (contains(list[l].attributes.item(atti).value, '{')) {
                                                       
                                                        var val = list[l].attributes.item(atti).value;
                                                        var name = list[l].attributes.item(atti).name;
                                                        var attcmd = binder.readPattern(list[l].attributes.item(atti).value);
                                                       
                                                        if (attcmd.length > 0) {
                                                            for (var aci = 0, acmax = attcmd.length;aci < acmax ;aci++){
                                                                val = val.replace('{' + attcmd[aci] + '}', d[_lc][attcmd[aci]]);
                                                               
                                                            } 
                                                        }
                                                        list[l].attributes.item(atti).value = val; 
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    //Check for wildcard binds
                                    //Ex. <div sj-template='true' onclick='alert({id})'>{name}</div>
                                    var cmdlist = sj(copy).children('[sj-template]');
                                    for (var cmd = 0, cmdmax = cmdlist.length; cmd < cmdmax; cmd++) {
                                        //Read patterns
                                        if (cmdlist[cmd].attributes.length > 0) {
                                            for (var attcb = 0, attmax = cmdlist[cmd].attributes.length; attcb < attmax; attcb++) { 
                                                if (contains(cmdlist[cmd].attributes.item(attcb).value, '{')) {

                                                    var cbval = cmdlist[cmd].attributes.item(attcb).value;
                                                  
                                                    var attcbp = binder.readPattern(cmdlist[cmd].attributes.item(attcb).value);

                                                    if (attcbp.length > 0) {
                                                        for (var cbi = 0, acmax = attcbp.length; cbi < acmax ; cbi++) {
                                                            cbval = cbval.replace('{' + attcbp[cbi] + '}', d[_lc][attcbp[cbi]]);
                                                        }
                                                    }
                                                    cmdlist[cmd].attributes.item(attcb).value = cbval;
                                                } else {
                                                    if (sj(cmdlist[cmd]).text().length > 0) {
                                                        var icbp = binder.readPattern(sj(cmdlist[cmd]).text());
                                                        var pattVal = sj(cmdlist[cmd]).text();
                                                        if (icbp.length > 0) {
                                                            for (var cbi = 0, acmax = icbp.length; cbi < acmax ; cbi++) {
                                                                pattVal = pattVal.replace('{' + icbp[cbi] + '}', d[_lc][icbp[cbi]]);
                                                            }
                                                        }
                                                    }
                                                    sj(cmdlist[cmd]).text(pattVal);
                                                }
                                            }
                                        }  
                                    }
                                } else {
                                    if (!sj(this).hasChildNodes()) {
                                        sj(this).att('no-children', true);
                                    } else {
                                        if (prop.length == 0) {
                                            if (!sj(copy).hasChildNodes() && sj(copy).checkAtt('sj-bind')) {
                                                prop.push(sj(copy).att('sj-bind'));
                                            }
                                        }
                                    }
                                    if (prop.length > 0) {
                                        if (prop.length == 1) { 
                                            if (copy.tagName === 'IMG') {
                                                sj(copy).displayDefault();
                                                copy.src = d[_lc][prop[0]];
                                                var alt = copy.alt; 
                                                if (contains(alt, '{') && contains(alt, '}')) {
                                                    alt = alt.replace('{', '').replace('}', '');
                                                    copy.alt = d[_lc][alt];
                                                }
                                            } else if (copy.tagName === 'A') {
                                                sj(copy).displayDefault();
                                                copy.href = d[_lc][prop[0]];
                                                var innera = copy.text; 
                                                if (contains(innera, '{') && contains(innera, '{')) {
                                                    innera = innera.replace('{', '').replace('}', '');
                                                    var innArr = innera.split('.');
                                                    if (innArr.length > 0) {
                                                        innera = innArr[1];
                                                    }
                                                    sj(copy).text(d[_lc][innera]);
                                                }
                                            } else { 
                                                sj(copy).text(d[_lc][prop[0]]);
                                            }
                                        } else {
                                            var line = ''; 
                                            for (var pindex in prop) {
                                                line += d[_lc][prop[pindex]] + ' ';
                                            } 
                                            sj(copy).text(line);
                                        } 
                                    } else {  
                                        sj(copy).text(d[_lc]);
                                    }
                                }

                            }

                            arr.push(copy);
                        }

                    }

                    for (var a = 0, max = arr.length; a < max; a++) {
                        if (arr[a].tagName === 'IMG' || arr[a].tagName === 'A') {
                            sj(this).displayOff();
                            sj(arr[a]).att('cloned', true); 
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