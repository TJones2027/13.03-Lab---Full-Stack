const express = require('express');
const router = express.Router();

// GET home page
router.get('/', async (req, res) => {
  const db = req.db;
  const todos = await db.all("SELECT * FROM todos");
  res.render("index", { title: "Todo List", todos });
});

// CREATE a new task
router.post('/create', async (req, res) => {
  const db = req.db;
  const { task } = req.body;

  await db.run("INSERT INTO todos(task, completed) VALUES(?, 0)", [task]);
  res.redirect('/');
});

// DELETE a task
router.post('/delete', async (req, res) => {
  const db = req.db;
  const { id } = req.body;

  await db.run("DELETE FROM todos WHERE id = ?", [id]);
  res.redirect('/');
});

// MARK COMPLETE
router.post('/complete/:id', async (req, res) => {
  const db = req.db;
  const id = req.params.id;

  await db.run("UPDATE todos SET completed = 1 WHERE id = ?", [id]);
  res.redirect('/');
});

// SHOW EDIT FORM
router.get('/edit/:id', async (req, res) => {
  const db = req.db;
  const id = req.params.id;

  const todo = await db.get("SELECT * FROM todos WHERE id = ?", [id]);

  res.render('edit', { title: "Edit Task", todo });
});

// UPDATE TASK
router.post('/update/:id', async (req, res) => {
  const db = req.db;
  const id = req.params.id;
  const { task } = req.body;

  await db.run("UPDATE todos SET task = ? WHERE id = ?", [task, id]);
  res.redirect('/');
});

module.exports = router;
