<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 订单列表数据 -->
            <el-table :data="OderList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="order_pay">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot>
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!--修改地址对话框  -->
        <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addressVisible = false">取 消</el-button>
                <el-button type="primary" @click="addressVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 展示物流进度的对话框 -->
        <!-- <el-dialog title="物流进度" :visible.sync="progressBoxVisible" width="50%">
            <el-timeline reverse="true">
                <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
                    {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog> -->
    </div>
</template>

<script>
    import cityData from './citydata.js'
    export default {
        data() {
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10,
                },
                OderList: [],
                total: 0,
                addressVisible: false,
                addressForm: {
                    address1: [],
                    address2: '',
                },
                addressFormRules: {
                    address1: [
                        { required: true, message: '请选择省市区县', trigger: 'blur' },
                    ],
                    address2: [
                        { required: true, message: '请输入详细地址', trigger: 'blur' },
                    ],
                },
                cityData,
                progressBoxVisible: false,
                //物流信息
                progressInfo: [
                    {
                        "time": "2018-05-10 09:39:00",
                        "ftime": "2018-05-10 09:39:00",
                        "context": "已签收,感谢使用顺丰,期待再次为您服务",
                        "location": ""
                    },
                    {
                        "time": "2018-05-10 08:23:00",
                        "ftime": "2018-05-10 08:23:00",
                        "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                        "location": ""
                    },
                    {
                        "time": "2018-05-10 07:32:00",
                        "ftime": "2018-05-10 07:32:00",
                        "context": "快件到达 [北京海淀育新小区营业点]",
                        "location": ""
                    },
                    {
                        "time": "2018-05-10 02:03:00",
                        "ftime": "2018-05-10 02:03:00",
                        "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                        "location": ""
                    },
                    {
                        "time": "2018-05-09 23:05:00",
                        "ftime": "2018-05-09 23:05:00",
                        "context": "快件到达 [北京顺义集散中心]",
                        "location": ""
                    },
                    {
                        "time": "2018-05-09 21:21:00",
                        "ftime": "2018-05-09 21:21:00",
                        "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                        "location": ""
                    },
                    {
                        "time": "2018-05-09 13:07:00",
                        "ftime": "2018-05-09 13:07:00",
                        "context": "顺丰速运 已收取快件",
                        "location": ""
                    },
                    {
                        "time": "2018-05-09 12:25:03",
                        "ftime": "2018-05-09 12:25:03",
                        "context": "卖家发货",
                        "location": ""
                    },
                    {
                        "time": "2018-05-09 12:22:24",
                        "ftime": "2018-05-09 12:22:24",
                        "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                        "location": ""
                    },
                    {
                        "time": "2018-05-08 21:36:04",
                        "ftime": "2018-05-08 21:36:04",
                        "context": "商品已经下单",
                        "location": ""
                    }
                ]

            }
        },
        methods: {
            async getOderList() {
                const { data: res } = await this.$http.get('orders', { params: this.queryInfo });
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.OderList = res.data.goods;
                //this.queryInfo.pagenum = res.data.pagenum;
                this.total = res.data.total;
            },
            //每页多少条
            handleSizeChange(newsize) {
                this.queryInfo.pagesize = newsize;
                this.getOderList();
            },
            //当前第几页
            handleCurrentChange(newpage) {
                this.queryInfo.pagenum = newpage;
                this.getOderList();
            },
            showBox() {
                this.addressVisible = true;
            },
            addressDialogClosed() {
                this.$refs.addressFormRef.resetFields();
            },
            async showProgressBox() {
                // const { data: res } = await this.$http.get('https://www.liulongbin.top:8888/kuaidi/1106975712662');
                // if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                // this.progressInfo = res.data;
                this.progressBoxVisible = true;
            }
        },
        created() {
            this.getOderList()
        }
    }
</script>

<style scoped>
    .el-cascader {
        width: 100%
    }
</style>
