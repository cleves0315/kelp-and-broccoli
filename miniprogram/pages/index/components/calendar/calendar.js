// pages/index/components/calendar/calendar.js
import { initCalendar } from './utils/calendar.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // curDate: 
  },

  /**
   * 组件的初始数据
   */
  data: {
    weekLineTxt: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    dayActive: 0,
    thisCalendarYear: 0,       // 日历标题 -> 显示当前年月份
    thisCalendarMonth: 0,      // 日历标题 -> 显示当前年月份
    calendar: [],              // 当年日历数据
    clendarCurrent: 0,         // 控制当前滑块组件显示的索引，根据月份显示当前月份日历表
    lastCurrent: 0,            // 记录上一次滑块的索引值 (用来判断本次滑动的方向)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化日历数据、日历标题
     */
    initCalendarData() {
      const y = new Date().getFullYear();
      const m = new Date().getMonth();
      let arr = [];

      // 获取以这个月为中心，共5个月的日历数据
      for (let i = -1; i < 4; i++) {
        arr.push(initCalendar('month', new Date(y, m + i, 1).getFullYear() + '-' + new Date(y, m + i, 1).getMonth() + '-' + '01')[0]);
      }


      this.setData({
        thisCalendarYear: y,      // 初始标题年份
        thisCalendarMonth: m + 1,    // 初始标题月份
        clendarCurrent: 2,                               // 初始滑块的位置（这里默认加载5个月日历数据，当前的月份排在中间）
        calendar: arr,                        // 获取当前时间 年日历排版
      })
      this.data.lastCurrent = this.data.clendarCurrent;       // 记录这次的滑块位置
    },

    
    /**
     * 滑块索引改变时，更改标题年、月
     * @callback 滑块current发生改变
     */
    handleToChangeCalendar(e) {
      console.log('changed')
      let current = e.detail.current;
      const difCent = current - this.data.lastCurrent;    // 基于上次，本次滑动的 swiper-item 数（向左为负）
      let currentY = this.data.thisCalendarYear;         // 当前标题年份(滑动更改前)
      let currentM = this.data.thisCalendarMonth;       // 当前标题月份(滑动更改前)
      const calendar = this.data.calendar;

      // console.log(difCent)
      currentM += difCent;     // 根据本次滑动的块数，把月份值做更改

      // 滑块日历 跨年滑动，则把年份值更改
      if (currentM < 1) {
        currentY -= 1;
      } else if (currentM > 12) {
        currentY += 1;
      }

      
      // 月份超出范围，设置为对应正确月份
      switch (currentM) {
        case 0:
          currentM = 12;
          break;
        case -1:
          currentM = 11;
          break;
        case -2:
          currentM = 10;
          break;
        case -4:
          currentM = 9;
          break;
        case 13:
          currentM = 1;
          break;
        case 14:
          currentM = 2;
          break;
        case 15:
          currentM = 3;
          break;
        case 16:
          currentM = 4;
          break;
      }


      this.setData({
        thisCalendarYear: currentY,        // 更改标题中的年份
        thisCalendarMonth: currentM,       // 更改标题中的月份
      })

      this.data.lastCurrent = current;              // 记录本次滑块的位置
      

      return;
      // 如果滑到了最左边，加载日历表最前端的上个月数据
      if (difCent < 0 && current <= 1) {
        // let firstM = (currentM - current - 1);     // 日历头部要插入的月份
        // 把日历头部要插入的时间按照'xxxx/xx/xx格式输出'
        const dates = new Date(currentY, (currentM - current - 1 - 1)).toLocaleDateString();    

        console.log('现在显示的月份 ' + currentM + '; 现在索引 ' + current )

        // 从日历插件获取上个月份日历数据
        calendar.unshift(initCalendar('month', dates)[0]);


        // 最前端日历增加一个，滑块的位置也往后移一位
        current += 1;
        setTimeout(() => {
          this.setData({
            clendarCurrent: current,     // 设置滑块索引位置
            calendar
          })
        }, 500)
        this.data.lastCurrent = current;   // 记录本次滑块位置
      }

      // // 上一次是在12月，本次还向右滑动
      // if ((current >= (calendar.length - 2)) && difCent > 0) {
      //   calendar.push(initCalendar('month', (currentY + 1) + '-' + '1' + '-' + '1')[0]);
      //   this.setData({
      //     calendar
      //   })
      // }
      
      this.triggerEvent('chaSwpCalendar', { current })
      
      this.data.lastCurrent = current;
    },


    /**
     * 滑块动画结束后，(如果是在最前端、最后端无法再滑动) 则在最前、后端添加数据
     * @callback 滑块动画停止事件（在change事件之后触发）
     */
    handleAnimationfinish(e) {
      // return;
      console.log('animation end')
      const source = e.detail.source;        // 触发类型，是否用户手动触发
      const current = e.detail.current;      // 动画结束后的current
      const calendar = this.data.calendar;    // 当前日历数据
      const currentY = this.data.thisCalendarYear;   // 当前标题显示的年份
      const currentM = this.data.thisCalendarMonth;  // 当前标题显示的月份

      let dates = '';     // 要加载的日历日期
      let arr = [];     // 存放新加载的日历数据
      
      
      // 本次由用户主动触发 才往下执行
      if (source != 'touch') return;
      
      // 给最前新增日历表
      if (current == 0) {
        // 假设当前2020年12月 new Date(2020, 10) == 2020/11/1
        dates = new Date(currentY, currentM - 2, 1);
        dates = dates.getFullYear() + '-' +(dates.getMonth() + 1) + '-' + '1';
        arr = initCalendar('month', dates)[0];    // 获取上个月日历数据

        console.log('加载 ' + dates + ' 日历');

        calendar.unshift(arr);

        this.setData({
          calendar,
          clendarCurrent: 0,         // 设置当前滑块索引
          thisCalendarYear: (currentM - 1) == 0 ? currentY - 1 : currentY,
          thisCalendarMonth: (currentM - 1) == 0 ? 12 : (currentM - 1)
        })

        this.data.lastCurrent = 0;              // 动画结束后，记录本次滑块的位置

      } 
      // 当前在最后端
      else if (current == calendar.length -1) {

      }
    },
  },


  attached() {
    // 初始化日历数据
    this.initCalendarData();
  }
})
