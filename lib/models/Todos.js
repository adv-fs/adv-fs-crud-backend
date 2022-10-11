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

  static async insert({ user_id, description }) {
    const { rows } = await pool.query(
      `INSERT INTO adv_todos
      (user_id, description)
      VALUES ($1, $2)
      RETURNING *`,
      [user_id, description]
    );
    return new Todos(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM adv_todos');
    
    return rows.map((row) => new Todos(row));
  }
  
};
