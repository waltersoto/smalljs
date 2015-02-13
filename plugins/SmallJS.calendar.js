(function () {


    var UNDEFINED = "undefined",
        DIV = "div",
        CSS_CLEAR = "sj-cal-clear",
        CSS_CAL = "sj-cal",
        CSS_OUTOF = "sj-cal-outof",
        CSS_TODAY = "sj-cal-today",
        CSS_RIGHT = "right",
        CSS_LEFT = "left",
        CSS_CENTER = "center",
        CSS_HEADER = "header",
        CSS_LABEL = "lbl",
        CSS_LABELS = "labels",
        CSS_DAYS = "days",
        CSS_DAY = "day",
        CSS_DAY_ROW = "day-row";
     
    var dateMonthInfo = function (date) {

        if (typeof (date) === UNDEFINED) {
            date = new Date(); //Set to today
        }
          
        //Today's date (1-31)
        this.today = date.getDate();

        //Month number Jan-Dec (0-11)
        this.month = date.getMonth();

        //Full year
        this.year = date.getFullYear();

        this.numberOfDays = (function (m, y) {
            var d = new Date(y, m, 1);
            var tmpDate = new Date(d.getFullYear(), (d.getMonth() + 1), 1); //add +1 
            tmpDate.setDate(0);
            return tmpDate.getDate();
        })(this.month, this.year);

        this.lastMonth = (function (d) {
            var temp = new Date(d.valueOf());
            var dtemp = d.getDate();
            temp.setDate(0);
            return new Date(temp.getFullYear(), temp.getMonth(), dtemp);
        })(date);


        this.lastMonthEnds = (function (d) {
            var t = new Date(d.valueOf());;
            t.setDate(0);
            return t.getDate();
        })(date);
         
        this.nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
         
        //Start of current month of month
        this.startOfMonth = new Date(this.year, this.month, 1);

        //Month starts on this day
        this.dayInFirstWeek = this.startOfMonth.getDay();
    };

    var info = new dateMonthInfo(today);

    var cal = function (params) {
        ///	<param name="params" type="object">
        ///{
        ///  id:'container id',
        ///  date:'custom date' or today's date if not provided,
        ///  bindto:'bind selection to an output (ex. textbox)'
        ///  onselect:function(year,month,day)
        ///}
        ///	</param>
        var block = function (cssClass, txt) {
            var div = document.createElement(DIV);
            sj(div).addClass(cssClass);
            if (typeof (txt) !== UNDEFINED) {
                sj(div).text(txt);
            }
            return div;
        };

        var clear = block(CSS_CLEAR, "&nbsp;");


        var header = function (month, year) {

            var div = block(CSS_HEADER);
            sj(div).delegate(DIV, "click", function () {
                if (sj(this).classExists(CSS_LEFT)) {
                    cal({
                        id: params.id,
                        date: info.lastMonth,
                        onselect: params.onselect,
                        bindto: params.bindto
                    });
                    if (typeof (params.onselect) !== UNDEFINED) {
                        params.onselect(info.lastMonth.getFullYear(), info.lastMonth.getMonth(), info.lastMonth.getDate(),true);
                    }
                } else if (sj(this).classExists(CSS_RIGHT)) {
                    cal({
                        id: params.id,
                        date: info.nextMonth,
                        onselect: params.onselect,
                        bindto: params.bindto
                    });
                    if (typeof (params.onselect) !== UNDEFINED) {
                        params.onselect(info.nextMonth.getFullYear(), info.nextMonth.getMonth(), info.nextMonth.getDate(),true);
                    }
                }

            });


            var l = block(CSS_LEFT, "<");

            var c = block(CSS_CENTER, month + ", " + year);

            var r = block(CSS_RIGHT, ">");

            div.appendChild(l);
            div.appendChild(c);
            div.appendChild(r);
            div.appendChild(clear);

            return div;

        };

        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

        var labels = function () {

            var lblDiv = block(CSS_LABELS);

            var lbl;
            for (var lin = 0, max = days.length; lin < max; lin++) {
                lbl = block(CSS_LABEL, days[lin]);
                lblDiv.appendChild(lbl);
            }
            lblDiv.appendChild(clear);
            return lblDiv;
        };




        var today = new Date();

        if (typeof (params.date) !== UNDEFINED) {
            today = new Date(params.date.valueOf());
        }

        if (typeof (params.bindto) !== UNDEFINED) {
            sj(params.bindto).text((info.month + 1) + "/" + info.today + "/" + info.year);
        }

        var div = block(CSS_CAL);
        div.appendChild(header(months[info.month], info.year));
        div.appendChild(clear);

        var daysDiv = block(CSS_DAYS);
        sj(daysDiv).delegate(DIV, "click", function () {
            if (!sj(this).classExists(CSS_LABEL)) {
                var selectedMonth;
                var selectedDay;
                var selectedYear;

                if (sj(this).classExists(CSS_OUTOF)) {
                    var omonth = this.innerHTML;
                    if (omonth < 20) {
                        //Next month 
                        selectedMonth = info.nextMonth.getMonth();
                        selectedDay = omonth;
                        selectedYear = info.nextMonth.getFullYear();
                    } else {
                        //Last month  
                        selectedMonth = info.lastMonth.getMonth();
                        selectedDay = omonth;
                        selectedYear = info.lastMonth.getFullYear();
                    }
                } else {
                    selectedMonth = info.month;
                    selectedDay = this.innerHTML;
                    selectedYear = info.year;
                }

                cal({
                    id: params.id,
                    date: new Date(selectedYear, selectedMonth, selectedDay),
                    onselect: params.onselect,
                    bindto: params.bindto
                });

                if (typeof (params.onselect) !== UNDEFINED) {
                    params.onselect(selectedYear, selectedMonth, selectedDay,false);
                }

                if (typeof (params.bindto) !== UNDEFINED) {
                    sj(params.bindto).text((selectedMonth + 1) +"/"+ selectedDay  + "/" + selectedYear);
                }
            }

        });

        daysDiv.appendChild(labels());
        
        var weeks = [];

        var dayCounter = 0;
        var nextMonth = 0;

        var lastMonth = (info.lastMonthEnds - (info.dayInFirstWeek - 1));
        if (info.dayInFirstWeek === 0) { lastMonth = info.lastMonthEnds - 6; }


        for (var i = 0; i < 6; i++) {

            var wk = [];

            for (var d = 0; d < 7; d++) {

                if (i === 0) {
                    //First week
                    if (d >= info.dayInFirstWeek && info.dayInFirstWeek !== 0) {
                        dayCounter++;
                        wk.push({ v: dayCounter, o: false });
                    } else {
                        wk.push({ v: lastMonth, o: true });
                        lastMonth++;
                    }
                } else {
                    dayCounter++;
                    if (dayCounter > info.numberOfDays) {
                        nextMonth++;
                        wk.push({ v: nextMonth, o: true });
                    } else {
                        wk.push({ v: dayCounter, o: false });
                    }

                }

            }

            weeks.push(wk);

        }
    
        for (i = 0; i < weeks.length; i++) {
            var wrow = block(CSS_DAY_ROW);

            for (var w = 0; w < weeks[i].length; w++) {

                var dcell = block(CSS_DAY, weeks[i][w].v);

                if (weeks[i][w].v === info.today && !weeks[i][w].o) {
                    sj(dcell).addClass(CSS_TODAY);
                }

                if (weeks[i][w].o) {
                    sj(dcell).addClass(CSS_OUTOF);
                }
                wrow.appendChild(dcell);
            }
            wrow.appendChild(clear);
            daysDiv.appendChild(wrow);
        }

        daysDiv.appendChild(clear);

        div.appendChild(daysDiv);

        sj(params.id).removeChildren();
        sj(params.id).appendChild(div);


    };

    smalljs.extend({
        calendar: cal
    });


})();