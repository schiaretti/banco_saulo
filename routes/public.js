import express from 'express';
import bcrypt from 'bcrypt';
import User from './model/UserModel.js'; // Importando o modelo de usuário

const router = express.Router();

/* Rota de criar usuário */
router.post('/cadastro', async (req, res) => {
    try {
        let { nome, email, senha } = req.body;

        // Removendo espaços extras
        nome = nome?.trim();
        email = email?.trim();
        senha = senha?.trim();

        // Verificando se todos os campos foram fornecidos
        if (!nome || !email || !senha) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
        }

        // Verificando se o email já existe no banco de dados
        const usuarioExistente = await User.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'Email já está em uso!' });
        }

        // Gerando o hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashsenha = await bcrypt.hash(senha, salt);

        // Criando novo usuário
        const novoUsuario = new User({ nome, email, senha: hashsenha });

        // Salvando no banco de dados
        await novoUsuario.save();

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor, tente novamente!' });
    }
});

/* Rota de editar usuário */
router.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    let { nome, email, senha } = req.body;

    try {
        // Verifica se o ID é válido
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        // Removendo espaços extras
        nome = nome?.trim();
        email = email?.trim();
        senha = senha?.trim();

        // Verifica se ao menos um campo foi enviado para atualização
        if (!nome && !email && !senha) {
            return res.status(400).json({ error: 'Informe ao menos um campo para atualizar' });
        }

        // Criptografar nova senha, se fornecida
        let hashSenha = undefined;
        if (senha) {
            const salt = await bcrypt.genSalt(10);
            hashSenha = await bcrypt.hash(senha, salt);
        }

        // Atualizar usuário no banco de dados
        const usuarioAtualizado = await User.findByIdAndUpdate(
            id,
            { nome, email, ...(hashSenha && { senha: hashSenha }) }, // Atualiza a senha somente se foi fornecida
            { new: true, select: '-senha' } // Retorna o documento atualizado SEM a senha
        );

        if (!usuarioAtualizado) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json(usuarioAtualizado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

/* Rota para listar usuários */
router.get('/listar-usuarios', async (req, res) => {
    try {
        const usuarios = await User.find({}, '-senha'); // Exclui o campo "senha" da resposta

        res.status(200).json({
            message: 'Usuários listados com sucesso!',
            usuarios
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor, tente novamente!' });
    }
});

/* Rota para deletar usuário */
router.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) { // Verifica se o ID é válido para o MongoDB
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const usuarioDeletado = await User.findByIdAndDelete(id);

        if (!usuarioDeletado) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Usuário deletado com sucesso!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});


/* Rota de login */
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: "Email e senha são obrigatórios!" });
        }

        // Busca usuário pelo e-mail
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        // Verifica se a senha está correta
        const isMatch = await bcrypt.compare(senha, usuario.senha);
        if (!isMatch) {
            return res.status(400).json({ message: "Senha inválida!" });
        }

        res.status(200).json({ 
            message: "Login bem-sucedido!", 
            usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email }
        });

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor, tente novamente!" });
    }
});


/*rota de criar clientes*/
/*router.post('/cadastro-clientes', async (req, res) => {

    try {
        const cliente = req.body

        await prisma.cliente.create({

            data: {
                email: cliente.email,
                nome: cliente.nome,
                cnpj: cliente.cnpj,
                celular: cliente.celular,
                contato: cliente.contato,
            },
        })
        res.status(201).json(cliente)
    } catch (error) {

        res.status(500).json({ message: "Erro no servidor tente novamente!" })
    }

})

/* rota de listar clientes */
/*router.get('/listar-clientes', async (req, res) => {

    try {

        const clientes = await prisma.cliente.findMany()

        res.status(200).json({ message: 'Clientes listados com sucesso!', clientes })

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor tente novamente!" })
    }

})

/*rota de editar clientes*/
/*router.put('/clientes/:id', async (req, res) => {
    const id = Number(req.params.id); // Convertendo o ID para número

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido, deve ser um número" });
    }

    try {
        const clienteAtualizado = await prisma.cliente.update({
            where: { id: id },
            data: {
                email: req.body.email,
                nome: req.body.nome,
                cnpj: req.body.cnpj,
                celular: req.body.celular,
                contato: req.body.contato
            }
        });

        res.status(200).json(clienteAtualizado);

    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar cliente" });
    }
});


/*rota de deletar */

/*router.delete('/clientes/:id', async (req, res) => {
    const id = Number(req.params.id); // Convertendo o ID para número

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido, deve ser um número" });
    }

    try {
        await prisma.cliente.delete({
            where: { id: id }
        });

        res.status(200).json({ message: "Cliente deletado com sucesso!" });

    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar cliente" });
    }
});

/*rota de salvar fretes*/
/*router.post('/logistica', async (req, res) => {

    try {
        const fretes = req.body
       
        await prisma.logistica.create({
           
            data: {
                usuario: fretes.usuario,
                cliente: fretes.cliente,
                cidorigem: fretes.cidorigem,
                ciddestino: fretes.ciddestino,
                freteemp: fretes.freteemp,
                fretemot: fretes.fretemot,
                produto: fretes.produto,
                veiculo: fretes.veiculo,
            },
        })

        res.status(201).json(fretes)
    } catch (error) {
       console.error(error)
        res.status(500).json({ message: "Erro no servidor tente novamente!" })
       
    }

})

/* rota de listar fretes */
/*router.get('/listar-fretes', async (req, res) => {

    try {

        const fretes = await prisma.logistica.findMany()

        res.status(200).json({ message: 'fretes listados com sucesso!', fretes })

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor tente novamente!" })
    }

})

/*rota de editar clientes*/
/*router.put('/logistica/:id', async (req, res) => {
    const id = Number(req.params.id); // Convertendo o ID para número

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido, deve ser um número" });
    }

    try {
        const logisticaAtualizada = await prisma.logistica.update({
            where: { id: id },
            data: {
                usuario: req.body.usuario,
                cliente: req.body.cliente,
                cidorigem: req.body.cidorigem,
                ciddestino: req.body.ciddestino,
                freteemp: req.body.freteemp,
                fretemot: req.body.fretemot,
                produto: req.body.produto,
                veiculo: req.body.veiculo
            }
        });

        res.status(200).json(logisticaAtualizada);

    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar logística" });
    }
});


/*rota de deletar */

/*router.delete('/logistica/:id', async (req, res) => {
    const id = Number(req.params.id); // Convertendo o ID para número

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido, deve ser um número" });
    }

    try {
        await prisma.logistica.delete({
            where: { id: id }
        });

        res.status(200).json({ message: "Frete deletado com sucesso!" });

    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar frete" });
    }
});*/




export default router