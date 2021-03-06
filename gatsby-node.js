const path = require('path')
// const { createFilePath } = require(`gatsby-source-filesystem`);
const _ = require('lodash')
//const createPaginatedPages = require('gatsby-paginate')

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  let slug

  if (node.internal.type === `MarkdownRemark`) {
    const fileNode = getNode(node.parent)
    const parsedFilePath = path.parse(fileNode.relativePath)

    slug = `/${parsedFilePath.name}`

    // const docTypeArray = fileNode.dir.split('/')
    // const type = docTypeArray[docTypeArray.length-1]
    //   console.log(`\n`, slug);

    // Add slug as a field on the node.
    createNodeField({ node, name: `slug`, value: slug })
  }
}

exports.createPages = ({ actions, graphql }) => {
  const { createPage, createRedirect } = actions

  const pageTemplate = path.resolve('src/templates/page.js')
  const blogPostTemplate = path.resolve('src/templates/blogpost.js')
  const tagTemplate = path.resolve('src/templates/tags.js')

  /* / Because our home page is created with the /home slug, redirect / to it.
  createRedirect({
    fromPath: '/',
    toPath: '/home',
    isPermanent: true,
    redirectInBrowser: true,
  })

*/

  //two named queries...note the use of glob filtering here

  return graphql(`
    {
      pages: allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: {
          fileAbsolutePath: { glob: "**/pages/**" }
          frontmatter: { published: { ne: false } }
        }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              tags
              parent
              description
              published
              lastModDate
            }
          }
        }
      }

      posts: allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: {
          fileAbsolutePath: { glob: "**/posts/**" }
          frontmatter: { published: { ne: false } }
        }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              tags
              parent
              description
              published
              lastModDate
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    // Make pages with the pages result
    const pages = result.data.pages.edges

    // Create post detail pages
    pages.forEach(({ node }) => {
      const slug = node.fields.slug
      // console.log(slug);

      createPage({
        path: slug,
        component: pageTemplate,
      })
    })

    // Make posts with the posts result
    const posts = result.data.posts.edges

    // Create post detail pages
    posts.forEach(({ node }, index) => {
      const slug = node.fields.slug
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node
      //console.log(slug)

      createPage({
        path: slug,
        component: blogPostTemplate,
        context: {
          previous,
          next,
        },
      })
    })

    // Tag pages:
    let tags = []
    // Iterate through each post, putting all found tags into `tags`
    _.each(posts, edge => {
      if (_.get(edge, 'node.frontmatter.tags')) {
        tags = tags.concat(edge.node.frontmatter.tags)
      }
    })
    // Eliminate duplicate tags
    tags = _.uniq(tags)

    // Make tag pages
    tags.forEach(tag => {
      createPage({
        path: `/tags/${_.kebabCase(tag)}/`,
        component: tagTemplate,
        context: {
          tag,
        },
      })
    })
  })
}
