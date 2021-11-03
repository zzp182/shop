<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index
                index-text="#" border class="treeTable">
                <!-- 是否有效 -->
                <template slot="isOk" slot-scope="scope">
                    <i class="el-icon-check" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                    <i class="el-icon-close" v-else style="color: red;"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
                    <el-tag type="warning" v-else-if="scope.row.cat_level === 2" size="mini">三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" >
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="qurrInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="qurrInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
            <el-form :model="AddCateForm" :rules="AddCateRules" ref="AddCateFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="AddCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps"
                        @change="parentCateChange" clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //查询条件
                qurrInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5,
                },
                //商品分类的数据列表
                cateList: [],
                //总数据条数
                total: 0,
                //为table指定列的定义
                columns: [
                    {
                        label: "分类名称",
                        prop: 'cat_name',
                    },
                    {
                        label: "是否有效",
                        type: 'template',
                        //表示当前列使用的模板名称
                        template: 'isOk'
                    },
                    {
                        label: "排序",
                        type: 'template',
                        //表示当前列使用的模板名称
                        template: 'order'
                    },
                    {
                        label: "操作",
                        type: 'template',
                        //表示当前列使用的模板名称
                        template: 'opt'
                    }
                ],
                //添加分类对话框隐藏与显示
                addCateDialogVisible: false,
                //添加分类对话校验规则
                AddCateRules: { cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }] },
                //添加分类表单数据
                AddCateForm: {
                    //将要添加分类的名称
                    cat_name: '',
                    //父级分类的id
                    cat_pid: 0,
                    //分类的等级
                    cat_level: 0,

                },
                //父级分类的列表
                parentCateList: [],
                //级联选择器props
                cascaderProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    checkStrictly: true,
                },
                //选中的父级分类id数组
                selectedKeys: [],
            }

        },
        methods: {
            //获取商品分类数据
            async getCateList() {
                const { data: res } = await this.$http.get('categories', { params: this.qurrInfo });
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.cateList = res.data.result;
                this.total = res.data.total
            },
            //监听每页几条
            handleSizeChange(newsize) {
                this.qurrInfo.pagesize = newsize;
                this.getCateList();
            },
            //监听当前页
            handleCurrentChange(newPage) {
                this.qurrInfo.pagenum = newPage;
                this.getCateList();
            },
            //点击按钮展示添加分类对话框
            showAddCateDialog() {
                //获取父级分类的数据列表
                this.getParentCateList();
                this.addCateDialogVisible = true;
            },
            //获取父级分类名称
            async getParentCateList() {
                const { data: res } = await this.$http.get('categories', { params: { type: 2 } });
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.parentCateList = res.data;
            },
            //选择项发生变化触发函数
            parentCateChange() {
                if (this.selectedKeys.length > 0) {
                    this.AddCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
                    this.AddCateForm.cat_level = this.selectedKeys.length;
                    return
                } else {
                    this.AddCateForm.cat_pid = 0;
                    this.AddCateForm.cat_level = 0;
                }
            },
            //点击按钮添加新的分类
            addCate() {
                this.$refs.AddCateFormRef.validate(async valid => {
                    if (!valid) return;
                    const { data: res } = await this.$http.post('categories', this.AddCateForm);
                    if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
                    this.$message.success('添加分类成功');
                    this.getCateList();
                    this.addCateDialogVisible = false;
                })
            },
            //监听对话框的关闭事件重置表单数据
            addCateDialogClosed() {
                this.$refs.AddCateFormRef.resetFields();
                this.selectedKeys = [];
                this.AddCateForm.cat_level = 0;
                this.AddCateForm.cat_pid = 0;
            }
        },
        created() {
            this.getCateList();
        },
    }
</script>

<style scoped>
    .treeTable {
        margin-top: 20px;
    }

    .el-cascader {
        width: 100%;
    }
</style>