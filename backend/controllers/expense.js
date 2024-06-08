const ExpenseSchema = require("../models/expenseModel");

module.exports.addExpense = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    const expense = new ExpenseSchema({
        title,
        amount,
        category,
        description,
        date,
    });

    try {
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if(amount<=0 || !amount === 'number'){
            return res.status(400).json({message:"Amount must be a positive"})
           }

        await expense.save();
        res.status(200).json({ message: "Expense Added" });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: "Server Error" });
    }
    console.log(expense);
};

module.exports.getExpense = async (req, res) => {
    try {
        const expenses = await ExpenseSchema.find().sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const expense = await ExpenseSchema.findByIdAndDelete(id);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({ message: "Expense Deleted" });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: "Server Error" });
    }
};
