import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import { Link } from 'gatsby'
// Utilities
import kebabCase from 'lodash/kebabCase'

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark
  return (
    <Layout>
      <div className="blog-post">
        <h1>{frontmatter.title}</h1>
        <h2>{frontmatter.date}</h2>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <div>
        <h1>Tags</h1>
        <ul>
          {frontmatter.tags.map(tag => (
            <li key={tag}>
              <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {frontmatter.tags.map(({ tag }) => (
          <Link to="/test" style={{ textDecoration: `none`, color: `blue` }}>
            {tag}
          </Link>
        ))}
      </div>
    </Layout>
  )
}
export const pageQuery = graphql`
  query postPage($path: String!) {
    markdownRemark(fields: { slug: { eq: $path } }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        title
        description
        date(formatString: "MMMM DD, YYYY")
        tags
      }
    }
  }
`
