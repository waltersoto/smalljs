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
(function (window, smalljs) {

       //Constants
    var METHOD_POST = 'POST',
        METHOD_GET = 'GET',
        METHOD_HEADER = 'HEADER',
        RESULT_JSON = 'JSON',
        RESULT_STRING = 'STRING',
        RESULT_XML = 'XML',
        RESULT_STATUS = 'STATUS',
        DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded',
        UNDEFINED = 'undefined';

    function isDefined(o) { return typeof o !== UNDEFINED; }
    function isFunction(f){ return typeof f === 'function'; }

     function parseXml(text) { 
            var xmlDoc;
            if (window.DOMParser) {
                xmlParser = new DOMParser();
                xmlDoc = xmlParser.parseFromString(text, 'text/xml');
            } else {
                xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
                xmlDoc.async = 'false';
                xmlDoc.loadXML(text);
            }
            return xmlDoc;
    }
   

     function request() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else {//IE 5,6
            try {
                return new ActiveXObject('Msxml2.XMLHTTP.6.0');
            } catch (e) {
                try {
                    return new ActiveXObject('Msxml2.XMLHTTP.3.0');
                } catch (e2) {
                    try {
                        return new ActiveXObject('Microsoft.XMLhttp');
                    } catch (ex) {
                        return null; //Browser doesn't support ajax
                    }
                }
            }
        }
    }

    function firstSymbol(url) {
        ///	<summary>
        ///	Determine if a parameter will begin with ? or &
        ///	</summary>
        ///	<param name="url" type="string">
        ///	 Ajax call url
        ///	</param>
        var symbol = '';
        if (url.indexOf('?') == -1) {
            symbol = '?';
        } else {
            if (url.indexOf('&') == -1 && url.indexOf('?') == url.length - 1) {
                symbol = '';
            } else {
                symbol = '&';
            }
        }
        return symbol;
    }

    function getParameters(params, url, encode) {
        ///	<summary>
        ///	Get parameters to initiate request
        ///	</summary>
        ///	<param name="params" type="string[]">
        ///	 Parameters array
        ///	</param>
        ///	<param name="url" type="string">
        ///	 Request URL
        ///	</param>
        ///	<param name="encode" type="bool">
        ///	 Encode URL?
        ///	</param>
        ///	<returns type="string" />
        var symbol = firstSymbol(url), list = '';
        for (var p in params) {
            if (isDefined(params[p])) {
                var par = params[p];
                if (isDefined(encode)) {
                    par = encodeURIComponent(par);
                }
                list += symbol + p + '=' + par;
                if (symbol != '&') {
                    symbol = '&';
                }
            }
        }
        return list;
    }

 

    function  call(req) {
        ///	<summary>
        ///	Perform an Ajax call
        ///	</summary>
        ///	<param name="req" type="json">
        ///	 {
        ///      method: 'Post'|'Get'|'Header',
        ///      url: '',
        ///      data: {
        ///       'Param 1': 'Value 1',
        ///       'Param 2': 'Value 2'
        ///      },
        ///      onTimeout:function(),
        ///      timeout:'wait for response time',
        ///      form:'form name' | 'form object' (Method must be post)
        ///      encode: true | false
        ///      resultType: 'String'|'Xml'|'Json'|'Status',
        ///      contentType:'application/x-www-form-urlencoded',
        ///      onResponse:function(),
        ///      onError:function(),
        ///      onResponseHeader:function()
        ///  }
        ///	</param> 
    
            if (isDefined(req.url)) { 
                var format = isDefined(req.resultType) ? req.resultType : RESULT_JSON ,parameters = '';
                if (isDefined(req.data)) {
                    parameters = getParameters(req.data, req.url,
                    (isDefined(req.encode) ? true : false));
                }
                var req_method = isDefined(req.method) ? req.method : METHOD_POST;
                var xH = request();

                if (xH !== null) {
                    xH.onreadystatechange = function () { 
                        if (xH.readyState == 4) {
                            if (xH.responseText.length > 0) {
                                var result = "";
                                var status = xH.status;
                                switch (format.toString().toUpperCase()) {
                                    case RESULT_STRING: result = xH.responseText; //Text
                                        break;
                                    case RESULT_XML: result = xml.parse(xH.responseText);
                                        break;
                                    case RESULT_JSON: result = xH.responseText;
                                        if (typeof (JSON) !== UNDEFINED) {
                                            result = JSON.parse(result);
                                        }
                                        break;
                                    case RESULT_STATUS: result = status;
                                        break;
                                    default: result = xH.responseText;
                                        break;
                                }
                                if (status == 200) {
                                    if (isFunction(req.onResponseHeader)) {
                                        req.onResponseHeader(xH.getAllResponseHeaders());
                                    }
                                    if (isFunction(req.onResponse)) {
                                        req.onResponse(result);
                                    }
                                } else {
                                    if (isFunction(req.onError)) {
                                        req.onError(status, xH.statusText);
                                    }
                                }
                            }
                            xH = null;//End
                        } 
                    };

                    var params = null, reqUrl = req.url;
                     
                    //Get
                    if (req_method.toUpperCase() === METHOD_GET) {
                        reqUrl += parameters;
                    } else if (req_method.toUpperCase() === METHOD_POST) {
                        params = parameters.replace('?', '');
                    }
                  
                    var contentType = isDefined(req.contentType) ? req.contentType : DEFAULT_CONTENT_TYPE;
                    if (isDefined(req.timeout)) {
                        xH.timeout = req.timeout; 
                    }
                    if (isFunction(req.onTimeout)) {
                        xH.ontimeout = req.onTimeout;
                    }
                    xH.open(req_method, reqUrl, true);
                    xH.setRequestHeader('Content-Type', contentType);
                    if (contentType.toUpperCase() === RESULT_JSON) {
                        xH.send(JSON.stringify(req.data));
                    } else {
                        xH.send(params);
                    }
                } else { 
                    if (isFunction(req.onError)) {
                        req.onError('0', 'Browser does not support ajax');
                    } 
                }
            }           
    }

    smalljs.extend({
        ajax:call
    });

})(window,smalljs);
