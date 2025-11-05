const Quiz = require('../models/Quiz');

// Create a new quiz (owned by authenticated user)
const createQuiz = async (req, res) => {
  try {
    const { title, topic, difficulty, time_limit, questions } = req.body;

    if (!title || !topic || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'title, topic and at least one question are required' });
    }

    const quiz = new Quiz({
      title,
      topic,
      difficulty,
      time_limit,
      questions,
      createdBy: req.userId
    });

    await quiz.save();
    res.status(201).json({ success: true, quiz });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ success: false, message: 'Error creating quiz', error: error.message });
  }
};

// Get all quizzes for the authenticated user
const getQuizzesForUser = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, quizzes });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ success: false, message: 'Error fetching quizzes', error: error.message });
  }
};

// Get a single quiz by ID (must be owner)
const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    if (quiz.createdBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, quiz });
  } catch (error) {
    console.error('Get quiz by id error:', error);
    res.status(500).json({ success: false, message: 'Error fetching quiz', error: error.message });
  }
};

// Update a quiz (owner only)
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    if (quiz.createdBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Only allow specific fields to be updated
    const allowed = ['title', 'topic', 'difficulty', 'time_limit', 'questions'];
    allowed.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        quiz[field] = updates[field];
      }
    });

    await quiz.save();
    res.json({ success: true, quiz });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ success: false, message: 'Error updating quiz', error: error.message });
  }
};

// Delete a quiz (owner only)
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    if (quiz.createdBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await quiz.deleteOne();
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ success: false, message: 'Error deleting quiz', error: error.message });
  }
};

module.exports = {
  createQuiz,
  getQuizzesForUser,
  getQuizById,
  updateQuiz,
  deleteQuiz
};
