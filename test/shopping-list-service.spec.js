const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');
const { expect } = require('chai');

describe('Shopping list service object', () => {
  let db;
  let testItems = [
    {
      id: 1,
      name: 'item1',
      price: '10.00',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: true,
      category: 'Main'
    },
    {
      id: 2,
      name: 'item2',
      price: '10.00',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: true,
      category: 'Main'
    },
    {
      id: 3,
      name: 'item3',
      price: '10.00',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: true,
      category: 'Main'
    }
  ];

  before('setup db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before('clean up items table', () =>
    db('shopping_list').truncate());

  afterEach('clean up items table', () =>
    db('shopping_list').truncate());

  after('end connection to database', () =>
    db.destroy());

  context('Given \'shopping_list\' has data', () => {
    beforeEach(() => {
      return db
        .insert(testItems)
        .into('shopping_list');
    });

    it('getAllItems() resolves all items from \'shopping_list\' table', () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(testItems);
        });
    });

    it('getById() resolves an item by id from \'shopping_list\' table', () => {
      const thirdId = 3;
      const thirdTestItem = testItems[thirdId - 1];
      return ShoppingListService.getById(db, thirdId)
        .then((actual) => {
          expect(actual).to.eql({
            id: thirdId,
            name: thirdTestItem.name,
            price: thirdTestItem.price,
            date_added: thirdTestItem.date_added,
            checked: thirdTestItem.checked,
            category: thirdTestItem.category
          });
        });
    });

    it('deleteItem() removes an item by id from \'shopping_list\' table', () => {
      const itemId = 3;
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          // copy the test articles array without the "deleted" article
          const expected = testItems.filter(item => item.id !== itemId);
          expect(allItems).to.eql(expected);
        });
    });

    it('updateItem() updates an item by id from \shopping_list\' table', () => {
      const itemId = 3;
      const updates = {
        name: 'item3',
        price: '100.00',
        date_added: new Date('2030-01-22T16:28:32.615Z'),
        checked: true,
        category: 'Main'
      };

      return ShoppingListService.updateItem(db, itemId, updates)
        .then(() => ShoppingListService.getById(db, itemId))
        .then(actual => {
          expect(actual).to.eql({
            id: itemId,
            ...updates
          });
        });
    });
  });

  context('Given \'shopping_list\' has no data', () => {
    it('getAllItems() resolves an empty array', () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([]);
        });
    });

    it('insertItem() inserts a new item and resolves the new item with an \'id\'', () => {
      const newItem = {
        id: 1,
        name: 'item1',
        price: '10.00',
        date_added: new Date('2029-01-22T16:28:32.615Z'),
        checked: true,
        category: 'Main'
      };
      return ShoppingListService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql(newItem);
        });
    });
  });
});