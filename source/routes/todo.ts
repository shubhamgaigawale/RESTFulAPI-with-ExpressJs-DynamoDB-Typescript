import express from 'express';
import TodoController from "../controller/todo"

const router = express.Router();

router.get('/todos', TodoController.getAllTodos);

router.get('/todos/:todo_id', TodoController.getTodoById)

router.get('/todos/:name', TodoController.getTodoByName)

router.post('/todos', TodoController.createTodo);

router.patch('/todos', TodoController.updateTodo);

router.delete('/todos/:todo_id', TodoController.deleteTodo);

export = router;