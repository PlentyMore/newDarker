<template>
    <div class="submitMvBox">
        <div class="submitMvTitleBox">
            <div class="submitMvTitleText"><p>修改番剧信息</p></div>
            <div class="closeBtn" @click="closeBox"><p>×</p></div>
        </div>
        <div class="submitMvInBox">
            <div class="submitRules">
                <span><strong>* 番剧名称定义需要按照以下规则</strong></span><br>
                <span>- 番剧名称以百度百科为准</span><br>
                <span>- 第一个季度直接采取该名称,例如「darker」</span><br>
                <span>- 多个季度,则以「番剧名称+空格+第几季」命名,例如「darker 第二季」</span><br>
                <span>- sp,ova,剧场版规则与以上规则一致,例如「darker ova」</span><br>
                <span>- 当然也不仅限于番剧,电影也是一样可以的</span>
            </div>
            <div class="mvTitleInputBox">
                <div class="mvTitleInputInBox">
                    <p>番剧名称</p>
                    <input v-model="bangumiName">
                </div>
            </div>
            <div class="zeroEpisodeBox">
                <div class="zeroEpisodeInBox">
                    <p>是否有第0集</p>
                    <div class="zeroEpChoiceBox">
                        <p @click="zeroEp=true" :class="[zeroEp?'zeroEpSelected':'']">有</p>
                        <p @click="zeroEp=false" :class="[zeroEp?'':'zeroEpSelected']">没有</p>
                    </div>
                </div>
                <p class="zeroEpBoxRule">* 若剧场版或电影则集数为「1」</p>
            </div>
            <div class="totalEpisodeBox">
                <div class="totalEpisodeInBox">
                    <p>总集数</p>
                    <input v-model="episodeTotal">
                </div>
            </div>
            <div class="coverUploadBox">
                <div class="coverUploadInBox">
                    <p class="coverUploadTitle">封面</p>
                    <p class="coverUploadBtn" @click="showUploadCover=true">上传封面</p>
                </div>
                <p class="coverPreviewText" v-if="coverUrl==''">封面预览</p>
                <img :src="coverUrl" class="coverPreview">
            </div>
            <div class="footerRule">
                <p>* 若本次提交被收录后封面仍可修改 *</p>
            </div>
        </div>
        <div class="submitMvBtnBox">
            <div class="submitMvBtnInBox">
                <p class="mvSubmitCancel" @click="closeBox">取消</p>
                <p class="mvSubmitConfirm" @click="submitNewMv">确定</p>
            </div>
        </div>
        <my-upload field="image"
            @crop-success="cropSuccess"
            @crop-upload-success="cropUploadSuccess"
            @crop-upload-fail="cropUploadFail"
            v-model="showUploadCover"
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
import api from "../../api.js";
import myUpload from "vue-image-crop-upload";
export default {
  props: ["show", "pb"],
  components: {
    myUpload
  },
  data() {
    return {
      bangumiName: "",
      episodeTotal: 0,
      zeroEp: false,
      showUploadCover: false,
      uploadURL: "https://api.imgur.com/3/image",
      imgURL: "https://i.imgur.com",
      uploadHEADERS: {
        Authorization: "Client-ID 3855bbe9883a511"
      },
      coverUrl: "",
      langExtObj: {
        preview: "封面预览"
      }
    };
  },
  methods: {
    async submitNewMv() {
      let rd = this.pb
        ? (await api.updatePostBangumi({
            id: this.pb.id,
            bn: this.bangumiName,
            et: this.episodeTotal,
            hzi: this.zeroEp ? 1 : 0,
            thumb: this.coverUrl
          })).data
        : (await api.sendPostBangumi({
            bangumiName: this.bangumiName,
            episodeTotal: this.episodeTotal,
            hasZeroIndex: this.zeroEp ? 1 : 0,
            thumb: this.coverUrl
          })).data;
      console.log("提交番剧成功", rd);
      if (rd.code === 0) {
        this.$alert(rd.msg, "提交成功", {
          confirmButtonText: "确定",
          callback: action => {
            this.bangumiName = "";
            this.episodeTotal = 0;
            this.zeroEp = false;
            setTimeout(() => {
              this.closeBox();
              this.$emit("updateMvList");
            }, 400);
          }
        });
        // 如果该番剧已经存在了
      } else if (rd.code === 5003) {
        this.$alert(rd.msg, "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.bangumiName = "";
            this.episodeTotal = 0;
            this.zeroEp = false;
          }
        });
      } else {
        this.$alert(rd.msg, "参数有误", {
          confirmButtonText: "确定",
          callback: action => {
            console.log(action);
          }
        });
      }
    },
    closeBox() {
      this.$emit("closeBox");
    },
    cropUploadSuccess(res, field) {
      console.log("-------- upload success --------");
      console.log(res);
      let link = res.data.link;
      link = link.substring(link.lastIndexOf("/"));
      console.log("link:", link);
      this.coverUrl = this.imgURL + link;
      console.log("field: " + field);
      // console.log('curImageUrl:', this.curImageUrl);
    },
    cropSuccess(imgDataUrl, field) {
      console.log("-------- crop success --------");
    },
    cropUploadFail(status, field) {
      console.log("-------- upload fail --------");
      console.log(status);
      console.log("field: " + field);
    }
  },
  mounted() {
    if (this.pb) {
      console.log("pb有东西了", this.pb);
      this.bangumiName = this.pb.bn;
      this.episodeTotal = this.pb.et;
      this.zeroEp = this.pb.hzi == 1;
      this.coverUrl = this.pb.thumb;
    }
  }
};
</script>

