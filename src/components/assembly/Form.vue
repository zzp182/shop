<template>
  <!-- @submit.native.prevent解决form只有一个input会响应回车的问题 -->
  <el-form ref="form" size="small" :model="data" label-width="auto" @submit.native.prevent="">
    <el-row :gutter="20">
    <el-col v-for="f in field" :key="f.name" :span="f.span || 24">
      <slot v-if="f.ftype === type.Group" :name="f.name" v-bind="{field: f, data}">
        <div class="group">{{f.label}}</div>
      </slot>
      <el-form-item v-else :prop="f.name" :label="f.label" :rules="getBlurRule(f)">
        <slot :name="f.name" v-bind="{field: f, data}">
          <!-- 开关 -->
          <el-switch
          v-if="f.ftype === 'Boolean' && (data[f.name] = Boolean(data[f.name]), true)"
          v-model="data[f.name]"
          v-bind="f"
          v-on="f"/>
          <!-- 下拉列表 -->
          <el-select v-else-if="f.select"
            :placeholder="f.placeholder ? f.placeholder : f.label"
            v-model="data[f.name]"
            style="width:100%;"
            v-bind="f">
            <el-option v-for="(s, i) in f.select" :key="i" :value="s[0]" :label="s[1]" />
          </el-select>
          <!-- 数字输入 -->
          <el-input-number v-else-if="f.ftype === 'Number'" v-model="data[f.name]" style="width:100%;" v-bind="f" />
          <!-- 日期选择-->
          <el-date-picker v-else-if="f.ftype === type.Date" v-model="data[f.name]" v-bind="f"
            type="date"
            style="width: 100%"
            placeholder="选择日期"
            value-format="yyyy-MM-dd" />
          <!-- 普通输入框 -->
          <el-input v-else
            :type="f.ftype === type.Rich ? 'textarea' : f.ftype ? f.ftype : 'text'"
            v-model="data[f.name]"
            :placeholder="f.placeholder ? f.placeholder : f.label"
            v-bind="f" />
        </slot>
        <el-alert v-if="f.desc" class="form-desc" type="info" size="small" :closable="false">{{f.desc}}</el-alert>
      </el-form-item>
    </el-col>
    </el-row>
  </el-form>
</template>


<script>
export default {
        data(){
            return{
                
            }
        }
    }
</script>