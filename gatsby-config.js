module.exports = {
  siteMetadata: {
    title: 'New Project',
    intro: 'An Intro',
    description: 'Site Description',
    keywords: 'Test, My Site, John',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/posts`,
        name: 'posts',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/pages`,
        name: 'pages',
      },
    },
  ],
}
