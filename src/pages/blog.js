import React from 'react'
import { graphql } from 'gatsby'
import { Link } from 'gatsby'
import Layout from '../components/layout'

export default ({
  data, // this prop will be injected by the GraphQL query below.
}) => {
  //console.log(data)
  return (
    <Layout>
      <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
          <span> — {node.frontmatter.date}</span>
          <p>{node.frontmatter.description}</p>
        </div>
      ))}
    </Layout>
  )
}
export const pageQuery = graphql`
  query blogPage {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: {
        fileAbsolutePath: { glob: "**/posts/**" }
        frontmatter: { published: { ne: false } }
      }
    ) {
      totalCount
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            description
          }
        }
      }
    }
  }
`
