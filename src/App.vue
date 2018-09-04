<template>
  <div id="app">
    <div class="topBox">
      <menu-button-box
        @jmpIndex="jmpIndex"
        @jmpWatch="jmpWatch"
        @jmpPersonal="jmpPersonal"
        @jmpNotice="jmpNotice"></menu-button-box>
    </div>
    <!--
    <div class='searchBar' :style="searchBoxMove" @mouseover="shake=true" @mouseout="shake=false" v-show="showSearch" v-if="true">
      <div class="searchInBar">
        <p class="searchBarItem">搜索：</p>
        <input v-model="searchText" class="searchBarKey">
      </div>
    </div>
    -->
    <div class="searchCom" :style="searchBoxMove" @mouseover="showInputKey=true" @mouseout="onMouseLeaveSearchBox" v-show="showSearch">
      <!--<div class="searchComBg" v-show="!showInputKey"></div>-->
      <div :class="showInputKey?'searchIconLeftOnS':'searchIconLeft'"></div>
      <transition name="searchInputTran" v-show="showInputKey">
        <input @keyup.esc="backToIndex" :placeholder="getSearchPlaceholderText" class="searchKeyInput" v-if="showInputKey" v-model="searchText">
      </transition>
      <div :class="showInputKey?'searchIconRightOnS':'searchIconRight'"></div>
    </div>
    <transition name="routerTran" v-show="showInputKey">
      <router-view :key="activeDate" v-bind="routerInfo" style="margin-bottom:30px;" @toIndex="toIndex"></router-view>
    </transition>
    <footer1 style="margin-bottom:0;"></footer1>
  </div>
</template>

