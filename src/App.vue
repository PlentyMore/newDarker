<template>
  <div id="app">
    <div class="topBox">
      <menu-button-box
        @jmpIndex="jmpIndex"
        @jmpWatch="jmpWatch"
        @jmpPersonal="jmpPersonal"
        @jmpNotice="jmpNotice"></menu-button-box>
    </div>
        <div class="searchBar" :style="searchBoxMove" v-show="showSearch" v-if="false">
          <p class="searchBarItem" style="width:50px;text-align: center;">搜索：</p>
          <input class="searchBarItem" v-model="searchText" placeholder="这是搜索输入框" style="width:140px; padding-left:10px;padding-right:10px;">
      </div>
    <router-view v-bind="routerInfo"></router-view>
  </div>
</template>

<script>
import MenuItemButton from "./components/menu/MenuItemButton.vue";
import MenuButtonBox from "./components/menu/MenuButtonBox.vue";
export default {
  name: "App",
  components: {
    MenuItemButton,
    MenuButtonBox
  },
  data() {
    return {
      routerInfo:{}, //用来传递数据给router-view对应组件用的包
      showMenu: false,
      showMain: false,
      searchText:"",
      searchBoxMove:{
        transform: 'translate(-50%,-500%)'
      },
    };
  },
  computed: {
    //当url不为首页和搜索结果页面时，不显示搜索框
    showSearch: function() {
      if(this.$route.path=='/searchResult'||this.$route.path=='/') return true;
      else return false; 
    }
  },
  watch: {
    aNum: function(newValue) {
      TweenLite.to(this.$data, 0.5, { a: newValue + "px" });
    },
    searchText:async function(newText){
      this.searchText=newText;
      if(newText==""){
        this.searchBoxMove={
          transform: 'translate(-50%,-500%)'
        }
        this.$router.push({name: 'index'});
      }
      else{
        this.routerInfo={
          searchText:this.searchText
        }
        this.searchBoxMove={
          transform: 'translate(-50%,-700%)'
        }
        // let res = await api.getsearchBangumisIdResult(newText);
        // let rd = res.data;
        // console.log("searchBangumiRes:",rd);
        // let bangumis = "";
        // let page = "";
        // if(rd.code === 0){
        //   bangumis = rd.data.content;
        //   page = rd.data.page;
        // }
        // else {
        //   console.log("no bangumi search result");
        // }
        this.$router.push({name: 'searchResult'});
      }
    }
  },
  methods:{
    //组件中无法使用this.$router对象，只能在App.vue将跳转函数传递给组件
    jmpIndex:function(){
      this.$router.push({name: 'index'});
    },
    jmpWatch:function(){
      this.$router.push({name: 'watch'});
    },
    jmpPersonal:function(){
      this.$router.push({name: 'personal'});
    },
    jmpNotice:function(pageNum){
      console.log('App',pageNum);
      this.$router.push({name: 'notice',params:{'pageNum':pageNum}});
    },
    checkLocalStorage() {
      if (typeof window.localStorage === "undefined") {
        this.$message({
          message: "请关闭隐私模式,或者浏览器太老旧了,否则无法保存登录状态",
          type: "warning"
        });
        return false;
      } else {
        return true;
      }
    },
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.topBox {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 1000;
}
.header-enter-active,
.header-leave-active {
  transition: opacity 0.5s;
}
.header-enter,
.header-leave-to {
  opacity: 0;
}

.headerBtnBox {
  width: 150px;
  display: flex;
  flex-direction: row;
  margin: 0 auto;
}
/*
/*滚动条 start
::-webkit-scrollbar {
  width: 12px;
  height: 4px;
  background-color: #f5f5f5;
}
/*定义滚动条轨道 内阴影+圆角
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background: #fff;
}
/*定义滑块 内阴影+圆角
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0px 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgba(255, 255, 240, 0.7);
  transition: background-color 1s;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 228, 225, 1);
}
*/
.searchBar{
    position: absolute;
    background: bisque;
    opacity: .8;
    height: 50px;
    width: 250px;
    z-index: 1000;
    display: flex;
    flex-direction: row;
    border-radius: 50px;
    /*绝对布局居中法*/
    top: 50%;
    left: 50%;
    transition: transform 1s;
}
.searchBarItem{
    margin: auto auto;
    border-radius: 10px;
    height: 20px;
    line-height: 20px;
    font: 23px;
    font-weight: bold;
}
</style>
