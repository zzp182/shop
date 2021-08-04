<template>
    <div>
         <!-- 面包屑导航区 -->
    <el-breadcrumb el-breadseparator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-row >
          <el-col >
            <el-button type="primary" @click="AddRoleDialogVisible=true">添加角色</el-button>
          </el-col>
        </el-row>
        <!-- 角色列表区 -->
        <el-table
            :data="rolelist" stripe  border >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row :class="['bdbottom'  , i1 === 0 ? 'bdtop':'' ,'vcenter' ]" v-for="(item1 , i1 ) in scope.row.children" :key="item1.id">
                 <el-col :span="5">
                   <el-tag @close="removeRightById(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                   <i class="el-icon-caret-right"></i>
                 </el-col>
                 <el-col :span="19">
                   <el-row :class="[i2 === 0 ? '' : 'bdtop' , 'vcenter']"  v-for="(item2 ,i2 ) in item1.children" :key="item2.id">
                     <el-col :span="6">
                       <el-tag @close="removeRightById(scope.row,item2.id)" type="success" closable>{{item2.authName}}</el-tag>
                       <i class="el-icon-caret-right"></i>
                     </el-col>
                     <el-col :span="18">
                       <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                        {{item3.authName}}
                       </el-tag>
                     </el-col>
                   </el-row>
                 </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope"  >
                     <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)" >编辑</el-button>
                     <el-button size="mini" type="danger"  icon="el-icon-edit" @click="removeRoleById(scope.row.id)">删除</el-button>
                     <el-button size="mini" type="warning" icon="el-icon-edit" @click="showSetRight(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>              
        </el-table>
    </el-card>
     <!-- 添加角色对话框 -->
            <el-dialog title="添加角色" :visible.sync="AddRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
              <el-form
               :model="addRoleForm"
                ref="addRoleFormRef"
                :rules="addRoleFormRules"
                label-width="100px"
              >
                <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                  <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="AddRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoles">确 定</el-button>
              </span>
            </el-dialog>

          <!-- 编辑角色的弹出框 -->
          <el-dialog  title="编辑角色"  :visible.sync="editRoleDialogVisible"  @close="editRoleDialogClosed"  width="40%" >
          <el-form 
          :model="editRoleForm" 
          ref="editRoleFormRef" 
          :rules="editRoleFormRules"  
          label-width="100px">
              <el-form-item label="角色名称" prop="roleName" >
                <el-input v-model="editRoleForm.roleName" disabled></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="email">
                <el-input v-model="editRoleForm.email"></el-input>
              </el-form-item>
          </el-form> 
            <span slot="footer" class="dialog-footer">
              <el-button @click="editRoleDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editRoles">确 定</el-button>
            </span>
        </el-dialog>
            <!-- 分配权限对话框 -->
        <el-dialog
          title="分配权限"
          :visible.sync="setRightDialog"
          width="50%"
          @close="setRightDialogClosed"
          >
           <el-tree :data="rightsList" :props="treeProps"  show-checkbox
            node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
              <el-button @click="setRightDialog = false">取 消</el-button>
              <el-button type="primary" @click="allotRight">确 定</el-button>
            </span>
        </el-dialog>
    </div>
    
</template>

