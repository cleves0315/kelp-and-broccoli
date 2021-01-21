// pages/my-plan/components/plan-list/plan-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btnChecked: {
      type: Boolean,
      value: false
    },
    undoList: {    // 未完成列表
      type: Array,
      value: []
    },
    finishList: {    // 完成列
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    planItemHeight: 0,      // 单个plan高度
    planItemMagBottom: 2,   // 单个plan margin-bottom像素
    finishListHeight: 0,    // 完成列表的高度

    // 图标
    sulightIcon: '/static/images/plan-edit/sunlight.svg',   // 我的一天
    overIcon: '/static/images/plan-edit/date_live.svg',  // 截止日期
    overIconExpired: '/static/images/plan-edit/date_over.svg',
    repeatIcon: '/static/images/plan-edit/repeat_live.svg',       // 重复
    repeatIconExpired: '/static/images/plan-edit/repeat_expired.svg',
    bookIcon: '/static/images/plan-edit/book.svg',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 切换单个计划完成状态
     * @callback tap
     */
    handleChangeState(e) {
      const data = e.currentTarget.dataset.data;
      const index = e.currentTarget.dataset.index;
      wx.vibrateShort({  // 震动
        type: 'heavy'
      });
      this.triggerEvent('change-state', { index, data });
    },

    /**
     * 点击单个计划
     * @todo 进入计划详情页
     */
    handleToTap(e) {
      this.triggerEvent('tapItem', e.currentTarget.dataset)
    },

    /**
     * 切换已完成按钮  true: 显示完成计划
     * @param {Boolean} e.detail.value 切换后的值
     * @todo 查看或隐藏已完成的计划
     */
    handleChangeFinishedBtn(e) {
      let finishListHeight = 0;
      const value = e.detail.value;
      
      if (value) {
        finishListHeight = this.data.finishList.length * (this.data.planItemHeight + this.data.planItemMagBottom);
      } else {
        finishListHeight = 0;
      }

      this.setData({
        finishListHeight
      })
    },
  },

  lifetimes: {
    attached() {
      // 获取planitem的高度
      this.createSelectorQuery()
        .select('#plan-item')
        .boundingClientRect(rect => {
          const { height } = rect;
          this.setData({
            planItemHeight: height
          })
        }).exec();
    }
  }
})
