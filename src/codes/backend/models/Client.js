import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  },
  name: { type: String, required: true },
  type: { type: String, enum: ['client', 'supplier'], required: true },
  email: { type: String },
  document: { type: String },
}, {
  timestamps: true,
});

// Garante que o mesmo cliente não seja cadastrado duas vezes para a mesma empresa
clientSchema.index({ companyId: 1, name: 1 }, { unique: true });

const Client = mongoose.model('Client', clientSchema);
export default Client;