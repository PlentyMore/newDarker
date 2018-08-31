<template>
  <div :class="['watchPageBox',{'watchPageBoxB':(showSubmitMvBox||loading)}]" :style="hasInfo?'':{height: '845px'}">
    <div class="searchResultBg2">
      <div class="searchResultBgInBox"></div>
      <div class="searchResultBgBox"><img :src="videoCover" class='searchResultBgImg'></div>
    </div>
    <transition name="submitMvBoxTran">
      <div class="submitMovieBox" v-if="showSubmitMvBox">
        <submit-movie
          :show="showSubmitMvBox"
          @closeBox="closeSubmitMvBox"
          @updateMvList="reloadMvInfo"
          class="submitMovieInBox"></submit-movie>
      </div>
    </transition>
    <div v-if="hasInfo">
      <div class="mvInfo">
        <p class="mvTitle">{{videoInfo.bangumiName}}：第{{videoInfo.episodeIndex}}集</p>
        <p class="mvMatch" @click="showMatchBox=!showMatchBox;showSubmitMvBox=false;">手动匹配</p>
      </div>
      <div class="mvOtherInfo">
        <div>
          <img src="../../../static/img/saw.png" title="访问量">
          <p>{{videoInfo.viewCount}}</p>
        </div>
        <div>
          <img src="../../../static/img/barrage.png" title="弹幕数">
          <p>{{videoInfo.danmakuCount}}</p>
        </div>
      </div>
    </div>
    <!--vue class三目-->
    <div :class="[hasInfo? '':'noMvInfo']">
      <el-upload id="uploadBox" class="videoBox" drag :multiple="false" :auto-upload="false" :on-change="handleChange"
                 action="/" :show-file-list="false">
        <div class="uploadTips">{{hasInfo?'将视频文件拖动到播放窗口，或点击这里可以手动选择视频文件':'将视频文件拖动到播放窗口，或点击这里可以手动选择视频文件'}}</div>
        <div class="wattingBox" v-if="loading">
          <img
            src='data:image/gif;base64,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'>
          <p>加载数据中...</p>
        </div>
        <transition name="chooseMvBoxTrans">
          <div class="chooseMvBox" @click.stop v-if="videoListShow">
            <p class="choosMvTitle">确认番剧</p>
            <select class="chooseMv" v-model="mvIndex">
              <option v-for="(item,index) in videoList" :value="index" :key="item.bangumiId">{{item.bangumiName}} -
                第{{item.episodeIndex}}集
              </option>
            </select>
            <div class="chooseMvBtnBox">
              <div class="confrimMvBtn" @click="chooseMv">确定</div>
              <div class="noChooseBtn" @click="noChoose">以上都不是</div>
            </div>
          </div>
        </transition>
        <transition name="mvMatchBox">
          <div v-if='showMatchBox' class="matchBox" @click.stop>
            <div class="matchInBox">
              <div class="matchInfoBox">
                <div class="searchMvKeyBox">
                  <input placeholder="请输入番剧关键词" v-model="searchMvKey">
                  <div class="searchMvResultBox" v-if="searchMvKey!=''&&searchMvBoxShow">
                    <div class="searchMvResultInBox" v-if="!searchWaitingShow">
                      <p v-for="(item,index) in searchMvResult" @click="chooseResult(index)" :key="item.bangumiId">
                        {{item.bangumiName}}</p>
                    </div>
                    <div class="searchMvResultInBox" v-if="searchWaitingShow">
                      <p>搜索中...</p>
                    </div>
                    <div class="searchMvResultInBox" v-if="noSearchMvResult">
                      <p @click="showSubmitMvBox=true">没找到结果？马上创建！</p>
                    </div>
                  </div>
                </div>
                <select v-model="searchResultEpisodeNum">
                  <option value="0">请选择集数</option>
                  <option v-for="n in searchResultChoose.episodeTotal" :value="n" :key="n">{{n}}</option>
                </select>
              </div>
              <div class="matchBtnBox">
                <p @click="confirmMvSearch">确定</p>
                <p @click="cancelMvSearch">取消</p>
              </div>
            </div>
          </div>
        </transition>
        <div @click.stop id='dplayer' ref="player" class="videoSize"></div>
        <div class="mvBarrageBox" @click.stop>
          <div class="onlineNumBox">
            <p>在线人数 {{online}}</p>
          </div>
          <div class="dm-color-wrapper">
            <el-color-picker size="mini" v-model="tmpDanmaku.color"></el-color-picker>
          </div>
          <el-popover
            :visible-arrow=false
            v-model="showDanPos"
            placement="top"
            width="180"
            trigger="click">
            <div class="dm-pos-choose-wrapper">
              <div class="dm-pos-setting-title">
                <span>选择弹幕类型</span>
              </div>
              <el-radio-group @change="showDanPos = false" style="cursor: pointer;" size="mini" v-model="tmpDanmaku.type">
                <el-radio-button label="top">顶部</el-radio-button>
                <el-radio-button label="right">滚动</el-radio-button>
                <el-radio-button label="bottom">底部</el-radio-button>
              </el-radio-group>
            </div>
            <div slot="reference" class="choose-dan-pos">
              <i class="el-icon-tickets dan-icon"></i>
            </div>
          </el-popover>
          <el-popover
            :visible-arrow=false
            v-model="showFontSet"
            placement="top"
            width="250"
            trigger="click">
            <div class="dm-pos-choose-wrapper">
              <div class="dm-pos-setting-title">
                <span>弹幕显示设置</span>
              </div>
              <div>
                <div class="displaySet">
                  <span class="demonstration" style="width:30%">透明度</span>
                  <el-slider v-model="opacity" style="width:60%;margin:-10px auto;"></el-slider>
                </div>
                <div class="displaySet">
                  <span class="demonstration" style="width:30%">字体大小</span>
                  <el-slider v-model="fontSize" style="width:60%;margin:-10px auto;" :max="30" :min="10"></el-slider>
                </div>
              </div>
            </div>
            <div slot="reference" class="choose-dan-pos">
              <i class="el-icon-setting dan-icon" @click="showFontSet=!showFontSet"></i>
            </div>
          </el-popover>
          <input :disabled="canSendDanmaku" @keyup.enter="sendDanmaku" v-model="tmpDanmaku.text" placeholder="请输入弹幕">
          <button @click="sendDanmaku"
                  :disabled="canSendDanmaku"
                  style="text-align:center;border: none"
                  class="mvBarrageBoxBtn">
            <span>发送</span>
          </button>
        </div>
      </el-upload>
    </div>
    <div class="commentList" v-if="hasInfo" id="comment">
      <real-comment
        :oid="videoInfo?videoInfo.episodeId:''"
        :type=1
        :rpid="specificRpid"
      >
      </real-comment>
    </div>
  </div>
