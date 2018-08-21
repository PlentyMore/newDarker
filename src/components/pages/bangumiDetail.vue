<template>
  <div class="bangumi-detail">
    <div class="bangumi-bg-wrap">
      <div class="bangumi-bg-blur">
        <div class="bangumi-bg-blur-img" :style="blurImageStyle">
        </div>
      </div>
    </div>
    <div class="bangumi-top">
      <div class="top-inner">
        <div class="bangumi-name">
          <span>{{bangumi.bangumiName}}</span>
        </div>
        <div class="bangumi-thumb">
          <img :src="bangumi.thumb?bangumi.thumb:'../../../static/img/1.jpg'"/>
        </div>
      </div>
    </div>
    <div class="bangumi-bottom">
      <div class="bottom-inner">
        <div class="bangumi-episodes">
          <a target="_blank" :href="'#/video/'+e.epId" class="episode-link" v-for="e in episodes">
            {{e.epIndex}}
          </a>
        </div>
      </div>
    </div>
    <div class="comment-container">
      <real-comment
        :oid="bid"
        :type=3
        :rpid="rpid"
      >
      </real-comment>
    </div>
  </div>
</template>

<script>
  import api from "../../api";
  import realComment from "../comment/RealComment.vue";
  export default {
    name: "bangumiDetail",
    data(){
      return {
        episodes:"",
        page: "",
        bid: "",
        rpid: "",
        bangumi: "",
        blurImageStyle:""
      }
    },
    components:{
      'real-comment':realComment
    },
    methods:{
      async initEpisodes(bid){
        let res =  await api.getEpisodesByBid(bid);
        let rd = res.data;
        console.log(rd);
        if(rd.code === 0){
          this.episodes = rd.data.episodes;
          this.page = rd.data.page;
        }
        else {
          console.log("getEpisodeByBid err!")
        }
      },
      async initBangumi(bid){
        console.log("init bangumi, bid:",bid);
        let res = await api.getBangumiById(bid);
        let rd = res.data;
        console.log("bangumi res:",rd);
        if(rd.code === 0){
          this.bangumi = rd.data;
          this.blurImageStyle = {
            'background-image': 'url('+(rd.data.thumb?rd.data.thumb:'../../../static/img/1.jpg')+')'
          };
          console.log("blurImageStyle:",this.blurImageStyle);
        }
        else{
          console.log("no bangumi founded, bid:",bid);
        }
      }
    },
    created(){
      console.log("bangumiDetail created!");
      let bid = this.$route.params.bid;
      let bangumi = this.$route.params.bangumi;
      let rpid = this.$route.query.rpid;
      console.log("bid:",bid);
      console.log("bangumi:",bangumi);
      if(bid){
        this.bid = bid;
        this.initBangumi(bid);
        this.initEpisodes(bid);
      }
      else{
        console.log("no bid");
      }
      if(rpid){
        this.rpid = rpid;
      }
    }
  }
</script>

<style scoped>
  .bangumi-bg-blur {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow-x: hidden;
    margin-top: -60px;
  }
  .bangumi-bg-blur:before {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.3);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
  }
  .bangumi-bg-blur-img {
    position: absolute;
    background-size: cover;
    width: 110%;
    min-width: 1120px;
    height: 480px;
    top: 50%;
    left: 50%;
    margin: -260px -55%;
    z-index: 10;
    background-repeat: no-repeat;
    background-position: 50%;
    filter: blur(40px);
  }
  .bangumi-top {
    margin-bottom: 40px;
  }
  .top-inner {
    display: inline-block;
    width: 980px;
    position: relative;
    z-index: 100;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .bottom-inner {
    display: inline-block;
    width: 980px;
    text-align: left;
    position: relative;
    z-index: 100;
  }
  .bangumi-name {
    text-align: left;
    margin-bottom: 10px;
  }
  .bangumi-name span {
    display: inline-block;
    font-size: 20px;
    line-height: 30px;
    font-weight: 700;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .bangumi-thumb {
    width: 640px;
    height: 320px;
  }
  .bangumi-thumb img {
    width: 640px;
    height: 320px;
    border: 4px solid white;
    border-radius: 4px;
  }
  .episode-link {
    display: inline-block;
    line-height: 100%;
    font-size: 15px;
    padding: 3px 2px;
    margin: 0 6px 6px 0;
    min-width: 40px;
    color: #e4e4e6;
    background: #352c2c;
    border-radius: 8%;
    text-align: center;
  }
</style>
