<template>
    <div class="searchResultPage">
        <div class="searchResultBox">
          <h1 style="color: #1b84ec" v-show="bangumis === ''">什么都没有找到</h1>
            <div v-for="(item,index) in bangumis">
                <img :src="item.thumb?item.thumb:'../../../static/img/1.jpg'" @click="goBangumiDetail(item)">
                <marquee behavior="alternate" scrollamount="6">{{item.bangumiName}}</marquee>
                <p>集数：{{item.episodeTotal}}</p>
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
  import api from "../../api"
export default {
    props:['searchText'],
    data(){
        return{
            bangumis: "",
            page: "",
            result:[{
                img: '../../../static/img/1.jpg',
                name: '糜烂PlentyMore',
                episodes: 99999,
            },{
                img: '../../../static/img/2.jpg',
                name: '超级糜烂PlentyMore fuckfuckfuckfuck',
                episodes: 99999,
            },{
                img: '../../../static/img/2.jpg',
                name: '超级糜烂PlentyMore fuckfuckfuckfuck',
                episodes: 99999,
            },{
                img: '../../../static/img/2.jpg',
                name: '超级糜烂PlentyMore fuckfuckfuckfuck',
                episodes: 99999,
            },{
                img: '../../../static/img/2.jpg',
                name: '超级糜烂PlentyMore fuckfuckfuckfuck',
                episodes: 99999,
            },{
                img: '../../../static/img/2.jpg',
                name: '超级糜烂PlentyMore fuckfuckfuckfuck',
                episodes: 99999,
            },{
                img: '../../../static/img/2.jpg',
                name: '超级糜烂PlentyMore fuckfuckfuckfuck',
                episodes: 99999,
            },{
                img: '../../../static/img/2.jpg',
                name: '超级糜烂PlentyMore fuckfuckfuckfuck',
                episodes: 99999,
            },{
                img: '../../../static/img/2.jpg',
                name: '超级糜烂PlentyMore fuckfuckfuckfuck',
                episodes: 99999,
            },{
                img: '../../../static/img/2.jpg',
                name: '超级糜烂PlentyMore fuckfuckfuckfuck',
                episodes: 99999,
            }]
        };
    },
    methods:{
      async searchBangumis(text){
        let res = await api.getsearchBangumisIdResult(text);
        let rd = res.data;
        console.log("searchBangumiRes:",rd);
        if(rd.code === 0){
          this.bangumis = rd.data.content;
          this.page = rd.data.page;
        }
        else {
          this.bangumis = "";
          this.page.totalSize = 0;
          console.log("no bangumi search result");
        }
      },
      async handleCurrentChange(val){
        console.log("pageNum:",val);
        let res = await API.searchBangumisByName(this.searchText,val,this.page.pageSize);
        let rd = res.data;
        if(rd.code === 0){
          this.bangumis = rd.data.content;
          this.page = rd.data.page;
        }
        else {
          this.bangumis = "";
          console.log("error search bangumis in page");
        }
      },
      async handleSizeChange(val){
        console.log("pageSize:",val);
        let res = await API.searchBangumisByName(this.searchText,1,val);
        let rd = res.data;
        if(rd.code === 0){
          this.bangumis = rd.data.content;
          this.page = rd.data.page;
        }
        else {
          console.log("error search bangumis in page");
        }
      },
      goBangumiDetail(bangumi){
        console.log("go bangumiDetail");
        console.log("bangumi: ",bangumi)
        let routeData = this.$router.resolve({name: 'bangumiDetail', params:{bid:bangumi.bangumiId,bangumi:bangumi}});
        console.log("href:",routeData.href);
        window.open(routeData.href, '_blank');
      },
        test(){
            //alert(this.$route.params.searchText);
            console.log(this.searchText);
        }
    },
    watch:{
        searchText(newInfo){
            console.log(newInfo);
          this.searchBangumis(newInfo);
        }
    },
    created(){
        console.log(this.searchText);
        this.searchBangumis(this.searchText);
    },
}
</script>

<style>
  .page-container {
    display: block !important;
    width: 100% !important;
    height: 80px !important;
    background: none !important;
  }
.searchResultPage{
    display: flex;
    flex-direction: row;
}
.searchResultBox{
    width: 1600px;
    margin: 8% auto;
}
.searchResultBox div{
    opacity: .8;
    background: goldenrod;
    width: 180px;
    height: 160px;
    margin: 10px 10px;
    float: left;
    display: inline-block;
    border-radius: 10px;
    box-shadow: 0 0 30px;
    transition: box-shadow .5s;
}
.searchResultBox div:hover{
    box-shadow: 8px 8px 30px;
}
.searchResultBox img{
    width: 180px;
    height: 100px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
.searchResultBox marquee{
    height: 25px;
    line-height: 25px;
}
.searchResultBox p{
    margin-top: 0;
    height: 25px;
    line-height: 25px;
}
</style>
