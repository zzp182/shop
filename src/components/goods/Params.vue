<template>
    <div>
      <!-- 面包屑导航区 -->
    <el-breadcrumb el-breadseparator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
          <el-col >
              <el-button type="primary">分类参数</el-button>
          </el-col>
      </el-row>
    </el-card>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                
            }
        },
        created(){},
        methods:{

        }
    }
</script>