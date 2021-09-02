<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="avatar-wrapper">
        <img src="../assets/logo.png" alt="" />
      </div>

      <el-form
        class="login-form"
        ref="loginForm"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="密码"
          >
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="loginValidate">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      // 登录表单验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在3到10个字符之间',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在6到15个字符之间',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 登录表单重置
    resetLoginForm() {
      this.$refs.loginForm.resetFields()
    },
    // 登录表单预验证
    loginValidate() {
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) return
        else {
          const { data: res } = await this.$http.post('login', this.loginForm)
          if (res.meta.status !== 200) {
            return this.$message.error('登录失败')
          } else {
            this.$message.success('登录成功！')
            window.sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          }
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;

  .login-wrapper {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar-wrapper {
      height: 130px;
      width: 130px;
      background-color: #fff;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 100%;
        height: 100%;
        background-color: #eee;
        border-radius: 50%;
      }
    }

    .login-form {
      box-sizing: border-box;
      width: 100%;
      padding: 0 20px;
      position: absolute;
      bottom: 0;

      .btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>