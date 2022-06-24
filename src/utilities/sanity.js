import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: 'pa19rq30',
  dataset: 'production',
  apiVersion: '2022-06-24',
  useCdn: true
})

export function fetch (query, param = {}) {
  return client.fetch(query, param)
}
