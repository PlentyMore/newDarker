<template>
  <div class="commentChildItemBox" :id="subReply.rpid">
    <div class="commentChildItemInBox">
      <a :href="'#/user/'+subReply.uid" target="_blank" >
        <img :src="subReply.user.avatar?subReply.user.avatar:'../../../static/img/noAvatar.jpg'" class="commentChildItemAvatar">
      </a>
      <div class="commentChildContentBox">
        <p class="replyChildUsername">
          <a :href="'#/user/'+subReply.uid" target="_blank" style="text-decoration: none;color: rgb(127, 162, 238);">
            {{subReply.user.nick}}
          </a>
        </p>
        <p class="replyChildContent">{{subReply.content}}</p>
        <div class="commentChildControlBox">
          <p class="commentChildTime">{{getDateDiff}}</p>
          <div class="commentChildUpvote" @click="upvote">
            <img :src="subReply.like_status===0?'../../../static/img/upvote2.png':'../../../static/img/upvoted2.png'">
            <p>{{subReply.like}}</p>
          </div>
          <p class="commentChildReplyBtn" @click="showReplyBox">回复</p>
          <p class="commentChildDeleteBtn" v-show="canDelReply" @click="delSubReply">删除</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from "../../api.js";
  import { formatDate } from "../../time.js";
  export default {
    name: "SubReply",
    props:["oid","type","subReply","subIndex"],
    components:{
      // "reply-box": ReplyBox
    },
    data() {
      return {
        uid: "",
        role: ""
      };
    },
    computed: {
      getDateDiff() {
        let minute = 1000 * 60;
        let hour = minute * 60;
        let day = hour * 24;
        let now = new Date().getTime();
        let diffValue = now - this.subReply.ctime;
        if (diffValue < 0) {
          return;
        }
        let dayC = diffValue / day;
        let hourC = diffValue / hour;
        let minC = diffValue / minute;
        if (dayC >= 1) {
          return formatDate(new Date(this.subReply.ctime), "yyyy-MM-dd hh:mm");
        } else if (hourC >= 1) {
          return "" + parseInt(hourC) + "小时前";
        } else if (minC >= 1) {
          return "" + parseInt(minC) + "分钟前";
        } else return "刚刚";
      },
      canDelReply(){
        if(this.uid === this.subReply.uid)
          return true;
        else if(this.role){
          if(this.role === 'ROLE_ADMIN' || this.role === 'ROLE_MANAGER')
            return true;
        }
        return false;
      }
    },
    methods:{
      async delSubReply(){
        let res = await api.deleteMyRpely(this.subReply.rpid);
        let rd = res.data;
        if(rd.code === 0){
          this.$emit("onRemoveSubReply",this.subIndex);
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
        else {
          console.log("删除子评论失败，index:",this.subIndex);
        }
      },
      async upvote() {
        let upvoteRes;
        if (this.subReply.like_status === 0) {
          upvoteRes = await api.upvoteReply(this.subReply.rpid);
          this.subReply.like++;
          this.subReply.like_status = 1;
        } else {
          upvoteRes = await api.cancelUpvoteReply(this.subReply.rpid);
          this.subReply.like--;
          this.subReply.like_status = 0;
        }
      },
      showReplyBox(){
        this.$emit("onShowSubReplyBox",this.subReply);
      }
    },
    created(){
      let id = localStorage.getItem("USER_ID");
      let rol = localStorage.getItem("ROLE");
      if(id){
        this.uid = parseInt(id);
      }
      if(rol){
        this.role = rol;
      }
    }
  }
</script>

<style scoped>

</style>
<style>
.commentChildItemBox {
  display: flex;
  flex-direction: column;
  width: 850px;
  margin: 0px auto;
  margin-right: 0;
}
.commentChildItemInBox {
  display: flex;
  flex-direction: row;
}
.commentChildItemAvatar {
  height: 30px;
  width: 30px;
  border-radius: 50px;
  margin: 13px auto;
  cursor: pointer;
}
.commentChildContentBox {
  text-align: left;
  margin: auto 5px;
}
.commentChildControlBox {
  display: flex;
  flex-direction: row;
}
.replyChildUsername {
  text-align: left;
  font-weight: bold;
  font-size: 13px;
  margin-left: 10px;
  color: rgb(127, 162, 238);
  cursor: pointer;
  /*内容自适应宽度*/
  display: inline-block;
}
.replyChildContent {
  color: white;
  height: auto;
  text-align: left;
  font-size: 13px;
  margin: -10px 10px;
  width: 770px;
  word-wrap: break-word;
  word-break: break-all;
}
.commentChildControlBox {
  width: 770px;
  height: 20px;
  margin: 12px 10px;
}
.commentChildTime {
  font-size: 10px;
  margin: auto 0px;
  color: gray;
}
.commentChildUpvote {
  display: flex;
  flex-direction: row;
  margin: auto 5px;
  cursor: pointer;
}
.commentChildUpvote img {
  width: 15px;
  height: 15px;
  margin: auto auto;
}
.commentChildUpvote p {
  font-size: 10px;
  margin: auto auto;
  color: gray;
}
.commentChildReplyBtn {
  margin: auto 10px;
  color: rgb(24, 109, 189);
}
.commentChildDeleteBtn {
  margin: auto auto;
  margin-right: 0;
  color: rgb(156, 4, 4);
}
.commentChildDeleteBtn,
.commentChildReplyBtn {
  font-size: 11px;
  cursor: pointer;
  font-weight: bold;
}
.commentChildReplyBox {
  margin: auto auto;
  margin-bottom: 10px;
}
</style>
