<template>
  <div class="login">
    <img :src="require('../assets/chat.svg')" alt="logo" class="logo" />
    <van-button type="primary" round @click="handleEnterRoom">进入测试房间 </van-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Button } from 'vant';
import { IUser } from '@/interfaces/auth.interface';

@Component({
  components: {
    'van-button': Button
  }
})
export default class Login extends Vue {
  get accountInfo(): IUser {
    return this.$store.state.accountInfo
  }

  handleEnterRoom() {
    this.$router.push({name: 'chat-room'})
    // if (this.accountInfo && this.accountInfo.acoid) {
    //   this.$router.push({name: 'chat-room'})
    // } else {
    //   Notify({ type: 'warning', message: '当前未登录，请先登录爱智账号！' });
    // }
  }
}
</script>

<style lang='less' scoped>
.login {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  margin-bottom: 64px;
}
</style>