(function (sj, global) {

    var fn = function (name) {

        var obj = sj.get(name);

        this.radio = {
            index: function () {
                ///	<summary>
                ///	Return selected index from a radio element
                ///	</summary>
                ///	<param name="id" type="identifier">
                ///	 Element id, name, or reference
                ///	</param>
                ///	<returns type="number" />
                if (typeof (obj.length) !== 'undefined') {
                    var index = -1;
                    for (var i = 0, m = obj.length; i < m; i++) {
                        if (obj[i].checked) {
                            index = i;
                            break;
                        }
                    }
                    return index;
                }
                return -1;
            },
            value: function () {
                ///	<summary>
                ///	Return selected value from a radio element
                ///	</summary>
                ///	<param name="id" type="identifier">
                ///	 Element id, name, or reference
                ///	</param>
                ///	<returns type="object" />

                var index = this.index();
                if (index !== -1) {
                    return obj[index].value;
                }
                return "";
            }
        };

        this.option = {
            select: function (val) {
                ///	<summary>
                ///	Select an element in a list
                ///	</summary> 
                ///	<param name="val" type="value">
                ///	 Value of the element to be selected
                ///	</param>
                for (var i = 0, m = obj.length ; i < m; i++) {
                    if (obj.options[i].value === val) {
                        obj.options[i].selected = true;
                    }
                }
            },
            index: function () {
                ///	<summary>
                ///	Return selected index from an option element
                ///	</summary> 
                ///	<returns type="number or array" />
                if (typeof obj.selectedIndex !== 'undefined') {
                    if (obj.selectedIndex !== -1) {
                        if (obj.multiple) {
                            var v = [];
                            for (var i = 0, m = obj.length; i < m; i++) {
                                if (obj.options[i].selected) {
                                    v.push(i);
                                }
                            }
                            return v;
                        } else {
                            return obj.selectedIndex;
                        }
                    }
                }
                return -1;
            },
            value: function () {
                ///<summary>
                ///	Return selected value from an option element
                ///</summary> 
                ///<returns type="object or array" /> 
                if (obj.multiple) {
                    var v = [];
                    for (var i = 0, m = obj.length; i < m; i++) {
                        if (obj.options[i].selected) {
                            v.push(obj.options[i].value);
                        }
                    }
                    return v;
                } else {
                    return obj.options[this.index()].value;
                }
            },
            clear: function () {
                ///<summary>
                ///	Clear all elements from an option element
                ///</summary> 
                for (var i = 0, m = obj.length; i < m; i++) {
                    obj.options[i].selected = false;
                }
            },
            text: function () {
                ///<summary>
                ///	Return selected text from an option element
                ///</summary> 
                ///<returns type="string or array" />
                if (obj.multiple) {
                    var v = [];
                    for (var i = 0, m = obj.length; i < m; i++) {
                        if (obj.options[i].selected) {
                            v.push(obj.options[i].text);
                        }
                    }
                    return v;
                } else {
                    return obj.options[this.index()].text;
                }
            }
        }

    };

    var formQ = function (name) {
        ///<summary>
        ///	Select form elements
        ///</summary>
        ///<param name="name" type="string">
        ///	Element id or name 
        ///</param>
        return new fn(name);
    };


    global.formQ = formQ;

})(smalljs, window);