<script>
import MenuItemButton from "./components/menu/MenuItemButton.vue";
import MenuButtonBox from "./components/menu/MenuButtonBox.vue";
import footer1 from "./components/footer/footer.vue";
export default {
  name: "App",
  components: {
    MenuItemButton,
    MenuButtonBox,
    footer1
  },
  data() {
    return {
      routerInfo: {}, //用来传递数据给router-view对应组件用的包
      showMenu: false,
      showMain: false,
      searchText: "",
      shake: false,
      showInputKey: false,
      searchBoxMove: {
        transform: "translate(-50%,0%) rotateZ(0deg)"
      },
      activeDate: "",
      toIndexFlag:true,
    };
  },
  computed: {
    //当url不为首页和搜索结果页面时，不显示搜索框
    showSearch: function() {
      return this.$route.path === "/searchResult" || this.$route.path === "/";
    },
    getSearchPlaceholderText(){
      if(this.$route.path === "/searchResult")
        return " 按ESC返回";
      else return " 请输入关键词"
    },
    showFooter() {
      return this.$route.path !== "/";
    }
  },
  watch: {
    aNum: function(newValue) {
      TweenLite.to(this.$data, 0.5, { a: newValue + "px" });
    },
    searchText: async function(newText) {
      this.searchText = newText;
      this.routerInfo = {
        searchText: this.searchText  //传searText到searchResult
      };
      if(newText){
        console.log("newText not empty: ",newText);
        if(this.$route.path !== "/searchResult"){
          //如果当前页面是首页则跳转到searchResult
          console.log("go to searchResult page...");
          //螺旋升天的动画
          this.searchBoxMove = {
            transform: "translate(-50%,-150%) rotateZ(-360deg)"
          };
          this.$router.push({ name: "searchResult" });
        }
      }
    }
  },
  methods: {
    toIndex(){
      console.log('跳转到了首页');
      if(this.$route.path === "/"){
        //跳转到首页时看看searchText是否不为空，如果是则让搜索框回到初始状态
        if(this.searchText){
          this.searchText = "";
          this.showInputKey = false;
          this.searchBoxMove = {
            transform: "translate(-50%,0%) rotateZ(0deg)"
          };
        }
        else {
          this.showInputKey = false;
        }
      }
    },
    //组件中无法使用this.$router对象，只能在App.vue将跳转函数传递给组件
    jmpIndex: function() {
      this.activeDate = new Date().getTime();
      this.$router.push({ name: "index" });
    },
    jmpWatch: function() {
      // this.activeDate = new Date().getTime();
      this.$router.push({ name: "blank"});
      this.$router.push({ name: "watch"});
      // setTimeout(()=>{
      //
      //   this.$router.push({ name: "watch"});
      // },100);

    },
    jmpPersonal: function() {
      this.activeDate = new Date().getTime();
      this.$router.push({ name: "personal" });
    },
    jmpNotice: function(pageNum) {
      console.log("App", pageNum);
      console.log(window.location.host);
      this.activeDate = new Date().getTime();
      this.routerInfo = {
        noticeIndex: pageNum
      };
      //window.location.assign('#/notice/'+pageNum);
      //this.$router.push({ name: "notice", params: { pageNum: pageNum } });
      this.$router.push({ name: "notice", query: { pageNum: pageNum } });
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
    backToIndex(){
      console.log("esc keyup");
      if(this.$route.path === "/searchResult"){
        this.searchText = "";
        this.showInputKey = false;
        this.searchBoxMove = {
          transform: "translate(-50%,0%) rotateZ(0deg)"
        };
        this.$router.push({name:'index'});
        console.log("backToIndex!!!");
      }
    },
    onMouseLeaveSearchBox(){
      if(this.$route.path === "/"){
        if(this.searchText === ""){
          this.showInputKey = false;
        }
      }
    }
  }
};
</script>

<style>
  .vicp-wrap {
    background-color: #07070c !important;
    width: 450px !important;
  }
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.routerTran-enter-active,
.routerTran-leave-active {
  transition: opacity 0.3s;
}
.routerTran-enter, .routerTran-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.searchCom {
  position: absolute;
  top: 200px;
  left: 50%;
  z-index: 1000;
  display: flex;
  flex-direction: row;
  height: 50px;
  transition: 1s all;
}
.searchComBg{
  background-image: url("../static/img/search.png");
  background-size: cover;
  width: 50px;
  border-radius: 5px;
  opacity: 0.8;
  border: 2px solid black;
}
.searchIconLeft {
  background-image: url("../static/img/searchLeft.png");
  background-size: cover;
  height: 50px;
  width: 25px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  opacity: 0.8;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  border-left: 2px solid black;
}
  .searchIconLeftOnS {
    background-image: url("../static/img/searchLeft.png");
    background-size: cover;
    height: 50px;
    width: 25px;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    opacity: 0.8;
    border-top: 2px solid black;
    border-bottom: 2px solid black;
    border-left: 2px solid black;
  }
.searchIconRight {
  background-image: url("../static/img/searchRight.png");
  background-size: cover;
  height: 50px;
  width: 25px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  opacity: 0.8;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  border-right: 2px solid black;
}
  .searchIconRightOnS {
    background-image: url("../static/img/searchRight.png");
    background-size: cover;
    height: 50px;
    width: 25px;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
    opacity: 0.8;
    border-top: 2px solid black;
    border-bottom: 2px solid black;
    border-right: 2px solid black;
  }
.searchKeyInput {
  height: 50px;
  width: 200px;
  background: rgba(255, 255, 255, 0.534);
  outline: none;
  font-size: 30px;
  border: 0px;
  padding-left: 5px;
  padding-right: 5px;
  font-weight: bold;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}
.searchInputTran-leave-active,
.searchInputTran-enter-active {
  transition: all 0.5s ease;
}
.searchInputTran-leave-active,
.searchInputTran-enter {
  width: 0px !important;
  padding-left: 0px;
  padding-right: 0px;
  /*!important 将该样式优先级调至最高*/
}
.searchInputTran-leave,
.searchInputTran-enter-active {
  width: 200px;
  padding-left: 5px;
  padding-right: 5px;
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
.searchBar {
  background: rgba(86, 100, 104, 0.8);
  position: absolute;
  opacity: 1;
  height: 50px;
  width: 450px;
  border-radius: 80px;
  border: 1px solid #c3b8b8;
  z-index: 300;
  display: flex;
  flex-direction: row;
  filter: grayscale(15%);
  /*绝对布局居中法*/
  top: 380px;
  left: 50%;
  transition: transform 1s;
}
.searchInBar {
  margin: auto auto;
  display: flex;
  flex-direction: row;
  width: 450px;
}
.searchBarKey {
  outline: none;
  height: 20px;
  background: rgba(255, 255, 255, 0);
  border: 1px dashed black;
  /*padding:10px;*/
  font-size: 20px;
  font-family: 'Sigmar One', cursive;
  font-weight: bold;
  line-height: 20px;
  margin: auto auto;
}
.searchBarKey:hover {
  border: 1px dashed black;
}
.searchBarKey:active {
  border: 1px dashed black;
}
.searchBarItem {
  color: black;
  margin: auto auto;
  margin-right: 10px;
  line-height: 23px;
  font-size: 25px;
  font-family: 华文琥珀,serif;
  font-weight: bold;
  text-align: center;
}
.searchRun-animation {
  animation: searchBarShake 0.5s linear 0s 1 normal;
}
@keyframes searchBarShake {
  0% {
    transform: translate(-50%, -500%) rotate(-3deg);
  }
  12.5% {
    transform: translate(-50%, -500%) rotate(0deg);
  }
  25% {
    transform: translate(-50%, -500%) rotate(3deg);
  }
  37.5% {
    transform: translate(-50%, -500%) rotate(0deg);
  }
  50% {
    transform: translate(-50%, -500%) rotate(-3deg);
  }
  62.5% {
    transform: translate(-50%, -500%) rotate(0deg);
  }
  75% {
    transform: translate(-50%, -500%) rotate(3deg);
  }
  87.5% {
    transform: translate(-50%, -500%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -500%) rotate(-3deg);
  }
}
.searchRun-animation2 {
  animation: searchBarShake2 0.5s linear 0s 1 normal;
}
@keyframes searchBarShake2 {
  0% {
    transform: translate(-50%, -600%) rotate(0deg);
  }
  12.5% {
    transform: translate(-50%, -600%) rotate(-3deg);
  }
  25% {
    transform: translate(-50%, -600%) rotate(0deg);
  }
  37.5% {
    transform: translate(-50%, -600%) rotate(3deg);
  }
  50% {
    transform: translate(-50%, -600%) rotate(0deg);
  }
  62.5% {
    transform: translate(-50%, -600%) rotate(-3deg);
  }
  75% {
    transform: translate(-50%, -600%) rotate(0deg);
  }
  87.5% {
    transform: translate(-50%, -600%) rotate(3deg);
  }
  100% {
    transform: translate(-50%, -600%) rotate(0deg);
  }
}
</style>
