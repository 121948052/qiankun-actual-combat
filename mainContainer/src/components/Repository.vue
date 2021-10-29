<!--
 * User: CHT
 * Date: 2021/9/7
 * Time: 15:54
-->
<template>

  <Poptip
    :width="360"
    ref="poptip"
    title="">
    <div class="repository">
      <span class="icon"></span>
    </div>
    <section
      @keydown.enter="search"
      class="repository-container"
      slot="content">
      <h3>系统操作指南</h3>
      <div class="search-input">
        <Icon
          class="search-icon"
          type="icon-search"
        />
        <input
          v-model="keywords"
          placeholder="请输入关键字搜索"
          type="text"
        />
        <Button
          :disabled="!keywords.trim()"
          @click="search"
          type="primary"
          class="search-btn">
          搜索
        </Button>
      </div>
    </section>
  </Poptip>
</template>

<script>
import { save } from '@/storage'

export default {
  name: 'Repository',
  data () {
    return {
      keywords: ''
    }
  },
  methods: {
    search () {
      if (!this.keywords.trim()) return
      this.$refs.poptip.visible = false
      save('currentTabName', '搜索结果')
      this.$router.push({
        path: '/work/knowledge/search/result',
        query: {
          searchvalue: this.keywords,
          tagtype: 0
        }
      })
      this.keywords = ''
    }
  }
}
</script>

<style lang="less" scoped>
@deep : ~">>>";

.repository {
  @height    : 40px;
  @icon-size : 22px;
  @padding   : ((@height - @icon-size) / 2);

  box-sizing : border-box;
  cursor     : pointer;
  height     : @height;
  width      : 36px;
  text-align : center;
  padding    : @padding 6px;

  &:hover {
    background-color : rgba(0, 68, 255, 0.555);
  }

  .icon {
    display    : inline-block;
    width      : @icon-size;
    height     : @icon-size;
    background : url('/image/repository-icon.svg') no-repeat center/22px;
  }

  @{deep} {
    .sh-poptip-body {
      padding : 19px;
    }
  }
}

.repository-container {
  width      : 320px;
  text-align : left;

  > h3 {
    font-size     : 14px;
    color         : #1F2E4D;
    line-height   : 2;
    margin-bottom : 10px;
  }

  > .search-input {
    display     : flex;
    position    : relative;
    align-items : center;

    .search-icon {
      left     : .5em;
      position : absolute;
      color    : #B7BECA;
    }

    input {
      font-size     : 12px;
      box-sizing    : border-box;
      padding-left  : 2em;
      height        : 32px;
      line-height   : 30px;
      width         : 260px;
      border        : 1px solid #3377FF;
      border-radius : 3px 0 0 3px;

      &:focus {
        border-color : #3377FF;
        outline      : none;
      }
    }

    .search-btn {
      height        : 32px;
      border-radius : 0 3px 3px 0;
    }
  }
}
</style>
