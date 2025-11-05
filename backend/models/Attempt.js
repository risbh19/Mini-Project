const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question_index: {
    type: Number,
    required: true,
    min: 0
  },
  selected_choice: {
    type: Number,
    required: true,
    min: 0
  },
  // optional: store whether this answer was correct at submission time
  is_correct: {
    type: Boolean,
    default: false
  },
  // optional snapshot of the question text (useful if questions change later)
  question_text: {
    type: String,
    default: ''
  }
}, { _id: false });

const attemptSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'quizId is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'userId is required']
  },
  answers: {
    type: [answerSchema],
    default: []
  },
  score: {
    // number of correct answers
    type: Number,
    default: 0,
    min: 0
  },
  total_questions: {
    type: Number,
    required: [true, 'total_questions is required'],
    min: [0, 'total_questions cannot be negative']
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Virtual for percentage
attemptSchema.virtual('percentage').get(function() {
  if (!this.total_questions) return 0;
  return (this.score / this.total_questions) * 100;
});

// Ensure indexes for common queries
attemptSchema.index({ quizId: 1 });
attemptSchema.index({ userId: 1 });

const Attempt = mongoose.model('Attempt', attemptSchema);

module.exports = Attempt;
