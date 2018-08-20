<template>
    <div class="box">
        <div class="logo" v-on:jmp="mainPage">
            <img src="../../../static/img/logo.png" class="logoImg">
            <div class="logoTitle">Darker</div>
        </div>
        <div class="headerBtnBox">
            <div class="headerBtnInBox">
                <menu-item-button style="margin:0 auto;" v-on:jmp="mainPage" icon-img="../../../static/img/home2.png">首页</menu-item-button>
                <menu-item-button style="margin:0 20px;" v-on:jmp="watchPage" icon-img="../../../static/img/video.png">观看</menu-item-button>
            </div>
        </div>
        <div class="msgAndUserBtn">
            <message-menu
              :unread-notice-num="unreadNotice"
              @jmpNotice="noticePage"
              v-if="isLogin"
              style="margin:auto auto;"></message-menu>
            <!-- v-bind传入动态值 -->
            <user-menu
                :is-login.sync="isLogin"
                @jmpPersonal="personalPage"
                style="margin:auto auto;"></user-menu>
        </div>
    </div>
</template>

<script>
import MenuItemButton from "./MenuItemButton.vue";
import UserMenu from "./UserMenu.vue";
import MessageMenu from "./MessageMenu.vue";
import api from "../../api";
export default {
  data() {
    return {
      isLogin: false,
      //循环延时执行器
      intervalId: "",
      unreadNotice: {
        at: 0,
        like: 0,
        reply: 1,
        system: 0,
        total: 1
      }
    };
  },
  components: {
    MenuItemButton,
    UserMenu,
    MessageMenu
  },
  methods: {
    mainPage: function() {
      this.countUnreadMsg();
      this.$emit("jmpIndex");
    },
    watchPage: function() {
      this.countUnreadMsg();
      this.$emit("jmpWatch");
    },
    personalPage: function() {
      this.countUnreadMsg();
      this.$emit("jmpPersonal");
    },
    noticePage: function(pageNum) {
      console.log("MenuButtonBox", pageNum);
      this.countUnreadMsg();
      this.$emit("jmpNotice", pageNum);
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
    //检测未读消息
    async countUnreadMsg() {
      let uid = localStorage.getItem("USER_ID");
      if (uid) {
        let res = await api.countUnreadMsg(uid);
        let rd = res.data;
        if (rd.code === 0) {
          console.log("更新未读信息列表:", rd);
          this.unreadNotice = rd.data;
        } else {
          console.log("no new msg");
        }
      } else {
        console.log("未登陆");
      }
    }
  },
  watch: {
    isLogin: function() {
      console.log("isLogin 改变了");
    }
  },
  //渲染阶段函数，检测当前登陆状态
  async mounted() {
    if (this.checkLocalStorage()) {
      let saveLoginName = localStorage.getItem("loginUserName");
      let JWT_TOKEN = localStorage.getItem("JWT_TOKEN");
      let USER_ID = localStorage.getItem("USER_ID");
      //this.tap("check userid: " + USER_ID);
      if (JWT_TOKEN == null || JWT_TOKEN === "") {
        this.isLogin = false;
        return;
      }
      //检查Token是否过期
      let res = await api.checkToken(JWT_TOKEN);
      //this.tap(res.data);
      if (res.data.code === 0 || res.data.msg === "ojbk") {
        this.isLogin = true;
        this.loginUserName = saveLoginName;
      }
    }
  },
  //created阶段函数，
  created() {
    console.log("app created!");
    this.countUnreadMsg();
    if (this.checkLocalStorage()) {
      if (
        localStorage.getItem("USER_ID") &&
        localStorage.getItem("JWT_TOKEN") &&
        localStorage.getItem("loginUserName") &&
        localStorage.getItem("ROLE")
      ) {
        this.isLogin = true;
        console.log("set isLogin true!");
      } else {
        this.isLogin = false;
      }
      if (localStorage.getItem("USER_ID") && this.isLogin) {
        //每1分钟检测一次未读消息
        this.intervalId = setInterval(() => {
          this.countUnreadMsg();
        }, 60000);
      }
    }
  },
  //销毁前阶段，清除循环延时执行器
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
};
</script>

<style>
.box {
  width: 100%;
  height: 60px;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(169, 169, 169, 0.1);
  background-size: 200%;
  transition: background-color 0.5s;
  display: flex;
  flex-direction: row;
}
.box:hover {
  background-color: rgba(169, 169, 169, 0.7);
}
.headerBtnBox {
  margin: 0 auto;
}
.headerBtnInBox {
  margin: 0 auto;
  width: 230px;
  display: flex;
  flex-direction: row;
}
.logo {
  left: 0;
  height: 60px;
  width: 400px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
}
.logoImg {
  height: 40px;
  margin: auto 20px;
  filter: invert(0%);
}
.logo:hover {
  animation: mymove 0.5s infinite;
  animation-iteration-count: 1;
}
@keyframes mymove {
  0% {
    filter: invert(100%);
  }
  20% {
    filter: invert(0%);
  }
  38% {
    filter: invert(100%);
  }
  54% {
    filter: invert(0%);
  }
  68% {
    filter: invert(100%);
  }
  80% {
    filter: invert(0%);
  }
  90% {
    filter: invert(100%);
  }
  99% {
    filter: invert(0%);
  }
}
.logoTitle {
  width: 140px;
  font-size: 35px;
  font-family: Stencil Std;
  line-height: 50px;
  margin: 10px -10px;
  color: black;
}
.msgAndUserBtn {
  height: 60px;
  width: 220px;
  margin-right: 180px;
  display: flex;
  flex-direction: row;
}
</style>
