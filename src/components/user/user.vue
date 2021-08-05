<template>
  <div id="user">
    <!-- 面包屑导航区 -->
    <el-breadcrumb el-breadseparator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card >
      <el-row :gutter="15">
        <el-col :span="10">
        <!-- 搜索与添加区 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getUserList'>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"  ></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="addDialog = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userlist" border> 
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope" >
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" >
          <template slot-scope="scope">
            <!-- 修改用户 -->
            
               <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.id)"></el-button>
           
            <!-- 删除用户 -->
           
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row.id)"></el-button>
            
            <!-- 分配角色 -->
            <el-tooltip  effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页显示区 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[6,8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialog"
      @close="addClose"
      width="50%">
     <el-form :model="addForm" :rules="addRuleForm" ref="addFormRef" label-width="70px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
     </el-form> 
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
   </el-dialog>

    <!-- 编辑用户的弹出框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialog"
      @close="addClose"
      width="50%"
      @click="editClose">
     <el-form :model="editFrom" :rules="addRuleForm" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
         <el-form-item label="手机" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
     </el-form> 
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
   </el-dialog>
   <!-- 分配角色弹出框 -->
   <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialog"
      width="50%"
      @close="setRoleDialogClosed"
      >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleid" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
export default {
 data(){
   //校验邮箱规则
   var checkEmail = (rule,value,cb)=>{
     const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
     if(regEmail.test(value)){
       return cb()
     }
     cb(new Error('请输入合法的邮箱'))
   }
   //校验手机号规则
   var checkMobile = (rule,value,cb)=>{
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
      if(regMobile.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
   }
   return{
    //获取用户列表参数对象
     queryInfo:{
       query:'',
       //当前的页数
       pagenum:1,
       pagesize:6,
     },
     userlist:[],
     //查询到的用户信息对象
     editFrom:{},
     total:0,
     addDialog:false,
     editDialog:false,
     addForm:{
       username:"",
       password:"",
       email:"",
       mobile:""
     },
     addRuleForm:{
       username:[
          { required: true, message: "请输入用户名", trigger: "blur" },
          {  require: true, min: 3, max: 10, message: "用户名长度在 3 到 10 个字符", trigger: "blur"}
         ],
        password:[
          { required:true,message:'请输入密码',trigger:'blur'},
          { require: true,min:6,max:15,message:'用户名长度在6~15个字符之间',trigger:'blur'}
         ],
       email:[
          { required:true,message:'请输入邮箱',trigger:'blur'},
          { validator: checkEmail, trigger: "blur" }
        ],
       mobile:[
          { required:true,message:'请输入电话',trigger:'blur'},
          { validator: checkMobile, trigger: "blur" }
        ]
     },
     setRoleDialog:false,
     userInfo:{},
     rolesList:[],
     selectedRoleid:'' 
   }
 },
 created(){
   this.getUserList()
 },
 methods:{
  async getUserList(){
    const {data : res} = await this.$http.get('users',{ params : this.queryInfo })
    if(res.meta.status !== 200){
     return this.$message.error('获取用户列表失败')
    }
    this.userlist = res.data.users
    this.total = res.data.total 
   },
  //  监听 pagesize 的事件
   handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize;
      this.getUserList();
   },
   //监听页码值改变的事件
   handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage;
        this.getUserList();
   },
   //监听状态的变化
  async userStateChange(userInfo){
      const {data: res} = await  this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if(res.meta.status !== 200){
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
   },
   //添加对话框关闭重置事件
   addClose(){
      this.$refs.addFormRef.resetFields();
   },
   //添加用户事件
   addUser(){
       this.$refs.addFormRef.validate(async valid=>{
         if(!valid) return
         const{data : res} = await this.$http.post('users',this.addForm)
         if(res.meta.status !== 201){this.$message.error('添加用户失败！')}
         this.$message.success('添加用户成功！')
         this.addDialog = false;
         this.getUserList();
       })
   },
   //编辑用户事件
    async showEditDialog(id){
    const {data : res} = await this.$http.get('users/'+id);
    if(res.meta.status !== 200){
        return this.$message.error('查询用户信息失败');
    }
    this.editFrom = res.data;
    this.editDialog = true;
   },
   //编辑用户提交事件
   editUser(){
     this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return;
        //发起修改用户信息的数据请求
      const {data : res } = await  this.$http.put('users/'+this.editFrom.id,
        {email: this.editFrom.email,
        mobile: this.editFrom.mobile
        })
        if(res.meta.status != 200){
          return this.$message.error('更新用户信息失败！')
        }
        this.editDialog = false;
        this.getUserList();
        this.$message.success('更新用户状态成功！')

     })
   },
   //编辑用户重置事件
    editClose(){
      this.$refs.editFrom.resetFields();
    },
   //删除用户
  async remove(id){
    const res = await this.$confirm('是否删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'}).catch(err => err);
          if(res !== 'confirm'){
            return this.$message.info('已取消删除')
          }
         const {data : delRes} = await this.$http.delete('users/'+id)
         if(delRes.meta.status !== 200){
           return this.$message.error('删除用户失败！')
         }
         this.$message.success('删除用户成功！');
         this.getUserList();
   },
   //分配角色
  async setRole(userInfo){
     console.log(userInfo)
     this.userInfo = userInfo
     //在展示对话框之前，获取所有角色的列表
     const { data: res } =  await this.$http.get('roles')
     if(res.meta.status !== 200 ){
       return this.$message.error('获取角色列表失败！')
     }
     this.rolesList = res.data
     this.setRoleDialog = true
   },
   //点击确定按钮分配角色
  async saveRoleInfo(){
       if(!this.selectedRoleid){
          return this.$message.error('请选择要分配的角色！')
       }  
       const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
         rid: this.selectedRoleid
       }) 
       if(res.meta.status !== 200){
           return this.$message.error('更新角色失败！')
       }
        this.$message.success('更新角色成功！')
        this.getUserList()
        this.setRoleDialog = false
   },  
   // 分配角色对话框关闭事件
    setRoleDialogClosed () {
      this.selectedRoleid = ''
      this.userInfo = {}
    }
     
 }

}
</script>

<style>

</style>