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
    list: {    // 列表数据
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 切换状态
     * @callback tap
     */
    handleChangeState(e) {
      const index = e.currentTarget.dataset.index;
      wx.vibrateShort({  // 震动
        type: 'heavy'
      });
      this.triggerEvent('change-state', { index });
    },


    handleToTap(e) {
      this.triggerEvent('tapItem', e.currentTarget.dataset)
    }
  }
})
