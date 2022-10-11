const pool = require('../utils/pool');

module.exports = class Todos {
  id;
  user_id;
  completed;
  description;

  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.completed = row.completed;
    this.description = row.description;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM todos');
    
    return rows.map((row) => new Todos(row));
  }
  
};
