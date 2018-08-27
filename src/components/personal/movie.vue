<template>
    <div class="movieBox">
        <div class="wattingBox" v-if="loading">
          <img src='data:image/gif;base64,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'>
          <p>加载数据中...</p>
        </div>
        <div class="subBox">
            <p class="subTitle">全部提交</p>
            <p class="subNum">({{totalSize}})</p>
            <div class="subSelectBox">
                <select class="subSelect" @change="updateListByStatus($event)">
                    <option value=0>全部</option>
                    <option value=1>待处理</option>
                    <option value=2>已采纳</option>
                    <option value=3>待完善</option>
                    <option value=4>未被采纳</option>
                    <option value="5">待审核</option>
                </select>
            </div>
        </div>
        <div class="sortBox">
            <p class="sortTitle" @click="submitMv">提交番剧信息</p>
            <transition name="submitMvBoxTran">
                <div class="submitMovieBox" v-if="showSubmitMvBox">
                    <submit-movie
                        :show="showSubmitMvBox"
                        :pb="pb"
                        @closeBox="closeSubmitMvBox"
                        @updateMvList="reloadMvList"
                        class="submitMovieInBox"></submit-movie>
                </div>
            </transition>
            <div class="sortSelectBox">
                <select class="sortSelect" @change="updateListByTime($event)">
                    <option value="0">创建时间</option>
                    <option value="1">修改时间</option>
                </select>
                <div class="searchMvBox">
                    <input placeholder="请输入番剧名称" class="searchMv" v-model="searchMvKey">
                </div>
            </div>
        </div>
        <div class="mvList">
            <darker-scroll
                :item-count=pageSize
                :item-height=120
                :item-spacing=15
                :scroll-hight=540
                :scroll-width=850
                @nextPage="nextPage"
                class="scroll">
                <div v-for="(item,index) in postBangumiList" class="movieItem" :key="item.id">
                    <img :src="item.thumb?item.thumb:'../../../static/img/1.jpg'" class="mvImg">
                    <div class="mvInfoBox">
                        <p class="mvTitle">{{item.bn}} | 共{{item.et}}集</p>
                        <p class="mvMsg" v-if="item.msg!=''">修改提示: {{item.msg}}</p>
                        <p class="mvTime">创建时间: {{new Date(item.create_time).toLocaleString()}}</p>
                        <p class="mvTime2">修改时间: {{new Date(item.modify_time).toLocaleString()}}</p>
                    </div>
                    <div class="mvOtherBox">
                        <div class="mvStateBox">
                            <p class="mvStateTitle">状态</p>
                            <p class="mvState" :style="stateStyle[item.pbs]">{{item.pbs_name}}</p>
                        </div>
                        <div class="mvToolBox" @mouseover="toolDisplay(index,0)" @mouseout="toolDisplay(index,1)">
                            <p class="mvToolTitle">操作<img src="../../../static/img/down.png"></p>
                            <transition name="mvTool">
                                <div v-if="index==showToolIndex" :class="[{'twoSelectMenu':(item.pbs !== 'SUCCESS' && item.pbs !== 'AUDITING')},{'lastItemMenu':(index==totalSize-1&&index!=0)},'mvToolSelect']">
                                    <div>
                                        <p class="normalBtn" v-if="item.pbs === 'SUCCESS' || item.pbs === 'AUDITING'">设置可见</p>
                                        <p class="normalBtn" @click="updateBangumiCover(item.id,index)" v-if="item.pbs === 'SUCCESS' || item.pbs === 'AUDITING'">修改封面</p>
                                        <p class="normalBtn" @click="updatePostBangumi(item)" v-if="item.pbs !== 'SUCCESS' && item.pbs !== 'AUDITING'">修改</p>
                                        <p class="warnBtn" @click="deletePostBangumi(item.id)">删除</p>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </darker-scroll>
        </div>
        <my-upload field="image"
          @crop-success="cropSuccess"
          @crop-upload-success="cropUploadSuccess"
          @crop-upload-fail="cropUploadFail"
          v-model="updateBangumiCoverShow"
          :width="620"
          :height="350"
          :noCircle="true"
          :url="uploadURL"
          :headers="uploadHEADERS"
          :langExt="langExtObj"
          img-format="jpg"
      ></my-upload>
    </div>
