describe('Home page', () => {
  it('loads', () => {
    cy.visit('/');
    cy.contains('Office Booking');
  });
});
