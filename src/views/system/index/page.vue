<template>
  <d2-container>
    <template slot="header">设置首页显示数据</template>
    <el-alert title="修改成功" v-if="alert" type="success" description="" show-icon> </el-alert>
    <h3>显示文字说明</h3>
    <el-input
      type="textarea"
      :rows="5"
      placeholder="请输入内容"
      v-model="text"
      class="input-demo-400">
    </el-input>
    <h3>显示图片</h3>
    <el-upload
      class="avatar-uploader"
      action="/home/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-row style="margin-top: 10px">
      <el-button type="primary" :disabled="loading" :loading="loading" @click="save">{{btn}}</el-button>
    </el-row>

  </d2-container>
</template>

<script>
// import axios from 'axios'
import request from '@/plugin/axios'
export default {
  name: 'page1',
  data () {
    return {
      loading: false,
      alert: false,
      text: '',
      imageUrl: '',
      url: '',
      btn: '保存'
    }
  },
  created () {
    this.init()
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.url = res.data.val
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    save () {
      this.loading = true
      request.post('/home/save', {
        text: this.text,
        url: this.url
      }).then(rsp => {
        this.loading = false
        this.alert = true
        setTimeout(() => {
          this.alert = false
        }, 5000)
      }).catch(e => {
        this.loading = false
      })
      // axios.post('/home/save', {
      //   text: this.text,
      //   url: this.url
      // }).then(rsp => {
      //   this.loading = false
      //   this.alert = true
      //   setTimeout(() => {
      //     this.alert = false
      //   }, 5000)
      // }).catch(e => {
      //   this.loading = false
      // })
    },
    init () {
      let url = '/home/index'
      request.get(url).then(rsp => {
        this.text = rsp.text
        this.url = rsp.url
        this.imageUrl = rsp.url
      })
    }
  }
}
</script>

<style lang="scss" >
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
.page {
  .logo {
    width: 120px;
  }
  .btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    margin-top: 0px;
    margin-bottom: 20px;
    .btn-group__btn {
      color: $color-text-sub;
      &:hover {
        color: $color-text-main;
      }
      &.btn-group__btn--link {
        color: $color-primary;
      }
    }
  }
}
</style>
