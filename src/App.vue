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
    <div class="searchCom" :style="searchBoxMove" @mouseover="showInputKey=true" @mouseout="showInputKey=!searchText==''" v-show="showSearch">
      <div class="searchIconLeft"></div>
      <transition name="searchInputTran">
        <input class="searchKeyInput" v-if="showInputKey" v-model="searchText">
      </transition>
      <div class="searchIconRight"></div>
    </div>
    <router-view :key="activeDate" v-bind="routerInfo"></router-view>
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
      routerInfo: {}, //用来传递数据给router-view对应组件用的包
      showMenu: false,
      showMain: false,
      searchText: "",
      shake:false,
      showInputKey:false,
      searchBoxMove: {
        transform: "translate(-50%,0%) rotateZ(0deg)"
      },
      activeDate: ""
    };
  },
  computed: {
    //当url不为首页和搜索结果页面时，不显示搜索框
    showSearch: function() {
      if (this.$route.path == "/searchResult" || this.$route.path == "/")
        return true;
      else return false;
    }
  },
  watch: {
    aNum: function(newValue) {
      TweenLite.to(this.$data, 0.5, { a: newValue + "px" });
    },
    searchText: async function(newText) {
      this.searchText = newText;
      if (newText == "") {
        this.showInputKey=false;
        this.searchBoxMove = {
          transform: "translate(-50%,0%) rotateZ(0deg)"
        };
        this.$router.push({ name: "index" });
      } else {
        this.routerInfo = {
          searchText: this.searchText
        };
        this.searchBoxMove = {
          transform: "translate(-50%,-150%) rotateZ(-360deg)"
        };
        this.$router.push({ name: "searchResult" });
      }
    }
  },
  methods: {
    //组件中无法使用this.$router对象，只能在App.vue将跳转函数传递给组件
    jmpIndex: function() {
      this.activeDate = new Date().getTime();
      this.$router.push({ name: "index" });
    },
    jmpWatch: function() {
      this.activeDate = new Date().getTime();
      this.$router.push({ name: "watch" });
    },
    jmpPersonal: function() {
      this.activeDate = new Date().getTime();
      this.$router.push({ name: "personal" });
    },
    jmpNotice: function(pageNum) {
      console.log("App", pageNum);
      console.log(window.location.host);
      this.activeDate = new Date().getTime();
      this.routerInfo={
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
    }
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
.searchCom{
  position: absolute;
  top: 200px;
  left: 50%;
  z-index: 400;
  display: flex;
  flex-direction: row;
  height: 50px;
  transition: 1s all;
}
.searchIconLeft{
  background-image: url("../static/img/searchLeft.png");
  background-size: cover;
  height: 50px;
  width: 25px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  opacity: .8;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  border-left: 2px solid black;
}
.searchIconRight{
  background-image: url("../static/img/searchRight.png");
  background-size: cover;
  height: 50px;
  width: 25px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  opacity: .8;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  border-right: 2px solid black;
  margin-left: -0.1px;
}
.searchKeyInput{
  height: 50px;
  width: 200px;
  background: rgba(255, 255, 255, 0.534);
  outline: none;
  font-size: 30px;
  border: 0px;
  padding-left: 5px;
  padding-right: 5px;
  font-weight: bold;
}
.searchInputTran-leave-active,
.searchInputTran-enter-active {
  transition: all 0.2s ease;
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
.searchInBar{
  margin: auto auto;
  display: flex;
  flex-direction: row;
  width: 450px;
}
.searchBarKey{
  outline: none;
  height: 20px;
  background: rgba(255, 255, 255, 0);
  border: 1px dashed black;
  /*padding:10px;*/
  font-size: 20px;
  font-family: 华文琥珀;
  font-weight: bold;
  line-height: 20px;
  margin: auto auto;
}
.searchBarKey:hover{
  border: 1px dashed black;
}
.searchBarKey:active{
  border: 1px dashed black;
}
.searchBarItem {
  color: black;
  margin: auto auto;
  margin-right: 10px;
  line-height: 23px;
  font-size: 25px;
  font-family: 华文琥珀;
  font-weight: bold;
  text-align: center;
}
.searchRun-animation{
  animation: searchBarShake .5s linear 0s 1 normal;
}
@keyframes searchBarShake {
  0%{transform: translate(-50%,-500%) rotate(-3deg);}
  12.5%{transform: translate(-50%,-500%) rotate(0deg);}
  25%{transform: translate(-50%,-500%) rotate(3deg);}
  37.5%{transform: translate(-50%,-500%) rotate(0deg);}
  50%{transform: translate(-50%,-500%) rotate(-3deg);}
  62.5%{transform: translate(-50%,-500%) rotate(0deg);}
  75%{transform: translate(-50%,-500%) rotate(3deg);}
  87.5%{transform: translate(-50%,-500%) rotate(0deg);}
  100%{transform: translate(-50%,-500%) rotate(-3deg);}
}
.searchRun-animation2{
  animation: searchBarShake2 .5s linear 0s 1 normal;
}
@keyframes searchBarShake2 {
  0%{transform: translate(-50%,-600%) rotate(0deg);}
  12.5%{transform: translate(-50%,-600%) rotate(-3deg);}
  25%{transform: translate(-50%,-600%) rotate(0deg);}
  37.5%{transform: translate(-50%,-600%) rotate(3deg);}
  50%{transform: translate(-50%,-600%) rotate(0deg);}
  62.5%{transform: translate(-50%,-600%) rotate(-3deg);}
  75%{transform: translate(-50%,-600%) rotate(0deg);}
  87.5%{transform: translate(-50%,-600%) rotate(3deg);}
  100%{transform: translate(-50%,-600%) rotate(0deg);}
}
</style>
