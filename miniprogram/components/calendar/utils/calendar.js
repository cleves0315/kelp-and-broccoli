import { calendar } from './calendar-cn';

/**
 * 初始化当月日历数据 (没有参数默认当天)
 * @method
 * @param {Date} date 要获取日历的时间，根据这个时间生成这一年的公历
 * @param {String} type 要获取日历的长度 （year、month）
 * @param {Number} line 日历中显示几行
 * @returns [[{},{}...],[{},{}...]]
 */
function initCalendar(type = 'month', dates = new Date(), line = 6) {
  console.log('new Date() --> ' + dates.getFullYear() + '-' + (dates.getMonth() + 1 ) + '-' + dates.getDate());
  const date = new Date(dates);     // 初始时间格式
  const y = date.getFullYear();
  let arrY = [];   // 日历存储数组
  let m = -1;      // 如果是获取月份表，这里存储当前月份

  if (type == 'month') m = date.getMonth();

  // 这里获取公历数据
  // 一年12个月，这里循环12次
  for (let t = 0; t < 12; t++) {
    if (type == 'month' && t > 0) break;

    const arr = [];     // 存储日历格式的数组
    let n = [];         // 日历格式中的一行
    let d = 1;          // 日历格式中的天数
    let days = 0;               // 获取这个月共有多少天
    let firstDayWeek = 0;       // 获取下每月第一天是星期几
    let currentMonth = 0;       // 用来记录当前循环的月份

    if (type == 'month') {
      currentMonth = m;
    } else {
      currentMonth = t;
    }

    days = new Date(y, currentMonth + 1, 0).getDate();     
    firstDayWeek = new Date(y, currentMonth, 1).getDay();  


    // 这里开始循环月份表
    // 这一步先做出月份表中上个月留下的日期
    // 假设这个月1号是周三，前面还有 周日、周一、周二 的上个月日期，所以直接按照firstDayWeek循环n次
    for(let i = 0; i < firstDayWeek; i++) {
      const obj = {};

      obj.year = new Date(y, currentMonth, (0 - i)).getFullYear();                // 添加新历年份属性
      obj.month = new Date(y, currentMonth, (0 - i)).getMonth() + 1;    // 添加新历月份属性
      obj.day = new Date(y, currentMonth, 0 - i).getDate();   // new Date(2020, 8, 0) --> 9月没有0号 === 8月31
      obj.type = 'last';                           // 上个月日期，我设置 last 类型
      n.unshift(obj);
    }

    // 开始存储月份表，一个循环排一行
    for (let j = 0; j < line; j++) {

      // 这里存储日期，一个循环一个格子
      for (let i = 0; i < 7; i++) {
        const obj = {};                              // 日期格式 { day: 1, type: '' }

        // 这个月都放完了，该放什么？
        if(d > days) {
          obj.year = new Date(y, currentMonth, (d + 1)).getFullYear();                // 添加新历年份属性
          obj.month = new Date(y, currentMonth, (d + 1)).getMonth() + 1;    // 添加新历月份属性
          obj.day = new Date(y, currentMonth, d++).getDate();   // new Date(2020, 8, 31)  --> 9月没有31 === 10月1
          obj.type = 'next';                         // 下个月日期，我设置 next 类型
        } else {
          // 放置这个月的天数
          obj.year = y;                // 添加新历年份属性
          obj.month = currentMonth + 1;    // 添加新历月份属性
          obj.day = d++;
          obj.type = 'this';                        // 这个月日期，我设置 this 类型
        }
  
        n.push(obj);
        if (n.length == 7) break;    // 放了7个格子该结束了
      }
  
      arr.push(n);
      n = [];           // 这一行放完了，清空ba
    }

    arrY.push(arr);
  }

  // console.log(arrY)
  
  // 这里通过公历数据 去获取阳历数据
  for (let i = 0; i < 12; i++) {
    if (type == 'month' && i > 0) break;

    // arrY[i] 一年中的某月
    arrY[i].forEach((item, index) => {

      // item 一个月日历表中的一行
      item.forEach((w, j) => {

        // w 日历表中的一个小格子 某天
        // 给指定的日期转化阳历
        // { IMonthCn: 八月, IDayCn: 十五, festival: 国庆节, lunarFestival: 中秋节  }
        let obj = [];
        let currentMonth = 0;              // 当前循环的月份，用来转化阳历函数的参数

        if (type == 'month') {
          currentMonth = m;
        } else {
          currentMonth = i;
        }

        switch (w.type) {
          case 'this':
            obj = calendar.solar2lunar(y, currentMonth + 1, w.day);   
            break;
          case 'last':         // 当月日历中 上个月留下的日期
            if (i != 0) {
              obj = calendar.solar2lunar(y, currentMonth, w.day);
            } else {
              // 这里是去年的日期
              obj = calendar.solar2lunar(y - 1, 12, w.day);
            }
            break;
          case 'next':         // 当月日历中 下个月露头的日期
            if (i != 11) {
              obj = calendar.solar2lunar(y, currentMonth + 2, w.day);
            } else {
              // 这里是明年的日期
              obj = calendar.solar2lunar(y + 1, 1, w.day);
            }
            break;
        }

        // console.log('阳历数据')
        // console.log(obj)


        arrY[i][index][j].yearCn = obj.gzYear;                      // 阳历 年份
        arrY[i][index][j].monthCn = obj.IMonthCn;                   // 阳历 月份
        arrY[i][index][j].dayCn = obj.IDayCn;                       // 阳历 日期
        arrY[i][index][j].festival = obj.festival;                  // 节假日
        arrY[i][index][j].lunarFestival = obj.lunarFestival;        // 第二个节日
      })
    })
  }

  console.log(arrY)

  return arrY;
}

module.exports = {
  initCalendar
}