<template>
  <div class="replyBox" :style="mode>0?'width:820px;':''">
    <div class="replyInfoBox">
      <img :src="avatar!=''?avatar:'../../../static/img/noAvatar.jpg'">
      <div class="replyLoginTip" v-if="!isLogin">
        <div class="replyLoginTipInBox">
          <p class="loginTipText loginTipText1">请先 </p>
          <p class="replyLoginBtn" @click="loginBoxShow=true">登陆</p>
          <p class="loginTipText">后发表评论 (・ω・)</p>
        </div>
      </div>
      <textarea :placeholder="placeholder" v-model="content" :disabled='!isLogin'  :style="mode>0?'width:630px;':''"></textarea>
      <div @click="submitReply" class="replyBtn" :style="isLogin?'':'background:grey'"><p>{{sendBtnText}}</p></div>
    </div>
    <el-popover
      v-model="show_emoji_box"
      width="400"
      placement="bottom-start"
      trigger="click">
      <div>
          <emoji-box v-on:selectedEmoji="selectedEmoji"></emoji-box>
      </div>
      <div ref="mybox" slot="reference" tabindex="1" class="emojiBox">
          <p class="emojiTitle">☺表情</p>
      </div>
    </el-popover>
    <transition name="loginNowBoxTran">
      <login-box class="loginNowBox" v-if="loginBoxShow" @closeLoginBox="loginBoxShow=false"></login-box>
    </transition>
  </div>
</template>

<script>
import api from "../../api.js";
import emojiBox from "./EmojiBox.vue";
import loginBox from "../login/login.vue";
export default {
  name: "PostReply",
  props: ["oid", "type", "mode", "parentRpid", "replyInfo", "top"],
  components: {
    emojiBox,
    loginBox
  },
  data() {
    return {
      avatar: localStorage.getItem("face") ? localStorage.getItem("face") : "",
      isLogin: localStorage.getItem("USER_ID") ? true : false,
      content: "",
      sendBtnText: "发表评论",
      sendingFlag: false,
      show_emoji_box: false,
      loginBoxShow: false
    };
  },
  computed: {
    placeholder() {
      if (this.replyInfo) {
        return "回复 @" + this.replyInfo.user.nick;
      } else {
        return "请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。";
      }
    }
  },
  watch: {
    replyInfo() {
      console.log("clean content");
      if (this.mode === 1) {
        this.content = "";
      }
    }
  },
  methods: {
    async submitReply() {
      if (!this.isLogin) {
        this.$message({
          message: "请先登录。",
          type: "error"
        });
        return;
      }
      if (this.content == "") {
        this.$message({
          message: "不可以发送空评论哦！",
          type: "error"
        });
        return;
      }
      if (!this.sendingFlag) {
        this.sendBtnText = "发表中...";
        this.sendingFlag = true;
      } else {
        return;
      }
      let postRes;
      //发送父级评论
      if (this.mode === 0) {
        postRes = await api.postVideoReply({
          oid: this.oid,
          type: this.type,
          content: this.content
        });
        console.log("回复结果", postRes);
        let rd = postRes.data;
        if (rd.code === 0) {
          this.$emit("onAddRootReply", rd.data.rpid);
          this.content = "";
          this.sendingFlag = false;
          this.sendBtnText = "发表评论";
          this.$message({
            message: "发送评论成功",
            type: "error"
          });
        } else {
          this.sendingFlag = false;
          this.sendBtnText = "发表评论";
          console.log("发送评论失败");
          this.$message({
            message: "发送评论失败: " + rd.msg,
            type: "error"
          });
        }
        //不可直接修改props数据，会出错
        //（调用父组件的refresh函数时，会更改父组件data，同时会重新渲染父组件，然后父组件会重新传值到props，导致冲突）
      } else {
        //发送子级评论
        let tmp = {
          oid: this.oid,
          type: this.type,
          content: this.placeholder + "：" + this.content,
          root: this.replyInfo.rpid,
          parent: this.parentRpid
        };
        console.log("send subReply:", tmp);
        postRes = await api.postVideoReply({
          oid: this.oid,
          type: this.type,
          content: this.placeholder + "：" + this.content,
          root: this.parentRpid,
          tuid: this.replyInfo.user.uid
        });
        console.log("回复结果", postRes);
        let rd = postRes.data;
        if (rd.code === 0) {
          if (this.top) {
            console.log("emit onAddTopSubReply");
            this.$emit("onAddTopSubReply", rd.data.rpid);
          } else {
            this.$emit("onAddSubReply", rd.data.rpid);
          }
          this.content = "";
          this.sendingFlag = false;
          this.sendBtnText = "发表评论";
          this.$message({
            message: "发送评论成功",
            type: "error"
          });
        } else {
          this.sendingFlag = false;
          this.sendBtnText = "发表评论";
          console.log("发送子评论失败");
          this.$message({
            message: "发送评论失败: " + rd.msg,
            type: "error"
          });
        }
      }
      this.sendBtnText = "发表评论";
      this.sendingFlag = false;
    },
    selectedEmoji(emoji) {
      this.show_emoji_box = false;
      if (!this.isLogin) {
        this.$message({
          message: "请先登录。",
          type: "error"
        });
        return;
      }
      this.content = this.content + emoji;
    }
  }
};
</script>

