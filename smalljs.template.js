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
(function (smalljs, ajax) {

    var folder;
     
    var toDom = function(txt) {
        var temp = document.createElement("div");
        temp.innerHTML = txt;
        return temp.firstChild;
    };

    var fetch = function (templateUrl, callback,asText) {
        ajax({
                method:"GET",
                url:templateUrl,
                onResponse: function (html) {
                    if (typeof callback === "function") {
                        if (typeof asText === "undefined") {
                            callback(toDom(html));
                        }
                        callback(html);
                    }
                    
                },
                resultType: "String"
            });   
    };

    var validTemplatedData = function(o) {
        return o.hasOwnProperty("template") && o.hasOwnProperty("data");
    }

    var template = function (templateFolder) {

        folder = templateFolder;

        if (folder.length > 0 && folder.substring(folder.length - 1) === "\\") {
            folder = folder.substring(0, folder.length - 1);
        }

        if (folder.length > 0 && folder.substring(folder.length - 1) !== "/") {
            folder = folder + "/";
        }
 

        this.load = function (name,callback) {
            ///	<summary>
            ///	Load template as text with data biding
            ///	</summary>
            ///	<param name="name" type="string">
            ///	 Name of the template file
            ///	</param>  
            ///	<param name="callbacks" type="function">
            ///	 Function that will receive a template instance. (ex. function(html){})
            ///	</param>  

            fetch(folder + name,callback);
             
        };

        this.loadWith = function(name, bindings, callback) {
            ///	<summary>
            ///	Load template as text with data biding
            ///	</summary>
            ///	<param name="name" type="string">
            ///	 Name of the template file
            ///	</param> 
            ///	<param name="bindings" type="json">
            ///	 Data to bind. (ex. [{'label1':'data'},{'label2','data'}]
            ///	</param> 
            ///	<param name="callbacks" type="function">
            ///	 Function that will receive and array of template instances. (ex. function(html[]){})
            ///	</param>  

            fetch(folder + name, function (html) {

                if (typeof bindings !== "undefined") {

                    var items = [];

                    for (var i = 0, max = bindings.length; i < max; i++) {
                        var temp = html;
                        for (var p in bindings[i]) {
                            if (bindings[i].hasOwnProperty(p)) {
                                temp = temp.replace("{" + p + "}", bindings[i][p]);
                            }
                        }

                        items.push(toDom(temp));
                    }

                    if (typeof callback === "function") {
                        callback(items);
                    }

                }
            },true);


        };

        this.loadCustoms = function(templatedBindings, callback) {
            ///	<summary>
            ///	Load template as text with data biding
            ///	</summary>  
            ///	<param name="templatedBindings" type="json">
            ///	 Data to bind. (ex. [{template:'templateFile.html',data:{'label1':'data'},{'label2','data'}}]
            ///	</param> 
            ///	<param name="callbacks" type="function">
            ///	 Function that will receive and array of template instances. (ex. function(html[]){})
            ///	</param>  

            if (typeof templatedBindings !== "undefined"
                && templatedBindings !== null
                && validTemplatedData(templatedBindings)) {

                var items = [];

                for (var i = 0, max = templatedBindings.length; i < max; i++) {

                    var t = templatedBindings[i];
                    this.loadWith(t.template, t.data,
                        function(html) {
                            item.push(html);
                        }); 
                }

                if (typeof callback === "function") {
                    callback(items);
                }
            }


        };


    };



    smalljs.extend({
        template:template
    });


})(smalljs, smalljs.ajax);