<style>
.submitMvBox {
  background: #252e53;
  z-index: 300;
  display: flex;
  flex-direction: column;
  width: 500px;
  border-radius: 5px;
}
.submitMvTitleBox {
  background: #424450;
  margin-top: 0;
  height: 40px;
  width: 500px;
  display: flex;
  flex-direction: row;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.submitMvTitleText {
  margin: auto auto;
  width: 150px;
  color: wheat;
  font-weight: bold;
  font-size: 18px;
}
.submitMvTitleText p {
  line-height: 40px;
  margin: auto auto;
}
.closeBtn {
  position: absolute;
  color: white;
  margin: 0 470px;
  width: 30px;
  height: 40px;
  cursor: pointer;
}
.closeBtn p {
  line-height: 40px;
  margin: auto auto;
  font-size: 20px;
}
.submitMvInBox {
  display: flex;
  flex-direction: column;
  background-color: #30313a;
}
.submitRules {
  display: flex;
  flex-direction: column;
  margin: 40px auto;
  width: 96%;
}
.submitRules span {
  margin-bottom: -16px;
  text-align: left;
  font-size: 13px;
  color: grey;
}
.mvTitleInputBox {
  margin-top: -10px;
}
.mvTitleInputInBox {
  display: flex;
  flex-direction: row;
  width: 96%;
  margin: auto auto;
}
.mvTitleInputInBox p {
  font-size: 15px;
  color: white;
  width: 100px;
}
.mvTitleInputInBox input {
  margin: auto 10px;
  height: 15px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 3px;
  outline: none;
  border: 1px solid white;
  transition: all .2s;
}
.mvTitleInputInBox input:hover{
  border: 1px solid grey;
}
.mvTitleInputInBox input:focus{
  border: 1px solid black;
}
.zeroEpisodeBox {
  display: flex;
  flex-direction: column;
  width: 96%;
  margin: auto auto;
}
.zeroEpisodeInBox {
  display: flex;
  flex-direction: row;
  height: 40px;
}
.zeroEpisodeInBox p {
  font-size: 15px;
  color: white;
  line-height: 40px;
  margin-top: auto;
  width: 100px;
}
.zeroEpChoiceBox {
  display: flex;
  flex-direction: row;
  margin: auto 10px;
}
.zeroEpChoiceBox p {
  margin: auto 10px;
  border: 1px solid grey;
  border-radius: 5px;
  width: 40px;
  height: 20px;
  line-height: 20px;
  color: grey;
  transition: 0.2s all;
  cursor: pointer;
}
.zeroEpChoiceBox p:hover {
  border: 1px solid rgb(93, 93, 252);
  color: rgb(93, 93, 252);
}
.zeroEpSelected {
  border: 1px solid rgb(93, 93, 252) !important;
  color: rgb(93, 93, 252) !important;
}
.zeroEpBoxRule {
  margin: 0px 0px;
  text-align: left;
  color: grey;
  font-size: 12px;
}
.totalEpisodeBox {
  margin-top: 20px;
}
.totalEpisodeInBox {
  display: flex;
  flex-direction: row;
  width: 96%;
  margin: auto auto;
}
.totalEpisodeInBox p {
  width: 100px;
  margin: auto 0;
  color: white;
  font-size: 15px;
  line-height: 15px;
}
.totalEpisodeInBox input {
  margin: auto 10px;
  height: 15px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 3px;
  outline: none;
  border: 1px solid white;
  transition: all .2s;
}
.totalEpisodeInBox input:hover{
  border: 1px solid grey;
}
.totalEpisodeInBox input:focus{
  border: 1px solid black;
}
.coverUploadBox {
  margin-top: 20px;
}
.coverUploadInBox {
  display: flex;
  flex-direction: row;
  width: 96%;
  margin: auto auto;
}
.coverUploadTitle {
  width: 100px;
  height: 30px;
  color: white;
  font-size: 15px;
  line-height: 30px;
  margin-top: auto;
}
.coverUploadBtn {
  background: rgb(88, 191, 231);
  height: 25px;
  width: 100px;
  line-height: 25px;
  font-size: 13px;
  margin: 0 10px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: 0.2s background;
}
.coverUploadBtn:hover {
  background: rgb(124, 194, 221);
}
.coverUploadBtn:active {
  background: rgb(55, 178, 226);
}
.coverPreviewText {
  position: absolute;
  color: grey;
  font-size: 25px;
  margin: 0px auto;
  width: 500px;
  height: 240px;
  line-height: 240px;
}
.coverPreview {
  background: rgba(255, 255, 255, 0);
  height: 260px;
  width: 480px;
  margin: -10px auto;
  /*border: 1px solid wheat;*/
  border-radius: 5px;
}
.footerRule {
  margin-top: 5px;
  color: grey;
}
.footerRule p {
  font-size: 12px;
  color: grey;
}
.submitMvBtnBox {
  background: #424450;
  width: 500px;
  height: 50px;
  display: flex;
  flex-direction: row;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.submitMvBtnInBox {
  display: flex;
  flex-direction: row;
  margin-left: 340px;
  width: 160px;
}
.mvSubmitCancel {
  background: white;
  border: 1px solid white;
  width: 58px;
  height: 28px;
}
.mvSubmitCancel:hover {
  border: 1px solid rgb(0, 177, 247);
  color: rgb(0, 177, 247);
}
.mvSubmitCancel:active {
  border: 1px solid rgb(0, 153, 255);
  color: rgb(0, 153, 255);
}
.mvSubmitConfirm {
  background: rgb(88, 191, 231);
  color: white;
  width: 60px;
  height: 30px;
}
.mvSubmitConfirm:hover {
  background: rgb(124, 194, 221);
}
.mvSubmitConfirm:active {
  background: rgb(55, 178, 226);
}
.mvSubmitConfirm,
.mvSubmitCancel {
  border-radius: 5px;
  margin: auto auto;
  line-height: 30px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s all;
}
</style>
