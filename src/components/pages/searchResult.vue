<template>
    <div class="searchResultPage">
        <div class="searchResultBgInBox"></div>
        <div class="searchResultBgBox"><img :src="bgUrl" class='searchResultBgImg'></div>
        <div class="searchResultBox">
          <h1 style="color: #1b84ec" v-show="bangumis === ''">什么都没有找到</h1>
            <div v-for="(item,index) in bangumis" class="searchResultItem" @mouseover="changeBgUrl(item.thumb)">
                <img :src="item.thumb?item.thumb:'../../../static/img/1.jpg'" @click="goBangumiDetail(item)">
                <div class="bangumiName" v-if="item.bangumiName.length<='ElderDriverBroken♂Man1'.length"><p>{{item.bangumiName}}</p></div>
                <marquee v-else behavior="alternate" scrollamount="6">{{item.bangumiName}}</marquee>
                <p class="bangumiEpInfo">集数：{{item.episodeTotal}}</p>
            </div>
            <div v-if="bangumis" class="page-container">
              <el-pagination v-show="page.totalSize>10" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                             :current-page.sync="page.pageNumber"
                             :page-sizes="[10,20,30,40,50]" :page-size="page.pageSize"
                             layout="total, sizes, prev, pager, next, jumper" :total="page.totalSize">
              </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../api";
export default {
  props: ["searchText"],
  data() {
    return {
      bangumis: "",
      page: "",
      result: [],
      bgUrl: ""
    };
  },
  methods: {
    changeBgUrl(url) {
      this.bgUrl = url;
    },
    async searchBangumis(text) {
      let res = await api.getsearchBangumisIdResult(text);
      let rd = res.data;
      console.log("searchBangumiRes:", rd);
      if (rd.code === 0) {
        this.bangumis = rd.data.content;
        this.page = rd.data.page;
        this.bgUrl = rd.data.content[0].thumb;
        console.log("bgUrl", this.bgUrl);
        console.log("pageNum:", "ElderDriverBroken♂Man".length);
      } else {
        this.bangumis = "";
        this.page.totalSize = 0;
        console.log("no bangumi search result");
      }
    },
    async handleCurrentChange(val) {
      let res = await API.searchBangumisByName(
        this.searchText,
        val,
        this.page.pageSize
      );
      let rd = res.data;
      if (rd.code === 0) {
        this.bangumis = rd.data.content;
        this.page = rd.data.page;
      } else {
        this.bangumis = "";
        console.log("error search bangumis in page");
      }
    },
    async handleSizeChange(val) {
      console.log("pageSize:", val);
      let res = await API.searchBangumisByName(this.searchText, 1, val);
      let rd = res.data;
      if (rd.code === 0) {
        this.bangumis = rd.data.content;
        this.page = rd.data.page;
      } else {
        console.log("error search bangumis in page");
      }
    },
    goBangumiDetail(bangumi) {
      console.log("go bangumiDetail");
      console.log("bangumi: ", bangumi);
      let routeData = this.$router.resolve({
        name: "bangumiDetail",
        params: { bid: bangumi.bangumiId, bangumi: bangumi }
      });
      console.log("href:", routeData.href);
      window.open(routeData.href, "_blank");
    },
    test() {
      //alert(this.$route.params.searchText);
      console.log(this.searchText);
    }
  },
  watch: {
    searchText(newInfo) {
      console.log(newInfo);
      this.searchBangumis(newInfo);
    }
  },
  created() {
    console.log(this.searchText);
    this.searchBangumis(this.searchText);
  }
};
</script>

<style>
.page-container {
  display: block !important;
  width: 100% !important;
  height: 80px !important;
  background: none !important;
}
.searchResultBgBox {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 2;
}
.searchResultBgInBox {
  background: rgba(0, 0, 0, 0.486);
  top: 0;
  left: 0;
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 100%;
}
.searchResultBgImg {
  height: 100%;
  width: 100%;
  filter: blur(20px) grayscale(30%);
}
.searchResultPage {
  display: flex;
  flex-direction: row;
}
.searchResultBox {
  width: 1600px;
  margin: 8% auto;
  z-index: 10;
}
.searchResultItem {
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.548);
  width: 180px;
  height: 160px;
  margin: 30px 10px;
  float: left;
  display: inline-block;
  border-radius: 10px;
  box-shadow: 0 0 10px white;
  transition: box-shadow 0.5s;
  cursor: pointer;
}
.searchResultItem:hover {
  box-shadow: 0px 0px 20px white;
}
.searchResultBox img {
  width: 180px;
  height: 100px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.searchResultBox marquee {
  height: 25px;
  line-height: 25px;
}
.bangumiName {
  height: 25px;
  line-height: 25px;
  margin-top: -10px;
}
.bangumiEpInfo {
  margin-top: 0;
  height: 25px;
  line-height: 25px;
}
</style>
