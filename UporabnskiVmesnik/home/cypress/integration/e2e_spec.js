describe("My First E2E Test", () => {
  it("Should add an item to the cart", () => {
    cy.visit("http://home:2999/");
    cy.get("#showlogin").click();
    cy.get("#loginbtn").click();
    cy.get("#showcart").click();
    cy.get("#clearcart").click();
    cy.get("#postcart").click();
    cy.get("#addtocart_1").click();
    cy.get("#cart").click();
    cy.get("#grand_total").should("contain", "$5.99");
  });
});
