<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 提示区域 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
            </el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- tab栏区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforTabLeave"
                    @tab-click="tabClick">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price" type="number">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight" type="number">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number" type="number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps"
                                @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
                            <!-- 复选框组 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="i" v-for="(i,index) in item.attr_vals" :key="index" border>
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="item in onlyTabData" :key="item.attr_id" :label="item.attr_name">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- antion 图片要上传到的后台api地址 -->
                        <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                            list-type="picture" :headers="headerObj" :on-success=handleSuccess>
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditorRef">
                        </quill-editor>
                        <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath">
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {

        data() {
            return {
                //步骤条的索引位
                activeIndex: '0',
                //添加商品的表单数据对象
                addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    goods_cat: [],
                    //图片上传
                    pics: [],
                    //商品的详情描述
                    goods_introduce: '',
                    attrs: [],


                },
                //表单验证规则
                addFormRules: {
                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' },
                    ],
                    goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' },],
                    goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' },],
                    goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' },],
                    goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' },],
                },
                //分类数据
                cateList: [],
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',

                },
                //动态参数列表数据
                manyTableData: [],
                //静态属性数据列表
                onlyTabData: [],
                //图片上传请求头
                headerObj: { Authorization: window.sessionStorage.getItem('token') },
                //
                previewPath: '',
                //图片预览对话框
                previewVisible: false,
                uploadURL: 'http://shop.zzp.world/api/private/v1/upload'
            }
        },
        methods: {
            //获取所有商品分类数据
            async getCateList() {
                const { data: res } = await this.$http.get('categories');
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.cateList = res.data;
            },
            // 级联选择器选中项变化
            handleChange() {
                if (this.addForm.goods_cat.length !== 3) {
                    this.addForm.goods_cat = []
                }
                //console.log(this.addForm.goods_cat)
            },
            //阻止页面切换  tab的属性 当离开当前页面去往下一个页面的时候触发
            beforTabLeave(active, oldActive) {
                if (this.addForm.goods_cat.length !== 3 && oldActive === '0') {
                    return false;
                }

            },
            //tab 点击事件
            async tabClick() {
                //访问的是动态参数面板
                if (this.activeIndex === '1') {
                    const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } });
                    if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
                    })
                    this.manyTableData = res.data;
                    //console.log(this.manyTableData);
                } else if (this.activeIndex === '2') {
                    const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } });
                    if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                    //console.log(res.data);
                    this.onlyTabData = res.data
                }
            },
            // 处理图片预览效果
            handlePreview(file) {
                this.previewPath = 'http://shop.zzp.world/' + file.response.data.tmp_path;
                this.previewVisible = true;
                console.log(file);
            },
            //处理图片移除
            handleRemove(file) {
                //获取将要删除的临时数据 从pics数组中找到对应的索引值 调用splice函数移除对应的图片
                const filepath = file.response.data.tmp_path;
                const i = this.addForm.pics.findIndex(x => x.pic === filepath)
                this.addForm.pics.splice(i, 1);
                //console.log(file);
            },
            //监听图片上传成功的事件
            handleSuccess(response) {
                //先得到一个图片数据 在把数据push到图片数组中
                const picInfo = { pic: response.data.tmp_path };
                this.addForm.pics.push(picInfo);
            },
            //添加商品详情
            add() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) {
                        return this.$message.error('请填写必要的表单项')
                    }
                    //lodash cloneDeep(obj)
                    const form = _.cloneDeep(this.addForm);
                    form.goods_cat = form.goods_cat.join(',');
                    // 动态属性
                    this.manyTableData.forEach(item => {
                        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') };
                        this.addForm.attrs.push(newInfo);
                    })
                    // 静态属性
                    this.onlyTabData.forEach(item => {
                        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
                        this.addForm.attrs.push(newInfo);
                    })
                    form.attrs = this.addForm.attrs;
                    //console.log(form);
                    // console.log(this.addForm);
                    const { data: res } = await this.$http.post('goods', form)
                    if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
                    this.$message.success('添加商品成功');
                    this.$router.push('/goods')
                })
            }
        },
        created() {
            this.getCateList();
        },
        computed: {
            cateId() {
                if (this.addForm.goods_cat.length === 3) {
                    return this.addForm.goods_cat[2]
                }
                return null
            }
        }
    }
</script>

<style scoped>
    .el-checkbox {
        margin: 0 10px 0 0 !important;
    }

    .addBtn {
        margin-top: 15px;
    }
</style>