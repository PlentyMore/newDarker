<template>
    <div class="titleBox" @mouseover="inBtn" @mouseout="outBtn" @click="jmp">
      <div class="titleInBox">
        <img :src="iconImg" class="iconImg" :style="iconImgStyle">
        <div class="title" :style="[{'font-size':font},titleStyle]"><slot></slot></div>
      </div>
        <div class="borderLine" :style="{width:border}"></div>
    </div>
</template>

<script>
export default {
  props: ["iconImg"],
  name: "MenuItemButton",
  data() {
    return {
      fontSize: 25,
      font: "25px",
      borderLength: 0,
      iconImgStyle: {
        filter: "grayscale(90%)",
        transform: "scale(1)"
      },
      titleStyle: {
      },
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
      this.borderLength = 100;
      this.iconImgStyle = {
        filter: "grayscale(0%)",
        transform: "scale(1.1)",
        opacity: 1
      };
      this.titleStyle= {
        color: "orange",
        opacity: 1
      }
    },
    outBtn: function() {
      this.fontSize = 25;
      this.borderLength = 0;
      this.iconImgStyle = {
        filter: "grayscale(90%)",
        transform: "scale(1)",
        opacity: 0.7
      };
      this.titleStyle={};
    },
    jmp: function() {
      this.$emit("jmp");
    }
  },
  mounted() {
    console.log("图标", this.iconImg);
  }
};
</script>

<style>
.titleBox {
  width: 100px;
  height: 60px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.titleInBox {
  display: flex;
  flex-direction: row;
  margin: auto auto;
}
.iconImg {
  height: 30px;
  margin-top: 17px;
  opacity: 0.7;
  transition: all 0.5s;
}
.title {
  height: 30px;
  width: 70px;
  text-align: center;
  line-height: 30px;
  font-family: 华文琥珀;
  margin-top: 17px;
  color: rgb(158, 144, 119);
  opacity: 0.7;
  transition: color 0.5s;
}
.borderLine {
  margin-top: 10px;
  height: 0px;
  border-bottom: 3px solid orange;
}
</style>
