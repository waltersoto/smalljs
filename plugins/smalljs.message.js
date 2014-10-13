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
/* Required: smalljs.js  */
(function (smalljs, $) {
    
    var message = {
        cssClass: null,
        modal: function (msg, params) {
            /// <signature>
            ///   <summary>Show modal message</summary>
            ///   <param name="msg" type="string">Message to display</param> 
            /// </signature>
            /// <signature>
            ///   <summary>This method shows a message box</summary>
            ///   <param name="msg" type="string">Message to display</param> 
            ///	  <param name="params" type="object">
            ///	  {  
            ///      buttons: {
            ///       ok: 'Ok button label',
            ///       cancel: 'Cancel button label'
            ///      }, 
            ///     onOk:function(), 
            ///     width:250,
            ///     height:100
            ///     background:'#666666', 
            ///     showOnTop:true|false,
            ///     animate:true|false
            ///   }
            ///	 </param>
            /// </signature>  

      
            if (typeof (params.onOK) === 'function') {
                this.modalEvent = params.onOK;
            } else if (typeof (params.onOk) === 'function') {
                this.modalEvent = params.onOk;
            }else if(typeof(params.onok) === 'function'){
                this.modalEvent = params.onok;
            }
        
            if (this.modalEvent == null) { this.modalEvent = function () { }; }
            if (typeof (params.buttons) !== 'undefined') {
                if (typeof (params.buttons.ok) !== 'undefined') { this.setting.okText = params.buttons.ok; }
                if (typeof (params.buttons.cancel) !== 'undefined') { this.setting.cancelText = params.buttons.cancel; }
                if (typeof (params.buttons.width) !== 'undefined') { this.setting.buttonWidth = params.buttons.width; }
            }
            if (typeof (msg) === 'undefined') { msg = ''; }
            this.show(msg, {
                width: params.width,
                height: params.height,
                background: params.background,
                autoHide: params.autoHide,
                showOnTop: params.showOnTop,
                animate: params.animate
            });


        },
        show: function (msg, params) {
            /// <signature>
            ///   <summary>This method shows a message box</summary>
            ///   <param name="msg" type="string">Message to display</param> 
            /// </signature>
            /// <signature>
            ///   <summary>This method shows a message box</summary>
            ///   <param name="msg" type="string">Message to display</param> 
            ///   <param name="params" type="object">
            ///	  {  
            ///     hideButton:true|false,
            ///     width:250,
            ///     height:100
            ///     background:'#666666',
            ///     autoHide:2000 (in milliseconds),
            ///     showOnTop:true|false,
            ///     animate:true|false
            ///   }
            ///</param> 
            /// </signature> 
            var boxId = "smalljs_boxId";
            var bgId = "smalljs_msgbgId";
            var msgBox = document.createElement("div");
            var textArea = document.createElement("div");
            var hideButton = false;
            var showOnTop = false;
            var autohide = -1;
            if (typeof (params) !== 'undefined') {
                if (typeof (params.background) !== 'undefined') {
                    this.setting.backgroundColor = params.background;
                }
                if (typeof (params.width) !== 'undefined') {
                    this.setting.width = params.width;
                    this.setting.textAreaWidth = params.width - 10;
                }
                if (typeof (params.height) !== 'undefined') {
                    this.setting.height = params.height;
                    this.setting.textAreaHeight = params.height - 30;
                }
                if (typeof (params.hideButton) !== 'undefined') {
                    hideButton = params.hideButton;
                }
                if (typeof (params.autoHide) !== 'undefined') {
                    autohide = params.autoHide;
                }
                if (typeof (params.showOnTop) !== 'undefined') {
                    showOnTop = params.showOnTop;
                }
               
            }
            msgBox.setAttribute("id", boxId);
            if (message.cssClass === null) {
                msgBox.style.width = this.setting.width + "px";
                msgBox.style.height = this.setting.height + "px";
                msgBox.style.paddingTop = "20px";
                msgBox.style.textAlign = "center";
                msgBox.style.top = showOnTop ? "5%" : "30%";

                msgBox.style.left = "0";
                msgBox.style.right = "0";

                msgBox.style.margin = "auto";
                msgBox.style.position = "fixed";
                msgBox.style.backgroundColor = "#ffffff";
                msgBox.style.border = "1px solid #999999";
                msgBox.style.overflow = "hidden";
                msgBox.style.borderRadius = "2px";
                msgBox.style.zIndex = (this.setting.zIndex + 5).toString();
            } else {
                msgBox.className = this.cssClass;
            }

            textArea.style.width = this.setting.textAreaWidth + "px";
            textArea.style.height = this.setting.textAreaHeight + "px";
            textArea.style.textAlign = "center";
            textArea.style.margin = "auto";
            textArea.style.overflow = "auto";
            textArea.innerHTML = msg;
            msgBox.appendChild(textArea);

            if (!hideButton || this.modalEvent !== null) {
                var button = document.createElement("input");
                button.setAttribute("type", "button");
                if (message.cssClass === null) {
                    button.style.width = "80px";
                    button.style.border = "1px solid #dcdcdc";
                    button.style.display = "inline-block";
                    button.style.backgroundColor = "#ededed";
                    button.style.color = "#777777";
                    button.style.padding = "6px";
                    button.style.margin = "1px";
                    if (button.style.background) {
                        button.style.background = "-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #ededed), color-stop(1, #dfdfdf) )";
                        button.style.background = "-moz-linear-gradient( center top, #ededed 5%, #dfdfdf 100% )";
                    }
                    button.style.cursor = "pointer";
                }
                button.value = this.setting.okText;
                button.onclick = (this.modalEvent === null) ? function () {
                    message.hide(boxId, bgId);
                } : function () {
                    message.hide(boxId, bgId);
                    var modalEvent = message.modalEvent;
                    message.modalEvent = null;
                    message.setting.reset();
                    modalEvent();
                };

                msgBox.appendChild(button);
            } else {
                textArea.style.height = this.setting.textAreaHeight + 30 + "px";
            }

            //Cancel Button
            if (this.modalEvent !== null) {
                var cancel = document.createElement("input");
                cancel.setAttribute("type", "button");
                if (this.cssClass === null) {
                    cancel.style.width = "80px";
                    cancel.style.border = "1px solid #dcdcdc";
                    cancel.style.display = "inline-block";
                    cancel.style.backgroundColor = "#ededed";
                    cancel.style.color = "#777777";
                    cancel.style.padding = "6px";
                    cancel.style.margin = "1px";
                    if (cancel.style.background) {
                        cancel.style.background = "-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #ededed), color-stop(1, #dfdfdf) )";
                        cancel.style.background = "-moz-linear-gradient( center top, #ededed 5%, #dfdfdf 100% )";
                    }
                    cancel.style.cursor = "pointer";
                }
                cancel.value = this.setting.cancelText;
                cancel.onclick = function () { message.hide(boxId, bgId); };
                msgBox.appendChild(cancel);
            }



            var bg = document.createElement("div");
            bg.setAttribute("id", bgId);
            bg.style.backgroundColor = message.setting.backgroundColor;

            if (message.modalEvent === null) {
                bg.onclick = function () {
                    message.hide(boxId, bgId);
                    message.setting.reset();
                };
            }


            bg.style.position = "fixed";
            bg.style.height = Math.max(
                    Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
                    Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
                    Math.max(document.body.clientHeight, document.documentElement.clientHeight)
                ) + "px";
            bg.style.width = Math.max(
                  Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                  Math.max(document.body.offsetWidth, document.documentElement.offsetWidth),
                  Math.max(document.body.clientWidth, document.documentElement.clientWidth)
              ) + "px";

            bg.style.top = "0px";
            bg.style.left = "0px";
            bg.style.zIndex = message.setting.zIndex.toString();
            bg.style.filter = "alpha(opacity=70)";
            bg.style.opacity = "0.7";
            document.body.appendChild(bg);
            document.body.appendChild(msgBox);

           
            if (autohide > 0 && message.modalEvent === null) {
                smalljs.wait(autohide, function () {
                    message.hide(boxId, bgId);
                    message.setting.reset();
                });
            }
           
         

        },
        modalEvent: null,
        hide: function (id, bgId) {
            ///	<summary>
            ///	Hide message box
            ///	</summary>
            ///	<param name="id" type="string">
            ///	 Message box id
            ///	</param>
            ///	<param name="bgId" type="string">
            ///	 Message box background id
            ///	</param> 
            var toRemove = $(id);
            var toRemoveBg = $(bgId);
            if (toRemove !== null) {
                document.body.removeChild(toRemove);
                toRemove = null;
            }
            if (toRemoveBg !== null) {
                document.body.removeChild(toRemoveBg);
                toRemoveBg = null;
            }
       
        },
        setting: {
            reset: function () {
                this.okText = 'OK',
                this.cancelText = 'CANCEL';
                this.width = 250;
                this.height = 145;
                this.textAreaWidth = 240;
                this.textAreaHeight = 100;
                this.zIndex = 200;
                this.animate = false;
                this.backgroundColor = '#666666'
            },
            okText: 'OK',
            cancelText: 'CANCEL',
            backgroundColor: "#666666",
            zIndex: 200,
            width: 250,
            height: 145,
            animate: false,
            textAreaWidth: 240,
            textAreaHeight: 100
        }
    };
    /* End message */

    smalljs.extend({
        message: message
    });


})(smalljs,smalljs.get);