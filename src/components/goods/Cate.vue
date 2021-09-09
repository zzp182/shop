<template>
    <div>
      <!-- 面包屑导航区 -->
    <el-breadcrumb el-breadseparator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
          <el-col >
              <el-button type="primary" @click="showAddCate">添加分类</el-button>
          </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" 
        show-index index-text="#" border :show-row-hover="false" style="margin-top:15px;">
        <!-- 是否有效 -->
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted === false"></i>
            <i class="el-icon-error"   style="color:red" v-else></i>
          </template>
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <!-- 操作-->
          <template slot="opt" >
            <el-button size="mini" type="primary" icon="el-icon-edit"  >编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </template>
      </tree-table>
      <!-- 分页区域 -->
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="addCate" width="50%" >
      <!-- 添加分类表单 -->
      <el-form ref="addCateFormRef" :model="addCateForm" label-width="100px" :rules="addCateFormRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类父级">
          <!-- <el-input v-model="addCateForm.cat_name"></el-input> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCate = false">取 消</el-button>
        <el-button type="primary" @click="addCate = false">确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                //指定查询条件
                queryInfo:{
                  type: 3,
                  pagenum: 1,
                  pagesize: 5
                },
                //商品分类数据列表
                catelist: [],
                total:0,
                addCate:false,
                addCateForm:{
                  cat_name:'',
                  //父级分类id
                  cat_pid:0,
                  //分类的id
                  cat_level:0,
                },
                addCateFormRules:{
                  cat_name:[
                    { required: true,message: '请输入分类名称', trigger: 'blur'}
                  ]
                },
                parentCateList:[],
                columns:[
                  {
                    label:'分类名称',
                    prop:'cat_name'
                  },
                  {
                    label:'是否有效',
                    //作用域插槽，模板列
                    type:'template',
                    //模板名称
                    template:'isok'
                  },
                  {
                    label:'排序',
                    //作用域插槽，模板列
                    type:'template',
                    //模板名称
                    template:'order'
                  },
                  {
                    label:'操作',
                    //作用域插槽，模板列
                    type:'template',
                    //模板名称
                    template:'opt'
                  }
                ]
            }
        },
        created(){
          this.getCateList()
        },
        methods:{
          //获取商品分类数据
          async getCateList(){
            const {data: res } = await this.$http.get('categories' , { params: this.queryInfo})
            if(res.meta.status !== 200){
              return this.$message.error('获取商品分类失败！');
            }
            //数据赋值
            this.catelist = res.data.result
            this.total = res.data.total
          },
          //监听pagesize变化
          handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getCateList()
          },
          //监听pagenum变化
          handleCurrentChange(newPage){
            this.queryInfo.pagenum =newPage
            this.getCateList()
          },
          showAddCate(){
            this.getParentCateList()
            this.addCate = true
          },
          //获取父级分类的数据列表
          async getParentCateList(){
            const { data: res } = await this.$http.get('categories', {
              params: { type: 2 }
            })
            if (res.meta.status !== 200) {
              return this.$message.error('获取父级分类失败！')
            }
            this.parentCateList = res.data
          }               
        }
    }
</script>