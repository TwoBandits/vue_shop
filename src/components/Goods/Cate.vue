<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="{ row }">
          <el-tag size="mini" v-if="row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="{ row }">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCate(row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            :clearable="true"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClose"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类ID">
          <el-input v-model="editCateForm.cat_id" disabled></el-input
        ></el-form-item>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      //商品分类的列表
      cateList: [],
      //查询商品分类参数对象
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //    商品分类数据总条数
      total: 0,
      //    为table指定列的配置
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isOk' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' },
      ],

      //   添加分类对话框显示与否
      addCateDialogVisible: false,
      //   添加分类的表单数据对象
      addCateForm: {
        // 分类名称
        cat_name: '',
        // 分类的父级id
        cat_pid: 0,
        // 分类的等级
        cat_level: 0,
      },
      //   添加分类的表单规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      //   父级分类的列表
      parentCateList: [],
      //   级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
      },
      //   选中的父级分类id
      selectedKeys: [],

      //   编辑分类
      //   编辑分类对话框显示与否
      editCateDialogVisible: false,
      //   编辑分类对象
      editCateForm: {
        cat_id: '',
        cat_name: '',
      },
      //   编辑分类表单验证规则对象
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
    }
  },
  mounted() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // pageSize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },

    // 添加分类对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化触发
    parentCateChange() {
      // 如果选中了父级，父级id数组中的最后一项就是所确定父级分类的id
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 分类的等级等于父级id数组的长度
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    // 添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (validate) => {
        if (!validate) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }

        this.$message.success('添加分类成功！')
        this.getCateList()
      })
      this.addCateDialogVisible = false
    },
    // 添加分类对话框的关闭
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },

    // 编辑分类
    async showEditCateDialog(id) {
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类信息失败!')
      }
      this.editCateForm.cat_id = res.data.cat_id
      this.editCateForm.cat_name = res.data.cat_name
      this.editCateDialogVisible = true
    },
    // 确定提交编辑分类请求
    editCate() {
      this.$refs.editCateFormRef.validate(async (validate) => {
        console.log(this.editCateForm)
        if (!validate) return
        const { data: res } = await this.$http.put(
          `categories/${this.editCateForm.cat_id}`,
          {
            cat_name: this.editCateForm.cat_name,
          }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('编辑分类失败')
        }
        this.$message.success('编辑分类成功！')
        this.getCateList()
        this.editCateDialogVisible = false
      })
    },
    // 编辑分类对话框关闭
    editCateDialogClose() {
      this.$refs.editCateFormRef.resetFields()
    },

    // 删除相关
    async removeCate(id) {
      const confirmResult =await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch( err => err )
      console.log(confirmResult);
      if (confirmResult === 'cancel') {
        this.$message.error('已取消删除！')
      }
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`categories/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除分类失败！')
        }
        this.$message.success('删除分类成功！')
        this.getCateList()
      }
    },
  },
}
</script>

<style lang="less" scope>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>