import { calendar } from './calendar-cn';

/**
 * 初始化当月日历数据 (没有参数默认当天)
 * @method
 * @param {Date} date 要获取日历的时间，根据这个时间生成这一年的公历
 * @param {Number} line 日历中显示几行
 * @returns [[{},{}...],[{},{}...]]
 */
function initMonthCalendar(dates = new Date(), line = 6) {
  const date = new Date(dates);                          // 初始时间格式
  const y = date.getFullYear();
  const arrY = [];                                          // 年日历存储数组


  // 一年12个月，这里循环12次
  for (let t = 0; t < 12; t++) {

    const arr = [];     // 存储日历格式的数组
    let n = [];       // 日历格式中的一行
    let d = 1;        // 日历格式中的天数
    let days = new Date(y, t + 1, 0).getDate();          // 获取这个月共有多少天
    let firstDayWeek = new Date(y, t, 1).getDay();       // 获取下每月第一天是星期几

    
    // 这里开始循环月份表
    // 这一步先做出月份表中上个月留下的日期
    // 把上个月剩下几天留在这个月的'奸细'放在最前头n
    // 假设这个月1号是周三，前面还有 周日、周一、周二 的上个月日期，所以直接按照firstDayWeek循环n次
    for(let i = 0; i < firstDayWeek; i++) {
      // new Date(2020, 8, 0)   --> 9月没有0号 === 8月31
      const obj = {};
      obj.day = new Date(y, t, 0 - i).getDate();
      obj.type = 'last';           // 上个月日期，我设置 last 类型
      n.unshift(obj);
    }
  
    // 开始存储月份表，假设7天一个数组 1个数组一行
    // 这里，参数我默认想要6行
    for (let j = 0; j < line; j++) {
      // 一天占一个格子，最多一星期7个格子
      // 这里我想要7个格子
      for (let i = 0; i < 7; i++) {
        const obj = {};    // 每一天日期格式 { day: 1, type: '' }
  
        if(d > days) {
          // 这个月都放完了，该放什么？
          // new Date(2020, 8, 31)  --> 9月没有31 === 10月1
          obj.day = new Date(y, t, d++).getDate();
          obj.type = 'next';       // 下个月日期，我设置 next 类型
        } else {
          // 放置这个月的天数
          obj.day = d++;
          obj.type = 'this';      // 这个月日期，我设置 this 类型
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

 
  for (let i = 0; i < 12; i++) {

    // arrY[i] 一年中的某月
    arrY[i].forEach((item, index) => {

      // item 一个月日历表中的一行
      item.forEach((m, j) => {

        // m 日历表中的一个小格子 某天
        // 给指定的日期转化阳历
        // { IMonthCn: 八月, IDayCn: 十五, festival: 国庆节, lunarFestival: 中秋节  }
        let obj = [];

        switch (m.type) {
          case 'this':
            obj = calendar.solar2lunar(y, i + 1, m.day);   
            break;
          case 'last':         // 当月日历中 上个月留下的日期
            if (i != 0) {
              obj = calendar.solar2lunar(y, i, m.day);
            } else {
              // 这里是去年的日期
              obj = calendar.solar2lunar(y - 1, 12, m.day);
            }
            break;
          case 'next':         // 当月日历中 下个月露头的日期
            if (i != 11) {
              obj = calendar.solar2lunar(y, i + 2, m.day);
            } else {
              // 这里是明年的日期
              obj = calendar.solar2lunar(y + 1, 1, m.day);
            }
            break;
        }

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
  initMonthCalendar
}