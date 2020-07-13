// pages/home/components/btn/btn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    txt: {
      type: String,
      value: '开始学习'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    touch: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleToStart() {
      this.setData({ touch: 1 });
    },

    handleToEnd() {
      this.setData({ touch: 0 });
    },

    handleToTap() {
      this.triggerEvent('tapbtn');
    }
  }
})
