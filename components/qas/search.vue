<template>
  <el-row :gutter="10" class="search-wrapper">
    <el-col>
      <el-input placeholder="请输入问答标题关键字" v-model="keyword" @input="search" class="input-qasearch"/>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      keyword: ''
    }
  },
  methods: {
    search () {
      this.$emit('search', this.keyword)
    }
  },
}
</script>

<style lang="scss">
</style>
