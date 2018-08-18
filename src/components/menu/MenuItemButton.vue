<template>
    <div class="titleBox" @mouseover="inBtn" @mouseout="outBtn" @click="jmp">
        <div class="title" :style="{'font-size':font}"><slot></slot></div>
        <p class="borderLine" :style="{width:border}"></p>
    </div>
</template>

<script>
export default {
  name: "MenuItemButton",
  props: {},
  data() {
    return {
      fontSize: 25,
      font: "25px",
      borderLength: 0,
      border: 0
    };
  },
  computed: {},
  watch: {
    fontSize: function(newSize) {
      TweenLite.to(this.$data, 0.5, { font: newSize + "px" });
    },
    borderLength: function(newSize) {
      TweenLite.to(this.$data, 0.5, { border: newSize + "px" });
    }
  },
  methods: {
    inBtn: function() {
      this.fontSize = 28;
      this.borderLength = 70;
    },
    outBtn: function() {
      this.fontSize = 25;
      this.borderLength = 0;
    },
    jmp:function(){
      this.$emit("jmp");
    }
  }
};
</script>

<style>
.titleBox {
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.title {
  height: 30px;
  width: 70px;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
  font-family: 幼圆;
  margin-top: 17px;
  color: lightslategray;
  transition: color 0.5s;
}
.title:hover{
  color: mediumorchid;
}
.borderLine {
  margin-top: 10px;
  height: 0px;
  border-bottom: 3px solid mediumorchid;
}
</style>
