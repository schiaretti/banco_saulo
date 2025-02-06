import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://saulo:tico293112@saulodb.cekl7.mongodb.net/?retryWrites=true&w=majority&appName=saulodb', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB', error);
    process.exit(1);
  }
};

export default connectDB;
