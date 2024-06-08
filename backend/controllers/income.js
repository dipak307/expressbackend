const IncomeSchema = require("../models/incomeModel");

module.exports.addIncome = async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    const income = new IncomeSchema({
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
            return res.status(400).json({ message: "Amount must be a positive number" });
        }

        await income.save();
        res.status(200).json({ message: "Income Added" });
    } catch (error) {
        console.error('Error adding income:', error);
        res.status(500).json({ message: "Server Error" });
    }
    console.log(income);
};

module.exports.getIncomes = async (req, res) => {
    try {
        const incomes = await IncomeSchema.find().sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        console.error('Error fetching incomes:', error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports.deleteIncomes = async (req, res) => {
    const { id } = req.params;
    try {
        const income = await IncomeSchema.findByIdAndDelete(id);
        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }
        res.status(200).json({ message: "Income Deleted" });
    } catch (error) {
        console.error('Error deleting income:', error);
        res.status(500).json({ message: "Server Error" });
    }
};
