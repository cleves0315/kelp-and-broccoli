// pages/index/components/calendar/calendar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    vertical: {
      type: Boolean,
      value: true
    },
    nextMargin: {
      type: String,
      value: '160rpx'
    },
    clendarCurrent: {               // 当前日历滑块的current
      type: Number,
      value: 0
    },
    thisCalendarYear: {              // 日历标题 -> 显示当前年月份
      type: Number,
      value: 0
    },
    thisCalendarMonth: {              // 日历标题 -> 显示当前年月份
      type: Number,
      value: 0
    },
    calendar: {               // 当年日历数据
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    weekLineTxt: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    dayActive: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleToChangeCalendar(e) {
      const current = e.detail.current;

      this.triggerEvent('chaSwpCalendar', { current })
    },
  }
})
