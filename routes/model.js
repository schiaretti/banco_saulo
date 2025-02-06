// models/UserModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  // Você pode adicionar outros campos aqui conforme a necessidade
});

const User = mongoose.model('User', usuarioSchema);

export default User;
