import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import { Link } from 'gatsby'
// Utilities
import kebabCase from 'lodash/kebabCase'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const { previous, next } = this.props.pageContext
    //console.log(previous)
    return (
      <Layout>
        <div>
          <h1>{post.frontmatter.title}</h1>
          <h2>{post.frontmatter.date}</h2>

          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
        <div>
          <h1>Tags</h1>
          <ul>
            {post.frontmatter.tags.map(tag => (
              <li key={tag}>
                <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              listStyle: 'none',
              padding: 0,
            }}
          >
            {previous && (
              <li>
                <Link to={previous.fields.slug} rel="prev">
                  ← Previous
                </Link>
              </li>
            )}

            {next && (
              <li>
                <Link to={next.fields.slug} rel="next">
                  Next →
                </Link>
              </li>
            )}
          </ul>
        </div>
      </Layout>
    )
  }
}

export default BlogPostTemplate

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

/*
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
*/
