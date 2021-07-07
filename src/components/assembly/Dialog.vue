<template>
  <el-dialog
    :title="title"
    >
    <span slot="footer">
      <slot name="footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onSubmit">{{submitText}}</el-button>
      </slot>
    </span>
  </el-dialog>
</template>
<script>
// import { Form } from './Form'
export default {
        props:{
           title:{type: String, default: ''},

        },
        // components:{ Form },
        data(){
            return{
                isOpen:false,
                onClosed: false,
                key: 0
            }
        },
        porps: {
          title:''
        }
    }
</script>