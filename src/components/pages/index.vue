<template>
    <div>
        <div class="footerImgBox">
          <div class="footerImg"></div>
        </div>
        <div class="footerImgBox">
          <div class="footerImg2"></div>
        </div>
        <div class="cloudBox">
          <div class="cloud1"></div>
        </div>
        <div class="cloudBox">
          <div class="cloud2"></div>
        </div>
        <div class="cloudBox">
          <div class="cloud3"></div>
        </div>
        <div class="righterImgBox" v-if="false">
          <img src="../../../static/img/righter.png" class="righterImg">
        </div>
        <div class="carouselBox">
            <img :src="bgImgUrl[bgImgIndex].thumb" class="carousel run-animation" id='carousel'>
        </div>
        <div class="base6"></div>
        <div class="welcome">
            <div class="textBox" @mouseover="startFn" @mouseout="endFn">
                <h1 :data-start="start" :data-startB="startB" class="text" data-text="Welcome to Darker!!">Welcome to Darker!!</h1>
            </div>
            <div class="sysMsgBox" @click="jmpAnnounce" style="cursor:pointer">
                <marquee class="sysMsg">{{announceInfo.title}}</marquee>
            </div>
            <div class="barrageBox" v-if="false">
                <input class="barrageInput" placeholder="在这里输入弹幕" style="width:140px; padding-left:10px;padding-right:10px;">
                <p class="sendBtn">点击发送</p>
            </div>
        </div>
        <div class="hotImgBox">
            <div class="hotImgInBox">
                <div class="hotImgNow" @click="jmpNowBangumi" :style="{'margin-left':hotImgNowLoc,width:imgWidth}"></div>
                <img v-for="(url,index) in bgImgUrl" :src="url.thumb" :style="[{width:imgWidth}]" @click="jmpToBangumi(url)" class="hotImgItemBox" @mouseover="userChangeHotImgNow(index)" :key="url.bangumiId">
            </div>
        </div>
      <div class="indexFooter">
        <div class="inderFooter2">
          <div class="footerAbout">
            <a target="_blank" class="footerItem" href="#/aboutUs">关于我们</a>
            <a target="_blank" class="footerItem" href="#/contactUs" @mouseover="infoText='联系我们'" @mouseout="infoText='用爱发电'">{{infoText}}</a>
            <a target="_blank" class="footerItem" href="https://t.me/joinchat/D6RlYg6geGuiS3WP_ag5zg"><img style="width:20px;height:15px;" src="../../../static/img/logo.png"><p>加入我们</p></a>
          </div>
          <div class="authorInfo">
            <p>Crafted with</p>
            <p style="color:red;font-size:18px;">❤</p>
            <p>by Darkers ©2018 Darker.</p>
          </div>
          <div class="indexFooterInBox">
            <a target="_blank" :href="GLOBAL.DOInviteLink" class="footerItem"><img class="elementIcon" :src="GLOBAL.imgURL+'/FlgYbSr.png'"></a>
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
      bgImgUrl: [{thumb:'../../../static/img/1.jpg'}],
      bgImgIndex: 0,
      hotImgNowLoc: "0px",
      announceInfo:{},
      imgWidth:'',
      widthNum:0,
      infoText:'用爱发电'
      // notice: "",
      // showNotice: false,
      // lastNoticeId: "",
      // curNoticeId: ""
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
      this.hotImgNowLoc = (this.widthNum * this.bgImgIndex).toString() + "%";
      clearInterval(this.carouselTimer);
      this.carouselTimer=null;
      let carousel = document.getElementById("carousel");
      carousel.classList.remove("run-animation");
      carousel.offsetLeft;
      carousel.classList.add("run-animation");
      this.carouselTimer = setInterval(()=>{
        this.bgImgIndex++;
        if (this.bgImgIndex == this.bgImgUrl.length) this.bgImgIndex = 0;
        this.hotImgNowLoc = (this.widthNum * this.bgImgIndex).toString() + "%";
      }, 5000);
    },
    jmpToBangumi(item){
      console.log(item);
      window.location.assign('/#/bangumi/'+item.bangumiId);
    },
    jmpNowBangumi(){
      window.location.assign('/#/bangumi/'+this.bgImgUrl[this.bgImgIndex].bangumiId);
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
      if(resData.code===0){
        this.bgImgUrl=resData.data.bangumi;
        this.imgWidth=(100/this.bgImgUrl.length).toString()+'%';
        this.widthNum=100/this.bgImgUrl.length;
      }
    }
  },
  async created() {
    await this.initCommend();
    //在这里获取首页推荐的数据
    this.carouselTimer = setInterval(()=> {
      this.bgImgIndex++;
      if (this.bgImgIndex == this.bgImgUrl.length) this.bgImgIndex = 0;
      this.hotImgNowLoc = (this.widthNum * this.bgImgIndex).toString() + "%";
    }, 5000);
    await this.initAnnounce();
    this.$emit('toIndex');
  }
};
</script>

