<template>
  <div class="tenant-box">
    <span class="tenant-title" @click="changeVisit">{{ activeTenant.tenantName }}
      <Icon type="icon-down-bracket" size="14" :class="['arrow', showBox ? 'show-arrow' : 'hidd-arrow']"/>
    </span>
    <transition name="transition-drop">
      <ul class="tenant-wrap" v-show="showBox">
        <li
          v-for="(item, i) in tenantList" :key="i"
          :class="['tenant-item', {'tenant-item-active': activeTenant.tenantCode === item.tenantCode}]">
          <p class="tenant-first-title">{{ item.tenantName }}</p>
          <div class="instance" v-for="(instance, v) in item.instances" :key="v" @click="setTenant(item, instance)">
            <img v-if="instance.serviceImg" :src="instance.serviceImg" alt="">
            <img v-else :src="instance.serviceImg" alt="">
            <p class="title">
              <!-- {{instance.instanceName}} -->
              <Tooltip transfer :content="instance.instanceName" placement="bottom">
                {{ instance.instanceName }}
              </Tooltip>
            </p>
          </div>
        </li>
      </ul>
    </transition>
    <Model v-model="showModel">
      <template #header>
        <div class="outHeader">
          <Icon class="outIconL" type="icon-warning"/>
          <span class="outTitle">切换租户</span>
          <Icon class="outIconR" type="icon-close" @click="cal"/>
        </div>
      </template>
      <div class="outContent">
        确定切换当前租户为 <span class="tenant-name">{{ changeModel && changeModel.tenant.tenantName }}</span> 吗？
      </div>
      <template #footer>
        <div class="outFooter">
          <Button type="primary" @click="ok">确定</Button>
          <Button :disabled="disChange" @click="cal">取消</Button>
        </div>
      </template>
    </Model>
    <Loading size="20" fullScreen animate="around" v-model="isloading"/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { read, save, clearMulti, clear } from '@/storage'

export default {
  name: 'TenantList',
  data () {
    return {
      showBox: false,
      showModel: false,
      disChange: false,
      activeTenant: '',
      tenantList: [],
      changeModel: null,
      isloading: false
    }
  },
  computed: {
    ...mapState({
      url: ({ url }) => url
    })
  },
  watch: {},
  created () {
    this.init()
  },
  methods: {
    ...mapActions(['changeTenant', 'getAllElements', 'getTenantInstanceList']),
    init () {
      const tenantInstances = JSON.parse(read('tenantInstances'))
      if (tenantInstances && tenantInstances.length > 0) {
        this.tenantList = tenantInstances.map(tenant => {
          return {
            ...tenant,
            instances: (tenant.instances || []).map(instance => {
              const serviceImg = instance.serviceImg ? this.url.upLoadAdress + instance.serviceImg : null
              return {
                ...instance,
                serviceImg
              }
            })
          }
        })
        this.activeTenant = this.tenantList.find(item => item.isDefault === 1)
      }
    },
    changeVisit () {
      if (this.tenantList.length === 1 && this.tenantList[0].instances.length === 1) return
      this.showBox = !this.showBox
    },
    setTenant (tenant, instance) {
      this.isloading = false
      // 暂时先用instanceName作为基准，本平台即为租户管理平台。
      // if (instance.instanceName === '租户管理平台') return
      if (tenant.tenantCode !== this.activeTenant.tenantCode) {
        this.changeModel = {
          tenant: tenant,
          instance: instance
        }
        this.showModel = true
      } else {
        this.open(instance)
      }
    },
    open (instance, isTenant) {
      const token = read('token') ? read('token').replace('Bearer ', '') : null
      const userInfor = JSON.parse(read('userInfor'))
      const { tenantCode } = userInfor
      const { instanceCode, serviceUrl } = instance
      let url = `${serviceUrl}?t=${token}&c=${tenantCode}&i=${instanceCode}&r=${userInfor.refresh_token}`
      // 切换租户
      if (isTenant) {
        // 保留最新userInfor数据，getAllElements需要用到
        clearMulti(['btnPremissions', 'tenantInfor', 'menu', 'innerSystemList', 'tabList'])
        // 清楚tablist
        Promise.all([
          this.getAllElements(),
          this.getTenantInstanceList()
        ]).then(() => {
          save('instanceCode', instanceCode)
          window.location.href = url
        }).catch(() => {
          clear('', true)
        })
      } else {
        // 切换实例
        console.log('切换实例当前地址', url, instanceCode)
        window.open(url, instanceCode)
      }
    },

    ok () {
      // 切换租户
      // 1. 读切租户下实例的菜单按钮 2.读取userinfo 3.
      this.isloading = true
      this.disChange = true
      this.changeTenant({
        refresh_token: JSON.parse(read('userInfor')).refresh_token,
        tenantCode: this.changeModel.tenant.tenantCode,
        grant_type: 'change_tenant',
        client_id: process.env.VUE_APP_CLIENT_ID,
        client_secret: process.env.VUE_APP_CLIENT_SECRET
      })
        .then(() => {
          this.isloading = true
          this.activeTenant = this.changeModel.tenant
          this.$message({ type: 'success', message: '操作成功！' })
          this.open(this.changeModel.instance, true)
        })
        .finally(() => {
          this.isloading = false
          this.changeModel = null
          this.disChange = this.showModel = false
        })
    },
    cal () {
      this.changeModel = null
      this.showModel = false
    }
  }
}
</script>

