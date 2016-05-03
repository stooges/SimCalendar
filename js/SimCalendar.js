/**
 *   @author LiuChen
 * 使用：
 * 1. 引用SimCalendar.css
 * 2. 引用SimCalendar.js
 * 3. 使用
 * $(selector).SimCalendar();
 * 或
 * $(selector).SimCalendar(dateData,options);
 * 参数说明：
 * dateData参见示例代码；
 * options:
         firstDayOfWeek: 7,                              //一星期的第一天，取值1到7，取7为星期日为第一天
         baseClass: "calendar",                          //日历的css类
         curDayClass: "cur-day",                         //当前日期的css类
         prevMonthCellClass: "prev-month",               //上一个月日期的css类
         nextMonthCellClass: "next-month",               //下一个月日期的css类
         curMonthNormalCellClass: "normal",              //正常日期的css类
         prevNextMonthDaysVisible: true,                 //是否显示不属于本月的日期
         weekDayNames:["一","二","三","四","五","六","日"],//日期显示文字
         extendCell: function(curDate, data){}           //扩展格的默认内容填充，curDate为当前日期的Date类型数据，data为当前日期对应的传入数据
         onClick:function(date,dateData){ }              //点击日期事件函数，date为当前日期，dateData同SimCalendar参数dateData
 * 示例：
 * html代码：
   <div id="simcalendar"></div>
 * js代码：
   $("#simcalendar").SimCalendar(
    {
     '2015-10-18':{price:1234,num:0},
     '2015-10-20':{price:1234,num:222}
    },
    {
        extendCell: function(curDate, data){//参数curDate:当前日期的Date类型数据，参数data:dateData中与当前日期对应的数据
             if(Date.parse(curDate)< Date.parse(new Date()))//不显示当前日期之前的数据
                 return curDate.getDate();
             var ht=[];
             ht.push("<div class='date'>",curDate.getDate(),"</div>");
             ht.push("<div class='price'>",data.price,"元</div>")
             if(data.num>0)
                 ht.push("<div class='avilable'>有位<div>");
              else
                 ht.push("<div class='no_avilable'>无位</div>");
             return ht.join("");
         },
         onClick:function(date,dateData){//参数date:被点击的日期，如2015-10-19，参数dateData:同SimCalendar的第一个参数
             if(dateData[date])
                 alert(dateData[date].num);
         }
     });
 *
*/
;(function($,window,document,undefined){
    $.fn.SimCalendar = function(dateData, options){
    	var newDateData = {};
    	for(key in dateData){//去除日期中的全部个位0，如2016-01-01 改为 2016-1-1
    		var new_key = key.replace(/-0/g,"-");
    		newDateData[new_key] = dateData[key];
    	}
    	dateData = newDateData;
    	
        var simCalendar = new SimCalendar(this, dateData, options);
        var curDate= new Date();
        simCalendar.renderCalendar(curDate.getFullYear(),curDate.getMonth()+1);
        simCalendar.initEvent(curDate.getFullYear(),curDate.getMonth()+1);
        return simCalendar;
    };

    var SimCalendar = function($calendar_container,dateData, options){
        this.settings = {
                firstDayOfWeek: 1,                              //一星期的第一天，取值1到7，取7为星期日为第一天
                baseClass: "sim-calendar",                          //日历的css类
                curDayClass: "cur-day",                         //当前日期的css类
                prevMonthCellClass: "prev-month",               //上一个月日期的css类
                nextMonthCellClass: "next-month",               //下一个月日期的css类
                curMonthNormalCellClass: "normal",              //正常日期的css类
                prevNextMonthDaysVisible: true,                 //是否显示不属于本月的日期
                weekDayNames:["一","二","三","四","五","六","日"],//日期显示文字
                extendCell: function(curDate, data){            //扩展格的默认内容填充，curDate为当前日期的Date类型数据，data为当前日期对应的传入数据
                    var ht=[];
                    ht.push("<div>",curDate.getDate(),"</div>");
                    for(var key in data){
                        ht.push("<div>",key,":",data[key],"</div>");
                    }
                    return ht.join("");
                },
                onClick:function(date,dateData){ }               //点击日期事件函数，date为当前日期，dateData同SimCalendar参数dateData
            };
        $.extend(this.settings,options);
        this.$container = $calendar_container;
        this.simId = "cal"+(Math.random()+"").replace("0.","");
        this.dateData = [];
        if(dateData)
            this.dateData = dateData;

    };

    SimCalendar.prototype = {
        renderCalendar: function(year, month) {
            var ht = [];
            ht.push("<table class='", this.settings.baseClass, "' cellspacing='0' cellpadding='0' border='0'> ");
            ht.push(this._renderTitle(year, month));
            ht.push(this._renderBody(year, month));
            ht.push("</table>");

            this.$container.html(ht.join(""));
            //this.initEvent(year,month);
        },

        _renderTitle: function(year, month) {
            var ht = [];
            //日期
            ht.push("<tr>");
            ht.push("<th colspan='7' style='width:100%;'>" +
                "<div style='float:left;width:10%;text-align:center;cursor:pointer' class='change-month' id='", this.simId, "_prevMonth' title='上一月'><</div>" +
                "<div style='float:left;text-align:center;width:80%'>", year, "年", month, "月</div>" +
                "<div style='float:right;width:10%; text-align:center;cursor:pointer'' class='change-month' id='", this.simId, "_nextMonth' title='下一月'>></div>" +
                "</th>");
            ht.push("</tr>");
            //星期
            ht.push("<tr>");
            for (var i = 0; i < 7; i++) {
                var day = ((i + this.settings.firstDayOfWeek) == 7 ? 7 : (i + this.settings.firstDayOfWeek) % 7)-1;
                if(day==5 | day ==6)
	                ht.push("<th class='weekend'><b>", this.settings.weekDayNames[day], "</b></th>")
                else
	                ht.push("<th><b>", this.settings.weekDayNames[day], "</b></th>")
            }
            ht.push("</tr>");
            return ht.join("");
        },

        _renderBody: function(year, month) {
            var date = new Date(year, month - 1, 1);
            var day = date.getDay();
            var dayOfMonth = 1;
            var daysOfPrevMonth = (7 - this.settings.firstDayOfWeek + day) % 7;
            var totalDays = this._getTotalDays(year, month);
            var totalDaysOfPrevMonth = this._getToalDaysOfPrevMonth(year, month);
            var ht = [];
            var curDate;

            for (var i = 0; ; i++) {
                curDate = null;
                if (i % 7 == 0) {//新起一行
                    ht.push("<tr>");
                }
                ht.push("<td");
                if (i >= daysOfPrevMonth && dayOfMonth <= totalDays) {//本月
                    curDate = new Date(year, month - 1, dayOfMonth);
                    if (Date.parse(new Date().toDateString()) - curDate == 0) {
                        ht.push(" class='", this.settings.curDayClass, "'");
                    }
                    else {
                        ht.push(" class='", this.settings.curMonthNormalCellClass, "'");
                    }
                    ht.push("date='"+year,"-",month,"-",curDate.getDate(),"'");
                    ht.push("style='cursor:pointer'");
                    dayOfMonth++;

                }
                else if (i < daysOfPrevMonth) {//上月
                    if (this.settings.prevNextMonthDaysVisible) {
                        var prevMonth = month;
                        var prevYear = year;
                        if (month == 1) {
                            prevMonth = 12;
                            prevYear = prevYear - 1;
                        }
                        else {
                            prevMonth = prevMonth - 1;
                        }
                        curDate = new Date(prevYear, prevMonth - 1, totalDaysOfPrevMonth - (daysOfPrevMonth - i - 1));
                        ht.push(" class='", this.settings.prevMonthCellClass, "'");
                        ht.push("style='cursor:pointer'");
                    }
                }
                else {//下月
                    if (this.settings.prevNextMonthDaysVisible) {
                        var nextMonth = month;
                        var nextYear = year;
                        if (month == 12) {
                            nextMonth = 1;
                            nextYear = prevYear + 1;
                        }
                        else {
                            nextMonth = nextMonth + 1;
                        }
                        curDate = new Date(nextYear, nextMonth - 1, i - dayOfMonth - daysOfPrevMonth + 2);
                        ht.push(" class='", this.settings.nextMonthCellClass, "'");
                        ht.push("style='cursor:pointer'");
                    }
                }

                ht.push(">");
                if(curDate)
                    ht.push(this._buildCell(curDate));
                else
                    ht.push("");
                ht.push("</td>");
                if (i % 7 == 6) {//结束一行
                    ht.push("</tr>");
                }
                if (i % 7 == 6 && dayOfMonth - 1 >= totalDays) {
                    break;
                }
            }
            return ht.join("");
        },

        _buildCell: function(curDate) {
            var ht = [];            
            var curDate_str=curDate.getFullYear()+"-"+(curDate.getMonth()+1)+"-"+curDate.getDate();//例：2016-1-1
            if(this.dateData[curDate_str]){
                ht.push(this.settings.extendCell(curDate,this.dateData[curDate_str]));
            }else{
                ht.push("<div class='date'>"+curDate.getDate()+"</div><div class='bars'>---</div>");
            }
            return ht.join("");
        },

        initEvent: function(year, month) {
            var t = this;
            var prev = "#"+this.simId+"_prevMonth";
            var next = "#"+this.simId+"_nextMonth";

            $("body").on("click",prev,function(){
                if (month == 1) {
                    month = 12;
                    year = year - 1;
                }
                else {
                    month = month - 1;
                }
                t.renderCalendar(year, month);
            });

            $("body").on("click",next,function(){
                if (month == 12) {
                    month = 1;
                    year = year + 1;
                }
                else {
                    month = month + 1;
                }
                t.renderCalendar(year, month);
            });

            $("body").on("click","td[date]",function(){
	            t.settings.onClick($(this).attr("date").replace(/-0/g,"-"), t.dateData);
            });


            $("body").on("click","[class='"+this.settings.prevMonthCellClass+"']",function(){
                if (month == 1) {
                    month = 12;
                    year = year - 1;
                }
                else {
                    month = month - 1;
                }
                t.renderCalendar(year, month);
            });

            $("body").on("click","[class='"+this.settings.nextMonthCellClass+"']",function(){
                if (month == 12) {
                    month = 1;
                    year = year + 1;
                }
                else {
                    month = month + 1;
                }
                t.renderCalendar(year, month);
            });
        },

        //计算指定月的总天数
        _getTotalDays: function(year, month) {
            if (month == 2) {
                if (this._isLeapYear(year)) {
                    return 29;
                }
                else {
                    return 28;
                }
            }
            else if (month == 4 || month == 6 || month == 9 || month == 11) {
                return 30;
            }
            else {
                return 31;
            }
        },
        _getToalDaysOfPrevMonth: function(year, month) {
            if (month == 1) {
                month = 12;
                year = year - 1;
            }
            else {
                month = month - 1;
            }
            return this._getTotalDays(year, month);
        },
        //判断是否是闰年
        _isLeapYear: function(year) {
            return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
        },

        _parseDate: function(s) {
            var b = s.split(/-/);
            return new Date(b[0], b[1]-1, b[2]);
        }

    }

})($,window,document);
