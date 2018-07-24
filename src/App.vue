<template>
  <div id="app">
    <header>
      <div class="container">
        <div class="header-left">
          <div class="logo" @click="reset">
            <img width="50" src="/img/icons/apple-touch-icon-60x60.png" alt="logo">
          </div>
          <h1>InstaSave</h1>
        </div>
      </div>
    </header>
    <section class="search">
      <div class="container">
        <div class="search-box">
          <input autofocus class="input" type="text" v-model="url" placeholder="Type URL here..">
          <button 
            class="submit" 
            type="button"
            @click="submit"
            :disabled="submitting">
            {{ submitting ? 'Submitting' : 'Submit' }}
          </button>
        </div>
        <div class="error" v-if="error">
          {{ error }}
        </div>
        <div class="example">
          e.g. <span @click="applyExample">{{ example }}</span>
        </div>
      </div>
    </section>
    <main>
      <div class="container">
        <div class="item" v-for="(item, index) in result" :key="index">
          <video 
            :src="item.video_url" 
            v-if="item.is_video"
            :poster="item.display_url"
            controls>
          </video>
          <img :src="item.display_url" v-else alt="">
          <button 
            class="btn"
            :disabled="item.progress" 
            @click="download(item)">
            {{ item.progress ? `${item.progress}%` : 'Download' }}
          </button>
        </div>
      </div>
    </main>
    <footer>
      <div class="container">
        &copy; 2018 <a target="_blank" href="https://github.com/egoist">EGOIST</a> Presents.
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios'
import { parse as parseUrl } from 'url'
import path from 'path'
import qs from 'querystring'

export default {
  data() {
    const query = qs.parse(location.search.slice(1))
    return {
      url: query.url,
      result: [],
      submitting: false,
      error: null,
      example: 'https://www.instagram.com/p/BlgGWL1HD1P/'
    }
  },

  methods: {
    reset() {
      this.url = ''
      this.error = null
      this.result = []
    },

    async submit() {
      this.error = null
      if (!this.url) return
      this.submitting = true
      const { data } = await axios.get(`https://dinsta.egoist.rocks/resources?url=${this.url}`)

      this.submitting = false

      if (data.error) {
        this.error = data.error
      } else {
        this.result = data.map(item => ({
          ...item,
          progress: null
        }))
      }
    },

    async download(item) {
      const resource = item.video_url || item.display_url
      const res = await axios({
        method: 'GET',
        responseType: 'blob',
        url: resource,
        onDownloadProgress: e => {
          item.progress = Math.round(e.loaded / e.total * 100)
          if (item.progress === 100) {
            item.progress = null
          }
        }
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', path.basename(parseUrl(resource).pathname))
      link.click()
    },

    applyExample() {
      this.url = this.example
      this.submit()
    }
  }
}
</script>

<style src="grid.css/grid.min.css"></style>

<style>
body {
  font: 14px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
}

* {
  box-sizing: border-box;
}

a {
  color: #333;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 10px;
}

.header-left {
  display: flex;
  align-items: center;
  justify-content: center;
}

h1 {
  margin: 0;
  margin-left: 10px;
  font-size: 2.4rem;
  font-weight: 500;
  opacity: .65;
  color: white;
}

img {
  max-width: 100%;
}

video {
  width: 100%;
  height: auto;
}

header {
  background-color: #4788C7;
  color: white;
  padding: 50px 0;
}

main {
  margin: 30px 0;
}

.search {
  /* background-color: #f9f9f9; */
  padding: 30px 0;
}

.search-box {
  display: flex;
}

.item {
  margin-bottom: 20px;
}

.input {
  border: none;
  outline: none;
  padding: 8px 12px;
  width: 70%;
  background: #f0f0f0;
  font-size: 1rem;
}

.input:focus {
  background: #f9f9f9;
}

.submit {
  border: none;
  padding: 8px 12px;
  width: 30%;
  background-color: #e2e2e2;
  font-size: 1rem;
  outline: none;
}

footer {
  margin: 20px 0;
  text-align: center;
  color: gray;
}

footer a {
  color: gray;
}

.error {
  color: red;
  margin-top: 5px;
}

.example {
  margin-top: 5px;
  color: gray;
}

.example span {
  cursor: pointer;
}

.example span:hover {
  opacity: .75;
}
</style>

<style src="./css/button.css"></style>
