<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="{ row }">
            <el-row
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, index1) of row.children"
              :key="item1.id"
            >
              <!-- 一级权限列 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, index2) of item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 of item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="{ row }">
            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditRoleDialog(row.id)"
                >编辑</el-button
              >
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
                @click="removeRoleById(row.id)"
                >删除</el-button
              >
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRightDialog(row)"
                >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="resetAddRoleForm"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="resetEditRoleForm"
    >
      <el-form
        :model="editRoleForm"
        :rules="editRoleFormRules"
        ref="editRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色ID">
          <el-input v-model="editRoleForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 角色列表数据
      rolesList: [],

      // 添加角色对话框显示与否
      addRoleDialogVisible: false,
      // 添加角色表单参数对象
      addRoleForm: {},
      // 添加角色表单的验证规则对象
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色姓名！', trigger: 'blur' },
        ],
      },

      // 编辑角色对话框显示与否
      editRoleDialogVisible: false,
      // 编辑角色表单对象
      editRoleForm: {},
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
      },

      // 分配权限对话框显示与否
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的权限对应节点ID的数组
      defKeys:[],
      // 当前即将分配权限的角色id
      roleId:'',
    }
  },
  mounted() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    // 添加角色相关
    // 添加角色
    addRole() {
      // 添加表单预验证
      this.$refs.addRoleFormRef.validate(async (validate) => {
        if (!validate) return
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          this.$message.error('角色创建失败！')
        }
        this.$message.success('角色创建成功！')
        this.getRolesList()
      })
      this.addRoleDialogVisible = false
    },
    // 添加角色表单重置
    resetAddRoleForm() {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 编辑角色相关
    async showEditRoleDialog(id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败！')
      }
      this.editRoleForm = res.data
      this.editRoleDialogVisible = true
    },
    // 重置编辑角色表单
    resetEditRoleForm() {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 编辑角色
    editRole() {
      this.$refs.editRoleFormRef.validate(async (validate) => {
        if (!validate) return
        const { data: res } = await this.$http.put(
          `roles/${this.editRoleForm.roleId}`,
          this.editRoleForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑角色失败')
        }
        this.$message.success('编辑角色成功')
        this.getRolesList()
      })
      this.editRoleDialogVisible = false
    },
    // 删除角色相关
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult === 'cancel') {
        this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败！')
      }
      this.$message.success('删除角色成功！')
      this.getRolesList()
    },
    // 根据ID删除对应权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult === 'cancel') {
        this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if ((res.meta, status !== 200)) {
        return this.$message.error('取消权限失败')
      }
      // this.$message.success('取消权限成功')
      // this.getRolesList()
      role.children = res.data
    },
    // 分配权限相关
    async showSetRightDialog(role) {
      this.roleId = role.id

      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message('获取权限数据失败')
      }
      this.rightsList = res.data

      this.getLeafKeys(role,this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归形式获取角色下所有三级权限的id并保存到 defKeys中
    getLeafKeys(node,arr) {
      if( !node.children ) {
        return arr.push(node.id)
      }
      node.children.forEach( item => {
        this.getLeafKeys(item,arr)
      })
    },
    // 监听分配权限对话框的关闭
    setRightDialogClosed() {
      this.defKeys = []
    },
    //为角色分配权限 
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')
      const { data:res } = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if( res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功！')
      this.getRolesList()
      
      this.setRightDialogVisible = false
    }
  },
}
</script>

<style lang="less" scope>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>