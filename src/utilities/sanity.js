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

export function getImageUrl (source) {
  return imageBuilder.image(source).url()
}
