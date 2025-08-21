describe('techy-jokes', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to bookmarks and back', () => {
    cy.get('[data-testid="jokes-page"]').should('be.visible');
    cy.get('[data-testid="bookmarks-button"]').click();
    cy.get('[data-testid="bookmarks-page"]').should('be.visible');
  });
});
