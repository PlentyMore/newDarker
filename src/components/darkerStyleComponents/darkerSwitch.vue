<template>
    <div class="darkerSwitch" :style="switchBg" @click="isChoose=!isChoose">
        <p :style="switchBtnMove"></p>
    </div>
</template>

<script>
export default {
  props: ["choose"],
  data() {
    return {
      switchBg: { background: "rgba(207,207,207,.8)" },
      switchBtnMove: { "margin-left": "3px" },
      isChoose: this.choose
    };
  },
  watch: {
    isChoose: function(newValue) {
      if (newValue) {
        this.switchBg = { background: "rgba(100,149,237,.8)" };
        this.switchBtnMove = { "margin-left": "18px" };
      } else {
        this.switchBg = { background: "rgba(207,207,207,.8)" };
        this.switchBtnMove = { "margin-left": "3px" };
      }
      this.$emit("update:choose", newValue);
    }
  }
};
</script>

<style scoped>
.darkerSwitch {
  height: 18px;
  width: 35px;
  border-radius: 18px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  transition: background 0.2s linear;
}
.darkerSwitch p {
  background: white;
  height: 14px;
  width: 14px;
  border-radius: 14px;
  margin-top: 2.5px;
  transition: margin-left 0.2s linear;
}
</style>
