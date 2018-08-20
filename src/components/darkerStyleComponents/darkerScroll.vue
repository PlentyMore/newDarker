<template>
    <div class="scrollBox">
        <div class="scrollInBox" :style="scrollBoxSize" @mousewheel="scroll($event)">
            <div class="scrollInBox" :style="marginTop">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  //滚动窗高度，滚动窗宽度，项长度，项间隔，项数目
  props: [
    "scrollHight",
    "scrollWidth",
    "itemHeight",
    "itemSpacing",
    "itemCount"
  ],
  data() {
    return {
      marginTop: {
        "margin-top": "0px"
      },
      scrollBoxSize: {
        height: this.scrollHight + "px",
        width: this.scrollWidth + "px"
      },
      mtop: 0,
      max: 0,
      //实际项高 = 间隔+项高
      //底部限制 = 实际项高*(项数-滚动窗高/实际项高)+滚动窗高%实际项高/4
      min:
        (this.itemSpacing + this.itemHeight) *
          Math.floor(
            this.itemCount - (this.scrollHight/(this.itemHeight+this.itemSpacing))
          ) +
        (this.scrollHight % (this.itemSpacing + this.itemHeight)) / 4
    };
  },
  watch: {
    itemCount(newValue, oldValue) {
      console.log(newValue,oldValue);
      if (newValue < oldValue) {
        this.marginTop = {
          "margin-top": "0px"
        };
        this.scrollBoxSize = {
          height: this.scrollHight + "px",
          width: this.scrollWidth + "px"
        };
        this.mtop = 0;
        this.max = 0;
      }
      this.min =
        (this.itemSpacing + this.itemHeight) *
          Math.floor(
            this.itemCount - (this.scrollHight/(this.itemHeight+this.itemSpacing))
          ) +
        (this.scrollHight % (this.itemSpacing + this.itemHeight)) / 4;
      console.log(this.min);
    }
  },
  methods: {
    scroll: function(e) {
      console.log(this.scrollHight, this.min);
      if (this.min <= 0) return;
      var tmp = this.max + e.deltaY / 1.5;
      if (tmp < 0) {
        this.max = 0;
        this.mtop = 0;
      } else if (tmp >= this.min) {
        this.max = this.min;
        this.mtop = -this.min;
        this.$emit("nextPage");
        console.log("到底啦！");
      } else {
        this.max = tmp;
        this.mtop -= e.deltaY / 1.5;
      }
      this.marginTop = {
        "margin-top": this.mtop + "px"
      };
    }
  }
};
</script>

<style>
.scrollInBox {
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}
.scrollInBox {
  position: absolute;
  transition: margin-top 0.5s;
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