<style scoped>
.emojiBox {
  position: absolute;
  z-index: 40;
}
.replyBox {
  width: 900px;
  margin: auto auto;
}
.replyInfoBox {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  position: relative;
}
.replyInfoBox img {
  height: 50px;
  width: 50px;
  border-radius: 30px;
  margin: auto auto;
}
.replyInfoBox textarea {
  height: 50px;
  width: 700px;
  margin: auto auto;
  resize: none;
  border-radius: 5px;
  padding: 10px 10px 10px 10px;
  border: 1px solid gray;
  transition: border 0.2s;
  background: rgba(27, 27, 33, 0.719);
  outline: none;
  color: #c5c8c6;
}
.replyInfoBox textarea:hover {
  border: 1px solid #583b3b;
}
.replyInfoBox textarea:focus {
  border: 1px solid #3e1c1c;
}
.replyBtn {
  margin: auto auto;
  background: rgb(0, 164, 240);
  border-radius: 10px;
  height: 75px;
  width: 75px;
  display: flex;
  flex-direction: column;
  transition: background 0.2s;
  cursor: pointer;
}
.replyBtn p {
  margin: auto auto;
  width: 40px;
  /*height: 40px;*/
  color: white;
  font-weight: bold;
  text-align: center;
}
.replyBtn:hover {
  background: rgb(0, 134, 196);
}
.replyBtn:active {
  background: rgb(0, 174, 255);
}
.emojiBox {
  background: rgba(255, 255, 255, 0.219);
  color: lightgray;
  font-size: 14px;
  font-weight: bold;
  height: 23px;
  width: 60px;
  line-height: 20px;
  border: 1px solid transparent;
  border-radius: 3px;
  margin-top: 10px;
  margin-left: 73px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 10px;
  position: relative;
}
.emojiBox:hover {
  color: rgb(255, 255, 255);
  border: 1px solid #583b3b;
}
.emojiBox:active {
  background: rgba(27, 27, 27, 0.219);
  color: rgb(255, 255, 255);
  border: 1px solid #3e1c1c;
}
.emojiTitle {
  text-align: center;
  font-size: 12px !important;
  line-height: 24px;
  margin: auto auto;
}
.replyLoginTip {
  position: absolute;
  background: rgba(128, 128, 128, 0.671);
  width: 720px;
  height: 80px;
  left: 75px;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  text-align: center;
  font-size: 12px;
}
.replyLoginTipInBox {
  display: flex;
  flex-direction: row;
  margin: auto auto;
}
.loginTipText {
  line-height: 20px;
  height: 20px;
  margin: auto 0;
  color: rgb(61, 61, 61);
}
.loginTipText1 {
  margin-right: 5px;
}
.replyLoginBtn {
  background: rgb(0, 164, 240);
  margin: auto 0;
  line-height: 20px;
  height: 20px;
  color: white;
  width: 30px;
  padding: 2px 5px 2px 5px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 5px;
}
.replyLoginBtn:hover {
  background: rgb(0, 134, 196);
}
.replyLoginBtn:active {
  background: rgb(0, 174, 255);
}
.loginNowBox {
  position: fixed;
  z-index: 1000;
  top: 60px;
  left: 0;
  opacity: 1;
}
.loginNowBoxTran-enter-active,
.loginNowBoxTran-leave-active {
  transition: opacity 0.5s;
}
.loginNowBoxTran-enter, .loginNowBoxTran-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