</template>

<script>
import darkerScroll from "../darkerStyleComponents/darkerScroll.vue";
import submitMovie from "../submitMovie/submitMovie.vue";
import myUpload from "vue-image-crop-upload";
import api from "../../api.js";
export default {
  components: {
    darkerScroll,
    submitMovie,
    myUpload
  },
  data() {
    return {
      loading: false,
      mvToolShow: [false, false, false, false, false, false, false],
      showToolIndex: -1,
      showSubmitMvBox: false,
      postBangumiList: [],
      pageSize: 0,
      pageNum: 1,
      totalSize: 0,
      stateStyle: {
        PENDING: {
          background: "#a77427"
        },
        SUCCESS: {
          background: "#367b13"
        },
        NEED_PERFECT: {
          background: "#3580ce"
        },
        FAILED: {
          background: "#9e0c0c"
        },
        AUDITING: {
          background: "#f56c6c"
        }
      },
      pbParams: {
        pn: 1,
        ps: 10,
        sc: "",
        pbsc: "",
        pc: "",
        dc: "",
        bn: ""
      },
      searchMvKey: "",
      pb: null,
      updateBangumiCoverShow: false,
      uploadURL: "https://api.imgur.com/3/image",
      imgURL: "https://i.imgur.com",
      uploadHEADERS: {
        Authorization: "Client-ID 3855bbe9883a511"
      },
      langExtObj: {
        preview: "封面预览"
      }
    };
  },
  watch: {
    async searchMvKey() {
      this.loading = true;
      console.log("查找", this.searchMvKey);
      this.pbParams = {
        pn: 1,
        ps: 10,
        sc: "",
        pbsc: "",
        pc: "",
        dc: "",
        bn: this.searchMvKey
      };
      this.initMvList();
    }
  },
  methods: {
    async initMvList() {
      let rd = (await api.getUserPostBangumi(this.pbParams)).data;
      console.log("初始化番剧列表", rd);
      if (rd.code === 0) {
        this.pageNum = 1;
        this.postBangumiList = rd.data.postBangumi;
        this.totalSize = rd.data.page.totalSize;
        //不满或刚好一页
        if (rd.data.page.totalSize <= 10) this.pageSize = this.totalSize;
        else this.pageSize = 10;
      } else {
        console.log("请求列表失败");
      }
      this.loading = false;
      this.pb = null;
    },
    async nextPage() {
      if (Math.ceil(this.totalSize / 10) == this.pageNum) return;
      this.loading = true;
      this.pbParams.pn++;
      this.pageNum++;
      let rd = (await api.getUserPostBangumi(this.pbParams)).data;
      console.log("下一页", rd);
      if (rd.code === 0) {
        this.postBangumiList = this.postBangumiList.concat(rd.data.postBangumi);
        this.pageSize += rd.data.postBangumi.length;
      } else {
        console.log("请求下一页失败");
      }
      this.loading = false;
    },
    updateListByStatus(e) {
      this.loading = true;
      console.log("状态排序", e.target.selectedIndex);
      let pbsc = e.target.selectedIndex;
      if (pbsc == 0) pbsc = "";
      this.pbParams = {
        pn: 1,
        ps: 10,
        sc: "",
        pbsc: pbsc,
        pc: "",
        dc: "",
        bn: ""
      };
      this.initMvList();
    },
    updateListByTime(e) {
      this.loading = true;
      console.log("时间排序", e.target.selectedIndex);
      this.pbParams = {
        pn: 1,
        ps: 10,
        sc: "",
        pbsc: "",
        pc: e.target.selectedIndex,
        dc: "",
        bn: ""
      };
      this.initMvList();
    },
    reloadMvList() {
      this.loading = true;
      this.pbParams = {
        pn: 1,
        ps: 10,
        sc: "",
        pbsc: "",
        pc: "",
        dc: "",
        bn: ""
      };
      this.initMvList();
    },
    toolDisplay: function(index, flag) {
      if (flag == 0) this.mvToolShow[index] = true;
      else this.mvToolShow[index] = false;
      if (this.mvToolShow[index]) this.showToolIndex = index;
      else this.showToolIndex = -1;
    },
    updateBangumiCover(id, index) {
      console.log(index);
      this.pb = {
        id: id,
        index: index
      };
      this.updateBangumiCoverShow = true;
      console.log(this.pb);
    },
    async cropUploadSuccess(res, field) {
      console.log("-------- upload success --------");
      console.log(res);
      let link = res.data.link;
      link = link.substring(link.lastIndexOf("/"));
      console.log("link:", link);
      let coverUrl = this.imgURL + link;
      console.log("field: " + field);
      let rd = (await api.updatePostBangumiThumb({
        id: this.pb.id,
        thumb: coverUrl
      })).data;
      if (rd.code === 0) {
        setTimeout(() => (this.show = false), 100);
        this.$alert("修改封面需要审核，结果请留意系统通知", "封面提交成功", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      } else {
        this.$message.error(rd.msg);
      }
      this.postBangumiList[this.pb.index].thumb = coverUrl;
      this.pb = null;
      console.log(this.pb);
    },
    cropSuccess(imgDataUrl, field) {
      console.log("-------- crop success --------");
    },
    cropUploadFail(status, field) {
      console.log("-------- upload fail --------");
      console.log(status);
      console.log("field: " + field);
    },
    submitMv() {
      this.showSubmitMvBox = !this.showSubmitMvBox;
    },
    closeSubmitMvBox() {
      this.showSubmitMvBox = false;
      this.pb = null;
    },
    async updatePostBangumi(item) {
      this.pb = {
        id: item.id,
        bn: item.bn,
        et: item.et,
        hzi: item.hzi,
        thumb: item.thumb
      };
      this.showSubmitMvBox = true;
    },
    async deletePostBangumi(id) {
      this.$confirm(
        "注意! 一旦删除将无法恢复, 本操作仅会删除个人记录, 已采纳的番剧信息将会保留",
        "确认删除",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          let rd = (await api.deletePostBangumi(id)).data;
          console.log("res:", rd);
          if (rd.code === 0) {
            this.isDelete = true;
            this.$message.success("删除成功");
            this.reloadMvList();
          } else {
            this.$message.error(rd.msg);
          }
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.loading = true;
    this.initMvList();
  }
};
</script>

<style>
.twoSelectMenu {
  height: 90px !important;
}
.lastItemMenu {
  margin-top: -165px !important;
}
.submitMvBoxTran-enter-active,
.submitMvBoxTran-leave-active {
  transition: opacity 0.5s;
}
.submitMvBoxTran-enter, .submitMvBoxTran-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.movieBox {
  display: flex;
  flex-direction: column;
}
.subBox {
  display: flex;
  flex-direction: row;
  margin: 20px auto;
  width: 90%;
}
.subTitle {
  color: white;
  font-size: 15px;
  margin-left: 0;
  line-height: 15px;
  font-weight: bold;
}
.subNum {
  color: white;
  font-size: 10px;
  margin: 20px 3px;
  font-weight: bold;
}
.subSelectBox {
  margin: auto;
  margin-right: 0;
}
.subSelect {
  width: 100px !important;
}
.sortBox {
  display: flex;
  flex-direction: row;
}
.sortTitle {
  height: 25px;
  width: 20%;
  line-height: 25px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 13px;
  background: #795548;
  transition: all 0.1s;
  margin: 25px 30px;
  cursor: pointer;
  color: white;
}
.sortTitle:hover {
  background: #966959;
}
.sortTitle:active {
  background: #775346;
  /*border: 1px solid #4c352d;*/
}
.sortSelectBox {
  display: flex;
  flex-direction: row;
  width: 50%;
  margin-left: 20%;
}
.sortSelect {
  margin: auto;
  width: 160px;
}
.searchMvBox {
  width: 40%;
  height: 30px;
  margin: auto 30px;
}
.searchMv {
  width: 100%;
}
.mvList {
  display: flex;
  flex-direction: column;
}
.scroll {
  margin: auto 18px;
}
input {
  height: 22px;
  width: 60%;
  border-radius: 4px;
  border: 1px solid gray;
  padding-left: 10px;
  padding-right: 10px;
  transition: all 0.2s;
  margin: auto 0;
}
input:hover {
  border: 1px solid white;
  box-shadow: 0 0 1px white;
}
input:focus {
  border: 1px solid rgb(100, 149, 237);
  box-shadow: 0 0 1px rgb(100, 149, 237);
}
.movieItem {
  background: rgba(0, 0, 0, 0.253);
  height: 120px;
  width: 94%;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  border-radius: 10px;
}
.mvImg {
  height: 100%;
  width: 30%;
  margin-left: 0;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.mvInfoBox {
  width: 54%;
  display: flex;
  flex-direction: column;
}
.mvTitle {
  font-weight: bold;
  color: white;
  font-size: 18px !important;
  width: 100% !important;
  text-align: left !important;
  margin: 10px 15px !important;
}
.mvMsg {
  margin-top: 5px;
  margin-bottom: -10px;
  margin-left: 5px;
  font-size: 14px;
  height: 40px;
  width: 100%;
  color: wheat;
  text-align: center;
  word-break: break-all;
  word-wrap: break-word;
}
.mvTime {
  margin-top: 20px;
  font-size: 13px;
  color: #dad7d7;
  text-align: left;
  margin-left: 15px;
}
.mvTime2 {
  margin-top: -10px;
  font-size: 13px;
  color: #dad7d7;
  text-align: left;
  margin-left: 15px;
}
.mvOtherBox {
  width: 15%;
}
.mvStateBox {
  display: flex;
  flex-direction: row;
}
.mvStateTitle {
  font-size: 15px;
  line-height: 20px;
  height: 20px;
  margin: auto auto;
  color: white;
}
.mvState {
  color: white;
  font-size: 12px;
  height: 20px;
  margin-right: 5px;
  border-radius: 5px;
  line-height: 20px;
}
.mvToolBox {
  margin-top: 40px;
}
.mvToolTitle {
  color: white;
  font-size: 13px;
}
.mvToolTitle img {
  width: 12px;
  height: 12px;
  margin: auto 2px;
}
.mvToolSelect {
  background: white;
  position: absolute;
  margin-top: -15px;
  right: 55px;
  overflow: hidden;
  width: 80px;
  border-radius: 8px;
  font-size: 13px;
  display: flex;
  flex-direction: column;
}
.mvTool-leave-active,
.mvTool-enter-active {
  transition: all 0.2s ease;
}
.mvTool-leave-active,
.mvTool-enter {
  height: 0px !important;
  /*!important 将该样式优先级调至最高*/
  opacity: 0;
}
.mvTool-leave,
.mvTool-enter-active {
  height: 100px;
}
.normalBtn {
  background: skyblue;
  height: 25px;
  line-height: 25px;
  width: 90%;
  margin: 14px auto;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
}
.normalBtn:hover {
  background: rgb(145, 223, 253);
}
.normalBtn:active {
  background: rgb(28, 188, 252);
}
.warnBtn {
  background: rgb(255, 65, 65);
  height: 25px;
  line-height: 25px;
  width: 90%;
  margin: 14px auto;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
}
.warnBtn:hover {
  background: rgb(255, 117, 117);
}
.warnBtn:active {
  background: red;
}
.submitMovieBox {
  background: rgba(0, 0, 0, 0.37);
  height: 814px;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0px;
  z-index: 300;
  display: flex;
  flex-direction: column;
}
.submitMovieInBox {
  margin: auto auto;
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
  margin: 250px 275px;
}
.wattingBox img {
  margin: auto auto;
  margin-bottom: 0;
}
.wattingBox p {
  margin: auto auto;
  font-weight: bold;
}
</style>
