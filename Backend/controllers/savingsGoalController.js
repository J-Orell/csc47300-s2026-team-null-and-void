const SavingsGoal = require('../models/SavingsGoal');

// Create savings goal
exports.createSavingsGoal = async (req, res) => {
  try {
    const { name, targetAmount, deadline, category, description } = req.body;

    const goal = new SavingsGoal({
      userId: req.user.id,
      name,
      targetAmount,
      deadline,
      category,
      description,
    });

    await goal.save();
    res.status(201).json({
      success: true,
      message: 'Savings goal created successfully',
      goal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all savings goals for user
exports.getUserSavingsGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user.id }).sort({
      deadline: 1,
    });

    res.status(200).json({
      success: true,
      count: goals.length,
      goals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get savings goal by ID
exports.getSavingsGoalById = async (req, res) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }

    if (goal.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to access this savings goal' });
    }

    res.status(200).json({
      success: true,
      goal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update savings goal
exports.updateSavingsGoal = async (req, res) => {
  try {
    let goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }

    if (goal.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this savings goal' });
    }

    goal = await SavingsGoal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Savings goal updated successfully',
      goal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete savings goal
exports.deleteSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }

    if (goal.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this savings goal' });
    }

    await SavingsGoal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Savings goal deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all savings goals (Admin only)
exports.getAllSavingsGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find().populate('userId', 'username email');

    res.status(200).json({
      success: true,
      count: goals.length,
      goals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to savings goal
exports.addToSavingsGoal = async (req, res) => {
  try {
    const { amount } = req.body;

    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }

    if (goal.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this savings goal' });
    }

    goal.currentAmount += amount;

    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }

    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Amount added to savings goal',
      goal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
