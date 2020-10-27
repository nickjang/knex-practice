require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

const searchByTerm = (searchTerm) => {
  knexInstance
    .select('name', 'price', 'category', 'checked')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => console.log('search', result));
};

const paginateItems = (pageNumber) => {
  const limit = 6;
  const offset = 6 * (pageNumber - 1);

  knexInstance
    .select('name', 'price', 'category', 'checked')
    .from('shopping_list')
    .limit(limit)
    .offset(offset)
    .then(result => console.log('page', result));
};

const getItemsAfterDate = (daysAgo) => {
  knexInstance
    .select('name', 'price', 'category', 'checked', 'date_added')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw('now() - \'?? days\'::INTERVAL', daysAgo)
    )
    .then(result => console.log('day', result));
};

const totalCostByCategory = () => {
  return knexInstance
    .select('category')
    .sum('price AS total_price')
    .from('shopping_list')
    .groupBy('category')
    .then(result => console.log('total cost', result));
};

searchByTerm('fish');
paginateItems(3);
getItemsAfterDate('4');
totalCostByCategory();