/// <reference types="cypress" />

describe("Signup stest", () => {
  let randomString = Math.random().toString(36).substring(2);

  const email = "SignupUser" + randomString + "@gmail.com";
  const password = "Zeljko1";
  const securityAnswer = "Varga";

  describe("UI tests", () => {
    beforeEach(() => {
      cy.log("Email: " + email);
      cy.log("|Password: " + password);
      cy.visit("http://localhost:3000/#/");
      cy.get(".cdk-overlay-backdrop").click(-50, -50, { force: true });
      cy.get("#navbarAccount").click();
      cy.get("#navbarLoginButton").click();
    });

    it("Test valid signup", () => {
      cy.get("#newCustomerLink > .primary-link").click({ force: true });

      cy.get("#emailControl").type(email);
      cy.get("#passwordControl").type(password);
      cy.get("#repeatPasswordControl").type(password);
      cy.get(
        ".mat-form-field-type-mat-select > .mat-form-field-wrapper > .mat-form-field-flex"
      ).click();
      cy.get("#mat-option-4 > .mat-option-text").click();
      cy.get("#securityAnswerControl").type(securityAnswer);
      cy.get("#registerButton").click();
      cy.get(".mat-snack-bar-container").contains(
        "Registration completed successfully."
      );
    });

    it("Test valid login", () => {
      cy.get("#email").type(email);
      cy.get("#password").type(password);
      cy.get("#loginButton").click();
      cy.get(".fa-layers-counter").contains(0);
    });
  });

  describe("API tests", () => {
      const userCredential = {
          "email": email,
          "password": password
      }
      it("Test login via API", () => {

          cy.request("POST", "http://localhost:3000/rest/user/login", userCredential).then(response => {
              expect(response.status).to.eq(200);
          });
      });
      it("Login via Token", () => {
        cy.request("POST", "http://localhost:3000/rest/user/login", userCredential).its("body").then(body => {
            const token = body.authentication.token;
            cy.wrap(token).as("userToken");

            const userToken = cy.get("@userToken");
            cy.visit("http://localhost:3000/", {
                onBeforeLoad(browser) {
                    browser.localStorage.setItem("token", userToken)
                }
            });

            cy.wait(2000);
            cy.get(".cdk-overlay-backdrop").click(-50, -50, { force: true });
            cy.get(".fa-layers-counter").contains(0);
        })
      })
  });
});
