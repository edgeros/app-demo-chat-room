<template>
  <div class="home">
    <transition :name="transitionName">
      <router-view />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';

interface HistoryPath {
  index: number;
  fullPath?: string;
}

@Component({
  components: {}
})
export default class Home extends Vue {
  transitionName = 'slide-left';
  historyRouter: Array<HistoryPath> = [];

  @Watch('$route') public onRouteChange(to: Route, from: Route) {
    console.log('to:', to);
    const { fullPath, meta } = from;
    if (to.meta!.index > from.meta!.index) {
      this.transitionName = 'slide-left';
      this.historyRouter.push({ fullPath, index: meta!.index });
    } else {
      this.transitionName = 'slide-right';
      this.historyRouter.pop();
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  position: relative;
  > * {
    position: absolute;
  }
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s;
}
.slide-right-enter {
  transform: translateX(-100%);
}
.slide-right-leave-active {
  transform: translateX(100%);
}
.slide-left-enter {
  transform: translateX(100%);
}
.slide-left-leave-active {
  transform: translateX(-100%);
}
</style>