<style>
.indexFooter{
  position: absolute;
  bottom: 0;
  z-index: 1000;
  display: flex;
  flex-direction: row;
  left: 0.5%;
  width: 99%;
}
.inderFooter2{
  display: flex;
  flex-direction: row;
  margin: auto auto;
}
.footerAbout{
  display: flex;
  flex-direction: row;
}
.authorInfo{
  display: flex;
  flex-direction: row;
  height: 20px;
}
.authorInfo p{
  height: 20px;
  margin: auto 3px;
  line-height: 20px;
}
.indexFooterInBox{
  display: flex;
  flex-direction: row;
  margin: auto auto;
}
.footerItem{
  margin: auto 10px;
  text-align: center;
  display: flex;
  flex-direction: row;
  height: 20px;
  text-decoration: none;
  color: black;
}
.footerItem img{
  height: 20px;
  width: 20px;
  margin: auto auto;
}
.elementIcon{
  height: 20px;
  width: 120px !important;
}
.footerItem p{
  line-height: 20px;
  height: 20px;
  margin: auto 5px;
}
.carouselBox {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
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
  z-index: 4;
}
.welcome {
  position: absolute;
  height: 85px;
  width: 50%;
  margin-left: 25%;
  margin-top: 280px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  /*border-left: 10px solid black;*/
  /*border-right: 10px solid black;*/
}
.textBox {
  position: absolute;
  height: 90%;
  width: 100%;
  top: 20%;
}
.text {
  /*background: rgb(228, 166, 8);*/
  background: rgb(42, 83, 103);
  opacity: 0.8;
  position: absolute;
  height: 100%;
  width: 100%;
  font-size: 70px;
  top: -45px;
  color: rgb(0, 0, 0);
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
    color: black;
  }
  35% {
    opacity: 1;
    left: 4px;
    color: gray;
  }
  37% {
    opacity: 0;
    color:black;
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
    /*background: rgb(228, 166, 8);*/
  background: rgb(3, 4, 4);
  opacity: 0.9;
  height: 30px;
  width: 100%;
  border-bottom: 3px solid gray;
}
.sysMsg {
  line-height: 30px;
  color: #c19e33;
  width: 90%;
  font-weight: bold;
}
.hotImgBox {
  background: #00a7e0;
  border-top: 3px solid #7a7676;
  border-radius: 0px;
  position: absolute;
  height: 10%;
  width: 50%;
  /*绝对布局的居中法*/
  top: 435px;
  left: 25.4%;
  display: flex;
  flex-direction: row;
  z-index: 1000;
}
.hotImgInBox {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  margin: auto auto;
}
.hotImgItemBox{
  cursor: pointer;
}
.hotImgInBox img {
  height: 100%;
  width: inherit;
    /*
    置于a底下
    position: relative;
    z-index: -1;
    */
}
.hotImgNow {
  position: absolute;
  height: 100%;
  border: 1px solid white;
  box-shadow: 0px 0px 30px white inset;
  cursor: pointer;
  margin-top: 0px;
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
.footerImgBox{
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.footerImg{
  margin: auto auto;
  margin-bottom: 0;
  width: 100%;
  height: 65px;
  background-image: url("../../../static/img/wave1.png");
  background-position: 0 0;
  animation: footerMv 10s infinite linear;
}
@keyframes footerMv {
  0%{background-position: 0 0;}
  100%{background-position: 130% 0;}
}
.footerImg2{
  margin: auto auto;
  margin-bottom: 0;
  width: 100%;
  height: 70px;
  background-image: url("../../../static/img/wave2.png");
  animation: footerMv 20s infinite .2s linear;
  display: flex;
  flex-direction: column;
}
.footerImg2 p{
  margin:auto auto;
  margin-bottom: 0;
  cursor: pointer;
}
.righterImgBox{
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.righterImg{
  margin: auto auto;
  margin-right: 0;
  width: 100px;
/*.notify {*/
  /*display: inline-block;*/
/*}*/
/*.notify .content {*/
  /*display: inline-block;*/
  /*border: 1px solid #f8dfaa;*/
  /*width: 600px;*/
  /*background-color: #fff1d3;*/
  /*color: #e78b1f;*/
  /*position: relative;*/
  /*line-height: 30px;*/
  /*text-align: left;*/
  /*border-radius: 4px;*/
/*}*/
/*.notify .content a:hover {*/
  /*cursor: pointer;*/
/*}*/
/*.notify-bell {*/
  /*left: 10px;*/
  /*top: 6px;*/
  /*position: absolute;*/
/*}*/
/*.notify-close {*/
  /*right: 10px;*/
  /*top: 6px;*/
  /*position: absolute;*/
/*}*/
/*.notify-link {*/
  /*margin-left: 35px;*/
  /*font-size: 14px;*/
}
.cloudBox{
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.cloud1{
  margin: auto auto;
  margin-right: -180;
  margin-bottom: 180px;
  width: 180px;
  height: 90px;
  background-image: url("../../../static/img/cloud1.png");
  background-size: cover;
  animation: cloudMv 20s infinite linear;
}
@keyframes cloudMv {
  0%{margin-right: -180px;}
  99%{margin-right: 1600px;opacity: 0;}
  100%{opacity: 0;}
}
.cloud2{
  margin: auto auto;
  margin-right: -180px;
  margin-bottom: 650px;
  width: 180px;
  height: 86.4px;
  background-image: url("../../../static/img/cloud2.png");
  background-size: cover;
  animation: cloudMv 25s infinite 7s linear;
}
.cloud3{
  margin: auto auto;
  margin-right: -100px;
  margin-bottom: 550px;
  width: 100px;
  height: 70px;
  background-image: url("../../../static/img/cloud3.png");
  background-size: cover;
  animation: cloudMv2 30s infinite 15s linear;
}
@keyframes cloudMv2 {
  0%{margin-right: -100px;}
  99%{margin-right: 1600px;opacity: 0;}
  100%{opacity: 0;}
}
</style>
