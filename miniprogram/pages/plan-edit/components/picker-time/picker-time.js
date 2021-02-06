// pages/plan-edit/components/picker-time/picker-time.js
import { judgeIphoneX } from '../../../../utils/util';

const hourse = []
const minutes = []

for (let i = 0; i <= 23; i++) {
  if (i < 10) {
    hourse.push('0' + i)
  } else {
    hourse.push('' + i)
  }
}

for (let i = 0; i <= 59; i++) {
  if (i < 10) {
    minutes.push('0' + i)
  } else {
    minutes.push('' + i)
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
    currentDate: {   // 当前日期
      type: Object,
      value: {
        year: 2021,
        month: 2,
        day: 2
      }
    },
    currentTime: {   // 当前时间
      type: String,
      value: '00:00'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    hourse,
    minutes,
    value: [0, 0],

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
      const value = this.data.value;
      const pickResultH = this.data.hourse[value[0]];
      const pickResultM = this.data.minutes[value[1]];
      const pickTime = `${pickResultH}:${pickResultM}`;

      this.triggerEvent('back', { pickTime });
    },
    tapRight() {
      const value = this.data.value;
      const hourse = this.data.hourse[value[0]];
      const minutes = this.data.minutes[value[1]];
      const time = `${hourse}:${minutes}`;

      this.triggerEvent('setup', { time });
    },

    change(e) {
      const { value } = e.detail;

      this.data.value = value;
    },
  },

  observers: {
    currentTime: function(time) {
      const value = this.data.value;
      const h = time.split(':')[0];
      const m = time.split(':')[1];
      
      const hourse = this.data.hourse;
      const minutes = this.data.minutes;
      for (let i = 0; i < hourse.length; i++) {
        const item = hourse[i];
        if (item*1 === h*1) {
          value[0] = i;
          break;
        }
      }
      for (let i = 0; i < minutes.length; i++) {
        const item = minutes[i];
        if (item*1 === m*1) {
          value[1] = i;
          break;
        }
      }
      
      // 根据当前传递的时间，默认选择列表项里
      this.setData({
        value
      })
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
