import algolia from 'algoliasearch'

const posts = [
  {
    title: 'First Post',
    description: 'My first post',
    link: '/blog/first-post',
    objectID: '1'
  },
  {
    title: 'Second Post',
    description: 'My second post',
    link: '/blog/second-post',
    objectID: '2'
  },
  {
    title: 'Third Post',
    description: 'My third post',
    link: '/blog/third-post',
    objectID: '3'
  }
]

// Initialize Algolia
const client = algolia('WGGTXJI80W', '09757e54248fd87642f464ebf36462f2')
const index = client.initIndex('content')

index
  .saveObjects(posts)
  .then(console.log)
  .catch(console.log)
