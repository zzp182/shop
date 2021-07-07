<template>
  <el-container v-show="show">
    <el-main>
      <el-table
        ref="table"
        header-cell-class-name="cell-nowrap height-header"
        cell-class-name="height-cell"
        highlight-current-row
        v-bind="$attrs"
        v-on="$listeners"
        border
        height="100%"
        :data="formatRows">
        <el-table-column v-if="order" type="index" label="序号" align="center" width="50px">
          <template #header>
            <el-popover popper-class="col-content">
              <el-link slot="reference" icon="el-icon-edit-outline" @click="colDialog = true"/>
              <el-popconfirm title="保存当前表格显示的字段？" @onConfirm="saveField">
                <el-button slot="reference" size="small" plain style="width: 100%;">保存当前配置</el-button>
              </el-popconfirm>
              <el-cascader-panel v-model="select" :options="fieldOption" :props="{ multiple: true }" @change="show = false" />
            </el-popover>
          </template>
          <template #default="scope">{{(_page.limit * (_page.index - 1)) + scope.$index + 1}}</template>
        </el-table-column>
        <template v-for="(f, i) in fitField">
          <slot :name="f.name" v-bind="{field: f, data: formatRows}">
            <el-table-column header-align="center" :align="f.align || 'center'" v-bind="f" :key="`${f.name}${i}`" :prop="f.name">
              <!-- 标题 -->
              <template #header="scope">
                <slot :name="`${f.name}-header`" v-bind="{...scope, row: rows[scope.$index]}">{{f.label}}</slot>
              </template>
              <!-- 内容 -->
              <template v-if="f.type !== 'selection'" #default="scope">
                <slot :name="`${f.name}-data`" v-bind="{...scope, row: rows[scope.$index]}">
                  <el-tag
                    size="mini"
                    :hit="true"
                    v-if="f.ftype === 'Boolean'"
                    :type="rows[scope.$index][f.name] ? 'success' : 'danger'">
                    {{ scope.row[f.name] }}
                  </el-tag>
                  <span v-else>{{ scope.row[f.name] }}</span>
                </slot>
              </template>
            </el-table-column>
          </slot>
        </template>
      </el-table>
    </el-main>
    <el-footer height="auto">
      <el-pagination
        v-if="count"
        layout="total, prev, pager, next, jumper"
        :page-sizes="[20, 50, 100, 200]"
        :total="count || 0"
        :pager-count="5"
        :page-size.sync="_page.limit"
        :current-page.sync="_page.index"
        @size-change="pageChange()"
        @current-change="pageChange()">
      </el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
export default {
        data(){
            return{
            
            }
        }
    }
</script>