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
              <el-button type="primary">添加分类</el-button>
          </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" 
        show-index index-text="#" border :show-row-hover="false">
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted === false"></i>
            <i class="el-icon-error"   style="color:red" v-else></i>
          </template>
      </tree-table>
      <!-- 分页区域 -->

    </el-card>
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
                columns:[
                  {
                    label:'分类名称',
                    prop:'cat_name'
                  },
                  {
                    label:'是否有效',
                    // prop:'cat_deleted',
                    //作用域插槽，模板列
                    type:'template',
                    //模板名称
                    template:'isok'
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
          }                    
        }
    }
</script>