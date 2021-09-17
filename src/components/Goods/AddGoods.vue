<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        align-center
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addGoodInfoForm"
        :rules="addGoodInfoFormRules"
        ref="addGoodInfoFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodInfoForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodInfoForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodInfoForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodInfoForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodInfoForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item of manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(cb, i) of item.attr_vals"
                  :key="i"
                  :label="cb"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item of onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addGoodInfoForm.goods_introduce">
            </quill-editor>
            <el-button type="primary" class="addGoodBtn" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  naem: 'AddGoods',
  data() {
    return {
      activeIndex: '0',
      // 添加商品信息表单数据对象
      addGoodInfoForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类列表
        goods_cat: [],
        // 图片数据
        pics: [],
        // 商品内容详情描述
        goods_introduce: '',
        attrs:[]
      },
      // 添加商品信息表单数据验证规则对象
      addGoodInfoFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'change' },
        ],
      },
      // 商品分类列表
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      // 动态参数列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 图片上传的地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传的请求头对象(tokan验证)
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      //图片预览路径
      previewPath: '',
      previewDialogVisible: false,
    }
  },
  computed: {
    // 当前选中的商品分类ID
    cateId() {
      if (this.addGoodInfoForm.goods_cat.length === 3) {
        return this.addGoodInfoForm.goods_cat[2]
      }
      return null
    },
  },
  mounted() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data
    },
    // 级联选择器选中项发生变化时的处理函数
    handleChange() {
      if (this.addGoodInfoForm.goods_cat.length !== 3) {
        this.addGoodInfoForm.goods_cat = []
      }
    },
    // 标签切换前的钩子回调
    beforeTabLeave(activeName, oldActiveName) {
      if (
        oldActiveName === '0' &&
        this.addGoodInfoForm.goods_cat.length !== 3
      ) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品动态参数失败')
        }
        // 将数据中的attr_vals 由字符串转为数组
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品静态属性失败')
        }
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览(点击列表中的文件时触发的钩子)
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 图片上传成功
    handleSuccess(response) {
      // 获取图片在服务器的临时路径，生成图片的临时路径信息对象
      const picInfo = {
        pic: response.data.tmp_path,
      }
      this.addGoodInfoForm.pics.push(picInfo)
    },
    // 处理移除图片的操作
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addGoodInfoForm.pics.findIndex((item) => {
        item.pic === filePath
      })
      this.addGoodInfoForm.pics.splice(i, 1)
    },

    // 添加商品
    addGood() {
      this.$refs.addGoodInfoFormRef.validate( async valid => {
        if(!valid ) {
          return this.$message.error('请填写必要的信息')
        }

        // 深拷贝表单对象
        const form = _.cloneDeep(this.addGoodInfoForm)
        form.goods_cat = form.goods_cat.join(',')

        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')
          }
          this.addGoodInfoForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals
          }
          this.addGoodInfoForm.attrs.push(newInfo)
        })
        form.attrs = this.addGoodInfoForm.attrs

        const {data:res} = await this.$http.post('goods',form)
        if(res.meta.status !== 201 ) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addGoodBtn {
  margin-top: 15px;
}
</style>