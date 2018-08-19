<template>
    <div>
        <div class="carouselBox run-animation" id='carousel'>
            <img :src="bgImgUrl[bgImgIndex]" class="carousel">
        </div>
        <div class="base6"></div>
        <div class="welcome">
            <div class="textBox" @mouseover="startFn" @mouseout="endFn">
                <h1 :data-start="start" :data-startB="startB" class="text" data-text="Welcome to Darker!!">Welcome to Darker!!</h1>
            </div>
            <div class="sysMsgBox" @click="jmpAnnounce" style="cursor:pointer">
                <marquee class="sysMsg">{{announceInfo.title}}</marquee>
            </div>
            <div class="barrageBox">
                <input class="barrageInput" placeholder="在这里输入弹幕" style="width:140px; padding-left:10px;padding-right:10px;">
                <p class="sendBtn">点击发送</p>
            </div>
        </div>
        <div class="hotImgBox">
            <div class="hotImgInBox">
                <div class="hotImgNow" :style="{'margin-left':hotImgNowLoc}"></div>
                <div v-for="(url,index) in bgImgUrl">
                    <img :src="url" @mouseover="userChangeHotImgNow(index)">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../api.js";
export default {
  data() {
    return {
      start: false,
      startB: false,
      timer: null,
      carouselTimer: null,
      bgImgUrl: [
        "../../../static/img/1.jpg",
        "../../../static/img/2.jpg",
        "../../../static/img/3.jpg",
        "../../../static/img/4.jpg",
        "../../../static/img/2.jpg"
      ],
      bgImgIndex: 0,
      hotImgNowLoc: "10px",
      announceInfo:{},
    };
  },
  methods: {
    startFn: function() {
      this.start = true;
      var that = this;
      this.timer = setTimeout(function() {
        that.startB = true;
      }, 2000);
    },
    endFn: function() {
      this.start = false;
      clearTimeout(this.timer);
      this.startB = false;
    },
    userChangeHotImgNow: function(index) {
      this.bgImgIndex = index;
      this.hotImgNowLoc = (10 + 100 * index).toString() + "px";
      clearInterval(this.carouselTimer);
      let carousel = document.getElementById("carousel");
      carousel.classList.remove("run-animation");
      carousel.offsetLeft;
      carousel.classList.add("run-animation");
      var that = this;
      this.carouselTimer = setInterval(function() {
        that.bgImgIndex++;
        if (that.bgImgIndex == that.bgImgUrl.length) that.bgImgIndex = 0;
        that.hotImgNowLoc = (10 + 100 * that.bgImgIndex).toString() + "px";
      }, 5000);
    },
    jmpAnnounce() {
      this.$router.push({ name: "announce" ,params:{id:this.announceInfo.id} });
    },
    async initAnnounce(){
      let resData=(await api.getNotice()).data;
      if(resData.code===0){
        this.announceInfo=resData.data.indexNotice;
        console.log('公告信息',this.announceInfo);
      }
    },
    async initCommend(){
      let resData=(await api.getMostViewBangumis()).data;
      console.log('推荐番剧',resData);
    }
  },
  async created() {
    //在这里获取首页推荐的数据
    var that = this;
    this.carouselTimer = setInterval(function() {
      that.bgImgIndex++;
      if (that.bgImgIndex == that.bgImgUrl.length) that.bgImgIndex = 0;
      that.hotImgNowLoc = (10 + 100 * that.bgImgIndex).toString() + "px";
    }, 5000);
    await this.initAnnounce();
  }
};
</script>

