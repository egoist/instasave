<template>
  <div id="app">
    <gh slug="egoist/instasave"></gh>
    <h1 class="app-title">Insta Save</h1>
    <label class="url-label" for="instasave-url">Paste your Instagram link here</label>
    <input
    @input="handleTyping"
    placeholder="https://www.instagram.com/p/BJmERWHgFEd/" @keydown.enter="fetchImage" class="url-input" id="instasave-url" v-model="url">
    <div class="error" v-if="error">{{ error }}</div>
    <div class="preview">
      <img v-if="image" :src="image" alt="">
    </div>
    <div class="actions">
      <div class="action">
        <button :disabled="!url" type="button" class="button-preview" @click="fetchImage">{{ fetching ? 'Fetching...' : 'Preview' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import gh from 'vue-github-badge'

export default {
  name: 'app',
  data() {
    return {
      url: '',
      image: null,
      error: null,
      fetching: false
    }
  },
  methods: {
    handleTyping() {
      if (this.error) {
        this.error = null
      }
      if (this.image) {
        this.image = null
      }
    },
    async fetchImage() {
      const url = this.url.trim()
      if (!url || this.fetching) return

      this.fetching = true
      try {
        const res = await axios.get(`https://instasave-api.now.sh/embed?url=${url}`)
          .then(res => res.data)
        this.image = res.thumbnail_url
          .replace(/\/sh0.08\//, '/')
          .replace(/\/p\d{3}x\d{3}\//, '/')
        this.error = null
      } catch (err) {
        this.image = null
        if (err.response) {
          this.error = err.response.data
        } else {
          this.error = err.message
        }
      }
      this.fetching = false
    }
  },
  components: {
    gh
  }
}
</script>

<style scoped lang="stylus">
  .app-title
    margin-top: 100px
    font-weight: 300
    font-size: 3rem

  .url-label
    color: #ff5722
    display: block
    height: 30px
    line-height: 30px
    text-align: left

  .url-input
    display: block
    width: 100%
    border: 1px solid #e2e2e2
    box-shadow: 1px 2px 2px #f0f0f0
    background-color: white
    padding: 10px 10px
    border-radius: 4px
    outline: none
    &:focus
      border-color: #ccc

  .actions
    margin: 20px 0

  .button-preview
    border-radius: 33px
    padding: 15px 0
    width: 240px
    border: none
    font-size: 1.4rem
    cursor: pointer
    color: white
    outline: none
    background: linear-gradient(to right, #eaac76, #f57e46, #FF5722, #c1493d)
    &[disabled]
      cursor: not-allowed

.preview
  margin-top: 20px
  img
    max-width: 100%

.error
  text-align: left
  margin: 20px 0
  background-color: red
  color: white
  padding: 10px
  border-radius: 4px
  white-space: pre
  overflow: auto
</style>
