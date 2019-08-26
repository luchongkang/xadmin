<template>
  <d2-container>
    <template slot="header">填写师资介绍</template>
    <el-row>
      <el-button type="primary" @click="add">添加介绍</el-button>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in getList" :key="index">
        <div class="grid-content bg-purple">
          <span class="el-upload-list__item-actions">
            <span class="edit arrow" v-if="index !== 0" title="向左" @click="left(index)"><i class="el-icon-arrow-left"></i></span>
            <span class="edit" title="编辑" @click="edit(index)"><i class="el-icon-edit"></i></span>
            <span class="delete" title="删除" @click="del(index)"><i class="el-icon-delete"></i></span>
            <span class="edit arrow" v-if="getLength(index) " title="向右" @click="right(index)"><i class="el-icon-arrow-right"></i></span>
           </span>
          <el-image  :src="item.url" ></el-image>
          <div class="demonstration">{{ item.name }}</div>
        </div>
      </el-col>
    </el-row>
<el-dialog title="编辑" :visible.sync="show">
  <el-form >
    <el-form-item label="姓名" label-width="120px">
      <el-input v-model="name"  autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="教师简介" label-width="120px">
      <el-input v-model="desc" type="textarea" :rows="10" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="上传图片" label-width="120px">
      <el-upload
      class="avatar-uploader"
      action="/home/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="show = false">取 消</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>
  </div>
</el-dialog>
  </d2-container>
</template>

<script>
// import axios from 'axios'
import axios from '@/plugin/axios'
export default {
  name: 'page1',
  created () {
    this.init()
  },
  data () {
    return {
      name: '',
      desc: '',
      id: null,
      show: false,
      imageUrl: '',
      url: '',
      list: []
    }
  },
  computed: {
    getList () {
      return this.list
    }
  },
  methods: {
    getLength (index) {
      if (index === (this.list.length - 1)) {
        return false
      }
      return true
    },
    init () {
      axios.get('/home/list')
        .then((response) => {
          this.list = response
        })
    },
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
    submit () {
      if (!this.desc) {
        this.$message.error('请填写介绍')
        return false
      }
      if (!this.url) {
        this.$message.error('请上传图片')
        return false
      }
      let temp = { name: this.name, desc: this.desc, url: this.url }
      if (this.id != null) {
        this.list[this.id] = temp
      } else {
        this.list.push(temp)
      }
      axios.post('/home/save-list', {
        list: this.list
      }).then(rsp => {
        this.$message.success('保存成功')
      })
      this.name = ''
      this.desc = ''
      this.url = ''
      this.show = false
      this.imageUrl = ''
      this.id = null
    },
    left (index) {
      if (index !== 0) {
        let temp = this.list[index]
        let temp1 = this.list[index - 1]
        this.$set(this.list, index - 1, temp)
        this.$set(this.list, index, temp1)
        axios.post('/home/save-list', {
          list: this.list
        }).then(rsp => {
          this.$message.success('保存成功')
        })
      }
    },
    right (index) {
      if (index !== (this.list.length - 1)) {
        let temp = this.list[index]
        let temp1 = this.list[index + 1]
        this.$set(this.list, index + 1, temp)
        this.$set(this.list, index, temp1)
        axios.post('/home/save-list', {
          list: this.list
        }).then(rsp => {
          this.$message.success('保存成功')
        })
      }
    },
    add () {
      this.name = ''
      this.desc = ''
      this.url = ''
      this.imageUrl = ''
      this.id = null
      this.show = true
    },
    edit (id) {
      this.show = true
      this.id = id
      this.url = this.list[id].url
      this.imageUrl = this.list[id].url
      this.desc = this.list[id].desc
      this.name = this.list[id].name
    },
    del (id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id != null) {
          this.list.splice(id, 1)
        }
        axios.post('/home/save-list', {
          list: this.list
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style>
.el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    transition: opacity .3s;
}
.edit {
  padding: 0 5px;
}
.arrow {
  padding: 0 30px !important;
}
.el-upload-list__item-actions span{
  cursor: pointer;
  text-align: center;
  color: #fff;
}
.el-upload-list__item-actions:after {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
}

.el-upload-list__item-actions:hover {
    opacity: 1
}

.demonstration {
  text-align: center;
  color: #8492a6;
  padding: 10px 0;
}
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    position: relative;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .bg-purple-dark {
    background: #99a9bf;
    margin-bottom: 10px;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
