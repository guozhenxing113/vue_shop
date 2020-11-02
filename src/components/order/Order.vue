<template>
  <div>
    <el-card>
      <!-- 面包屑导航区 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图区域 -->
      <el-row>
        <el-col :span="8"
          ><el-input placeholder="请输入内容">
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
      </el-row>
      <!-- 订单数据列表 -->
      <el-table :data="this.orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="订单编号"
          prop="order_number"
          style="width: 300px"
        ></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="addRess"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <span class="demonstration">完整功能</span>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="this.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addRessVisible"
      width="50%"
      @close="addRessDialogClosed"
    >
      <el-form
        :model="addRessForm"
        :rules="addRessFormRules"
        ref="addRessFormRef"
        label-width="100px"
      >
        <el-form-item label="省级区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addRessForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详情地址" prop="address2">
          <el-input v-model="addRessForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRessVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRessVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //数据的总条数
      total: 0,
      //   订单数据列表
      orderList: [],
      // 修改地址的对话框
      addRessVisible: false,
      // 修改地址的表单
      addRessForm: {
        address1: [],
        address2: '',
      },
      // // 修改地址表单的验证规则
      addRessFormRules: {
        address1: [{ required: true, message: '请选择', trigger: 'blur' }],
        address2: [{ required: true, message: '请选择', trigger: 'blur' }],
      },
      cityData,
      // 物流进度
      progressVisible: false,
      //
      progressInfo: [],
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单数据列表失败')
      }
      this.$message.success('获取订单数据列表成功')
      //   console.log(res)
      this.total = res.data.total
      console.log(this.total)
      this.orderList = res.data.goods
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },
    // 点击按钮显示对话框
    addRess() {
      this.addRessVisible = true
      console.log(cityData)
    },
    //
    addRessDialogClosed() {
      this.$refs.addRessFormRef.resetFields()
    },
    //展示物流进度的操作
    showProgressBox() {
      this.progressVisible = true
    },
  },
}
</script>

<style scoped>
</style>
