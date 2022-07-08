import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const client = sanityClient({
  projectId: 'pa19rq30',
  dataset: 'production',
  apiVersion: '2022-06-24',
  useCdn: true
})
const imageBuilder = imageUrlBuilder(client)

export function fetch (query, param = {}) {
  return client.fetch(query, param)
}

export function getImageUrl (source, opts = {}) {
  let part = imageBuilder.image(source)

  if (notEmptyObject(opts)) {
    Object.entries(opts).forEach(entry => {
      const [key, value] = entry
      part = part[key](value) // Does things like part.width(200)
    })
  }

  return part.url()
}

function notEmptyObject (obj) {
  return Object.keys(obj).length > 0
}
