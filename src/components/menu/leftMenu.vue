<template>
    <div class="leftMenuBox">
        <div class="menuTitle">{{menuTitle}}</div>
        <div v-for="(item,i) in btnTitle">
            <p @click="index=i">{{item}}</p>
        </div>
    </div>
</template>

<script>
export default {
    //btnTitle为一个字面量对象
    props:['menuTitle','btnTitle','pageIndex'],
    data(){
        return{
            index: this.pageIndex
        };
    },
    watch:{
        index:function(newValue){
            this.$emit('update:pageIndex',newValue);
        }
    }
}
</script>

<style>
.leftMenuBox{
    background: rgba(24, 24, 24, 0.671);
    height: 650px;
    width: 250px;
    display: flex;
    flex-direction: column;
    padding-top: 0px;
    border-radius: 10px;
}
.leftMenuBox p{
    height: 60px;
    line-height: 60px;
    cursor: pointer;
    margin: 0;
    transition: background .5s;
    color: white;
    font-size: 18px;
}
.leftMenuBox p:hover{
    background: rgba(255, 254, 254, 0.651);
}
.menuTitle{
    background: rgba(0, 0, 0, 0.418);
    height: 80px;
    width: 250px;
    line-height: 80px;
    font-size: 22px;
    font-weight: bold;
    color: white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
</style>
