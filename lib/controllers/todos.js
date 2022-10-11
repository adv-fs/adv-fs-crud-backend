const { Router } = require('express');
const authenticate = require('../middleware/authenticate');

const Todos = require('../models/Todos');

module.exports = Router() 
  .post('/', authenticate, async (req, res, next) => {
    try {
      const item = await Todos.insert({ ...req.body, user_id: req.user.id });
      console.log('req.user.id', req.user.id);
      res.json(item);
    } catch (e) {
      next (e);
    }
  })

  .get('/', async (req, res, next) => {
    try {
      const item = await Todos.getAll();
      res.json(item);
    } catch (e) {
      next (e);
    }
  })
;
