<template>
  <div id="app">
    <gh slug="egoist/instasave"></gh>
    <h1 class="app-title">InstaSave</h1>
    <label class="url-label" for="instasave-url">Paste your Instagram link here</label>
    <input
    autofocus
    @input="handleTyping"
    placeholder="https://www.instagram.com/p/BJmERWHgFEd/" @keydown.enter="previewImage" class="url-input" id="instasave-url" v-model="url">
    <div class="error" v-if="error">{{ error }}</div>
    <div class="preview" v-if="image">
      <img :src="image.url" :alt="image.desc">
      <p>{{ image.desc }}</p>
      <p>-- by <a :href="`https://www.instagram.com/${image.author}/`" target="_blank">{{ image.author }}</a></p>
    </div>
    <div class="actions">
      <div class="action">
        <button :disabled="!url" type="button" class="button-preview" @click="previewImage">{{ fetching ? 'Fetching...' : 'Preview' }}</button>
      </div>
      <div class="action">
        <button :disabled="!url" type="button" class="button-download" @click="downloadImage">{{ downloading ? 'Downloading...' : 'Download' }}</button>
      </div>
    </div>
    <footer class="footer">
      {{ year }} &copy; <a href="https://github.com/egoist/donate">EGOIST</a>
    </footer>
  </div>
</template>

<script>
import axios from 'axios'
import gh from 'vue-github-badge'
import qs from 'query-string'
import download from 'downloadjs'

function getOriginalImage(url) {
  return url
    .replace(/\/sh0.08\//, '/')
    .replace(/\/[a-z]\d{3}x\d{3}\//, '/')
}

export default {
  name: 'app',
  data() {
    return {
      year: new Date().getFullYear(),
      url: '',
      image: null,
      error: null,
      fetching: false,
      downloading: false
    }
  },
  created() {
    const query = qs.parse(window.location.hash)
    if (query.url) {
      this.url = query.url
      this.previewImage()
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
      const query = qs.parse(window.location.hash)
      query.url = this.url
      window.location.hash = qs.stringify(query)
    },
    async fetchImage(url) {
      try {
        const res = await axios.get(`https://instasave-api.now.sh/embed?url=${url}`)
          .then(res => res.data)
        this.error = null
        return {
          url: getOriginalImage(res.thumbnail_url),
          author: res.author_name,
          desc: res.title,
          media_id: res.media_id
        }
      } catch (err) {
        if (err.response) {
          this.error = err.response.data
        } else {
          this.error = err.message
        }
        return null
      }
    },
    async previewImage() {
      const url = this.url.trim()
      if (!url || this.fetching) return

      this.fetching = true
      this.image = await this.fetchImage(url)
      this.fetching = false
    },
    async downloadImage() {
      const url = this.url.trim()
      if (!url || this.downloading) return

      this.downloading = true
      const file_name = `${res.author}-${res.media_id}.jpg`
      const dl = await axios({
        method:'get',
        url:res.url,
        responseType:'blob'
      }).then(function(response) {
          download(response.data, file_name, 'image/jpeg')
      })
      this.downloading = false
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

.actions
  display: flex
  align-items: center
  justify-content: center

.action
  padding: 10px

@media screen and (max-width: 768px)
  .actions
    flex-direction: column
</style>
