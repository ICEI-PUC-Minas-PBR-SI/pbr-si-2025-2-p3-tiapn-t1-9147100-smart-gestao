import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome do usuário é obrigatório.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor, insira um e-mail válido.'],
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória.'],
    minlength: 6,
    select: false, // Impede que a senha seja retornada em queries por padrão
  },
  role: {
    type: String,
    enum: ['ADMIN_COMPANY', 'USER', 'READ_ONLY'],
    default: 'USER',
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'O usuário deve estar associado a uma empresa.'],
    index: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Hook para criptografar a senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

export default User;