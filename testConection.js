import mongoose from 'mongoose';

const uri = 'mongodb+srv://saulo:tico293112@saulodb.cekl7.mongodb.net/?retryWrites=true&w=majority&appName=saulodb';

mongoose.connect(uri)
  .then(() => {
    console.log("Conexão com o MongoDB bem-sucedida!");
  })
  .catch((error) => {
    console.error("Erro na conexão com o MongoDB:", error);
  });
