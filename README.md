# Calendar


## 使用
1. 引用SimCalendar.css

	`<link href="SimCalendar.css" rel="stylesheet">`
  
2. 引用SimCalendar.js

	`<script src="SimCalendar.js"></script>`

3. 使用(下面两种方式)

  - `$(selector).SimCalendar();`

  - `$(selector).SimCalendar(dateData,options);`

##  参数说明：
		dateData参见示例代码；
		options:
			firstDayOfWeek: 7,                              //一星期的第一天，取值1到7，取7为星期日为第一天
			baseClass: "calendar",                          //日历的css类
			curDayClass: "cur-day",                         //当前日期的css类
			prevMonthCellClass: "prev-month",               //上一个月日期的css类
			nextMonthCellClass: "next-month",               //下一个月日期的css类
			curMonthNormalCellClass: "normal",              //正常日期的css类
			prevNextMonthDaysVisible: true,                 //是否显示不属于本月的日期
			weekDayNames:["一","二","三","四","五","六","日"],//日期显示文字
			extendCell: function(curDate, data){}           //扩展格的默认内容填充，curDate为当前日期的Date类型
											//   数据，data为当前日期对应的传入数据
			onClick:function(date,dateData){ }              //点击日期事件函数，date为当前日期，
											//    dateData同SimCalendar参数dateData

##  示例

### html代码：

`<div id="simcalendar"></div>`
   
### js代码：
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
