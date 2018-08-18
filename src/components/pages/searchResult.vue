<template>
    <div class="searchResultPage">
        <div class="searchResultBox">
            <div v-for="(item,index) in result">
                <img :src="item.img" @click="test">
                <marquee behavior="alternate" scrollamount="6">{{item.name}}</marquee>
                <p>集数：{{item.episodes}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['searchText'],
    data(){
        return{
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
        test:function(){
            //alert(this.$route.params.searchText);
            console.log(this.searchText);
        }
    },
    watch:{
        searchText:function(newInfo){
            console.log(newInfo);
        }
    },
    created:function(){
        console.log(this.searchText);
    },
}
</script>

<style>
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
