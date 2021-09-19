<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="{ row }">
            <el-tag v-if="row.pay_status === '1'" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="{ row }">
            {{ row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditOrderDialog(row.order_id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showLogisticsProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改订单对话框 -->
    <el-dialog
      title="修改订单"
      :visible.sync="editOrderDialogVisible"
      width="50%"
      @close="editOrderDialogClosed"
    >
      <el-form
        :model="editOrderForm"
        :rules="editOrderRules"
        ref="editOrderFormRef"
        label-width="100px"
      >
        <el-form-item label="是否发货">
          <el-switch
            v-model="editOrderForm.is_send"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="订单支付">
          <el-radio v-model="editOrderForm.order_pay" label="0"
            >未支付</el-radio
          >
          <el-radio v-model="editOrderForm.order_pay" label="1"
            >支付宝</el-radio
          >
          <el-radio v-model="editOrderForm.order_pay" label="2">微信</el-radio>
          <el-radio v-model="editOrderForm.order_pay" label="3"
            >银行卡</el-radio
          >
        </el-form-item>
        <el-form-item label="订单价格" prop="order_price">
          <el-input v-model.number="editOrderForm.order_price"></el-input>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-switch
            v-model="editOrderForm.pay_status"
            active-text="已付款"
            inactive-text="未付款"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="editOrderForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editOrderForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrderInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度 -->
    <el-dialog
      title="物流进度"
      :visible.sync="logisticsProgressDialogVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in logisticsProgressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../Order/city_data2017_element'

export default {
  name: 'orderList',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      //总数据条数
      total: 0,
      orderList: [],
      //   修改订单地址
      cityData: cityData,
      editOrderDialogVisible: false,
      editOrderForm: {
        address1: [],
        address2: '',
      },
      editOrderRules: {
        address1: [
          {
            type: 'array',
            required: true,
            message: '请选择市区/县',
            trigger: 'change',
          },
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
        order_price: [
          { required: true, message: '订单价格不能为空', trigger: 'blur' },
        ],
      },
      // 物流进度
      logisticsProgressDialogVisible: false,
      logisticsProgressInfo: [],
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 分页 pagesize 发生改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 修改订单对话框
    async showEditOrderDialog(id) {
      const { data: res } = await this.$http.get(`orders/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单详情失败')
      }
      this.editOrderForm = res.data
      this.editOrderForm.is_send =
        this.editOrderForm.is_send === '是' ? true : false
      this.editOrderForm.pay_status =
        this.editOrderForm.pay_status === '1' ? true : false
      this.editOrderDialogVisible = true
    },
    editOrderInfo() {
      this.$refs.editOrderFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写必要信息')
        }

        this.editOrderForm.is_send =
          this.editOrderForm.is_send === true ? '是' : '否'
        this.editOrderForm.pay_status =
          this.editOrderForm.pay_status === true ? '1' : '0'

        const { data: res } = await this.$http.put(
          `orders/${this.editOrderForm.order_id}`,
          this.editOrderForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('修改订单信息失败')
        }
        this.$message.success('修改订单信息成功')
        this.getOrderList()
      })
      this.editOrderDialogVisible = false
    },
    // 关闭修改地址的对话框
    editOrderDialogClosed() {
      this.$refs.editOrderFormRef.resetFields()
    },
    //展示物流进度
    async showLogisticsProgress() {
      const { data: res } = await this.$http.get(`/kuaidi/1106975712662`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }

      this.logisticsProgressInfo = res.data

      this.logisticsProgressDialogVisible = true
    },
  },
}
</script>

<style>
</style>