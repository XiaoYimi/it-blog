<template>
  <div class="page-about">
    <dl class="about-wrapper">
      <dd class="abouts">
        <h3 class="abouts-title">关于 IT 博</h3>
        <ul class="abouts-blog-wrapper">
          <li class="abouts-blog-item">IT 博创立于 2020 年 1 月，是一个面向编程开发者的社区平台。</li>
          <li class="abouts-blog-item">我们的 Slogan 为：拥抱科技，成就自我，绽放世界。</li>
          <li class="abouts-blog-item">记住：没有一门技术难以成就自我；没有自我成就难以绽放世界。</li>
          <li class="abouts-blog-item">本域名为 itblog.com，itblog 由 IT Blog 结合构成，意为：IT 博客。</li>
          <li class="abouts-blog-item">本站致力于推广各种 IT 技术，所有资源完全免费，且根据互联网的变化实时更新内容。</li>
          <li class="abouts-blog-item">本站内如果存在不足之处，欢迎广大编程开发者在本站留言提供建议 (在此先谢谢各位编程开发者们)。</li>
        </ul>
      </dd>
      <dd class="abouts">
        <h3 class="abouts-title">免责声明</h3>
        <ul class="abouts-blog-wrapper">
          <li class="abouts-blog-item">
            <div class="info">
              <div class="info-title">版权信息</div>
              <ul class="info-item-wrapper">
                <li class="info-item">IT 博刊载的所有内容，包括文字、图片、音频、视频、软件、程序、以及网页版式设计等均在网上搜集。</li>
                <li class="info-item">IT 博提供的内容仅用于个人学习、研究或欣赏。我们不保证内容的正确性。通过使用本站内容随之而来的风险与本站无关。</li>
                <li class="info-item">访问者可将本网站提供的内容或服务用于个人学习、研究或欣赏，以及其他非商业性或非盈利性用途，但同时应遵守著作权法及其他相关法律的规定，不得侵犯本网站及相关权利人的合法权利。</li>
                <li class="info-item">本网站内容原作者如不愿意在本网站刊登内容，请及时通知本站，予以删除。</li>
              </ul>
            </div>
          </li>
          <li class="abouts-blog-item">
            <div class="info">
              <div class="info-title">链接到 IT 博</div>
              <ul class="info-item-wrapper">
                <li class="info-item">任何网站都可以链接到 IT 博的任何页面。</li>
                <li class="info-item">如果您需要在对少量内容进行引用，请务必在引用该内容的页面添加指向被引用页面的链接。</li>
              </ul>
            </div>
          </li>
          <li class="abouts-blog-item">
            <div class="info">
              <div class="info-title">保证</div>
              <ul class="info-item-wrapper">
                <li class="info-item">IT 博不提供任何形式的保证。所有与使用本站相关的直接风险均由用户承担。IT 博提供的所有代码均为实例，并不对性能、适用性、适销性或/及其他方面提供任何保证。</li>
                <li class="info-item">IT 博的内容可能包含不准确性或错误。IT 博不对本网站及其内容的准确性进行保证。如果您发现本站点及其内容包含错误，请联系我们以便这些错误得到及时的更正：2590856083@qq.com 。</li>
              </ul>
            </div>
          </li>
          <li class="abouts-blog-item">
            <div class="info">
              <div class="info-title">您的行为</div>
              <ul class="info-item-wrapper">
                <li class="info-item">当您使用本站点时，说明您已经同意并接受本页面的所有信息。</li>
              </ul>
            </div>
          </li>
          <li class="abouts-blog-item">
            <div class="info">
              <div class="info-title">联系方式</div>
              <ul class="info-item-wrapper">
                <li class="info-item">联系邮箱：2590856083@qq.com（相关事务请发函至该邮箱）</li>
              </ul>
            </div>
          </li>
        </ul>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  async fetch ({store, params, $axios}) {
    const {status, data: { code, user }} = await $axios.get('/users/baseUser')
    if (status === 200 && code === 0) {
      store.commit('getUser', user)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/css/public/about.scss';
</style>
