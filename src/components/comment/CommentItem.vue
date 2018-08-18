<template>
    <div class="commentItemBox" :id="itemInfo.rpid">
        <div class="commentItemInBox">
            <img :src="itemInfo.user.avatar?itemInfo.user.avatar:'../../../static/img/noAvatar.jpg'" class="commentItemAvatar">
            <div class="commentContentBox">
                <p class="replyUsername">{{itemInfo.user.nick}}</p>
                <p class="replyContent">{{itemInfo.content}}</p>
                <div class="commentControlBox">
                    <p class="commentFloor">#{{itemInfo.floor}}</p>
                    <p class="commentTime">{{getDateDiff}}</p>
                    <div class="commentUpvote" @click="upvote">
                        <img :src="itemInfo.like_status==0?'../../../static/img/upvote2.png':'../../../static/img/upvoted2.png'">
                        <p>{{itemInfo.like}}</p>
                    </div>
                    <p class="commentReplyBtn" @click="showReply">回复</p>
                    <p class="commentDeleteBtn" v-show="uid==itemInfo.uid" @click="deleteReply">删除</p>
                </div>
            </div>
        </div>
        <div v-for="item in childReplies">
            <comment-child-item
                :item-info="item"
                :show-reply-box.sync="showReplyBox"
                :specific-rpid="specificRpid"
                @changeTarget="changeTarget"
                @refreshChildList="seeMore"
                @goAnchor='goAnchor'
                ></comment-child-item>
        </div>
        <div @click="seeMore" v-show="!noMore" v-if="itemInfo.rcount>3" class="seeMore">共{{itemInfo.rcount}}条回复，点击查看更多</div>
        <el-pagination
            v-show="noMore"
            v-if="childRepliesPageInfo.totalSize>10"
            @current-change="pageSelect"
            :small="true"
            :background="true"
            :current-page.sync="childRepliesPageInfo.pageNumber"
            :page-count="pageCount"
            :page-size="childRepliesPageInfo.pageSize"
            layout="total, prev, pager, next"
            :total="childRepliesPageInfo.totalSize">
        </el-pagination>
        <reply-box
            v-show="!showReplyBox"
            class="commentReplyBox"
            :video-info="videoInfo"
            :parent-comment-info="itemInfo"
            :mode=1
            :placeholder="targetUser"
            @refresh="seeMore">
        </reply-box>
    </div>
</template>

