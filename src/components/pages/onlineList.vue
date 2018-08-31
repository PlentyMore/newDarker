<template>
  <div class="searchResultPage1">
    <div class="searchResultBg1">
      <div class="searchResultBgInBox1"></div>
      <div class="searchResultBgBox1"><img :src="bgUrl" class='searchResultBgImg1'></div>
    </div>
    <div class="searchResultBox1" :style="resultStyle">
      <h1 style="color: #1b84ec" v-show="bangumis === ''">暂时没有人在观看视频</h1>
      <div v-for="(item,i) in bangumis" v-if="index>i" :class="['searchResultItem1',{'run-animation21':item.bangumiId==showId[i]}]" @mouseover="changeBgUrl(item.thumb)" @click="goBangumiDetail(item)" :key="item.bangumiId">
        <img :src="item.thumb?item.thumb:'../../../static/img/1.jpg'">
        <div class="bangumiName1" v-if="item.title.length<='ElderDriverBroken♂Man1'.length"><p>{{item.title}}</p></div>
          <marquee v-else behavior="alternate" scrollamount="6">{{item.title}}</marquee>
          <div class="mvOtherInfo1">
            <div>
              <img src="../../../static/img/saw2.png" title="访问量">
              <p>{{item.episodeViewCount}}</p>
            </div>
            <div>
              <img src="../../../static/img/barrage2.png" title="弹幕数">
              <p>{{item.danmakuCount}}</p>
            </div>
          </div>
          <p class="bangumiEpInfo1">在线人数:{{item.onlineCount}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../api";
import submitMovie from "../submitMovie/submitMovie.vue";
export default {
  props: ["searchText"],
  components: {
    "submit-movie": submitMovie
  },
  data() {
    return {
      bangumis: "",
      page: "",
      result: [],
      bgUrl: "",
      index: 0,
      showId: [],
      showTimer: null,
      resultStyle: {
        "min-height": "900px"
      },
      showSubmitBox: false
    };
  },
  methods: {
    async initOnlineList() {
      let res = (await api.getOnlineList()).data;
      console.log("在线列表信息", res);
      if (res.code === 0) {
        this.bangumis = res.data;
        console.log(this.bangumis);
        this.bgUrl =
          res.data[0].thumb === ""
            ? "../../static/img/1.jpg"
            : res.data[0].thumb;
        console.log("bgUrl", this.bgUrl);
        console.log("pageNum:", "ElderDriverBroken♂Man".length);
        this.showTimer = setInterval(() => {
          this.showId.push(this.bangumis[this.index].bangumiId);
          this.index++;
          if (this.index == this.bangumis.length) {
            clearInterval(this.showTimer);
            this.showTimer = null;
          }
        }, 150);
      }
    },
    changeBgUrl(url) {
      this.bgUrl = url === "" ? "../../static/img/1.jpg" : url;
    },
    goBangumiDetail(bangumi) {
      window.open(bangumi.linkUrl);
    }
  },
  created() {
    console.log(this.searchText);
    this.initOnlineList();
  },
  beforeDestroy() {
    clearInterval(this.showTimer);
    this.bangumis = "";
  }
};
</script>

<style>
.el-pagination__total {
  color: black;
}
.run-animation21 {
  animation: show 0.8s linear 0s 1 normal;
}
@keyframes show {
  0% {
    margin: 0px 10px;
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    margin: 30px 10px;
    opacity: 1;
  }
}
.page-container1 {
  display: flex !important;
  flex-direction: column;
  width: 100% !important;
  height: 80px !important;
  background: none !important;
  margin-top: -130px;
}
.searchResultBg1 {
  position: relative;
  z-index: -1;
}
.searchResultBgBox1 {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 2;
}
.searchResultBgInBox1 {
  background: rgba(0, 0, 0, 0.486);
  top: 0;
  left: 0;
  position: fixed;
  z-index: 3;
  width: 100%;
  height: 100%;
}
.searchResultBgImg1 {
  height: 100%;
  width: 100%;
  filter: blur(20px) grayscale(30%);
}
.searchResultPage1 {
  display: flex;
  flex-direction: column;
}
.searchResultBox1 {
  width: 1000px;
  margin: 8% auto;
  z-index: 10;
}
.sr-submit-link1 {
  color: #9a656e;
  cursor: pointer;
  text-decoration: underline;
}
.searchResultItem1 {
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.548);
  width: 180px;
  height: 180px;
  margin: 30px 10px;
  float: left;
  display: inline-block;
  border-radius: 10px;
  box-shadow: 0 0 10px white;
  transition: box-shadow 0.5s;
  cursor: pointer;
  opacity: 1;
}
.searchResultItem1:hover {
  box-shadow: 0px 0px 20px white;
}
.searchResultBox1 img {
  width: 180px;
  height: 100px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.searchResultBox1 marquee {
  height: 25px;
  line-height: 25px;
}
.bangumiName1 {
  height: 25px;
  line-height: 25px;
  margin-top: -15px;
}
.bangumiEpInfo1 {
  margin-top: 5px;
  height: 20px;
  line-height: 20px;
  font-size: 15px;
  background: rgba(255, 255, 255, 0.459);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.mvOtherInfo1 {
  display: flex;
  flex-direction: row;
  height: 25px;
  margin: 0 auto;
  width: 100%;
}
.mvOtherInfo1 div {
  display: flex;
  flex-direction: row;
  margin: auto auto;
  margin-right: 10px;
  width: 50%;
  height: 25px;
}
.mvOtherInfo1 img {
  height: 20px;
  width: 20px;
  margin: auto auto;
  margin-right: -18px;
  display: inline-block;
}
.mvOtherInfo1 p {
  margin: auto auto;
  color: white;
  font-size: 13px;
  line-height: 25px;
  height: 25px;
  padding-left: 3px;
  display: inline-block;
}
</style>
