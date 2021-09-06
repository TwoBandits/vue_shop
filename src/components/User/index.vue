<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="{ row }">
            <el-switch
              v-model="row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="{ row }">
            <el-tooltip
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setUserRole(row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户功能的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserForm"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editUserForm"
        :rules="editUserFormRules"
        ref="editUserFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配用户角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setUserRoleDialogVisible"
      width="50%"
      @close="setUserRoleDialogClosed"
    >
      <div>
        <p>当前用户：{{ userInfo.username }}</p>
        <p>当前角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UsersList',
  data() {
    // 添加用户功能验证邮箱的验证规则
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 添加用户功能手机号验证规则
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }

    return {
      // 用户列表请求参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      // 用户列表数据
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与否
      addDialogVisible: false,
      // 添加用户的表单数据
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加用户的表单规则对象
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度为 3 到 10 个字符之间',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在 6~15 个字符之间',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },

      // 编辑用户相关
      // 编辑用户对话框显示与否
      editDialogVisible: false,
      // 编辑用户表单对象
      editUserForm: {},
      // 编辑用户的表单规则对象
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },

      // 分配用户角色相关
      // 分配用户角色对话框显示与否
      setUserRoleDialogVisible: false,
      // 将要分配角色的用户信息
      userInfo: {},
      // 角色列表
      rolesList: [],
      // 当前选中的角色id
      selectedRoleId: '',
    }
  },
  mounted() {
    this.getUsersList()
  },
  methods: {
    // 获取用户列表数据
    async getUsersList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听 pageSize（每页显示条数）并重新请求数据
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getUsersList()
    },
    // 监听 页码值 (当前页码值)
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getUsersList()
    },
    // 监听 状态按钮的状态并改变用户状态
    async userStateChange(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        this.$message.error('更新用户状态失败！')
        userinfo.mg_state = !userinfo.mg_state
      }
      this.$message.success('更新用户状态成功！')
    },

    // 添加用户相关
    // 监听 添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addUserForm.resetFields()
    },
    addUser() {
      // 添加用户的预校验
      this.$refs.addUserForm.validate(async (validate) => {
        if (!validate) return
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status === 201) {
          this.$message.success('添加用户成功！')
          this.addDialogVisible = false
          this.getUsersList()
        } else {
          this.$message.error('添加用户失败！')
        }
      })
    },

    //编辑用户相关
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      this.editUserForm = res.data
    },
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `users/${this.editUserForm.id}`,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile,
          }
        )

        if (res.meta.status === 200) {
          this.editDialogVisible = false
          this.getUsersList()
          this.$message.success('更新用户信息成功！')
        } else {
          this.$message.error('更新用户信息失败！')
        }
      })
    },

    // 删除用户相关
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult === 'cancel') {
        return this.$message.info('已取消删除！')
      }
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`users/${id}`)
        if (res.meta.status === 200) {
          this.$message.success('用户删除成功！')
        } else {
          this.$message.error('用户删除失败！')
        }
        this.getUsersList()
      }
    },

    // 分配用户角色相关
    // 显示分配用户角色的对话框
    async setUserRole(userInfo) {
      this.userInfo = userInfo

      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data

      this.setUserRoleDialogVisible = true
    },
    // 确认分配用户角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }

      const { data:res } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId,
      })
      if( res.meta.status !== 200 ) {
        return this.$message.error('更新用户角色失败！')
      }
      this.$message.success('更新用户角色成功！')
      this.getUsersList()

      this.setUserRoleDialogVisible = false
    },
    // 分配用户角色对话框关闭
    setUserRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userinfo = {}
    }
  },
}
</script>

<style lang="less" scoped>
</style>