// pages/plan/components/plan-list/plan-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '计划标题'
    },
    detail: {
      type: String,
      value: '计划详情'
    },
    planList: {
      type: Array,
      value: []
    },
    planAddBtnTxt: {
      type: String,
      value: '添加计划'
    }
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
     * 点击添加计划
     */
    handleToAddPlan(e) {
      const data = e.currentTarget.dataset;

      this.triggerEvent('addplan', { data });
    }
  }
})
