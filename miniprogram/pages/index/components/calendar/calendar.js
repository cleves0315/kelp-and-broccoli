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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    weekLineTxt: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    dayActive: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击选择时期
     */
    handleChoseDay(e) {
      const index = e.currentTarget.dataset.index;

      this.setData({ dayActive: index })
    }
  }
})
