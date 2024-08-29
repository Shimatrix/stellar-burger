import user from '../fixtures/userData.json';

describe('cypress tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
  });
  describe('Тест добавления ингредиентов', () => {
    it('должен добавить в ингредиенты булку', () => {
      cy.get('[data-cy="Краторная булка N-200i"]')
        .children('button')
        .click({ force: true });
      cy.get(
        '.constructor-element > .constructor-element__row > .constructor-element__text'
      ).should('contain', 'Краторная булка N-200i');
      cy.get('.counter__num').should('contain', '2');
    });
    it('должен добавить в ингредиенты котлету', () => {
      cy.get('[data-cy="Биокотлета из марсианской Магнолии"]')
        .children('button')
        .click({ force: true });
      cy.get('.constructor-element__row').should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
      cy.get('.counter__num').should('contain', '1');
    });
    it('должен добавить в ингредиенты соус', () => {
      cy.get('[data-cy="Соус фирменный Space Sauce"]')
        .children('button')
        .click({ force: true });
      cy.get('.constructor-element__row').should(
        'contain',
        'Соус фирменный Space Sauce'
      );
      cy.get('.counter__num').should('contain', '1');
    });
  });

  describe('Тест модальных окон ингредиентов', () => {
    it('должен корректно отобразить данные ингредиента в открытом модальном окне', () => {
      cy.get('[data-cy="Краторная булка N-200i"]').click();
      cy.get('[data-cy="modalContent"]').should(
        'contain.text',
        'Краторная булка N-200i'
      );
      cy.get('[data-cy="modalContent"]').should('contain.text', 'Калории');
      cy.get('[data-cy="modalContent"]').should('contain.text', '420');
    });
    it('должен закрыть модальное окно по кнопке', () => {
      cy.get('[data-cy="Биокотлета из марсианской Магнолии"]').click();
      cy.get('#modals').find('button').click();
    });
    it('должен закрыть модальное окно кликом по оверлей', () => {
      cy.get('[data-cy="Соус фирменный Space Sauce"]').click();
      cy.get('[data-cy="modalOverlay"]').click({ force: true });
    });
  });

  describe('Тест заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'accessToken');
      localStorage.setItem('refreshToken', 'refreshToken');
      cy.visit('/');
      cy.intercept('GET', '/api/auth/user', { fixture: 'userData.json' });
    });

    it('должен проверить авторизацию', () => {
      cy.get('.EthV0Sfz22gpFO0doxic > .text').click();
      cy.get(
        ':nth-child(1) > .input__container > .input > .input__textfield'
      ).should('contain.value', user.user.name);
      cy.get(
        ':nth-child(2) > .input__container > .input > .input__textfield'
      ).should('contain.value', user.user.email);
    });
    it('должен произойти заказ', () => {
      cy.visit('/');
      cy.intercept('POST', '/api/orders', { fixture: 'orderData.json' }).as(
        'orderRequest'
      );
      cy.get('[data-cy="Флюоресцентная булка R2-D3"]')
        .children('button')
        .click({ force: true });
      cy.get('[data-cy="Филе Люминесцентного тетраодонтимформа"]')
        .children('button')
        .click({ force: true });
      cy.get('.button').contains('Оформить заказ').click();
      cy.wait('@orderRequest');
      cy.get('#modals').contains('41394');
      cy.get('#modals').find('button').click();
      cy.get('[data-cy="orderPrice"]').contains(0);
    });

    afterEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
    });
  });
});
