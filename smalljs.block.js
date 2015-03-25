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
(function (smalljs,global) {

    var ATT = {
        BLOCK: "block",
        PROPERTY:"blk-prop"
    };

    var TAG = {
        INPUT: "input",
        RADIO: "radio",
        TEXT_AREA: "textarea",
        SELECT: "select"
    }

    var UNDEFINED = "undefined";

    var setName = "";
    var fn = function (name) {

        var getNode = function (nodeName) {
            var nodes = document.querySelectorAll("[" + ATT.BLOCK + "=" + nodeName + "]");
            if (typeof nodes !== UNDEFINED && nodes.length > 0) {
                return nodes[0];
            }
            return null;
        };

        var getNodeProperties = function () {
            var list = null;
            var container = getNode(setName);
            if (container !== null && typeof  container !== "undefined") {
                list = container.querySelectorAll("["+ATT.PROPERTY+"]");
            }
            return list;
        };

        setName = name;
        this.get = function () {

            var set = {
            };


            var nodes = getNodeProperties(setName);
            if (typeof nodes !== "undefined" && nodes !== null && nodes.length > 0) {
                for (var i = 0; i < nodes.length; i++) {
                    var propName = nodes[i].attributes.getNamedItem(ATT.PROPERTY).value;
           
                    switch (nodes[i].tagName.toLowerCase()) {
                        case TAG.TEXT_AREA:
                        case TAG.INPUT:
                            var type = nodes[i].type;
                            switch (type.toLowerCase()) {
                                case "radio":
                                    if(nodes[i].checked){
                                        set[propName] = nodes[i].value;
                                    } 
                                    break;
                                default:
                                    set[propName] = nodes[i].value;
                                    break;
                            } 
                            break;
                        case TAG.SELECT:
                            if (typeof nodes[i].selectedIndex !== "undefined"
                                && nodes[i].selectedIndex !== -1) {
                                if (nodes[i].multiple) {
                                    var v = [];
                                    for (var oi = 0, m = nodes[i].length; oi < m; oi++) {
                                        if (nodes[i].options[oi].selected) {
                                            v.push(nodes[i].options[oi].value);
                                        }
                                    }
                                    set[propName] = v;
                                } else {
                                    set[propName] = nodes[i].options[nodes[i].selectedIndex].value;
                                }
                            }
                            break;
                        default:
                            if (typeof (nodes[i].innerHTML) !== UNDEFINED) { 
                                set[propName] = nodes[i].innerHTML;
                            }

                            break;
                    } 
                }
            }

            return set;
        };

        this.set = function (json) {

            var container = getNode(setName);

            for (var p in json) {
                if (json.hasOwnProperty(p)) {
                    if (typeof (json[p]) !== UNDEFINED) {

                        var element = container.querySelectorAll("[" + ATT.PROPERTY + "=" + p + "]");
                        if (typeof element !== UNDEFINED && element.length > 0) {
                            switch (element[0].tagName.toLowerCase()) {
                            case TAG.TEXT_AREA:
                                case TAG.INPUT:
                                    if (element[0].type.toLowerCase() === "radio") {
                                        for (var ri = 0, rm = element.length; ri < rm; ri++) {
                                            if (element[ri].value.toLowerCase() === json[p].toLowerCase()) {
                                                element[ri].checked = true;
                                            }
                                        }
                                    } else {
                                        element[0].value = json[p];
                                    }
                                
                                break;
                                case TAG.SELECT:

                                    if (json[p].constructor !== Array) {
                                        for (var oi = 0, m = element[0].length; oi < m; oi++) {
                                            if (element[0].options[oi].value.toLowerCase() === json[p].toLowerCase()) {
                                                element[0].options[oi].selected = true;
                                            }
                                        }
                                    } else {
                                        for (var ji = 0, jm = json[p].length; ji < jm; ji++) {
                                            for (oi = 0, m = element[0].length; oi < m; oi++) {
                                                if (element[0].options[oi].value.toLowerCase() === json[p][ji].toLowerCase()) {
                                                    element[0].options[oi].selected = true;
                                                }
                                            }
                                        }
                                    }

                              
                                break;
                            default:
                                if (typeof (element[0].innerHTML) !== UNDEFINED) {
                                    element[0].innerHTML = json[p];
                                }

                                break;
                            }
                        }

                    }
                }
            }

        };

    };

    smalljs.extend({
        block: function (name) {
            return new fn(name);
        }
    });

    if (!global.block) {
        global.block = smalljs.block;
    }

})(smalljs,window);