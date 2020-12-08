// components/navigation-bar/navigation-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    lefSideTxt: {     // 左侧按钮文字
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: 0,       // 组件高度
    iconSize: 0,     // 按钮大小
    rectHieght: 0,          // 导航栏胶囊的高度
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getHeight() {
      return this.data.height;
    },

    setHeight() {
      const rect = wx.getMenuButtonBoundingClientRect();
      const statusBarHeight = wx.getSystemInfoSync().statusBarHeight;

      const gap = rect.top - statusBarHeight;
      const height = statusBarHeight + gap * 2 + rect.height;
      const iconSize = rect.height - 10;

      this.setData({
        height: height,
        iconSize: iconSize,
        rectHieght: rect.height,
      })
    },

    handleTapLeftSide() {
      this.triggerEvent('tapleftside');
    }
  },

  lifetimes: {
    attached() {
      this.setHeight();
    },

    detached() {

    }
  }
})
