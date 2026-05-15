const Settings = require('../models/Settings');

// Get user settings
exports.getUserSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user.id });

    if (!settings) {
      settings = new Settings({ userId: req.user.id });
      await settings.save();
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user settings
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user.id });

    if (!settings) {
      settings = new Settings({ userId: req.user.id });
    }

    const {
      theme,
      currency,
      notificationsEnabled,
      emailNotifications,
      monthlyBudgetReminder,
      savingsGoalReminder,
      language,
    } = req.body;

    if (theme) settings.theme = theme;
    if (currency) settings.currency = currency;
    if (notificationsEnabled !== undefined)
      settings.notificationsEnabled = notificationsEnabled;
    if (emailNotifications !== undefined)
      settings.emailNotifications = emailNotifications;
    if (monthlyBudgetReminder !== undefined)
      settings.monthlyBudgetReminder = monthlyBudgetReminder;
    if (savingsGoalReminder !== undefined)
      settings.savingsGoalReminder = savingsGoalReminder;
    if (language) settings.language = language;

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add payment method
exports.addPaymentMethod = async (req, res) => {
  try {
    const { type, name, lastDigits } = req.body;

    let settings = await Settings.findOne({ userId: req.user.id });

    if (!settings) {
      settings = new Settings({ userId: req.user.id });
    }

    const paymentMethod = {
      id: new Date().getTime().toString(),
      type,
      name,
      lastDigits,
      isDefault: settings.paymentMethods.length === 0,
    };

    settings.paymentMethods.push(paymentMethod);
    await settings.save();

    res.status(201).json({
      success: true,
      message: 'Payment method added successfully',
      paymentMethod,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment methods
exports.getPaymentMethods = async (req, res) => {
  try {
    const settings = await Settings.findOne({ userId: req.user.id });

    if (!settings) {
      return res.status(200).json({
        success: true,
        paymentMethods: [],
      });
    }

    res.status(200).json({
      success: true,
      paymentMethods: settings.paymentMethods,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete payment method
exports.deletePaymentMethod = async (req, res) => {
  try {
    const settings = await Settings.findOne({ userId: req.user.id });

    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    settings.paymentMethods = settings.paymentMethods.filter(
      (method) => method.id !== req.params.paymentMethodId
    );

    // If deleted method was default, set first one as default
    if (settings.paymentMethods.length > 0 && !settings.paymentMethods.some((m) => m.isDefault)) {
      settings.paymentMethods[0].isDefault = true;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Payment method deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
