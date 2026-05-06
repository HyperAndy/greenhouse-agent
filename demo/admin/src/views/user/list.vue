<template>
  <div class="user-list">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" icon="Plus" @click="handleAdd">新增用户</el-button>
        </div>
      </template>

      <el-table :data="userList" v-loading="loading" stripe border>
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="roleType(row.role)" size="small">{{ roleLabel[row.role] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="farm" label="所属农场" width="150" />
        <el-table-column prop="enabled" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.enabled" @change="handleToggle(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最后登录" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link icon="UserFilled" @click="handleRole(row)">角色</el-button>
            <el-popconfirm title="确定删除?" @confirm="handleDelete(row)">
              <template #reference>
                <el-button type="danger" link icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '新增用户'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" :disabled="isEdit" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="所属农场">
          <el-select v-model="form.farm" placeholder="请选择" style="width: 100%">
            <el-option label="阳光农场" value="阳光农场" />
            <el-option label="绿源农场" value="绿源农场" />
            <el-option label="丰收农场" value="丰收农场" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="操作员" value="operator" />
            <el-option label="查看者" value="viewer" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="roleDialogVisible" title="分配角色" width="400px">
      <el-form label-width="80px">
        <el-form-item label="用户">
          <el-input :model-value="currentRoleUser.name" disabled />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="currentRoleUser.role" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="操作员" value="operator" />
            <el-option label="查看者" value="viewer" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const dialogVisible = ref(false)
const roleDialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const roleLabel = { admin: '管理员', operator: '操作员', viewer: '查看者' }
const roleType = (r) => ({ admin: 'danger', operator: 'warning', viewer: 'info' }[r] || 'info')

const userList = ref([
  { id: 1, name: '张三', phone: '13800138001', role: 'admin', farm: '阳光农场', enabled: true, lastLogin: '2024-03-15 14:00:00' },
  { id: 2, name: '李四', phone: '13800138002', role: 'operator', farm: '绿源农场', enabled: true, lastLogin: '2024-03-15 10:30:00' },
  { id: 3, name: '王五', phone: '13800138003', role: 'viewer', farm: '丰收农场', enabled: false, lastLogin: '2024-03-10 09:00:00' }
])

const form = reactive({ id: null, name: '', phone: '', password: '', role: '', farm: '' })
const currentRoleUser = reactive({ id: null, name: '', role: '' })

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { id: null, name: '', phone: '', password: '', role: '', farm: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, { ...row, password: '' })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value.validate()
  ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
  dialogVisible.value = false
}

const handleRole = (row) => {
  Object.assign(currentRoleUser, { id: row.id, name: row.name, role: row.role })
  roleDialogVisible.value = true
}

const confirmRole = () => {
  const user = userList.value.find(u => u.id === currentRoleUser.id)
  if (user) user.role = currentRoleUser.role
  ElMessage.success('角色已更新')
  roleDialogVisible.value = false
}

const handleToggle = (row) => {
  ElMessage.success(`用户已${row.enabled ? '启用' : '禁用'}`)
}

const handleDelete = (row) => {
  userList.value = userList.value.filter(u => u.id !== row.id)
  ElMessage.success('删除成功')
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
