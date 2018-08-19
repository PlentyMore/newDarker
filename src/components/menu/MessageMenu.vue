<template>
    <div class="msgBox">
        <div class="msgInbox" @mouseover="show=true" @mouseout="show=false">
            <menu-item-button class="msgTitle">消息<div class="unreadNum" v-if="unreadNoticeNum.total!=0"><p>{{unreadNoticeNum.total}}</p></div></menu-item-button>
            <transition name="msgMenu">
                <div v-if="show" class="msgMenuBox">
                    <div class="msgItemBox">
                        <p class="msgItem" @click="jmpNotice(0)">系统通知 <span class="unReadItemNum" v-if="unreadNoticeNum.system>0">{{unreadNoticeNum.system}}</span></p>
                        <p class="msgItem" @click="jmpNotice(1)">回复我的 <span class="unReadItemNum" v-if="unreadNoticeNum.reply>0">{{unreadNoticeNum.reply}}</span></p>
                        <p class="msgItem" @click="jmpNotice(2)">@我的 <span class="unReadItemNum" v-if="unreadNoticeNum.at>0">{{unreadNoticeNum.at}}</span></p>
                        <p class="msgItem" @click="jmpNotice(3)">收到的赞 <span class="unReadItemNum" v-if="unreadNoticeNum.like>0">{{unreadNoticeNum.like}}</span></p>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import MenuItemButton from "./MenuItemButton.vue";
export default {
  props:['unreadNoticeNum'],
  components: {
    MenuItemButton
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    jmpNotice(pageNum) {
      this.$emit("jmpNotice",pageNum);
    }
  }
};
</script>

<style>
.msgBox {
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
}
.msgInbox {
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
}
.msgTitle {
  cursor: pointer;
}
.msgMenu-leave-active,
.msgMenu-enter-active {
  transition: all 0.2s ease;
}
.msgMenu-leave-active,
.msgMenu-enter {
  height: 0px !important;
  /*!important将该样式优先级调至最高*/
}
.msgMenu-leave,
.msgMenu-enter-active {
  height: 100px;
}
.msgMenuBox {
  background: white;
  position: absolute;
  right: 5.5%;
  top: 60px;
  overflow: hidden;
  height: 160px;
  width: 180px;
  border-radius: 8px;
  box-shadow: 0px 10px 20px gainsboro;
  display: flex;
  flex-direction: column;
}
.msgItemBox {
  width: 100%;
  height: 140px;
  margin: auto;
  display: flex;
  flex-direction: column;
}
.msgItem {
  height: 35px;
  width: 100%;
  line-height: 35px;
  margin: 0;
  cursor: pointer;
  transition: background 0.4s;
}
.msgItem:hover {
  background: rgba(100, 149, 237, 0.6);
}
.unreadNum{
  background: red;
  position: absolute;
  height: 15px;
  width: 15px;
  border-radius: 15px;
  top:12px;
  right: 125px;
}
.unreadNum p{
  margin: 0 0;
  color: white;
  font-size: 10px;
  line-height: 15px;
}
.unReadItemNum{
  color: red;
  font-size: 12px;
}
</style>
