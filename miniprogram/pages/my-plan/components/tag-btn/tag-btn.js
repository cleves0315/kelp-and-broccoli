// pages/my-plan/components/tag-btn/tag-btn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrl: {
      type: String,
      value: './sources/arrow.svg'
    },
    txt: {
      type: String,
      value: '已完成'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    change() {
      const value = !this.data.value;
      this.setData({
        value
      });

      this.triggerEvent('change', { value });
    },
  }
})
