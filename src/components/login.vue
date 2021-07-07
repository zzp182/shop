<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像区域 -->
        <div class="avatar_box">
          <img :src="imgSrc" alt="">
        </div>
        <!-- 表单区域 -->
      <el-form ref="loginRef" :model="loginForm"  class="card" :rules="loginRules">
        <!-- 用户名 -->
        <el-form-item  prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
         <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="密码" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item  class="btns">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
     <!-- <ul class="bg-bubbles">
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
		</ul> -->
  </div>
</template>

<script>
export default {
 data(){
   return{
     loginForm:{
       username:'admin',
       password:'123456'
     },
     imgSrc: require('../assets/logo.png'),
  //验证规则
      loginRules: {
                username: [
                  { required: true, message: '请输入用户名', trigger: 'blur' },
                  { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                  password: [
                  { required: true, message: '请输入密码', trigger: 'blur' },
                  { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
      }
   }
 },
 methods:{
   //登录功能按钮
  login(){
    this.$refs.loginRef.validate( async(valid)=>{
        if(!valid) return;
        const {data : res} = await  this.$http.post("login",this.loginForm);
        if(res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功')
        window.sessionStorage.setItem("token",res.data.token)
        this.$router.push("/home");
        window.sessionStorage.setItem("user",res.data.username)
        //console.log(res);
    })
  },
   //重置功能按钮
   resetForm(){
    this.$refs.loginRef.resetFields()
   }
 }

}
</script>

<style  lang="less" scoped>
.login{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

}
.avatar_box{
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left:50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.card{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  
}
.btns{
   display: flex;
   justify-content: flex-end;
 
}

</style>