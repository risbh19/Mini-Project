const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createQuiz,
  getQuizzesForUser,
  getQuizById,
  updateQuiz,
  deleteQuiz
} = require('../controllers/quizController');

// Create a quiz (authenticated)
router.post('/', auth, createQuiz);

// Get all quizzes for the authenticated user
router.get('/', auth, getQuizzesForUser);

// Get single quiz by id (owner only)
router.get('/:id', auth, getQuizById);

// Update quiz (owner only)
router.put('/:id', auth, updateQuiz);

// Delete quiz (owner only)
router.delete('/:id', auth, deleteQuiz);

module.exports = router;