const ShoppingListService = {
  getAllItems(knex) {
    return knex.select('*').from('shopping_list');
  },
  getById(knex, id) {
    return knex
      .select('*')
      .from('shopping_list')
      .where('id', id)
      .first();
  },
  insertItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  updateItem(knex, id, updates) {
    return knex('shopping_list')
      .update(updates)
      .where({ id });
  },
  deleteItem(knex, id) {
    return knex('shopping_list')
      .delete()
      .where({ id });
  }
};

module.exports = ShoppingListService;