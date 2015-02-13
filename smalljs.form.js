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

    var f = null; 
    var UNDEFINED = "undefined";

    var FORM_TYPE = {
        SELECT_MULTIPLE: "select-multiple",
        SELECT_ONE: "select-one",
        CHECKBOX: "checkbox",
        RADIO: "radio",
        SUBMIT: "submit",
        BUTTON: "button"
    };

    function isDefined(o) {
        return o !== null && typeof o !== UNDEFINED;
    }

    function readOption(o) {

        if (o.multiple) {
            var v = [];
            for (var i = 0, m = o.length; i < m; i++) {
                if (o.options[i].selected) {
                    v.push(o.options[i].value);
                }
            }
            return v;
        } else {
            return o.options[o.selectedIndex].value;
        }
    }


    function fn(name) {

        var forms = document.getElementsByName(name);

        if (isDefined(forms)) {
            if (forms.length > 0) {
                f = forms[0];
            }
        }

        this.clear = function () {
            ///<summary>
            /// Clear all elements in the form
            ///	</summary> 
            if (isDefined(f)) {
                for (var i = 0, m = f.elements.length; i < m; i++) {
                    if (typeof (f.elements[i].name) !== UNDEFINED) { 
                        if (f.elements[i].type === FORM_TYPE.SELECT_MULTIPLE || f.elements[i].type === FORM_TYPE.SELECT_ONE) {
                            for (var o = 0; o < f.elements[i].options.length; o++) {
                                f.elements[i].options[o].selected = false;
                            }
                        } else if (f.elements[i].type === FORM_TYPE.CHECKBOX || f.elements[i].type === FORM_TYPE.RADIO) {
                            f.elements[i].checked = false;
                        } else {
                            if (f.elements[i].type !== FORM_TYPE.BUTTON && f.elements[i].type !== FORM_TYPE.SUBMIT) {
                                f.elements[i].value = "";
                            }
                        }
                    }
                }
            }
        };

        this.set = function () {
             ///<summary>
            ///  set form fields from a json file. (Not Implemented)
            ///	</summary> 


        };

        this.get = function () {
            ///	<summary>
            ///  get form fields as json
            ///	</summary> 
            ///	<returns type="jason object as{ 'element name':'element value' }" />
            var items = {};
            if (isDefined(f)) {
                for (var i = 0, m = f.elements.length; i < m; i++) {
                    if (typeof (f.elements[i].name) !== UNDEFINED) {
                        var nme = (f.elements[i].name.length > 0) ? f.elements[i].name : f.elements[i].type + i;
                        if (f.elements[i].type === FORM_TYPE.SELECT_MULTIPLE || f.elements[i].type === FORM_TYPE.SELECT_ONE) {
                            items[nme] = readOption(f.elements[i]);
                        } else if (f.elements[i].type === FORM_TYPE.CHECKBOX || f.elements[i].type === FORM_TYPE.RADIO) {
                            if (f.elements[i].checked) {
                                items[nme] = f.elements[i].value;
                            }
                        } else {
                            if (f.elements[i].type !== FORM_TYPE.BUTTON && f.elements[i].type !== FORM_TYPE.SUBMIT) {
                                items[nme] = f.elements[i].value;
                            }
                        }
                    }
                }
            }
            return items;
        };

    };

    var sjForm = function (name) {
        ///	<summary>
        ///	HTML forms utility
        ///	</summary>
        ///	<param name="name" type="string">
        ///	 Name of the form to manipulate
        ///	</param>
        ///	<returns type="sjForm" />
        return new fn(name);
    };

    smalljs.extend({
        form:sjForm
    });

    if (typeof global !== UNDEFINED) {
        if (!global.sjForm) {
            global.sjForm = sjForm;
        }
    }

})(smalljs,window);