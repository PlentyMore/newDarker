<template>
  <div class="replyBox">
    <div class="replyInfoBox">
      <img :src="avatar!=''?avatar:'../../../static/img/noAvatar.jpg'">
      <textarea :placeholder="placeholder" v-model="content"></textarea>
      <div @click="submitReply" class="replyBtn"><p>{{sendBtnText}}</p></div>
    </div>
    <div class="emojiBox">
      ☺表情
    </div>
  </div>
</template>

<script>
  import api from "../../api.js";
  export default {
    name: "PostReply",
    props: [
      "oid",
      "type",
      "mode",
      "parentRpid",
      "replyInfo",
      "top"
    ],
    data() {
      return {
        avatar: localStorage.getItem("face"),
        content: "",
        sendBtnText: "发表评论",
        sendingFlag: false
      };
    },
    computed:{
      placeholder(){
        if(this.replyInfo){
          return "回复 @"+this.replyInfo.user.nick;
        }
        else {
          return "请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。"
        }
      }
    },
    watch:{
      replyInfo(){
        console.log("clean content");
        if(this.mode === 1){
          this.content = "";
        }
      }
    },
    methods:{
      async submitReply() {
        if (this.content === "") {
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
          let rd = postRes.data;
          if(rd.code === 0){
            this.$emit("onAddRootReply",rd.data.rpid);
            this.content = "";
            this.sendingFlag = false;
            this.sendBtnText = "发表评论";
          }
          else {
            console.log("发送评论失败");
          }
          //不可直接修改props数据，会出错
          //（调用父组件的refresh函数时，会更改父组件data，同时会重新渲染父组件，然后父组件会重新传值到props，导致冲突）
        } else {
          //发送子级评论
          let tmp = {
            oid: this.oid,
            type: this.type,
            content: this.placeholder +"："+ this.content,
            root: this.replyInfo.rpid,
            parent: this.parentRpid
          };
          console.log("send subReply:",tmp);
          postRes = await api.postVideoReply({
            oid: this.oid,
            type: this.type,
            content: this.placeholder +"："+ this.content,
            root: this.parentRpid,
            tuid: this.replyInfo.user.uid
          });
          let rd = postRes.data;
          if(rd.code === 0){
            if(this.top){
              console.log("emit onAddTopSubReply");
              this.$emit("onAddTopSubReply",rd.data.rpid);
            }
            else {
              this.$emit("onAddSubReply",rd.data.rpid);
            }

            this.content = "";
            this.sendingFlag = false;
            this.sendBtnText = "发表评论";
          }
          else {
            console.log("发送子评论失败");
          }
        }

      }
    },

  }
</script>

<style scoped>

</style>
<style>
.replyBox {
  width: 900px;
  margin: auto auto;
}
.replyInfoBox {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
}
.replyInfoBox img {
  height: 50px;
  width: 50px;
  border-radius: 30px;
  margin: auto auto;
}
.replyInfoBox textarea {
  height: 60px;
  width: 700px;
  margin: auto auto;
  resize: none;
  border-radius: 5px;
  padding: 10px 10px 10px 10px;
  border: 1px solid gray;
  transition: border 0.2s;
  background: rgba(255, 255, 255, 0.397);
}
.replyInfoBox textarea:hover {
  border: 1px solid white;
}
.replyInfoBox textarea:focus {
  border: 1px solid rgb(100, 149, 237);
}
.replyInfoBox div {
  margin: auto auto;
  background: rgb(0, 164, 240);
  border-radius: 10px;
  height: 80px;
  width: 80px;
  display: flex;
  flex-direction: column;
  transition: background 0.2s;
  cursor: pointer;
}
.replyInfoBox p {
  margin: auto auto;
  width: 40px;
  height: 40px;
  color: white;
  font-weight: bold;
  text-align:center;
}
.replyInfoBox div:hover {
  background: rgb(0, 134, 196);
}
.replyInfoBox div:active {
  background: rgb(0, 174, 255);
}
.emojiBox {
  background: rgba(255, 255, 255, 0.219);
  color: black;
  font-size: 14px;
  font-weight: bold;
  height: 20px;
  width: 60px;
  line-height: 20px;
  border: 1px solid black;
  border-radius: 3px;
  margin-top: 3px;
  margin-left: 73px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 10px;
}
.emojiBox:hover {
  background: rgba(27, 27, 27, 0.219);
  color: rgb(255, 255, 255);
  border: 1px solid white;
}
</style>
