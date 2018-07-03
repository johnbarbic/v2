
const path = require("path");
// const { createFilePath } = require(`gatsby-source-filesystem`);
const _ = require("lodash");


exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  let slug;

	if (node.internal.type === `MarkdownRemark`) {
		const fileNode = getNode(node.parent)
    const parsedFilePath = path.parse(fileNode.relativePath);

    slug = `/${parsedFilePath.name}/`;


    // const docTypeArray = fileNode.dir.split('/')
		// const type = docTypeArray[docTypeArray.length-1]
     //   console.log(`\n`, slug);

    // Add slug as a field on the node.
    createNodeField({ node, name: `slug`, value: slug });


  }
}

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const pageTemplate = path.resolve("src/templates/page.js")
  const blogPostTemplate = path.resolve("src/templates/blogpost.js")
  const tagTemplate = path.resolve("src/templates/tags.js")

//two named queries...

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
            fields{
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
            fields{
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
    const pages = result.data.pages.edges;

    // Create post detail pages
    pages.forEach(({ node }) => {
      const slug = node.fields.slug;
      //console.log(slug);

      createPage({
        path: slug,
        component: pageTemplate
      })
    })


    // Make posts with the posts result
    const posts = result.data.posts.edges;

    // Create post detail pages
    posts.forEach(({ node }) => {
      const slug = node.fields.slug;
      //console.log(slug);

      createPage({
        path: slug,
        component: blogPostTemplate
      })
    })

    // Tag pages:
    let tags = []
    // Iterate through each post, putting all found tags into `tags`
    _.each(posts, edge => {
      if (_.get(edge, "node.frontmatter.tags")) {
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