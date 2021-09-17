<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-alert title="编辑商品信息" type="info" center show-icon> </el-alert>

    <el-card>
      <el-form
        :model="editGoodInfoForm"
        :rules="editGoodRules"
        ref="editGoodFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodInfoForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editGoodInfoForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editGoodInfoForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editGoodInfoForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍">
          <quill-editor v-model="editGoodInfoForm.goods_introduce">
          </quill-editor>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col>
          <el-button type="primary" @click="editGoodInfo">提交</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'EditGood',
  data() {
    return {
      editGoodInfoForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: [],
      },
      editGoodRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    goodId() {
      return this.$route.query.goodId
    },
  },
  created() {
    this.getGoodById()
  },
  methods: {
    async getGoodById() {
      const { data: res } = await this.$http.get(`goods/${this.goodId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品信息失败')
      }
      this.editGoodInfoForm = res.data
      // console.log(res.data)
    },
    // 确定提交编辑商品操作
    editGoodInfo() {
      this.$refs.editGoodFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写必要信息')
        }

        const { data:res } = await this.$http.put(`goods/${this.goodId}`,this.editGoodInfoForm)
        if ( res.meta.status !== 200 ) {
          return this.$message.error('修改商品信息失败')
        }
        this.$message.success('修改商品信息成功')
        this.$router.push('/goods')
      })
    },
  },
}
</script>

<style>
</style>