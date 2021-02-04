// pages/plan-edit/components/picker-time/picker-time.js
import { judgeIphoneX } from '../../../../utils/util';

const date = new Date()
const months = []
const days = []

for (let i = 1; i <= 24; i++) {
  if (i < 10) {
    months.push('0' + i)
  } else {
    months.push('' + i)
  }
}

for (let i = 1; i <= 60; i++) {
  if (i < 10) {
    days.push('0' + i)
  } else {
    days.push('' + i)
  }
}

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
    months,
    month: 2,
    days,
    day: 2,
    value: [1, 1],
    isDaytime: true,

    bottom: 0,   // 绝对定位bottom值 px
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTapBlank() {
      this.triggerEvent('close');
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

    tapLeft() {
      this.triggerEvent('back')
    },
    tapRight() {

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