<style>
.carouselBox {
  left: 0;
  top: 0;
  width: 100%;
  height: 876px;
  overflow-x: hidden;
  position: absolute;
  z-index: 1;
}
.carousel {
  width: 100%;
  height: auto;
  /*滤镜*/
  filter: grayscale(30%);
  transform: all 0.3s;
}
.run-animation {
  animation: carouselMove 5s linear 0s infinite normal;
}
@keyframes carouselMove {
  100% {
    transform: scale(1.1, 1.1);
  }
}
.base6 {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url(https://cdn.jsdelivr.net/gh/moezx/cdn@3.1.9/img/Sakura/images/dot.gif);
  z-index: 2;
}
.welcome {
  position: absolute;
  height: 10%;
  width: 50%;
  margin-left: 25%;
  margin-top: 16%;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}
.textBox {
  position: absolute;
  height: 90%;
  width: 100%;
  top: 20%;
}
.text {
  background: rgb(228, 166, 8);
  opacity: 0.7;
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 70px;
  top: -45px;
  color: red;
  clip: rect(0px, 900px, 80px, 0px);
}
[data-start="true"] {
  animation: textShiningA1 2s linear 0s 1 normal;
}
[data-startB="true"] {
  animation: textShiningA2 4s linear 2s infinite normal;
}
[data-start="true"].text:before,
[data-start="true"].text:after {
  content: attr(data-text);
  position: absolute;
  width: 100%;
  background: rgba(0, 0, 0, 0);
  clip: rect(0px, 900px, 80px, 0px);
  opacity: 0.6;
}
[data-start="true"].text:before {
  top: -1px;
  left: 3px;
  text-shadow: 2px 2px #35ff1a;
  animation: textShiningB1 1.5s linear 2.5s infinite normal;
}
[data-start="true"].text:after {
  top: 1px;
  left: -3px;
  text-shadow: -2px -2px #00a7e0;
  animation: textShiningB2 1.5s linear 2.5s infinite normal;
}
@keyframes textShiningA1 {
  0% {
    clip: rect(15px, 900px, 25px, 0px);
    opacity: 1;
  }
  70% {
    clip: rect(60px, 900px, 70px, 0px);
    opacity: 1;
  }
  71% {
    opacity: 0;
  }
  77% {
    clip: rect(0px, 900px, 85px, 0px);
    opacity: 1;
  }
  85% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes textShiningA2 {
  30% {
    opacity: 1;
    left: 4px;
    color: red;
  }
  35% {
    opacity: 1;
    left: 4px;
    color: gray;
  }
  37% {
    opacity: 0;
    color: red;
  }
  39% {
    opacity: 1;
    left: 0px;
  }
}
@keyframes textShiningB1 {
  0% {
    clip: rect(0, 0, 0, 0px);
    opacity: 1;
  }
  14% {
    clip: rect(10px, 900px, 20px, 0px);
  }
  15% {
    clip: rect(10px, 900px, 20px, 0px);
  }
  35% {
    clip: rect(25.75px, 900px, 35.75px, 0px);
  }
  37% {
    clip: rect(0px, 900px, 80px, 0px);
  }
  39% {
    clip: rect(27.55px, 900px, 37.55px, 0px);
  }
  65% {
    clip: rect(35.75px, 900px, 42.25px, 0px);
    text-shadow: 2px 2px #35ff1a;
  }
  67% {
    clip: rect(27.85px, 900px, 43.55px);
    text-shadow: 80px 80px #35ff1a;
  }
  69% {
    clip: rect(37.95px, 900px, 44.85px, 0px);
    text-shadow: 2px 2px #35ff1a;
  }
  100% {
    clip: rect(55px, 900px, 65px, 0px);
    opacity: 1;
  }
}
@keyframes textShiningB2 {
  0% {
    clip: rect(0, 0, 0, 0px);
    opacity: 1;
  }
  14% {
    clip: rect(12px, 900px, 25px, 0px);
  }
  15% {
    clip: rect(12px, 900px, 25px, 0px);
  }
  35% {
    clip: rect(25.75px, 900px, 35.75px, 0px);
  }
  37% {
    clip: rect(0px, 900px, 80px, 0px);
  }
  39% {
    clip: rect(27.55px, 900px, 37.55px, 0px);
  }
  65% {
    clip: rect(35.75px, 900px, 42.25px, 0px);
    text-shadow: -2px -2px #00a7e0;
  }
  67% {
    clip: rect(36.85px, 900px, 52.55px);
    text-shadow: -80px -80px #00a7e0;
  }
  69% {
    clip: rect(37.95px, 900px, 44.85px, 0px);
    text-shadow: -2px -2px #00a7e0;
  }
  100% {
    clip: rect(57px, 900px, 70px, 0px);
    opacity: 1;
  }
}
.sysMsgBox {
  position: absolute;
  top: -13px;
  background: rgb(228, 166, 8);
  opacity: 0.8;
  height: 30px;
  width: 100%;
  border-bottom: 3px solid gray;
}
.sysMsg {
  line-height: 30px;
  color: #ff3f1a;
  width: 90%;
  font-weight: bold;
}
.hotImgBox {
  position: absolute;
  height: 15%;
  /*绝对布局的居中法*/
  top: 50%;
  left: 50%;
  transform: translate(-50%, 20%);
  display: flex;
  flex-direction: row;
  z-index: 1000;
}
.hotImgInBox {
  height: 100px;
  display: flex;
  flex-direction: row;
  margin: auto;
}
.hotImgInBox img {
  width: 80px;
  height: 80px;
  border-radius: 80px;
  margin: 10px 10px;
  cursor: pointer;
  /*
    置于a底下
    position: relative;
    z-index: -1;
    */
}
.hotImgNow {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 80px;
  border: 1px solid white;
  box-shadow: 0px 0px 30px white inset;
  cursor: pointer;
  margin-top: 10px;
  transition: margin-left 1s;
}
.barrageBox {
  background: grey;
  opacity: 0.8;
  position: absolute;
  height: 30px;
  width: 300px;
  display: flex;
  flex-direction: row;
  /*绝对布局的居中法*/
  top: 50%;
  left: 50%;
  transform: translate(-50%, 700%);
}
.barrageInput,
.sendBtn {
  margin: auto auto;
  line-height: 30px;
}
.barrageInput {
  width: 100px;
  height: 20px;
}
.sendBtn {
  width: 100px;
  height: 30px;
}
</style>
