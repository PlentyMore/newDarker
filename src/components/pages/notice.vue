<template>
    <div class="noticeBox">
        <div class="noticeInBox">
            <left-menu
                class="leftMenu"
                :menu-title="menuTitle"
                :btn-title="test"
                :page-index.sync="pageIndex"></left-menu>
            <div class="msgListBox">
                <system v-if="pageIndex==0"></system>
                <reply v-if="pageIndex==1"></reply>
                <at v-if="pageIndex==2"></at>
                <upvote v-if="pageIndex==3"></upvote>
            </div>
        </div>
    </div>
</template>

<script>
import leftMenu from "../menu/leftMenu.vue";
import at from "../notice/at.vue";
import reply from "../notice/reply.vue";
import system from "../notice/system.vue";
import upvote from "../notice/upvote.vue";
import api from "../../api.js";
export default {
  components: {
    leftMenu,
    at,
    reply,
    system,
    upvote
  },
  data() {
    return {
      menuTitle: "消息",
      pageIndex: 0,
      test: {
        0: "系统通知",
        1: "回复我的",
        2: "@我的",
        3: "收到的赞"
      }
    };
  },
  mounted() {
    this.pageIndex = this.$route.query.pageNum;
    console.log("notice页：", this.pageIndex);
  }
};
</script>

<style>
.noticeBox {
  display: flex;
  flex-direction: row;
  position: absolute;
  width: 100%;
  height: 93%;
  overflow: hidden;
}
.noticeInBox {
  display: flex;
  flex-direction: row;
  margin: 2% auto;
  height: 100%;
}
.leftMenu {
  margin-left: auto;
}
.msgListBox {
  background: rgba(24, 24, 24, 0.671);
  height: 100%;
  width: 900px;
  display: flex;
  flex-direction: column;
  padding-top: 0px;
  border-radius: 5px;
  margin-left: 2%;
}
</style>
