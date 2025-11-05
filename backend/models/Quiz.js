const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question_text: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true
    },
    choices: {
        type: [String],
        validate: {
            validator: function(arr) {
                return Array.isArray(arr) && arr.length >= 2;
            },
            message: 'A question must have at least two choices'
        }
    },
    // Store correct answer as the index of the choices array
    correct_answer: {
        type: Number,
        required: [true, 'Correct answer index is required'],
        validate: {
            validator: function(value) {
                // `this.choices` is available here; ensure index is within bounds
                return Array.isArray(this.choices) && value >= 0 && value < this.choices.length;
            },
            message: 'correct_answer must be a valid index within choices'
        }
    },
    explanation: {
        type: String,
        trim: true,
        default: ''
    }
}, { _id: false });

const quizSchema = new mongoose.Schema({
    // Owner of the quiz
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'createdBy is required']
    },
    title: {
        type: String,
        required: [true, 'Quiz title is required'],
        trim: true
    },
    topic: {
        type: String,
        required: [true, 'Quiz topic is required'],
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    time_limit: {
        // time limit in seconds; 0 means no limit
        type: Number,
        default: 0,
        min: [0, 'time_limit cannot be negative']
    },
    questions: {
        type: [questionSchema],
        validate: {
            validator: function(arr) {
                return Array.isArray(arr) && arr.length > 0;
            },
            message: 'A quiz must contain at least one question'
        }
    }
}, {
    timestamps: true
});

// Indexes for faster querying by topic/difficulty
quizSchema.index({ topic: 1 });
quizSchema.index({ difficulty: 1 });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
