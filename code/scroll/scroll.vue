<template lang="html">
  <div class="yo-scroll"
       :class="{touch:touching}"
       @touchstart="touchStart($event)"
       @scroll="(onInfinite || infiniteLoading) ? onScroll($event) : undefined">
    <section class="inner" >
      <slot></slot>
      <footer class="load-more">
        <slot name="load-more">
          <span>加载中……</span>
        </slot>
      </footer>
    </section>
  </div>
</template>

<script>
  export default {
    props: {
      offset: {
        type: Number,
        default: 40
      },
      enableInfinite: {
        type: Boolean,
        default: true
      },
      enableRefresh: {
        type: Boolean,
        default: true
      },
      onInfinite: {
        type: Function,
        default: undefined,
        require: false
      }
    },
    data() {
      return {
        startY: 0,
        touching: false,
        infiniteLoading: false
      }
    },
    computed:{
      isIphoneX:function () {
        return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)
      }
    },
    methods: {
      touchStart(e) {
        this.startY = e.targetTouches[0].pageY
        this.startScroll = this.$el.scrollTop || 0
        this.touching = true;
      },
      infinite() {
        this.infiniteLoading = true;
        this.onInfinite(this.infiniteDone)
      },

      infiniteDone() {
        this.infiniteLoading = false
      },
      onScroll(e) {
        if (!this.enableInfinite || this.infiniteLoading) {
          return
        }
        let outerHeight = this.$el.clientHeight;
        let innerHeight = this.$el.querySelector('.inner').clientHeight;
        let scrollTop = this.$el.scrollTop;
        let infiniteHeight = this.$el.querySelector('.load-more').clientHeight;
        let bottom = innerHeight - outerHeight - scrollTop;
        if (bottom < infiniteHeight) this.infinite()
      }
    }
  }
</script>
<style>
  .yo-scroll {
    position: absolute;
    top: 67px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: auto;
    /*-webkit-overflow-scrolling: touch;*/
    border-radius: 10px 10px 0 0;
    padding: 0 15px 11px 15px!important;
    box-sizing: border-box;
  }
  .yo-scroll .inner {
    position: absolute;
    top: 0;
    width: 100%;
    transition-duration: 300ms;
    left: 0;
  }

  .yo-scroll.touch .inner {
    transition-duration: 0ms;
  }
  .yo-scroll .load-more {
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #ffffff;
  }
</style>
