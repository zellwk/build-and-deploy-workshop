import 'dotenv/config'
import g from 'glob'
import { readFile } from 'fs/promises'
import { promisify } from 'util'
import algoliasearch from 'algoliasearch'
import path from 'path'
import { JSDOM } from 'jsdom'
import crypto from 'crypto'

const glob = promisify(g)
const ALGOLIA_ID = process.env.ALGOLIA_ID
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_API_KEY)

// Indexing for document search
// https://www.algolia.com/blog/engineering/how-to-build-a-helpful-search-for-technical-documentation-the-laravel-example/
const index = client.initIndex('content')
index.setSettings({
  attributeForDistinct: 'h1',
  distinct: true
})

// Getting records from HTML Pages
const pages = await glob('./dist/**/index.html')
const records = await createRecordsFromHTML(pages)

// Remove redundant records
await removeRedundantRecords(records)

// Save records to Algolia
index
  .saveObjects(records)
  .then(console.log)
  .catch(console.log)

// ========================
// Supporting Functions
// ========================
/**
 * Scrapes HTML pages and creates records
 * @param {array} pages HTML pages to parse
 * @returns
 */
async function createRecordsFromHTML (pages) {
  // Improvement: Confirm which textElements are important for the records... And whether `element.textContent` gets all children content as well.
  const textElements = [
    'h1',
    'h2',
    'h3',
    'ul',
    'ol',
    // 'div',
    'span',
    'p',
    // 'b',
    // 'em',
    // 'strikethrough'
    // 'a',
    'figure'
  ].map(value => 'main ' + value)

  pages = pages.map(async (page, index) => {
    const pagePath = pages[index]
    const permalink = path.join(
      pagePath.replace('index.html', '').replace('dist/', '')
    )

    const buffer = await readFile(page)
    const html = buffer.toString()

    const { window } = new JSDOM(html)
    const document = window.document

    const elements = document.querySelectorAll(textElements)
    const stack = []
    let h1, h2, h3, link

    for (const element of elements) {
      let content
      let record = {}
      const tag = element.tagName
      if (tag === 'H1') {
        h1 = element.textContent
        link = permalink
      } else if (tag === 'H2') {
        h2 = element.textContent
        h3 = ''
        link = permalink + '#' + element.id
      } else if (tag === 'H3') {
        h3 = element.textContent
        link = permalink + '#' + element.id
      } else {
        content = element.textContent
      }

      // Build the record
      if (h1) record.h1 = h1
      if (h2) record.h2 = h2
      if (h3) record.h3 = h3
      if (link) record.link = link
      if (content) record.content = content.trim()
      record.objectID = quickHash(JSON.stringify(record))

      stack.push(record)
    }

    return stack
  })

  let records = await Promise.all(pages)
  records = records.flat()

  return records
}

// Fastest hash among a few tested ones.
// https://medium.com/@chris_72272/what-is-the-fastest-node-js-hashing-algorithm-c15c1a0e164e
function quickHash (data) {
  return crypto
    .createHash('sha1')
    .update(data)
    .digest('base64')
}

/**
 * Gets ID of current records from Algolia
 * @returns {array} Array of record IDs
 */
async function getOldRecordIDs () {
  let oldRecords = []
  await index.browseObjects({
    query: '',
    attributesToRetrieve: 'objectID',
    batch: batch => {
      oldRecords = oldRecords.concat(batch)
    }
  })

  return oldRecords.map(record => record.objectID)
}

/**
 * Removes redundant records from Algolia
 * @param {array} newRecords Algolia records
 */
async function removeRedundantRecords (newRecords) {
  const newRecordIDs = newRecords.map(record => record.objectID)
  const oldRecordIDs = await getOldRecordIDs()

  // Improvement: Pop the ID off both records when checked and true.
  // This reduces the amount of records in both arrays to filter through
  const redundantRecordIDs = oldRecordIDs.filter(
    id => !newRecordIDs.includes(id)
  )

  await index.deleteObjects(redundantRecordIDs)
}
