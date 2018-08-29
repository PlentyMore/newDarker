<template>
    <div class="aboutUsBox">
        <div style="margin: 0 auto;">
            <img src="../../../static/img/aboutUs.png" width="100%">
        </div>
        <div style="margin:50px auto;width:100%;height:200px;">
            <div style="margin:70px auto;">
            <p><span style="font-size:30px;font-weight:bold;">Darker </span>是一个在线弹幕网站</p>
                <p>B站找不到视频吗？只能下载到本地孤零零一人空虚寂寞冷地看吗？现在我们诚心为您提供一个拥有弹幕资源的在线视频播放器。</p>
                <p>只要您有视频，就能共享弹幕，本地视频从此不再单调！</p>
            </div>
        </div>
        <div style="margin:-30px auto;width:100%;height300px;display:flex;flex-direction:row;">
            <div style="display:flex;flex-direction:row;margin: auto auto">
                <div style="height:150px;width:300px;border:1px solid black;">
                    <p style="font-size:20px;margin:30px;">自动识别本地视频</p>
                    <p style="color:wheat">★★★★★</p>
                </div>
                <div style="height:150px;width:300px;border:1px solid black;">
                    <p style="font-size:20px;margin:30px;">提供在线弹幕</p>
                    <p style="color:wheat">★★★★★</p>
                </div>
                <div style="height:150px;width:300px;border:1px solid black;">
                    <p style="font-size:20px;margin:30px;">提供在线评论</p>
                    <p style="color:wheat">★★★★★</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../api.js";
export default {
  methods: {
    async func1() {
        console.log('正在执行func1');
        let a=await api.reVerifyEmail();
        console.log('请求完毕');
        return 123;
    },
    func2(){
        this.func1().then(a=>{
            console.log('执行完了func1',a);
        });
        console.log('func1外层')
    }
  },
  mounted(){
      this.func2();
  }
};
</script>

<style>
.aboutUsBox {
  display: flex;
  flex-direction: column;
  background: white;
  height: 755px;
}
</style>
