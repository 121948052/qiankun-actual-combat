<script>
import emptyPng from '@/assets/images/empty.png'
import yingyongSvg from '@/assets/images/yingyong.svg'
export default {
  name: 'Empty',
  props: {
    imageName: {
      type: String,
      default: 'emptyPng'
    },
    text: {
      type: String,
      default: '暂无数据'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: 'auto'
    }
  },
  data () {
    return {
      emptyPng,
      yingyongSvg
    }
  },
  render () {
    const { width, height, text, imageName } = this
    let image = this[imageName]
    return (
      <div class="empty" style={{ width, height }}>
        <div class="defaultIcon">
          <img class="emptyImage" style={imageName === 'yingyongSvg' ? 'width: 50px;opacity: 0.25;' : ''} src={image} alt="#" />
          <div>{text}</div>
        </div>
      </div>
    )
  }
}
</script>

<style scoped lang='less'>
.empty {
  position: relative;
  min-height: 240px;
  background-color: white;
  .defaultIcon {
    width: 100%;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #6F7E95;
    font-size: 14px;
  }
  .emptyImage {
    max-width: 240px;
  }
}
</style>