<script>
import replyBox from "./ReplyBox.vue";
import commentChildItem from "./CommentChildItem.vue";
import api from "../../api.js";
import { formatDate } from "../../time.js";
export default {
  props: ["videoInfo", "itemInfo", "specificRpid", "specificRpidLocation"],
  components: {
    replyBox,
    commentChildItem
  },
  data() {
    return {
      uid: localStorage.getItem("USER_ID"),
      childReplies: this.itemInfo.replies,
      childRepliesPageInfo: {
        totalSize: 3,
        pageNumber: 1,
        pageSize: 3
      },
      specificRpidTmp: this.specificRpid,
      //specificRpidLocationTmp:this.specificRpidLocation,
      pageCount: 1,
      showReplyBox: true,
      targetUser: "回复 @" + this.itemInfo.user.nick + " :",
      noMore: false,
      closeChildReplyBox: false,
      pageNum:
        this.specificRpidLocation.chdPageNum == 0
          ? 1
          : this.specificRpidLocation.chdPageNum
    };
  },
  watch: {
    itemInfo() {
      this.childReplies = this.itemInfo.replies;
      //修复翻页后，子评论翻页未隐藏的bug
      this.noMore = false;
    }
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
      if (!this.showReplyBox && this.closeChildReplyBox) {
        this.showReplyBox = true;
        this.closeChildReplyBox = false;
      } else this.showReplyBox = false;
      this.targetUser = "回复 @" + this.itemInfo.user.nick + " :";
      this.closeChildReplyBox = true;
    },
    changeTarget(target) {
      this.showReplyBox = false;
      this.targetUser = "回复 @" + target + " :";
    },
    async refresh(rpid) {
      let repliesData = await api.getRepliesOfAnyClassPage({
        oid: this.videoInfo.episodeId,
        type: 1,
        root: this.itemInfo.rpid,
        rpid: rpid
      });
      this.showReplyBox = true;
    },
    async seeMore() {
      let repliesData = await api.getRepliesOfAnyClassPage({
        pn: this.pageNum,
        oid: this.videoInfo.episodeId,
        type: 1,
        root: this.itemInfo.rpid
      });
      if (repliesData.status === 200) {
        this.childReplies = repliesData.data.data.replies;
        console.log(this.childReplies);
        this.childRepliesPageInfo = repliesData.data.data.page;
        this.pageCount = Math.ceil(this.childRepliesPageInfo.totalSize / 10);
        this.noMore = true;
      }
    },
    async pageSelect(index) {
      let repliesData = await api.getRepliesOfAnyClassPage({
        pn: index,
        oid: this.videoInfo.episodeId,
        type: 1,
        root: this.itemInfo.rpid
      });
      if (repliesData.status === 200) {
        this.childReplies = repliesData.data.data.replies;
        document.documentElement.scrollTop = document.body.scrollTop = 0;
      }
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
        this.$emit("refreshCommentList");
      } else {
        this.$message({
          message: "删除失败," + rd.msg,
          type: "error"
        });
      }
    },
    goAnchor() {
      console.log('子评论2:翻滚中');
      this.$emit("goAnchor");
    }
  },
  async mounted() {
    if (this.specificRpidTmp && this.specificRpidLocation.chdPageNum != 0) {
      await this.seeMore();
    } else if (
      this.specificRpidTmp &&
      this.specificRpidLocation.chdPageNum == 0 &&
      this.itemInfo.rpid == this.specificRpid
    ) {
      console.log('CommentItem:翻滚中');
      this.$emit("goAnchor");
    }
  }
};
</script>

<style>
.commentItemBox {
  display: flex;
  flex-direction: column;
  width: 900px;
  margin: 10px auto;
  border-bottom: 1px solid gray;
}
.commentItemInBox {
  display: flex;
  flex-direction: row;
}
.commentItemAvatar {
  height: 50px;
  width: 50px;
  border-radius: 50px;
  margin: auto auto;
  cursor: pointer;
}
.commentContentBox {
  margin: auto auto;
}
.commentControlBox {
  display: flex;
  flex-direction: row;
}
.replyUsername {
  text-align: left;
  margin-left: -760px;
  font-weight: bold;
  color: rgb(127, 162, 238);
  cursor: pointer;
  /*内容自适应宽度*/
  display: inline-block;
}
.replyContent {
  color: white;
  height: auto;
  text-align: left;
  margin: -10px 10px;
  width: 820px;
  word-wrap: break-word;
  word-break: break-all;
}
.commentControlBox {
  width: 820px;
  height: 20px;
  margin: 12px 10px;
}
.commentFloor {
  font-size: 12px;
  margin: auto 0;
  color: gray;
}
.commentTime {
  font-size: 12px;
  margin: auto 10px;
  color: gray;
}
.commentUpvote {
  display: flex;
  flex-direction: row;
  margin: auto 5px;
  cursor: pointer;
}
.commentUpvote img {
  width: 20px;
  height: 20px;
  margin: auto auto;
}
.commentUpvote p {
  font-size: 12px;
  margin: auto auto;
  color: gray;
}
.commentReplyBtn {
  margin: auto 10px;
  color: rgb(24, 109, 189);
}
.commentDeleteBtn {
  margin: auto auto;
  margin-right: 0;
  color: rgb(156, 4, 4);
}
.commentDeleteBtn,
.commentReplyBtn {
  font-size: 13px;
  cursor: pointer;
  font-weight: bold;
}
.commentReplyBox {
  margin: auto auto;
  margin-bottom: 10px;
}
.seeMore {
  color: rgb(127, 162, 238);
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
  margin-left: 50px;
}
.childRepliesPageBox {
  display: flex;
  flex-direction: row;
  background: salmon;
}
</style>
