<template>
    <div :class="['announceBox',{'announceBoxB':loading}]">
      <div class="wattingBox" v-if="loading">
        <img src='data:image/gif;base64,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'>
        <p>加载数据中...</p>
      </div>
      <div class="announceInBox">
        <div class="anTitleBox"><div class="anTitleInBox">{{announceInfo.title}}</div></div>
        <div class="anInfoBox">
          <div class="anInfoInBox">
            <div class="anDateBox">
              <img src="../../../static/img/date.png">
              <p>{{announceInfo.createTime| formatDate}}</p>
            </div>
            <div class="anReadBox">
              <img src="../../../static/img/saw.png">
              <p>{{announceInfo.viewCount}}</p>
            </div>
          </div>
        </div>
        <div class="anContentBox"><div v-html="announceInfo.content" class="anContentInBox"></div></div>
        <div class="commentList">
          <comment
            :video-info="announceId"
            :specific-rpid="specificRpid"
            :type=2
            @goAnchor="goAnchor"
            @cantGoAnchor="cantGoAnchor"
            @nextPageGoAnchor="nextPageGoAnchor"></comment>
        </div>
      </div>
    </div>
</template>

<script>
import api from "../../api.js";
import comment from "../comment/Comment.vue";
import { formatDate } from "../../time.js";
export default {
  data() {
    return {
      loading: false,
      announceInfo: {},
      announceId: {},
      specificRpid: this.$route.query.rpid
    };
  },
  components: {
    comment
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  methods: {
    async initAnnounce() {
      let resData = (await api.getNoticeById(1)).data;
      console.log(resData);
      if (resData.code === 0) {
        this.announceInfo = resData.data;
        this.loading=false;
      }else{
        this.$message({
          message:resData.msg,
          type:'error'
        });
      }
    },
    goAnchor() {
      this.loading = false;
      setTimeout(() => {
        console.log("翻滚吧！");
        let anchor = document.getElementById(this.specificRpid);
        console.log("anchor:", anchor);
        console.log("scrollIntoView!!!");
        anchor.scrollIntoView();
      }, 100);
    },
    cantGoAnchor() {
      this.loading = false;
      this.$message({
        message: "评论已被删除",
        type: "info"
      });
    },
    nextPageGoAnchor() {
      let anchor = document.getElementById("comment");
      setTimeout(() => {
        console.log("翻滚吧！");
        let anchor = document.getElementById("comment");
        anchor.scrollIntoView();
      }, 100);
    }
  },
  async created() {
    this.loading=true;
    this.announceId = {
      episodeId: this.$route.params.id
    };
    console.log("公告id", this.$route.params.id);
    if (this.specificRpid) this.loading = true;
    await this.initAnnounce();
  }
};
</script>

<style>
.announceBox {
  color: wheat;
  display: flex;
  flex-direction: column;
}
.announceBoxB {
  overflow: hidden;
  height: 820px;
}
.announceInBox {
  display: flex;
  flex-direction: column;
  margin-top: 60px;
}
.anTitleBox {
  text-align: left;
  margin: 0px auto;
  width: 100%;
}
.anTitleInBox {
  width: 30%;
  margin: auto 35%;
  font-size: 30px;
}
.anInfoBox {
  margin: auto auto;
  width: 100%;
}
.anInfoBox,
.anInfoInBox,
.anDateBox,
.anReadBox {
  display: flex;
  flex-direction: row;
}
.anInfoInBox {
  width: 30%;
  margin: auto 35%;
}
.anDateBox,
.anReadBox {
}
.anDateBox {
  margin-left: 0;
}
.anReadBox {
  margin-left: 10px;
}
.anInfoBox img {
  width: 20px;
  height: 20px;
  margin: auto auto;
}
.anContentBox {
  width: 100%;
}
.anContentInBox {
  display: flex;
  flex-direction: column;
  margin: auto 35%;
  width: 60%;
}
.anContentInBox * {
  margin: auto 0;
  text-align: left;
}
.anContentBox img {
  width: 300px;
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
  top: 40%;
  left: 50%;
  transform: translate(-50%, 20%);
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