<style scoped lang="less">
@deep : ~">>>";
.tenant-box {
  position     : relative;
  padding-left : 10px;

  .tenant-title {
    width         : 72px;
    color         : #ffffff;
    cursor        : pointer;
    display       : block;
    height        : 40px;
    line-height   : 40px;
    padding-right : 26px;
    text-align    : center;
    text-overflow : ellipsis;
    overflow      : hidden;
    word-break    : keep-all;

    &:hover {
      background-color : rgba(0, 68, 255, 0.555);
    }

    .arrow {
      position    : absolute;
      top         : 50%;
      right       : 0px;
      line-height : 1;
      transform   : translateY(-50%);
      transition  : transform .3s;
    }

    .show-arrow {
      transform : translateY(-50%) rotate(180deg);
      display   : inline-block;
    }
  }

  .tenant-wrap {
    position      : absolute;
    right         : -20px;
    top           : ~"calc(-100% + 80px + 4px)";
    z-index       : 999;
    color         : #1F2E4D;
    border-radius : 4px;
    background    : #ffffff;
    border        : 1px solid #E1E3EA;
    box-shadow    : 0px 1px 5px 0px rgba(194, 196, 204, 0.4);
    // min-width: 300px;
    width         : 430px;
    max-height    : 370px;
    padding       : 10px 20px;
    border-radius : 4px;
    overflow      : auto;

    .tenant-first-title {
      font-size     : 14px;
      font-weight   : 600;
      margin-bottom : 14px;
    }

    .tenant-item {
      margin-bottom : 20px;
      border-bottom : 1px solid #e6e9f0;

      &:last-child {
        margin-bottom : 0;
        border-bottom : 0;
      }

      .instance {
        display      : inline-block;
        margin-right : 20px;
        cursor       : pointer;
        transition   : color .3s;

        &:nth-child(5n + 1) {
          margin-right : 0;
        }

        &:hover {
          color : #3377ff;
        }

        img {
          box-sizing       : border-box;
          margin           : 0 auto;
          display          : block;
          width            : 38px;
          height           : 38px;
          border           : 1px solid #d2dae2;
          border-radius    : 4px;
          padding          : 5px;
          background-color : rgba(51, 119, 255, 90%);
        }

        @{deep} .title .sh-tooltip-rel {
          width         : 60px;
          margin-top    : 10px;
          text-overflow : ellipsis;
          overflow      : hidden;
          white-space   : nowrap;
          text-align    : center;
        }
      }
    }
  }

  .outHeader {
    height      : 18px;
    line-height : 18px;

    .outIconL {
      color     : #ffa033;
      font-size : 18px;
    }

    .outTitle {
      color       : #1f2e4d;
      font-weight : 600;
      margin-left : 5px;
    }

    .outIconR {
      float  : right;
      color  : #8f9bb3;
      cursor : pointer;
    }
  }

  .outContent {
    color : #1f2e4d;

    .tenant-name {
      color : #3377ff;
    }
  }

  .outFooter {
    width      : 100%;
    text-align : center;

    @{deep} .sh-btn {
      margin : 0 10px;
    }
  }
}
</style>
