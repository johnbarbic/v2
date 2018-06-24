import React from 'react'
// import Layout from '../components/layout'
import { graphql } from 'gatsby'

export default ({ data }) => {
   //console.log(data);
  return (
    <div>
      <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
      {data.allMarkdownRemark.edges.map(({ node }) => (
  //        const isPublished = node.frontmatter.date == true ? 'yes' : 'No';

        <div key={node.id}>
          <div>
            {node.frontmatter.title}{" "}
            <span style={{color:'blue'}}> - {node.frontmatter.date}</span>
          </div>
          <div>{node.frontmatter.description}</div>
          <div style={{color:'blue'}}>{node.frontmatter.published === true ? 'Yes' : 'No'}</div>
          <div style={{margin:'0 0 20px'}}>{node.frontmatter.slug}</div>
        </div>
      ))}
    </div>
  );
};

export const query = graphql`
  query IndexQuery {
  allMarkdownRemark (
    filter: { frontmatter : { published: { eq: true } } }
  ) {
    totalCount
    edges{
      node{
        frontmatter {
          title
          date
          slug
          description
          published
        }
      }
    }
  }
}
`;

