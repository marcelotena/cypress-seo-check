const X2JS = require('x2js')

describe('Sitemap test', () => {
  it('fetches the sitemap.xml', () => {
    cy.request(Cypress.env('sitemapUrl'))
        .its('body')
        .then((body) => {
          const x2js = new X2JS()
          const json = x2js.xml2js(body)

          cy.log(json)
          expect(json.urlset.url).to.be.an('array').and.have.length.greaterThan(0)

          json.urlset.url.forEach((url) => {
            const parsed = new URL(url.loc)
            cy.log(parsed.pathname)

            // check if the resource exists
            cy.request('HEAD', url.loc).its('status').should('eq', 200)
            // check if the resource exists AND download it
            cy.request(url.loc).its('status').should('eq', 200)
            // visit the page to check if it loads in the browser
            cy.visit(url.loc).wait(1000, { log: false })
          })
        })
  })
})