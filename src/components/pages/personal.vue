<template>
    <div class="personalBox">
        <div class="personalInBox">
            <left-menu
                class="leftMenu"
                :menu-title="menuTitle"
                :btn-title="test"
                :page-index.sync="pageIndex"></left-menu>
            <div class="infoBox">
                <info v-if="pageIndex==0"></info>
                <safe v-if="pageIndex==1"></safe>
                <movie v-if="pageIndex==2"></movie>
            </div>
        </div>
    </div>
</template>

<script>
import leftMenu from '../menu/leftMenu.vue'
import info from '../personal/info.vue'
import safe from '../personal/safe.vue'
import movie from '../personal/movie.vue'
export default {
    components:{
        leftMenu,
        info,
        safe,
        movie
    },
    data(){
        return{
            menuTitle:'个人信息',
            test:{
                0:'个人资料',
                1:'账号安全',
                2:'我的番剧',
            },
            pageIndex:0,
        };
    },
    watch:{
        pageIndex:function(i){
            
        }
    }
}
</script>

<style>
.personalBox{
    display: flex;
    flex-direction: row;
}
.personalInBox{
    display: flex;
    flex-direction: row;
    margin: 3% auto;
}
.leftMenu{
    margin-left: auto;
}
.infoBox{
    background: rgba(24, 24, 24, 0.671);
    height: 650px;
    width: 750px;
    display: flex;
    flex-direction: column;
    padding-top: 0px;
    border-radius: 10px;
    margin-left: 2%;
}
</style>
