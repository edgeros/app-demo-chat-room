<template>
  <div class="chat-room">
    <van-nav-bar :title="`测试房间【${chatCount}人】`">
      <template #left>
        <img
          :src="require('../assets/back.svg')"
          alt="back"
          width="22"
          :style="{ transform: 'rotateY(180deg)' }"
          @click="handleLeave"
        />
      </template>
    </van-nav-bar>
    <div class="chat-content-box">
      <div class="chat-content">
        <div
          :class="{ 'chat-content-item': true, 'chat-content-item-right': item.sender.acoid === accountInfo.acoid }"
          v-for="item in chatContent"
          :key="item.time"
        >
          <img :src="item.sender.profile || defaultAvatar" alt="avatar" width="32" />
          <div>{{ item.message }}</div>
        </div>
      </div>
    </div>
    <!-- 输入框 -->
    <div class="send">
      <van-field v-model="msg" center class="send-input" placeholder="请输入..."> </van-field>
      <van-button
        size="small"
        type="primary"
        :disabled="!msg.trim()"
        @click="sendMessage"
        class="send-btn"
        icon="guide-o"
        >发送</van-button
      >
      <van-button size="small" type="danger" class="send-btn" :style="{'margin-left': '8px'}" :disabled="!chatContent.length" @click="clearMessage" icon="delete-o"
        >清空</van-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Button, Field, NavBar, Uploader } from 'vant';
import { createSyncTable } from '@/services/webSynctable';
import { IUser } from '@/interfaces/auth.interface';
import { IResponse } from '@/interfaces/common.interface';

interface IChatMessage {
  sender: IUser;
  message: string;
  time: string;
}

@Component({
  components: {
    'van-nav-bar': NavBar,
    'van-field': Field,
    'van-button': Button,
    'van-uploader': Uploader
  }
})
export default class ChatRoom extends Vue {
  defaultAvatar = require('@/assets/small.png');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chatTable: any = undefined;
  chatCount = 0;
  chatContent: IChatMessage[] = [];
  msg = '';
  name = 0;
  chatContentBoxDom: HTMLElement | null = null;
  chatContentDom: HTMLElement | null = null;

  get accountInfo() {
    return this.$store.state.accountInfo;
  }

  created() {
    if (!this.accountInfo || !this.accountInfo.acoid) {
      this.$edger.notify.error('当前账号未登录！');
      this.$router.push('login');
    } else {
      this.name = +new Date();
      this.chatTable = createSyncTable('chat');
      this.chatTable.on('update', (k: 'count' | 'message', v: number | IChatMessage) => {
        switch (k) {
          case 'count':
            this.chatCount = v as number;
            break;
          case 'message':
            if (v instanceof Object) {
              this.chatContent.push(v);
            }
            break;
          default:
            break;
        }
      });
      this.chatTable.addEventListener('clear', () => {
        this.chatContent = [];
      });
    }
  }

  /* 返回登录页面 */
  handleLeave() {
    this.chatTable
      .set('count', --this.chatCount)
      .then(() => {
        this.chatTable.close();
        this.$router.push('login');
      })
      .catch(() => {
        this.$edger.notify.warning('离开房间失败，请重试！');
      });
  }

  /* 发送消息 */
  sendMessage() {
    this.chatTable
      .set('message', {
        sender: this.accountInfo,
        message: this.msg,
        time: new Date().toDateString()
      })
      .then(() => {
        this.msg = '';
      })
      .catch(() => {
        this.$edger.notify.error('消息发送失败，请重试！');
      });
  }

  clearMessage() {
    this.chatTable
      .fetch('clear')
      .then((ret: IResponse) => {
        console.log('server reply: ', ret);
      })
      .catch((e: Error) => {
        console.error('fetch error:', e);
      });
  }
}
</script>

<style lang="less" scoped>
@green: rgb(22, 206, 52);

.chat-room {
  width: 100%;
  height: 100%;
  min-height: 200px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.chat-content-box {
  flex: 1;
  background: #eee;
  overflow: auto;
  position: relative;
  .chat-content {
    position: absolute;
    left: 0;
    right: 0;
    min-height: 100%;
    .chat-content-item {
      padding: 8px 0;
      display: flex;
      align-items: flex-start;
      &.chat-content-item-right {
        flex-direction: row-reverse;
        div {
          margin-left: 48px;
          background: @green;
          margin-right: 0;
          &::before {
            display: none;
          }
          &::after {
            content: '';
            display: block;
            width: 0px;
            height: 0px;
            border: 5px solid @green;
            position: absolute;
            top: 8px;
            right: -4px;
            transform: rotate(45deg);
          }
        }
      }
      img {
        overflow: hidden;
        margin: 0 12px;
        border-radius: 4px;
      }
      div {
        // flex: 1;
        width: fit-content;
        background: #fff;
        margin-right: 48px;
        border-radius: 4px;
        padding: 8px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        word-break: break-all;
        white-space: pre-wrap;
        text-align: left;
        font-size: 13px;
        line-height: 20px;
        position: relative;
        &::before {
          content: '';
          display: block;
          width: 0px;
          height: 0px;
          border: 5px solid #fff;
          position: absolute;
          top: 8px;
          left: -4px;
          transform: rotate(45deg);
        }
      }
    }
  }
}

.send {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f1f3f4;
  box-shadow: 0 0 5px 0 #bbb;
  .send-input {
    padding: 4px 8px;
    margin-right: 12px;
  }
  img {
    display: block;
    margin: 0 8px;
  }
  .send-img {
    &:active {
      transform: scale(0.9);
    }
  }
  .send-btn {
    * {
      white-space: nowrap;
    }
  }
}
</style>
