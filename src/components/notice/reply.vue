<template>
    <div class="replyNoticeBox">
        <div class="wattingBox" v-if="loading">
          <img src='data:image/gif;base64,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'>
          <p>加载数据中...</p>
        </div>
        <p class="replyNoticeTitle">&thinsp;&thinsp; 回复我的</p>
        <div class="replyNoticeInBox">
            <darker-scroll
                :item-count=pageSize
                :item-height=100
                :item-spacing=15
                :scroll-hight=700
                :scroll-width=840
                @nextPage="nextPage"
                style="margin-top:0;"
                class="scroll">
                <div class="replyMsgItem" v-for="(item,index) in replyNoticeList">
                    <div class="replyMsgInfoBox">
                        <img :src="item.publisher.face" class="replyAvatar">
                        <div class="replyMsgInfo">
                            <div class="replyMsgTitleBox">
                                <p class="replyer">{{item.publisher.nick}}</p>
                                <p class="replyTime">{{new Date(item.createTime).toLocaleString()}}</p>
                            </div>
                            <div class="replyContentBox"><a :href="getContentUrl(item.content)" class="replyContent" style="color:rgb(64, 64, 250)">{{getContent(item.content)}}</a></div>
                        </div>
                        <p class="replyDelete" @click="deleteReplyMessage(item.id)">删除</p>
                    </div>
                    <div class="replyAddr">
                        <p class="replyAddrContent"><a :href="getContentUrl(item.title)" style="color:rgb(64, 64, 250)">{{getContent(item.title)}}</a>评论中回复了你</p>
                    </div>
                </div>
            </darker-scroll>
        </div>
    </div>
</template>

<script>
import darkerScroll from "../darkerStyleComponents/darkerScroll.vue";
import api from "../../api.js";
export default {
  components: {
    darkerScroll
  },
  data() {
    return {
      loading: false,
      replyNoticeList: [],
      pageSize: 0,
      pageNum: 1,
      totalSize: 0,
      pbParams: {
        type: 2,
        pn: 1,
        ps: 20
      }
    };
  },
  methods: {
    async deleteReplyMessage(mid) {
      console.log(mid);
      let resData = await api.deleteMessage(mid);
      if (resData.data.code === 0) {
          console.log('删除成功啦',resData);
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.loading=true;
        this.initReplyMessage();
      }
    },
    async initReplyMessage() {
      let rd = (await api.getMessageList({
        type: 2
      })).data;
      console.log("回复信息列表", rd);
      if (rd.code === 0) {
        this.replyNoticeList = rd.data.messages;
        this.totalSize = rd.data.page.totalSize;
        //不满或刚好一页
        if (rd.data.page.totalSize <= 20) this.pageSize = this.totalSize;
        else this.pageSize = 20;
      } else {
        console.log("请求列表失败");
      }
      this.loading = false;
    },
    async nextPage() {
      if (Math.ceil(this.totalSize / 20) == this.pageNum) return;
      this.loading = true;
      this.pbParams.pn++;
      this.pageNum++;
      let rd = (await api.getMessageList(this.pbParams)).data;
      console.log("下一页", rd);
      if (rd.code === 0) {
        this.replyNoticeList = this.replyNoticeList.concat(rd.data.messages);
        this.pageSize += rd.data.messages.length;
      } else {
        console.log("请求下一页失败");
      }
      this.loading = false;
    },
    getContent(content) {
      return content.substring(
        2,
        content.lastIndexOf("}", content.lastIndexOf("}", content.length) - 1)
      );
    },
    getContentUrl(content) {
      return content.substring(
        content.lastIndexOf('"', content.lastIndexOf('"', content.length) - 1) +
          1,
        content.lastIndexOf('"', content.length)
      );
    }
  },
  mounted() {
    this.loading=true;
    this.initReplyMessage();
  }
};
</script>

<style>
.replyNoticeBox {
  display: flex;
  flex-direction: column;
}
.replyNoticeTitle {
  margin: 10px auto;
  color: wheat;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 40px;
  width: 95%;
  line-height: 40px;
  border-radius: 3px;
  text-align: left;
}
.replyNoticeInBox {
  margin: auto auto;
  width: 95%;
  height: 800px;
  display: flex;
  flex-direction: column;
  background: rgba(163, 163, 163, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
.replyMsgItem {
  background: rgba(32, 32, 32, 0.377);
  color: white;
  border-radius: 10px;
  width: 95%;
  height: 100px;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.replyMsgInfoBox {
  display: flex;
  flex-direction: row;
  height: 60px;
}
.replyMsgInfo {
  width: 80%;
  height: 40px;
  display: flex;
  flex-direction: column;
  margin: 17px 5px;
}
.replyMsgTitleBox {
  display: flex;
  flex-direction: row;
}
.replyer {
  margin: 0 0;
}
.replyTime {
  margin: 0 10px;
  font-size: 13px;
  color: rgb(196, 196, 196);
}
.replyContentBox{
    text-align: left;
    font-size: 13px;
}
.replyAvatar {
  height: 50px;
  width: 50px;
  border-radius: 50px;
  margin: 10px 10px;
}
.replyAddr {
  height: 30px;
  margin-top: 5px;
}
.replyAddrContent {
  background: rgba(153, 123, 102, 0.63);
  margin: auto auto;
  width: 95%;
  height: 30px;
  font-size: 13px;
  line-height: 30px;
  border-radius: 10px;
}
.systemContent {
  margin: auto 10px;
  text-align: left;
  /*超出隐藏*/
  overflow: hidden;
  /*超出不换行*/
  text-overflow: ellipsis;
  /*超出省略号显示*/
  white-space: nowrap;
}
.replyDelete {
  background: rgb(255, 65, 65);
  height: 30px;
  width: 50px;
  line-height: 30px;
  margin-right: 25px;
  border-radius: 10px;
  cursor: pointer;
}
.replyDelete:hover {
  background: rgb(255, 117, 117);
}
.replyDelete:active {
  background: red;
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
