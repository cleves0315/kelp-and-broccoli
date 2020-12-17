// pages/plan-edit/components/calendar-box/calendar-box.js
import { judgeIphoneX } from '../../../../utils/util';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {           // 展示组件
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    iphoneX: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTapBlank() {
      this.triggerEvent('tapblank');
    },

    /**点击返回按钮 */
    handleTapBack() {
      this.triggerEvent('tapback');
    },
    /** 点击设置按钮 */
    handleTapSetup(e) {
      const value = e.detail.value;
      const date = `${value.year}-${value.month}-${value.day}`;

      this.triggerEvent('setup', { date });
    },
  },

  lifetimes: {
    attached() {
      this.setData({
        iphoneX: judgeIphoneX()
      })
    },
  }
})