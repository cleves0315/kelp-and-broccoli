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
    height: 0,   // 容器高度 px
    iphoneX: false,
    bottom: 0,   // 绝对定位bottom值 px
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTapBlank() {
      this.triggerEvent('tapblank');
    },
    handelTouchStart(e) {
      const pageY = e.changedTouches[0].pageY;

      this.data.startY = pageY;
    },
    handelTouchMove(e) {
      const moveY = e.changedTouches[0].pageY;
      let difY = moveY - this.data.startY;

      if (difY <= 0) difY = 0;

      this.setData({
        bottom: difY
      });
    },
    handelTouchEnd(e) {
      const endY = e.changedTouches[0].pageY;

      
      if (endY - this.data.startY > 30) {
        this.triggerEvent('close');
        setTimeout(() => {
          this.setData({
            bottom: 0
          });
        }, 500);
      } else {
        this.setData({
          bottom: 0
        });
      }
    },

    /**点击返回按钮 */
    handleTapBack() {
      console.log('handleTapBack')
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
      });

      const query = this.createSelectorQuery();
      query.select('#container').boundingClientRect(rect => {
        this.data.height = rect.height;
      }).exec();
    },
  }
})
