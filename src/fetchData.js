import axios from 'axios'
import cheerio from 'cheerio'

export default async url => {
  const html = await axios({
    url,
    timeout: 10000,
    method: 'GET'
  }).then(res => res.data)
  
  const $ = cheerio.load(html)
  let data
  $('script').each(function () {
    const content = $(this).html()
    if (content && content.includes('window._sharedData =')) {
      const fn = new Function('window', content)
      const window = {}
      fn(window)
      const media = window._sharedData.entry_data.PostPage[0].graphql.shortcode_media
      data = media.edge_sidecar_to_children ? 
        media.edge_sidecar_to_children.edges.map(item => item.node) :
        [media]
    }
  })
  return data
}
