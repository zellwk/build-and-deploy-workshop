import dateFns from 'date-fns'

export function sortPosts (posts) {
  return posts.sort((a, b) => {
    const aDate = new Date(a.frontmatter.date)
    const bDate = new Date(b.frontmatter.date)

    return bDate.getTime() - aDate.getTime()
  })
}

export function readableDate (date) {
  return dateFns.format(date, 'MMM do, yyyy')
}
