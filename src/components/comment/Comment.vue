<template>
    <div class="commentBox">
        <div class="commentNum">
            <p>{{commentPageInfo.totalSize}} 条评论</p>
        </div>
        <div class="commentTitle">
            <p class="commentAll">全部评论</p>
            <p class="refreshBtn" @click="initCommentInfo">刷新评论</p>
        </div>
        <div>
            <reply-box
                style="border-bottom: 1px solid gray;"
                :video-info="videoInfo"
                :mode=0
                :placeholder="parentCommentPlaceholder"
                :type="type"
                @refresh="initCommentInfo">
            </reply-box>
        </div>
        <div v-if="hotComment.length!=0">
            <div v-for="item in hotComment" style="color:red;">
                <comment-item
                  :item-info="item"
                  :video-info="videoInfo"
                  :type="type"
                  @refreshCommentList="initCommentInfo"></comment-item>
            </div>
        </div>
        <div v-if="hotComment.length!=0" class="hotLine">
            <p style="color:white">------------------以上为热门评论，点击</p>
            <p @click="sortByHot" style="color: rgb(24, 109, 189);font-weight:bold;cursor:pointer;">查看更多</p>
            <p style="color:white">------------------</p>
        </div>
        <div>
            <div v-for="item in commentList" style="color:red;">
                <comment-item
                  :item-info="item"
                  :video-info="videoInfo"
                  :specific-rpid="specificRpid"
                  :specific-rpid-location="specificRpidLocation"
                  :type="type"
                  @refreshCommentList="initCommentInfo"
                  @goAnchor="goAnchor"></comment-item>
            </div>
        </div>
        <div class="pagination">
            <el-pagination
                v-if="commentPageInfo.totalSize>20"
                @current-change="pageSelect"
                :background="true"
                :current-page.sync="commentPageInfo.pageNumber"
                :page-count="pageCount"
                :page-size="commentPageInfo.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="commentPageInfo.totalSize">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import commentItem from "./CommentItem.vue";
import replyBox from "./ReplyBox.vue";
import api from "../../api.js";
export default {
  props: ["videoInfo", "specificRpid","type"],
  components: {
    commentItem,
    replyBox
  },
  data() {
    return {
      commentList: [],
      commentPageInfo: {},
      hotComment: [],
      sort: 1,
      pageCount: 0,
      refreshComment: false,
      specificRpidTmp: this.specificRpid,
      specificRpidLocation: {
        parPageNum: 1,
        chdPageNum: 1
      },
      parentCommentPlaceholder:
        "请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。"
    };
  },
  watch: {
    videoInfo() {
      this.initCommentInfo();
    }
  },
  methods: {
    async sortByHot() {
      this.sort = 2;
      let repliesData = await api.getRepliesOfAnyClassPage({
        oid: this.videoInfo.episodeId,
        type: this.type,
        sort: this.sort
      });
      if (repliesData.status === 200) {
        this.commentList = repliesData.data.data.replies;
        this.commentPageInfo = repliesData.data.data.page;
        this.hotComment = [];
        this.pageCount = Math.ceil(this.commentPageInfo.totalSize / 20);
      }
    },
    async pageSelect(index) {
      this.$emit('nextPageGoAnchor');
      let repliesData = await api.getRepliesOfAnyClassPage({
        pn: index,
        oid: this.videoInfo.episodeId,
        type: this.type,
        sort: this.sort
      });
      if (repliesData.status === 200) {
        this.commentList = repliesData.data.data.replies;
      }
    },
    async initCommentInfo() {
      let repliesData = await api.getRepliesOfAnyClassPage({
        pn: this.specificRpidLocation.parPageNum,
        oid: this.videoInfo.episodeId,
        type: this.type,
        sort: this.sort
      });
      console.log("评论数据", repliesData);
      if (repliesData.status === 200) {
        this.commentList = repliesData.data.data.replies;
        this.commentPageInfo = repliesData.data.data.page;
        if (this.hotComment === null)
          this.hotComment = repliesData.data.data.hot;
        this.pageCount = Math.ceil(this.commentPageInfo.totalSize / 20);
        if (this.specificRpid) {
          setTimeout(() => {
            let anchor = document.getElementById(this.specificRpid);
            if (!anchor) this.$emit("cantGoAnchor");
          },3000);
        }
      }
      console.log("回复数据", repliesData);
      console.log("热门数据", this.hotComment);
    },
    goAnchor() {
      console.log("翻滚中");
      this.$emit("goAnchor");
    },
    cantGoAnchor() {
      this.$emit("cantGoAnchor");
    }
  },
  async mounted() {
    console.log("Comment:specificRpid", this.specificRpid);
    if (this.specificRpidTmp) {
      let rd = (await api.getRepliesOfAnyClassPage({
        oid: this.videoInfo.episodeId,
        type: this.type,
        rpid: this.specificRpidTmp
      })).data;
      if (rd.code === 0) {
        this.specificRpidLocation = {
          parPageNum: rd.data.page.pageNumber,
          chdPageNum: rd.data.subpage.pageNumber
        };
        console.log("定位评论坐标", this.specificRpidLocation);
      }
      this.specificRpidTmp = null;
    }
    await this.initCommentInfo();
  }
};
</script>

<style>
.commentBox {
  display: flex;
  flex-direction: column;
}
.commentNum {
  display: flex;
  flex-direction: column;
  width: 900px;
  height: 30px;
  margin: auto auto;
}
.commentNum p {
  text-align: left;
  color: antiquewhite;
  font-size: 20px;
  line-height: 30px;
  height: 30px;
  width: 100%;
  font-weight: bold;
  margin: auto auto;
}
.commentTitle {
  display: flex;
  flex-direction: row;
  width: 900px;
  margin: auto auto;
  height: 50px;
  border-bottom: 2px solid rgb(65, 163, 134);
}
.commentAll {
  color: antiquewhite;
  height: 30px;
  line-height: 30px;
}
.refreshBtn {
  color: antiquewhite;
  margin-left: 20px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
}
.hotLine {
  display: flex;
  flex-direction: row;
  margin: auto auto;
}
.pagination {
  width: 80%;
  margin: auto 0;
}
</style>
