<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column type="权限名称" prop="authName"></el-table-column>
        <el-table-column type="路径" prop="path"></el-table-column>
        <el-table-column type="权限等级" prop="level">
          <template v-slot="{ row }">
            <el-tag v-if="row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data() {
    return {
      //   权限列表数据
      rightsList: [],
    }
  },
  mounted() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
    },
  },
}
</script>

<style>
</style>