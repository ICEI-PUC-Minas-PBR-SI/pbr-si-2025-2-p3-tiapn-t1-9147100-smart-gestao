import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome da empresa é obrigatório.'],
    trim: true,
  },
  cnpj: {
    type: String,
    required: [true, 'O CNPJ é obrigatório.'],
    unique: true,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

const Company = mongoose.model('Company', companySchema);

export default Company;