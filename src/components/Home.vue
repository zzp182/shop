<template>
  <div id="home">
    <el-container class="content">
        <!-- 主体头部 -->
            <el-header>
                <div class="left">
                    <img :src="imgSrc" alt="">
                    <span>后台管理系统</span>
                </div>
                <div class="right">
                <span class="sp">用户：{{username}}</span>
                <el-button type="info" @click="logout">退出</el-button>
                </div>
                
            </el-header>
        <el-container>
            <!-- 主体侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <!-- 伸缩按钮 -->
                <div class="tog" @click="toggle">
                 |||
                </div>
                <!-- 主体菜单 -->
               <el-menu
                 background-color="#333741"
                 text-color="#fff"
                 active-text-color="#409EFF"
                 unique-opened
                 :collapse = "isCollapse"
                 :collapse-transition="false"
                 router :default-active="activePath" >
                 <!-- 一级菜单 -->
                <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id" >
                    <template slot="title" >
                        <i :class="iconObj[item.id]"></i>
                        <span>{{item.authName}}</span>
                    </template>
                <!-- 二级菜单 -->
                        <el-menu-item :index="'/'+subItem.path + ''" v-for="subItem in item.children" 
                        :key="subItem.id" @click="saveName('/'+subItem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                </el-submenu>
               </el-menu>
            </el-aside>
            <!-- 主体内容区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
 
  </div>
</template>

<script>
export default {
 data(){
     return{
      uesrname:'',
      menulist:[],
      iconObj: {
        "125": "iconfont el-icon-user-solid",
        "103": "iconfont el-icon-s-help",
        "101": "iconfont el-icon-s-cooperation",
        "102": "iconfont el-icon-s-order",
        "145": "iconfont el-icon-s-platform"
      },
      isCollapse: false,
      activePath: '',
      imgSrc: require('../assets/logo.png'),
     }
 },

 created(){

    this.username = window.sessionStorage.user
    this.getmenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
 },

 methods:{
    //退出登录,清空sessionStorage
    logout(){
        window.sessionStorage.clear()
        this.$router.push("/login")
        this.$message.success('用户已退出')
    },
    //获取菜单列表
    async getmenuList(){
     const {data: res} = await this.$http.get('menus')
     if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
     this.menulist = res.data 
    },
    //菜单隐藏显示事件
    toggle(){
      this.isCollapse = !this.isCollapse 
    },
    //保存链接高亮状态
    saveName(activePath){
          window.sessionStorage.setItem('activePath',activePath)
          this.activePath = activePath
    }

 },


}
</script>

<style >
#home{
    height: 100%;
}
.content{
    height: 100%;
}
.el-header{
    background-color: #373d41;
    color: aliceblue;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    padding-left: 0 !important;
}
.sp{
    margin-right: 15px;
    font-size: 18px;
}
.left{
    display: flex;
    align-items: center;
}
.left img{
    width: 25px;
    height: 25px;
    margin-left: 25px;
}
.left span{
    margin-left: 15px;
}
.el-aside{
    background-color: #333744;
}
.el-menu{
    border-right: none !important;
}
.el-main{
    background-color: #eaedf1;
}
.iconfont{
    margin-right: 10px;
}
.tog{
    background-color: #4a5064;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>