<script>
// import Dialog from '../assembly/Dialog'
    export default {
        // components:{ Dialog },
        data(){
          return{ 
            rolelist:[],
            title:'',
            addRoleForm: {},
             //   编辑角色信息
            editRoleForm: {},

            editRoleDialogVisible: false,

            setRightDialog:false,
            //权限数据
            rightsList:[],

            defKeys:[],

            roleId:'',
            //树形控件的属性绑定对象
            treeProps:{
              label:'authName',
              children :'children'
            },

            editRoleFormRules: {
              roleName: [
                { required: true, message: '请输入角色名称', trigger: 'blur' }
              ],
              roleDesc: [
                { required: true, message: '请输入角色描述', trigger: 'blur' }
              ]
            },

            //   添加用户对话框
            AddRoleDialogVisible: false,
             //   添加角色表单验证
            addRoleFormRules: {
              roleName: [
                { required: true, message: '请输入角色名称', trigger: 'blur' }
              ],
              roleDesc: [
                { required: true, message: '请输入角色描述', trigger: 'blur' }
              ]
            },
          }
        },

         created(){
            //获取所有的权限
            this.getRolesList()
        },
        methods:{
            //获取权限列表
          async  getRolesList(){
                 const {data: res} = await this.$http.get('roles')
                 console.log(res)
                 if(res.meta.status !== 200){
                     return this.$message.error('获取角色列表失败')
                 }
                 this.rolelist = res.data; 
            },
             // 添加角色
            addRoles () {
              this.$refs.addRoleFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post('roles', this.addRoleForm)
                if (res.meta.status !== 201) {
                  this.$message.error('添加角色失败！')
                }
                this.$message.success('添加角色成功！')
                this.AddRoleDialogVisible = false
                this.getRolesList()
              })
            },
            // 添加角色对话框的关闭
            addRoleDialogClosed () {
              this.$refs.addRoleFormRef.resetFields()
            },
             // 编辑角色对话框的关闭
            editRoleDialogClosed () {
              this.$refs.editRoleFormRef.resetFields()
            },
            //编辑角色
            async showEditDialog (id) {
              const { data: res } = await this.$http.get('roles/' + id)
              if (res.meta.status !== 200) return this.$message.error('查询角色信息失败！')
              this.editRoleForm = res.data
              this.editRoleDialogVisible = true
            },
            editRoles () {
            this.$refs.editRoleFormRef.validate(async valid => {
              // console.log(valid)
              // 表单预校验失败
              if (!valid) return
              const { data: res } = await this.$http.put(
                'roles/' + this.editRoleForm.roleId,
                {
                  roleName: this.editRoleForm.roleName,
                  roleDesc: this.editRoleForm.roleDesc
                }
              )
              if (res.meta.status !== 200) {
                this.$message.error('更新角色信息失败！')
              }
              // 隐藏编辑角色对话框
              this.editRoleDialogVisible = false
              this.$message.success('更新角色信息成功！')
              this.getRolesList()
            })
          },
          // 删除角色
          async removeRoleById (id) {
            const confirmResult = await this.$confirm(
              '此操作将永久删除该角色, 是否继续?',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            ).catch(err => err)
            if (confirmResult !== 'confirm') {
              return this.$message.info('已取消删除')
            }
            const { data: res } = await this.$http.delete('roles/' + id)
            if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
            this.$message.success('删除用户成功！')
            this.getRolesList()
          },
          //删除权限标签
          async removeRightById(role , rightId){
            const confirmResult =   await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err => err)
            if( confirmResult !== 'confirm' ){
               return this.$message.info('取消了删除')
            }else{
            const {data : res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)  
             if(res.meta.status !== 200 ){
               return this.$message.error('删除权限失败！')
             }else{
              //  this.getRolesList()
              role.children = res.data
             }
            }
            
          },
          //分配权限
          async showSetRight(role){
            this.roleId = role.id
            //获取所有权限数据
            const {data : res} = await this.$http.get('rights/tree')
            if(res.meta.status != 200){
               return this.$message.error('获取权限代码失败')
            }
            this.rightsList = res.data
            console.log(this.rightsList)
            //赋值三级节点的id
            this.getLeafKeys(role,this.defKeys)
            this.setRightDialog = true
          },
          //递归获取角色三级权限的id
          getLeafKeys(node , arr){
            if(!node.children){
               return arr.push(node.id)
            }

            node.children.forEach(item => 
              this.getLeafKeys(item,arr)
            )
          },
          //监听对话框的关闭事件
          setRightDialogClosed(){
             this.defKeys = []
          },
          //点击为角色分配权限
          async allotRight(){
              const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
              ]
              console.log(keys)
              const idStr = keys.join(',')
              const {data : res}  = await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr})
              if(res.meta.status !== 200){
                 return this.$message.error('分配权限失败！')
              }
              this.$message.success('权限分配成功！')
              this.getRolesList()
              this.setRightDialog = false
            }


        } 
    }
</script>

<style  scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>