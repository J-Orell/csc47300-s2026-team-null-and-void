const Budget = require('../models/Budget');

// Create budget
exports.createBudget = async (req, res) => {
  try {
    const { name, category, budgetedAmount, month, description, spentAmount } =
      req.body;

    const budget = new Budget({
      userId: req.user.id,
      name,
      category,
      budgetedAmount,
      spentAmount: spentAmount ?? 0,
      month,
      description,
    });

    await budget.save();
    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      budget,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all budgets for user
exports.getUserBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id }).sort({
      month: -1,
    });

    res.status(200).json({
      success: true,
      count: budgets.length,
      budgets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get budget by ID
exports.getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Check if user owns the budget
    if (budget.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to access this budget' });
    }

    res.status(200).json({
      success: true,
      budget,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update budget
exports.updateBudget = async (req, res) => {
  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this budget' });
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      budget,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this budget' });
    }

    await Budget.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all budgets (Admin only)
exports.getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().populate('userId', 'username email');

    res.status(200).json({
      success: true,
      count: budgets.length,
      budgets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