</template>

<script>
import VueDPlayer from "dplayer";
import "dplayer/dist/DPlayer.min.css";
import api from "../../api.js";
import SparkMD5 from "spark-md5";
import hashMe from "../../assets/hashme.js";
import submitMovie from "../submitMovie/submitMovie.vue";
import realComment from "../comment/RealComment.vue";
import footer1 from "../footer/footer.vue";

export default {
  components: {
    VueDPlayer,
    submitMovie,
    "real-comment": realComment,
    footer1
  },
  data() {
    return {
      dp: "",
      online: 0,
      ws: null,
      webSocketInterval: null,
      hasInfo: false,
      videoCover: "../../../static/img/1.jpg",
      videoURL: "",
      videoMd5: "",
      videoSize: 0,
      videoInfo: {
        bangumiId: -1,
        bangumiName: "",
        danmakuCount: 0,
        danmakuId: "",
        episodeId: -1,
        episodeIndex: -1,
        replyable: -1,
        thumb: "",
        videoId: -1,
        viewCount: -1
      },
      showSubmitMvBox: false,
      specificRpid: this.$route.query.rpid,
      loading: false,
      videoListShow: false,
      videoList: [],
      mvIndex: 0,
      showMatchBox: false,
      searchMvKey: "",
      searchMvResult: [],
      searchMvBoxShow: true,
      searchWaitingShow: false,
      noSearchMvResult: false,
      searchResultChoose: {},
      searchResultEpisodeNum: 0,
      //弹幕bug，第一次放视频没有弹幕出现
      bugTmp: 0,
      tmpDanmaku: {
        text: "",
        color: "#fff",
        type: "right"
      },
      showDanPos: false,
      showFontSet: false,
      opacity: 100,
      fontSize: 25,
      danmakuStyle: {
        opacity: "1",
        fontSize: "25px"
      }
    };
  },
  watch: {
    $route(to, from) {
      console.log("to: ", to + " from: ", from);
      this.resetAllData();
      setTimeout(() => {
        this.initDp();
      }, 1);
    },
    opacity() {
      let danmaku=document.getElementsByClassName('dplayer-danmaku');
      console.log('弹幕节点',danmaku);
      danmaku[0].style.opacity=(this.opacity/100).toString();
    },
    fontSize() {
      let danmaku=document.getElementsByClassName('dplayer-danmaku');
      console.log(this.fontSize.toString()+'px');
      danmaku[0].setAttribute('style','font-size: ' + this.fontSize.toString() + 'px !important');
    },
    videoInfo() {
      // if (this.bugTmp > 1) this.initDp();
      if (this.dp) this.switchVideo();
      this.videoCover =
        this.videoInfo.thumb === ""
          ? "../../../static/img/1.jpg"
          : this.videoInfo.thumb;
      clearInterval(this.webSocketInterval);
      if (this.ws) this.ws.close();
      this.webSocketInterval = null;
      this.initWebsocket(this.videoInfo.episodeId);
    },
    async searchMvKey(key) {
      console.log("searching...", this.searchMvKey);
      this.searchResultEpisodeNum = 0;
      this.noSearchMvResult = false;
      console.log("选择了的番剧名称", this.searchResultChoose.bangumiName);
      if (
        this.searchMvKey === "" ||
        this.searchMvKey == this.searchResultChoose.bangumiName
      ) {
        this.searchMvBoxShow = false;
        return;
      }
      this.searchMvBoxShow = true;
      this.searchResultChoose = {};
      this.searchWaitingShow = true;
      this.searchMvResult = [];
      let resData = await api.getsearchBangumisIdResult(this.searchMvKey);
      if (this.searchMvKey != key) return; //防止在未搜索出结果的情况下，更改了关键词，导致等待提示消失或搜索结果记录错误
      this.searchWaitingShow = false;
      console.log("搜索结果", resData);
      if (
        resData.data.code == 0 &&
        typeof resData.data.data.content !== "undefined"
      ) {
        if (this.searchMvKey != key) return; //防止在未搜索出结果的情况下，更改了关键词，导致搜索结果记录错误
        this.searchMvResult = resData.data.data.content;
      } else if (typeof resData.data.data.content === "undefined") {
        if (this.searchMvKey != key) return; //防止在未搜索出结果的情况下，更改了关键词，导致搜索结果记录错误
        this.searchMvResult = [];
        this.noSearchMvResult = true;
        console.log("没有数据");
      }
    }
  },
  methods: {
    sendDanmaku() {
      if (this.dp) {
        if (this.tmpDanmaku.text === "") return;
        this.dp.danmaku.send(
          {
            text: this.tmpDanmaku.text,
            color: this.tmpDanmaku.color ? this.tmpDanmaku.color : "#fff",
            type: this.tmpDanmaku.type
          },
          () => {
            this.tmpDanmaku.text = "";
          }
        );
      }
    },
    initWebsocket(epid) {
      this.ws = new WebSocket("ws://test.echisan.cn:8888/watch/" + epid);
      this.ws.onmessage = this.getMessage;
    },
    runws(epid) {
      if (this.ws.readyState === this.ws.OPEN) {
        this.getMessage();
      } else if (this.ws.readyState === this.ws.CONNECTING) {
        let that = this;
        this.webSocketInterval = setInterval(() => {
          that.getMessage();
        }, 300);
      } else {
        //存在期望结果（最匹配的信息）
        this.videoList = videosInfos;
        this.hasInfo = true;
        this.videoInfo = expectVideo;
        setTimeout(() => {
          this.$notify({
            title: "识别成功",
            message: this.bangumiName + " " + this.episodeIndex,
            type: "success"
          });
        }, 800);
        this.initWebsocket(epid);
        let that = this;
        this.webSocketInterval = setInterval(() => {
          that.getMessage();
        }, 500);
      }
    },
    getMessage(e) {
      this.online = e.data;
    },
    resetAllData() {
      console.log("begin reset add data.......");
      this.dp = "";
      this.hasInfo = false;
      this.videoCover = "../../../static/img/1.jpg";
      this.videoURL = "";
      this.videoMd5 = "";
      this.videoSize = 0;
      this.videoInfo = {
        bangumiId: -1,
        bangumiName: "",
        danmakuCount: 0,
        danmakuId: "",
        episodeId: -1,
        episodeIndex: -1,
        replyable: -1,
        thumb: "",
        videoId: -1,
        viewCount: -1
      };
      this.showSubmitMvBox = false;
      this.specificRpid = this.$route.query.rpid;
      this.loading = false;
      this.videoListShow = false;
      this.videoList = [];
      this.mvIndex = 0;
      this.showMatchBox = false;
      this.searchMvKey = "";
      this.searchMvResult = [];
      this.searchMvBoxShow = true;
      this.searchWaitingShow = false;
      this.noSearchMvResult = false;
      this.searchResultChoose = {};
      this.searchResultEpisodeNum = 0;
      this.videoCover = "../../../static/img/1.jpg";
      console.log("end reset add data.......");
    },
    getFileMd5(fileRaw) {
      return new Promise((res, rej) => {
        try {
          new hashMe(fileRaw, msg => {
            res(msg);
          });
        } catch (e) {
          rej(e);
        }
      });
    },
    switchVideo() {
      console.log("弹幕id", this.videoInfo.danmakuId);
      let danmaku = {
        id: this.videoInfo.danmakuId,
        api: "http://test.echisan.cn:8888/dplayer/",
        token: localStorage.getItem("JWT_TOKEN"),
        maximum: 1000,
        user: localStorage.getItem("loginUserName"),
        bottom: "15%",
        unlimited: true
      };
      this.dp.switchVideo({ url: this.videoURL }, danmaku);
    },
    async handleChange(file) {
      this.specificRpid = null;
      this.loading = true;
      this.bugTmp++;
      this.showMatchBox = false;
      this.videoURL = file.url;
      //获取视频的弹幕信息
      //获取md5
      this.videoMd5 = await this.getFileMd5(file.raw);
      //视频大小
      this.videoSize = file.size;
      //获取视频信息
      let resData = (await api.getVideosInfo(this.videoSize, this.videoMd5))
        .data;
      console.log("resData:", resData);
      //视频信息
      let videosInfos = resData.data.videoInfos;
      let expectVideo = resData.data.ev;
      //请求数据成功
      if (resData.code === 0 || resData.msg === "OK") {
        //不存在期望结果（即最匹配的信息）
        if (typeof expectVideo === "undefined") {
          //存在多个结果
          if (videosInfos.length > 1) {
            //等用户选择后才有将hasInfo设为true
            // this.hasInfo = false;
            //用户选择番剧信息列表显示
            this.videoListShow = true;
            //番剧信息列表数据
            this.videoList = videosInfos;
          } else if (videosInfos.length === 1) {
            //只存在一个结果
            this.hasInfo = true;
            this.videoInfo = videosInfos[0];
            //提示识别成功
            setTimeout(() => {
              this.$notify({
                title: "识别成功",
                message:
                  this.videoInfo.bangumiName +
                  " " +
                  this.videoInfo.episodeIndex,
                type: "success"
              });
            }, 800);
          } else {
            //未找到结果
            this.hasInfo = false;
            this.videoInfo = {
              bangumiId: -1,
              bangumiName: "",
              danmakuCount: 0,
              danmakuId: "",
              episodeId: -1,
              episodeIndex: -1,
              replyable: -1,
              thumb: "",
              videoId: -1,
              viewCount: -1
            };
          }
        } else {
          //存在期望结果（最匹配的信息）
          this.videoList = videosInfos;
          this.hasInfo = true;
          this.videoInfo = expectVideo;
          setTimeout(() => {
            this.$notify({
              title: "识别成功",
              message:
                this.videoInfo.bangumiName + " " + this.videoInfo.episodeIndex,
              type: "success"
            });
          }, 800);
        }
      } else {
        //请求失败
        this.showMatchBox = true;
        this.hasInfo = false;
        this.videoInfo = {
          bangumiId: -1,
          bangumiName: "",
          danmakuCount: 0,
          danmakuId: "",
          episodeId: -1,
          episodeIndex: -1,
          replyable: -1,
          thumb: "",
          videoId: -1,
          viewCount: -1
        };
      }
      this.loading = false;
    },
    chooseMv() {
      this.loading = true;
      this.videoListShow = false;
      this.videoInfo = this.videoList[this.mvIndex];
      this.hasInfo = true;
      console.log(this.videoInfo);
      this.loading = false;
      setTimeout(() => {
        this.$notify({
          title: "识别成功",
          message:
            this.videoInfo.bangumiName + " " + this.videoInfo.episodeIndex,
          type: "success"
        });
        api.matchVideoSuccess({ v: this.videoInfo.videoId });
      }, 800);
    },
    noChoose() {
      this.loading = true;
      this.videoListShow = false;
      this.showMatchBox = true;
      this.loading = false;
    },
    chooseResult(index) {
      this.searchResultChoose = this.searchMvResult[index];
      this.searchMvResult = [this.searchResultChoose];
      console.log("选择了", this.searchResultChoose);
      this.searchMvKey = this.searchResultChoose.bangumiName;
      this.searchMvBoxShow = false;
    },
    async confirmMvSearch() {
      console.log(
        "番剧id和集数",
        this.searchResultChoose.bangumiId,
        this.searchResultEpisodeNum
      );
      if (this.searchResultChoose == {} || this.searchResultEpisodeNum == 0) {
        this.$message({
          message: "请填入正确番剧或集数",
          type: "error"
        });
        return;
      }
      this.showMatchBox = false;
      this.loading = true;
      let res = await api.getDanmakujiIdByBangumisIdAndepIndex(
        this.searchResultChoose.bangumiId,
        this.searchResultEpisodeNum
      );
      console.log("手动选择番剧信息", res);
      this.videoInfo = res.data.data;
      this.hasInfo = true;
      this.sendMvInfo();
      //初始化搜索内容
      this.searchMvKey = "";
      this.searchMvResult = [];
      this.noSearchMvResult = false;
      this.searchWaitingShow = false;
      this.searchResultChoose = {};
      this.searchResultEpisodeNum = 0;
      this.loading = false;
      setTimeout(() => {
        this.$notify({
          title: "手动匹配成功",
          message:
            this.videoInfo.bangumiName + " " + this.videoInfo.episodeIndex,
          type: "success"
        });
        api.sendVideoMatchInfo({
          ep_id: this.videoInfo.episodeId,
          v_md5: this.videoMd5,
          v_size: this.videoSize
        });
      }, 800);
    },
    cancelMvSearch() {
      this.showMatchBox = false;
      this.searchMvKey = "";
      this.searchMvResult = [];
      this.noSearchMvResult = false;
      this.searchWaitingShow = false;
      this.searchResultChoose = {};
      this.searchResultEpisodeNum = 0;
      this.loading = false;
    },
    async sendMvInfo() {
      console.log("发送视频信息");
      let res = (await api.sendVideoMatchInfo({
        ep_id: this.videoInfo.episodeId,
        v_md5: this.videoMd5,
        v_size: this.videoSize
      })).data;
      console.log(res);
    },
    async initDp() {
      console.log("init dplayer!!!!");
      console.log("pic:", this.videoCover);
      this.dp = await new VueDPlayer({
        container: document.getElementById("dplayer"),
        autoplay: false,
        video: {
          url: this.videoURL,
          pic: this.videoCover,
          poster: this.videoCover
        },
        danmaku: {
          id: this.videoInfo.danmakuId,
          api: "http://test.echisan.cn:8888/dplayer/",
          token: localStorage.getItem("JWT_TOKEN"),
          maximum: 1000,
          user: localStorage.getItem("loginUserName"),
          bottom: "15%",
          unlimited: true
        }
      });
    },
    closeSubmitMvBox() {
      this.showSubmitMvBox = false;
    },
    reloadMvInfo() {
      this.$message({
        message: "提交成功，审核通过后即可选择您的番剧信息。",
        type: "success"
      });
    },
    async initEpisodeInfo(epid) {
      let rd = (await api.getEpisodeInfoByEpId(epid)).data;
      console.log("根据epid获取视频信息", rd);
      console.log("begin initEpisodeInfo");
      if (rd.code === 0) {
        this.videoInfo = rd.data;
        this.hasInfo = true;
        this.videoURL = rd.data.videoUrl;
        console.log("url!!!!!!!!!!!:", rd.data.videoUrl);
        this.videoCover =
          rd.data.thumb === "" ? "../../../static/img/1.jpg" : rd.data.thumb;
      }
      console.log("end initEpisodeInfo");
    }
  },
  computed: {
    canSendDanmaku() {
      if (!localStorage.getItem("USER_ID")) return true;
      if (!this.videoInfo.danmakuId) return true;
      if (!this.hasInfo) return true;
      return false;
    }
  },
  async mounted() {
    console.log("watchpage mounted!!!!");
    let epid = this.$route.params.epid;
    if (epid) {
      this.initWebsocket(epid);
      this.initEpisodeInfo(epid).then(() => {
        console.log("initEpisode end.......");
        this.initDp();
      });
    } else {
      this.initDp();
    }
  },
  created() {
    console.log("watchPage created!!!");
  },
  beforeDestroy() {
    if (this.ws) this.ws.close();
    clearInterval(this.webSocketInterval);
    this.webSocketInterval = null;
  }
};
</script>
<style>
.displaySet {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 10px;
}
.searchResultBg2 {
  z-index: -1;
  position: relative;
}

