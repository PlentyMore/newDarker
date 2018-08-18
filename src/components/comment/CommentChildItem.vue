<template>
    <div class="commentChildItemBox" :id="itemInfo.rpid">
        <div class="commentChildItemInBox">
            <img :src="itemInfo.user.avatar?itemInfo.user.avatar:'../../../static/img/noAvatar.jpg'" class="commentChildItemAvatar">
            <div class="commentChildContentBox">
                <p class="replyChildUsername">{{itemInfo.user.nick}}</p>
                <p class="replyChildContent">{{itemInfo.content}}</p>
                <div class="commentChildControlBox">
                    <p class="commentChildTime">{{getDateDiff}}</p>
                    <div class="commentChildUpvote" @click="upvote">
                        <img :src="itemInfo.like_status==0?'../../../static/img/upvote2.png':'../../../static/img/upvoted2.png'">
                        <p>{{itemInfo.like}}</p>
                    </div>
                    <p class="commentChildReplyBtn" @click="showReply">回复</p>
                    <p class="commentChildDeleteBtn" v-show="uid==itemInfo.uid" @click="deleteReply">删除</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import replyBox from "./ReplyBox.vue";
import api from "../../api.js";
import { formatDate } from "../../time.js";
export default {
  props: ["itemInfo", "showReplyBox","specificRpid"],
  components: {
    replyBox
  },
  data() {
    return {
      uid: localStorage.getItem("USER_ID")
    };
  },
  computed: {
    getDateDiff() {
      let minute = 1000 * 60;
      let hour = minute * 60;
      let day = hour * 24;
      let now = new Date().getTime();
      let diffValue = now - this.itemInfo.ctime;
      if (diffValue < 0) {
        return;
      }
      let dayC = diffValue / day;
      let hourC = diffValue / hour;
      let minC = diffValue / minute;
      if (dayC >= 1) {
        return formatDate(new Date(this.itemInfo.ctime), "yyyy-MM-dd hh:mm");
      } else if (hourC >= 1) {
        return "" + parseInt(hourC) + "小时前";
      } else if (minC >= 1) {
        return "" + parseInt(minC) + "分钟前";
      } else return "刚刚";
    }
  },
  methods: {
    showReply() {
      this.$emit("changeTarget", this.itemInfo.user.nick);
    },
    async upvote() {
      let upvoteRes;
      if (this.itemInfo.like_status == 0) {
        upvoteRes = await api.upvoteReply(this.itemInfo.rpid);
        this.itemInfo.like++;
        this.itemInfo.like_status = 1;
      } else {
        upvoteRes = await api.cancelUpvoteReply(this.itemInfo.rpid);
        this.itemInfo.like--;
        this.itemInfo.like_status = 0;
      }
    },
    async deleteReply() {
      let rd = (await api.deleteMyRpely(this.itemInfo.rpid)).data;
      console.log("删除评论结果", rd);
      if (rd.code === 0) {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.$emit('refreshChildList');
      } else {
        this.$message({
          message: "删除失败," + rd.msg,
          type: "error"
        });
      }
    },
  },
  mounted(){
    console.log(this.itemInfo.rpid);
    if(this.specificRpid==this.itemInfo.rpid){
      console.log('子评论1:翻滚中');
      this.$emit('goAnchor');
    }
  }
};
</script>

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
  margin: auto auto;
  cursor: pointer;
}
.commentChildContentBox {
  margin: auto auto;
}
.commentChildControlBox {
  display: flex;
  flex-direction: row;
}
.replyChildUsername {
  text-align: left;
  margin-left: -720px;
  font-weight: bold;
  font-size: 13px;
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
