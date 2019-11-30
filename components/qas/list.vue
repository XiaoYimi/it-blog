<template>
  <dl class="list-wrapper">
    <dt class="list-name">问答列表</dt>
    <div v-if="nqas.length > 0" class="page-wrapper">
      <div v-for="(pages, pid) of nqas" :key="pid" :class="['page', pid === page ? 'page-active' : '']">
        <dd class="item" v-for="(items, iid) of pages" :key="iid">
          <template v-for="(item, idx) of items">
            <div :key="idx"
              @click="detailQa('/user/' + item.nickname + '/qas/detail/' + item.qid)">
              <h3 class="item-title"><nuxt-link to="detailqa">{{ item.title }}</nuxt-link></h3>
              <div class="item-content" v-html="item.content" />
              <div class="item-info">
                <span class="hidden-sm-and-up">IT博主:</span>
                <span @click.stop="toAuthor('/user/' + item.nickname + '/detail')"
                  class="author">{{ item.nickname }}</span>
                <span class="hidden-sm-and-down">发布于 {{ item.date }}</span>
                <span class="item-readed"> <i class="el-icon-reading item-icon"/> 阅读 ({{ item.reading }})</span>
              </div>
            </div>
          </template>
        </dd>
      </div>
    </div>

    <dd class="item no-data" v-else>暂无问答 ...</dd>
    <dd v-show="nqas.length > 1">
      <el-pagination
        layout="prev, pager, next"
        @current-change="pclick"
        :current-page="0"
        :total="nqas.length * 10"/>
    </dd>
  </dl>

</template>

<script>
import DateDeal from '@/server/interface/utils/date_iso_to_ch'
export default {
  props: {
    keyword: String,
    qas: Array
  },
  data () {
    return {
      page: 0
    }
  },
  computed: {
    nqas () {
      let self = this
      let res = [], len = 0
      // 处理时间 国际时间转中国时间
      for (let d=0; d<self.qas.length; d++) {
        let date = self.qas[d].date
        date = DateDeal.datetime(date)
        self.qas[d].date = date
      }
      if (self.keyword !== '') {
        const res_filter = self.qas.filter(item => item.title.indexOf(self.keyword) >= 0)
        len = Math.ceil(res_filter.length / 20) // 组数
        for (let i=0; i<len; i++) {
          const item = []
          item.push(res_filter.slice(i * 20, i * 20 + 20))
          res.push(item)
        }
      } else {
        len = Math.ceil(self.qas.length / 20) // 组数
        for (let i=0; i<len; i++) {
          const item = []
          item.push(self.qas.slice(i * 20, i * 20 + 20))
          res.push(item)
        }
      }
      return res
    }
  },
  methods: {
    pclick (val) { this.page = val - 1 },
    detailQa (src) { this.$router.push(src) },
    toAuthor (src) {
      this.$router.push(src)
    }
  }
}
</script>

<style lang="scss">
</style>