.searchResultBgBox {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: -2;
}

.searchResultBgInBox {
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  position: fixed;
  z-index: -1;
  width: 100%;
  height: 100%;
}

.searchResultBgImg {
  height: 100%;
  width: 100%;
  filter: blur(20px) grayscale(30%);
}

.submitMvBoxTran-enter-active,
.submitMvBoxTran-leave-active {
  transition: opacity 0.5s;
}

.submitMvBoxTran-enter, .submitMvBoxTran-leave-to /* .fade-leave-active below version 2.1.8 */
 {
  opacity: 0;
}

.submitMovieBox {
  background: rgba(0, 0, 0, 0.37);
  height: 960px;
  width: 100%;
  position: absolute;
  left: 0;
  top: 60px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.submitMovieInBox {
  margin: auto auto;
}

.watchPageBox {
  display: flex;
  flex-direction: column;
}

.watchPageBoxB {
  overflow: hidden;
  height: 820px;
}

.mvMatchBox-enter-active,
.mvMatchBox-leave-active {
  transition: opacity 0.3s;
}

.mvMatchBox-enter,
.mvMatchBox-leave-active {
  opacity: 0;
}

.matchBox {
  height: 150px;
  width: 500px;
  background: rgba(105, 105, 105, 0.8);
  position: absolute;
  top: 150px;
  left: 200px;
  z-index: 800;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
}

.matchInBox {
  margin: auto auto;
  height: 130px;
  width: 480px;
  display: flex;
  flex-direction: column;
}

.matchInfoBox {
  display: flex;
  flex-direction: row;
  margin: auto auto;
  width: 80%;
  height: 60%;
}

.searchMvKeyBox {
  margin: auto auto;
  width: 170px;
}

.matchInfoBox input {
  background: rgba(255, 255, 255, 0.774);
  margin: auto auto;
  outline: none;
  padding: 5px 5px 5px 5px;
  border-radius: 5px;
  border: 2px solid grey;
  transition: border 0.2s;
}

.searchMvResultBox {
  margin: auto auto;
  background: rgba(255, 255, 255, 0.767);
  position: fixed;
  width: 168px;
  border-radius: 5px;
  z-index: 200;
  border: 1px solid rgb(101, 175, 245);
}

.searchMvResultInBox {
  margin-top: 10px;
  margin-bottom: 10px;
}

.searchMvResultBox p {
  margin: 0 0;
  height: 20px;
  line-height: 20px;
  color: black;
  font-size: 13px;
  transition: all 0.2s;
}

.searchMvResultBox p:hover {
  color: rgb(187, 255, 255);
  background: rgb(79, 191, 255);
}

.matchInfoBox select {
  background: rgba(255, 255, 255, 0.527);
  margin: auto auto;
  width: 30%;
  outline: none;
  padding: 5px 5px 5px 5px;
  border-radius: 5px;
  border: 2px solid grey;
  transition: border 0.2s;
}

.matchInfoBox input:hover,
.matchInfoBox select:hover {
  border: 2px solid rgb(216, 214, 214);
}

.matchInfoBox input:focus,
.matchInfoBox select:focus {
  border: 2px solid rgb(101, 175, 245);
}

.matchBtnBox {
  display: flex;
  flex-direction: row;
  margin: auto auto;
  width: 80%;
}

.matchBtnBox p {
  background: rgb(247, 139, 196);
  float: right;
  height: 25px;
  width: 30%;
  line-height: 25px;
  color: white;
  height: 25px;
  cursor: pointer;
  border-radius: 6px;
  margin: auto auto;
  transition: background 0.2s;
  text-align: center;
}

.mvInfo {
  display: flex;
  flex-direction: row;
  margin-bottom: 0px;
  margin: 5% auto;
  margin-bottom: 0;
  width: 900px;
  height: 40px;
}

.mvTitle {
  width: 80%;
  text-align: left;
  line-height: 30px;
  height: 30px;
  font-size: 22px;
  font-weight: bold;
  color: white;
  margin: auto auto;
}

.mvMatch {
  background: rgb(247, 139, 196);
  float: right;
  height: 30px;
  width: 20%;
  line-height: 30px;
  color: white;
  height: 30px;
  cursor: pointer;
  border-radius: 6px;
  margin: auto auto;
  transition: background 0.2s;
}

.mvMatch:hover,
.matchBtnBox p:hover {
  background: rgb(250, 112, 186);
}

.mvMatch:active,
.matchBtnBox p:active {
  background: rgb(248, 175, 214);
}

.mvOtherInfo {
  display: flex;
  flex-direction: row;
  width: 900px;
  height: 25px;
  margin: auto auto;
  margin-bottom: 5px;
}

.mvOtherInfo div {
  display: flex;
  flex-direction: row;
  margin-top: 0;
  margin-right: 10px;
}

.mvOtherInfo img {
  height: 20px;
  width: 20px;
  margin: auto auto;
}

.mvOtherInfo p {
  margin: auto auto;
  color: rgb(141, 141, 141);
  font-size: 13px;
  padding-left: 3px;
}

.noMvInfo {
  margin: 150px auto;
}

.videoBox {
  width: 900px;
  height: 450px;
  margin: auto auto;
}

.videoSize {
  height: 506px;
  width: 900px;
}

/*拖动框大小*/
.el-upload-dragger {
  width: 900px;
  height: 574px;
  background: rgba(255, 255, 255, 0.315);
  border: 0px;
  margin-top: 0px;
  text-align: left;
}

.uploadTips {
  font-size: 13px;
  line-height: 30px;
  font-weight: bold;
  color: wheat;
  height: 30px;
  text-align: center;
}

.mvBarrageBox {
  background: rgba(0, 0, 0, 0.356);
  height: 38px;
  width: 900px;
  cursor: default;
  display: flex;
  flex-direction: row;
}

.mvBarrageBox input {
  outline: none;
  margin: auto 0;
  height: 100%;
  width: 65%;
  padding-left: 10px;
  padding-right: 10px;
  background: inherit;
  border: 0;
  color: white;
}

.choose-dan-pos {
  width: 38px;
  height: 100%;
  text-align: center;
  color: white;
  margin: 0 0px;
}

.dm-color-wrapper {
  height: 100%;
  width: 38px;
}

.el-color-picker--mini {
  margin: 5px;
}

.dan-icon {
  font-size: 25px;
  margin: 7px auto;
}

.dm-pos-choose-wrapper {
  background: inherit;
  text-align: center;
}

.dm-pos-setting-title {
  height: 30px;
  font-weight: bold;
}

.mvBarrageBoxBtn {
  background: palevioletred;
  color: white;
  margin: auto 0;
  width: 55px;
  height: 100%;
  line-height: 38px;
  border-radius: 3px;
  cursor: pointer;
  z-index: 1000;
  transition: background 0.2s;
}

.onlineNumBox {
  width: 10%;
  margin: auto auto;
}

.onlineNumBox p {
  margin: auto auto;
  color: wheat;
  font-size: 15px;
  line-height: 100%;
  text-align: center;
  font-weight: bold;
}

.mvBarrageBoxBtn:hover {
  background: rgb(209, 94, 132);
}

.mvBarrageBoxBtn:active {
  background: rgb(209, 128, 155);
}

.commentList {
  margin-top: 150px;
}

.chooseMvBoxTrans-enter-active,
.chooseMvBoxTrans-leave-active {
  transition: opacity 0.3s;
}

.chooseMvBoxTrans-enter,
.chooseMvBoxTrans-leave-active {
  opacity: 0;
}

.chooseMvBox {
  background: rgb(0, 0, 51);
  position: absolute;
  z-index: 300;
  height: 200px;
  width: 400px;
  border-radius: 10px;
  border: 1px solid rgba(89, 147, 255, 0.692);
  top: 150px;
  left: 250px;
  text-align: center;
}

.choosMvTitle {
  background: rgb(0, 69, 97);
  margin-top: 0px;
  line-height: 40px;
  height: 40px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  color: rgb(103, 220, 255);
  font-weight: bold;
  font-size: 20px;
}

.chooseMv {
  outline: none;
  height: 30px;
  border-radius: 5px;
  /*select文字居中*/
  text-align: center;
  text-align-last: center;
}

.chooseMvBtnBox {
  display: flex;
  flex-direction: row;
  margin: 30px auto;
  width: 90%;
}

.chooseMvBtnBox div {
  margin: auto auto;
  height: 45px;
  width: 100px;
  line-height: 45px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  border: 1px solid rgb(203, 203, 255);
  transition: all 0.2s;
}

.confrimMvBtn {
  background: green;
}

.confrimMvBtn:hover {
  background: rgb(0, 146, 0);
  border: 1px solid rgb(154, 154, 253);
}

.confrimMvBtn:active {
  background: green;
  border: 1px solid rgb(203, 203, 255);
}

.noChooseBtn {
  background: gray;
}

.noChooseBtn:hover {
  background: rgb(151, 151, 151);
  border: 1px solid rgb(154, 154, 253);
}

.noChooseBtn:active {
  background: gray;
  border: 1px solid rgb(203, 203, 255);
}

.wattingBox {
  background: white;
  position: absolute;
  z-index: 300;
  width: 150px;
  height: 100px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  top: 200px;
  left: 50%;
  transform: translate(-50%, 20%);
}

.wattingBox img {
  margin: auto auto;
  margin-bottom: 0;
}

.wattingBox p {
  margin: auto auto;
  font-weight: bold;
}

.dplayer-danmaku .dplayer-danmaku-item {
  -webkit-user-select: none;
  position: absolute;
  white-space: pre;
  pointer-events: none;
  perspective: 500px;
  display: inline-block;
  will-change: transform;
  color: rgb(255, 255, 255);
  font-family: SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif;
  font-weight: bold;
  line-height: 1.125;
  opacity: 1;
}
</style>
