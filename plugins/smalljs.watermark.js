/*
 Plugin for smalljs toolkit
 Copyright (c) 2013 Walter M. Soto Reyes 
*/
(function () {
   var  watermark = {
            isEmpty: function (id) {
                var empty = true;
                if (!sj(id).classExists(smalljs.watermark.watermarkClass)) {
                    empty = smalljs.get(id).value.length < 1;
                }
                return empty;
            },
            setText: function (id, text) {
                text = typeof(text)==='undefined'?'':text;
                sj(id).removeClass(smalljs.watermark.watermarkClass);
                sj(id).text(text);
            },
            reset: function (o, t) {

                sj(o).addEvent('focus', function () {
                    if (o.value === t && sj(o).classExists(smalljs.watermark.watermarkClass)) {
                        o.value = '';
                        sj(o).removeClass(smalljs.watermark.watermarkClass);
                    }
                });

                sj(o).addEvent('focus', function () {
                        if (smalljs.get(o).value.length < 1) {
                            smalljs.get(o).value = t;
                            sj(o).addClass(smalljs.watermark.watermarkClass);
                        }
                }); 
            },
            watermarkClass: '_assign_text_watermark_css_',
            enable: function (watermarkCss) {
                ///	<summary>
                ///  Enable watermark property for text inputs.
                ///	</summary>
                ///	<param name="watermarkCss" type="string">
                ///	CSS class name 
                /// Example:
                /// .watermarkCss {
                ///       color: #dddddd;
                ///       font-variant:small-caps;
                ///       padding-left:10px;
                ///   } 
                ///	</param>  
                smalljs.watermark.watermarkClass = watermarkCss; 
                sj('[watermark]').forEach(function () {
                    var w = this.getAttribute('watermark');
                    if (w) {
                        sj(this).addClass(smalljs.watermark.watermarkClass);
                        this.value = w;
                        (function (o, t) {
                            smalljs.watermark.reset(o, t);
                        })(this, w);
                    }
                }); 
            }
    };

     
    smalljs.extend({
        watermark:watermark
    });

    smalljs.plugin({
        hasWatermark: function () {
            return watermark.isEmpty(this.me[0]);
        },
        removeWatermark: function (text) {
            watermark.setText(this.me[0], text);
            return this;
        }
    });

})();