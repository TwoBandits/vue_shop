<template>
  <div>
    <!--  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChangeSelect"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleClickTabs">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="{ row }">
                <!-- 循环渲染tag表 -->
                <el-tag
                  v-for="(item, i) of row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引行 -->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="{ row }">
                <!-- 循环渲染tag表 -->
                <el-tag
                  v-for="(item, i) of row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引行 -->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数/属性的对话框 -->
    <el-dialog
      :title="`添加${titleText}`"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数/属性的对话框 -->
    <el-dialog
      :title="`编辑${titleText}`"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    // 自定义对话框添加表单验证规则
    const checkAttrName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(`${this.titleText}不能为空`))
      } else {
        callback()
      }
    }

    return {
      // 商品分类数据列表
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      selectedCateKeys: [],
      // 指定被激活的标签页
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 添加功能相关数据
      addDialogVisible: false,
      addForm: {
        attr_name: '',
      },
      addFormRules: {
        attr_name: [{ validator: checkAttrName, trigger: 'blur' }],
      },
      // 编辑功能相关数据
      editDialogVisible: false,
      // 编辑表单数据对象
      editForm: {
        attr_name: '',
      },
      // 编辑表单验证规则
      editFormRules: {
        attr_name: [{ validator: checkAttrName, trigger: 'blur' }],
      },
    }
  },
  computed: {
    // 添加按钮是否可以点击
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 当前选中的三级分类id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      } else {
        return null
      }
    },
    // 添加属性/参数对话框的标题
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
  mounted() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.cateList = res.data
    },
    // 级联选择器发生变化时处理函数
    handleChangeSelect() {
      this.getParamsDate()
    },
    // 标签页点击事件处理函数
    handleClickTabs() {
      this.getParamsDate()
    },
    // 获取参数的列表数据
    async getParamsDate() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 每一行的参数各自有文本输入框与添加tag按钮切换
        item.inputVisible = false
        // 添加tag文本输入框的输入值
        item.inputValue = ''
      })

      if (this.activeName === 'many') {
        this.manyTableData = res.data
      }
      if (this.activeName === 'only') {
        this.onlyTableData = res.data
      }
    },

    // 添加对话框关闭事件
    addDialogClosed() {
      // 对话框关闭则重置表单状态
      this.$refs.addFormRef.resetFields()
    },
    //添加参数or属性
    addParams() {
      console.log(2)
      // 表单预验证
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error(`添加${this.titleText}失败！`)
        }
        this.$message.success(`添加${this.titleText}成功`)
        this.getParamsDate()
        this.addDialogVisible = false
      })
    },
    // 编辑功能
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(`获取${this.titleText}失败`)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 编辑对话框关闭事件（对话框关闭时重置表单）
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮编辑参数or属性
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(`修改${this.titleText}失败`)
        }
        this.$message.success(`修改${this.titleText}成功`)
        this.getParamsDate()
        this.editDialogVisible = false
      })
    },
    // 删除功能
    async removeParams(id) {
      // 删除前需要弹出提示框询问是否要删除
      const confirmResult = await this.$confirm(
        `此操作将永久删除该${this.titleText}, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(`删除${this.titleText}失败`)
      }
      this.$message.success(`删除${this.titleText}成功`)
      this.getParamsDate()
    },
    // 按下enter或失去焦点时触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      if (row.attr_vals.includes(row.inputValue.trim())) {
        row.inputValue = ''
        row.inputVisible = false
        return this.$message.info('已存在此参数项')
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发送请求更新attr_vals
      this.saveAttrVals(row)
    },
    //
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) {
        this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数项成功')
    },

    showInput(row) {
      row.inputVisible = true
      // 文本框自动获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除参数项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
  },
}
</script>

<style lang="less" scoped>
s .cat_opt {
  margin: 15px 0;
}
.input-new-tag {
  width: 120px;
}
</style>