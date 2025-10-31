import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'A transação deve pertencer a uma empresa.'],
    index: true, // Essencial para performance em um sistema multi-empresa
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'O tipo da transação (receita/despesa) é obrigatório.'],
  },
  category: {
    type: String,
    required: [true, 'A categoria é obrigatória.'],
    trim: true,
  },
  value: {
    type: Number,
    required: [true, 'O valor da transação é obrigatório.'],
    validate: {
      validator: (v) => v !== 0,
      message: 'O valor não pode ser zero.'
    }
  },
  date: {
    type: Date,
    required: [true, 'A data da transação é obrigatória.'],
    default: Date.now,
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;