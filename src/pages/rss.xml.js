import rss from '@astrojs/rss'

const importResult = import.meta.globEager('./blog/*.md')
const posts = Object.values(importResult)

export const get = () =>
  rss({
    title: 'This is your title',
    description: 'This is your description',
    site: 'https://astro-demo/',
    items: posts.map(post => ({
      title: post.frontmatter.title,
      pubDate: post.frontmatter.date,
      link: post.url
    }))
  })
