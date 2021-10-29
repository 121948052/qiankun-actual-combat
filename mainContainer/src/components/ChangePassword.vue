<template>
  <!-- Model 修改密码 -->
  <Model
    v-model="isChangePasswd"
    title="修改密码">
    <Form
      ref="formChangePasswd"
      style="margin-top: 40px"
      :model="formChangePasswd"
      :labelWidth="80"
      labelPosition="right"
      :inline="false"
      :rules="formChangePasswdRules">
      <form-item
        label="原始密码"
        prop="oldPassword">
        <Input
          class="edit-input"
          placeholder="请输入原始密码"
          type="password"
          v-model="formChangePasswd.oldPassword"
          isEncrypto
          @on-change-encrypto="val => encryptionModel.oldPassword = val"
        />
      </form-item>
      <form-item
        label="新密码"
        prop="newPassword">
        <Input
          class="edit-input"
          placeholder="请输入新密码"
          type="password"
          v-model="formChangePasswd.newPassword"
          :maxlength="16"
          isEncrypto
          @on-change-encrypto="val => encryptionModel.newPassword = val"
        />
      </form-item>
      <form-item
        label="确认密码"
        prop="confirmPassword">
        <Input
          class="edit-input"
          placeholder="请输入确认密码"
          type="password"
          v-model="formChangePasswd.confirmPassword"
          :maxlength="16"
          isEncrypto
          @on-change-encrypto="val => encryptionModel.confirmPassword = val"
        />
      </form-item>
    </Form>
    <template v-slot:footer>
      <Button @click="changePasswdOK" type="primary" :disabled="formChangePasswd.isDisabled">确定</Button>
      <Button @click="changePasswdNO" style="margin-left:10px">取消</Button>
    </template>
  </Model>
</template>

<script>
import { clear } from '@/storage'
import { mapActions } from 'vuex'

const passwordReg = /(?=.*[a-zA-Z]).{8,16}/
const characterLimitReg = /^[0-9a-zA-Z~!@$%^&*()_+]*$/

export default {
  name: 'ChangePassword',
  data () {
    const validateConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formChangePasswd.newPassword) {
        callback(new Error('两次输入新密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      isChangePasswd: false,
      // 加密前
      formChangePasswd: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        isDisabled: false
      },
      // 存储加密后字段
      encryptionModel: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      formChangePasswdRules: {
        oldPassword: [
          {
            required: true,
            message: '请输入原始密码',
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
          {
            message: '请设置8-16位密码，至少包含一个字母',
            trigger: 'blur',
            pattern: passwordReg
          },
          {
            message: '密码不能包含~!@$%^&*()_+之外的特殊字符',
            trigger: 'change',
            pattern: characterLimitReg
          }
        ],
        confirmPassword: [
          {
            required: true,
            trigger: 'blur',
            validator: validateConfirm
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['loginOuts', 'changPasswd']),
    // 密码修改
    changePassword () {
      this.isChangePasswd = true
      setTimeout(() => {
        this.$refs.formChangePasswd.resetFields()
      }, 0)
    },
    // 确定密码修改
    changePasswdOK () {
      this.$refs.formChangePasswd.validate(val => {
        if (!val) {
          return
        }
        const { oldPassword, newPassword, confirmPassword } = this.encryptionModel
        this.changPasswd({ oldPassword, newPassword, confirmPassword }).then(res => {
          this.$emit('colseLoginInfoModel')
          this.$message({ type: 'success', message: '密码修改成功，请重新登陆' })
          setTimeout(() => {
            this.$refs.formChangePasswd.resetFields()
            this.isChangePasswd = false
            clear('token', true)
            this.$router.push('/login')
          }, 1500)
        })
      })
    },
    // 取消密码修改
    changePasswdNO () {
      this.$refs.formChangePasswd.resetFields()
      this.isChangePasswd = false
    }
  }
}
</script>

<style scoped lang="less">
@deep : ~">>>";
.language {
  position    : relative;
  width       : 94px;
  height      : 44px;
  display     : flex;
  align-items : center;
  margin-left : 20px;
  // border-right: 1px solid #1265F1;
  .active-icon {
    z-index  : 1;
    left     : 1px;
    top      : 9px;
    color    : #ffffff;
    position : absolute;
  }
}

@{deep} .sh-select {
  width : 94px;

  &-selection {
    padding      : 0 0 0 13px;
    color        : #ffffff;
    background   : none;
    border-color : transparent;

    .iconfont {
      color : #ffffff;
    }
  }

  .selected-icon {
    display : none;
  }

  .sh-select-dropdown {
    margin : 10px 0 0 -10px;
    width  : 112px;
  }

  .sh-select-item {
    display     : flex;
    align-items : center;

    .iconfont {
      margin-right : 4px;
    }
  }
}

</style>
