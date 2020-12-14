// pages/index/components/calendar/calendar.js
import { initCalendar } from './sources/calendar.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lodingScope: {            // 初始化日历数据的范围[月]（默认加载当前时间为中心共5个月）
      type: Number,
      value: 5
    },
    headLeftIcon: {           // 标题栏左侧icon
      type: String,
      value: './sources/to_back.svg'
    },
    headRightTxt: {           // 标题栏右侧文本
      type: String,
      value: '设置'
    },
    showHeadFunts: {          // 显示标题栏工具按钮
      type: Boolean,
      value: false
    },
    activeIcon: {             // 被激活日期的图标
      type: String,
      value: 'https://6272-broccoli-puuzo-1302613116.tcb.qcloud.la/broccoli.png?sign=a39d71b31516e14dfc194a4747c0e5fe&t=1601783832'
    },
    rightTohAnimEnd: {        // 开、关 日历组件右滑尽头加载新日历(右滑，过去的日历)
      type: Boolean,
      value: false
    },
    leftTohAnimEnd: {        // 开、关 日历组件左滑尽头加载新日历
      type: Boolean,
      value: false
    },
    calBackImage: {          // 日历背景图
      type: String,
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    weekLineTxt: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    selectDay: {},             // 当前选中的日期
    today: null,               // 记录当天日期
    thisCalendarYear: 0,       // 日历标题 -> 显示当前年月份
    thisCalendarMonth: 0,      // 日历标题 -> 显示当前年月份
    calendar: [],              // 日历数据
    calendarCurrent: 0,         // 控制当前滑块组件显示的索引，根据月份显示当前月份日历表
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
      const lodScope = this.data.lodingScope;     // 加载日历的范围
      const scpHalf = parseInt(lodScope / 2);
      let arr = [];        // 保存返回的日历数据
      let dates = '';      // 保存格式化后的日期 new Date(2020, 11, 32)  -> 2021/1/1

      // 获取以这个月为中心，共5个月的日历数据
      for (let i = -scpHalf; i < (lodScope - scpHalf); i++) {
        dates = new Date(y, m + i, 1);
        arr.push(initCalendar('month', dates)[0]);
      }


      this.data.today = {
        year: y,
        month: m + 1,
        day: new Date().getDate()
      }

      this.setData({
        thisCalendarYear: y,        // 初始标题年份
        thisCalendarMonth: m + 1,   // 初始标题月份
        calendar: arr,              // 获取当前时间 年日历排版
        calendarCurrent: scpHalf,   // 初始滑块的位置在中间
        today: this.data.today,
        selectDay: this.data.today
      })
      this.data.lastCurrent = this.data.calendarCurrent;       // 记录这次的滑块位置
      
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

      // console.log(difCent)
      currentM += difCent;     // 根据本次滑动的块数，把月份值做更改

      const dates = new Date(currentY, currentM - 1);   // 重新格式化当前日期

      currentY = dates.getFullYear();
      currentM = dates.getMonth() + 1;

      this.setData({
        thisCalendarYear: currentY,        // 更改标题中的年份
        thisCalendarMonth: currentM,       // 更改标题中的月份
      })

      this.data.lastCurrent = current;              // 记录本次滑块的位置
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
      const selectDay = {};                 // 记录当前日历的第一天

      let dates = '';     // 要加载的日历日期
      let arr = [];     // 存放新加载的日历数据
      
      
      // 本次由用户主动触发 才往下执行
      if (source != 'touch') return;
      
      // 给最前端新增一条日历表
      if (current == 0) {
        if (!this.data.rightTohAnimEnd) return;     // 右滑加载新日历关闭状态，不加载新日历

        // 格式化新增日历的时间格式
        // 假设当前2020年12月 new Date(2020, 10) == 2020/11/1
        dates = new Date(currentY, currentM - 2, 1);       
        // dates = dates.getFullYear() + '-' +(dates.getMonth() + 1) + '-' + '1';

        // 获取上个月日历数据
        arr = initCalendar('month', dates)[0];

        console.log('加载 ' + dates + ' 日历');

        calendar.unshift(arr);

        this.setData({
          calendar,
          calendarCurrent: 0,         // 把滑块索引设置第一位
          thisCalendarYear: dates.getFullYear(),
          thisCalendarMonth: dates.getMonth() + 1
        })

        this.data.lastCurrent = 0;              // 动画结束后，记录本次滑块的位置

      } 
      // 给最后端新增一条日历表
      else if (current == calendar.length -1) {
        if (!this.data.leftTohAnimEnd) return;     // 右滑加载新日历关闭状态，不加载新日历

        // 格式化新增日历的时间格式
        // 假设当前2020年12月 new Date(2020, 12) == 2021/1/1
        dates = new Date(currentY, currentM, 1);
        // dates = dates.getFullYear() + '-' +(dates.getMonth() + 1) + '-' + '1';

        // 获取下个月日历数据
        arr = initCalendar('month', dates)[0];

        console.log('加载 ' + dates + ' 日历');

        calendar.push(arr);

        this.setData({
          calendar,
          calendarCurrent: calendar.length - 1,         // 把滑块索引设置最后一位
          thisCalendarYear: dates.getFullYear(),
          thisCalendarMonth: dates.getMonth() + 1
        })

        this.data.lastCurrent = calendar.length - 1;              // 动画结束后，记录本次滑块的位置
      }
      // 没有触发新增日历
      else {
        // 滑动动画结束后的日期
        dates = new Date(currentY, currentM - 1, 1);
      }

      // 动画结束后 选中的日期变更到当月第一天
      selectDay.year = dates.getFullYear();
      selectDay.month = dates.getMonth() + 1;
      selectDay.day = 1;

      this.setData({
        selectDay
      })
    },


    /**
     * 点击日期切换选中效果，或左右翻页
     * @param {*} e 
     * @callback 点击日期
     */
    handleToTapDay(e) {
      const data = e.currentTarget.dataset.data;
      console.log(data);
      
      if (data.type !== 'this') {
        return;
      }

      // 切换选中的日期
      this.setData({
        selectDay: data
      })
    },
  },

  attached() {
    // 初始化日历数据
    this.initCalendarData();
  }
})
