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

    var setName = '';
    var fn = function (name) {
        var getNode = function (name) {
            var nodes = document.querySelectorAll('[block=' + name + ']');
            if (typeof nodes !== 'undefined' && nodes.length > 0) {
                return nodes[0];
            }
            return null;
        };

        var getNodeProperties = function (name) {
            var list = null;
            var container = getNode(setName);
            if (container !== null) {
                list = container.querySelectorAll('[blk-prop]');
            }
            return list;
        };

        setName = name;
        this.get = function () {

            var set = {
            };


            var nodes = getNodeProperties(setName);
            if (typeof nodes !== null && nodes.length > 0) {
                for (var i = 0; i < nodes.length; i++) {
                    var name = nodes[i].attributes.getNamedItem('blk-prop').value;
                    var value = '';
                    switch (nodes[i].tagName.toLowerCase()) {
                        case 'textarea':
                        case 'input': value = nodes[i].value;
                            break;
                        default:
                            if (typeof (nodes[i].innerHTML) !== 'undefined') {
                                value = nodes[i].innerHTML;
                            }

                            break;
                    }

                    set[name] = value;
                }
            }

            return set;
        };

        this.set = function (json) {

            var container = getNode(setName);

            for (p in json) {
                if (typeof (json[p]) !== 'undefined') {

                    var element = container.querySelectorAll('[blk-prop=' + p + ']');
                    if (typeof element !== 'undefined' && element.length > 0) {
                        switch (element[0].tagName.toLowerCase()) {
                            case 'textarea':
                            case 'input': element[0].value = json[p];
                                break;
                            default:
                                if (typeof (element[0].innerHTML) !== 'undefined') {
                                    element[0].innerHTML = json[p];
                                }

                                break;
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