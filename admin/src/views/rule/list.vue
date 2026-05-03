<template>
  <div class="rule-list">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>规则管理</span>
          <el-button type="primary" icon="Plus" @click="handleAdd">新增规则</el-button>
        </div>
      </template>

      <el-table :data="ruleList" v-loading="loading" stripe border>
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="name" label="规则名称" min-width="150" />
        <el-table-column prop="greenhouse" label="所属大棚" width="140" />
        <el-table-column prop="condition" label="触发条件" min-width="200" />
        <el-table-column prop="action" label="执行动作" min-width="180" />
        <el-table-column prop="enabled" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.enabled" @change="handleToggle(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除?" @confirm="handleDelete(row)">
              <template #reference>
                <el-button type="danger" link icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑规则' : '新增规则'" width="700px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item label="所属大棚" prop="greenhouse">
          <el-select v-model="form.greenhouse" placeholder="请选择大棚" style="width: 100%">
            <el-option label="A区1号棚" value="A区1号棚" />
            <el-option label="A区2号棚" value="A区2号棚" />
            <el-option label="B区1号棚" value="B区1号棚" />
          </el-select>
        </el-form-item>

        <el-divider content-position="left">触发条件</el-divider>
        <div class="condition-panel">
          <div v-for="(cond, idx) in form.conditions" :key="idx" class="condition-row">
            <el-select v-model="cond.sensor" placeholder="传感器" style="width: 160px">
              <el-option label="温度" value="temperature" />
              <el-option label="湿度" value="humidity" />
              <el-option label="光照" value="light" />
              <el-option label="CO₂" value="co2" />
              <el-option label="土壤湿度" value="soilMoisture" />
            </el-select>
            <el-select v-model="cond.operator" placeholder="操作符" style="width: 120px">
              <el-option label="大于(>)" value="gt" />
              <el-option label="小于(<)" value="lt" />
              <el-option label="等于(=)" value="eq" />
              <el-option label="大于等于(≥)" value="gte" />
              <el-option label="小于等于(≤)" value="lte" />
            </el-select>
            <el-input-number v-model="cond.value" :precision="1" style="width: 140px" />
            <el-button v-if="form.conditions.length > 1" type="danger" icon="Delete" circle @click="form.conditions.splice(idx, 1)" />
          </div>
          <el-button type="primary" link icon="Plus" @click="form.conditions.push({ sensor: '', operator: '', value: 0 })">
            添加条件
          </el-button>
        </div>

        <el-divider content-position="left">执行动作</el-divider>
        <div class="action-panel">
          <div v-for="(act, idx) in form.actions" :key="idx" class="action-row">
            <el-select v-model="act.device" placeholder="继电器设备" style="width: 200px">
              <el-option label="风机控制" value="fan" />
              <el-option label="水泵控制" value="pump" />
              <el-option label="卷帘控制" value="curtain" />
              <el-option label="补光灯" value="light" />
            </el-select>
            <el-select v-model="act.channel" placeholder="通道" style="width: 120px">
              <el-option label="通道1" :value="1" />
              <el-option label="通道2" :value="2" />
              <el-option label="通道3" :value="3" />
              <el-option label="通道4" :value="4" />
            </el-select>
            <el-select v-model="act.state" placeholder="状态" style="width: 120px">
              <el-option label="开启" :value="1" />
              <el-option label="关闭" :value="0" />
            </el-select>
            <el-button v-if="form.actions.length > 1" type="danger" icon="Delete" circle @click="form.actions.splice(idx, 1)" />
          </div>
          <el-button type="primary" link icon="Plus" @click="form.actions.push({ device: '', channel: 1, state: 1 })">
            添加动作
          </el-button>
        </div>

        <el-form-item label="启用">
          <el-switch v-model="form.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const ruleList = ref([
  { id: 1, name: '高温自动通风', greenhouse: 'A区1号棚', condition: '温度 > 30°C', action: '风机-通道1 开启', enabled: true },
  { id: 2, name: '低温自动加热', greenhouse: 'A区2号棚', condition: '温度 < 10°C', action: '加热器-通道1 开启', enabled: true },
  { id: 3, name: '缺水自动灌溉', greenhouse: 'B区1号棚', condition: '土壤湿度 < 30%', action: '水泵-通道1 开启', enabled: false }
])

const form = reactive({
  id: null, name: '', greenhouse: '', enabled: true,
  conditions: [{ sensor: '', operator: '', value: 0 }],
  actions: [{ device: '', channel: 1, state: 1 }]
})

const rules = {
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  greenhouse: [{ required: true, message: '请选择大棚', trigger: 'change' }]
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    id: null, name: '', greenhouse: '', enabled: true,
    conditions: [{ sensor: '', operator: '', value: 0 }],
    actions: [{ device: '', channel: 1, state: 1 }]
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, {
    ...row,
    conditions: [{ sensor: 'temperature', operator: 'gt', value: 30 }],
    actions: [{ device: 'fan', channel: 1, state: 1 }]
  })
  dialogVisible.value = true
}

const handleToggle = (row) => {
  ElMessage.success(`规则已${row.enabled ? '启用' : '禁用'}`)
}

const handleSubmit = async () => {
  await formRef.value.validate()
  ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
  dialogVisible.value = false
}

const handleDelete = (row) => {
  ruleList.value = ruleList.value.filter(r => r.id !== row.id)
  ElMessage.success('删除成功')
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.condition-row, .action-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}
.condition-panel, .action-panel {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>
