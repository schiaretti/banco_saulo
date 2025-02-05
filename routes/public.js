import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const router = express.Router()
const prisma = new PrismaClient()


/*rota de criar*/
router.post('/cadastro', async (req, res) => {

    try {
        const usuario = req.body

        const salt = await bcrypt.genSalt(10)
        const hashsenha = await bcrypt.hash(usuario.senha, salt)

        await prisma.usuario.create({

            data: {
                email: usuario.email,
                nome: usuario.nome,
                senha: hashsenha,
            },
        })
        res.status(201).json(usuario)
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor tente novamente!" })
    }

})

/*rota de editar usuarios*/
router.put('/usuarios/:id', async (req, res) => {
    const id = Number(req.params.id); // Convertendo o ID para número

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido, deve ser um número" });
    }

    try {
        const usuarioAtualizado = await prisma.usuario.update({
            where: { id: id },
            data: {
                email: req.body.email,
                nome: req.body.nome,
                senha: req.body.senha
            }
        });

        res.status(200).json(usuarioAtualizado);

    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
});

/* rota de listar usuarios */
router.get('/listar-usuarios', async (req, res) => {

    try {

        const usuarios = await prisma.usuario.findMany()

        res.status(200).json({ message: 'Usuários listados com sucesso!', usuarios })

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor tente novamente!" })
    }

})

/*rota de deletar */

router.delete('/usuarios/:id', async (req, res) => {
    const id = Number(req.params.id); // Convertendo o ID para número

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido, deve ser um número" });
    }

    try {
        await prisma.usuario.delete({
            where: { id: id }
        });

        res.status(200).json({ message: "Usuário deletado com sucesso!" });

    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar usuário" });
    }
});



router.post('/login', async (req, res) => {

    try {
        const usuarioInfo = req.body

       
        const usuario = await prisma.usuario.findUnique({ where: { email: usuarioInfo.email } })
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado!" })
        }
        const isMatch = await bcrypt.compare(usuarioInfo.senha, usuario.senha)
        if (!isMatch) {
            return res.status(400).json({ message: "Senha inválida!" })
        }
        
       

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor tente novamente!" })
    }

})

/*rota de criar clientes*/
router.post('/cadastro-clientes', async (req, res) => {

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
router.get('/listar-clientes', async (req, res) => {

    try {

        const clientes = await prisma.cliente.findMany()

        res.status(200).json({ message: 'Clientes listados com sucesso!', clientes })

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor tente novamente!" })
    }

})

/*rota de editar clientes*/
router.put('/clientes/:id', async (req, res) => {
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

router.delete('/clientes/:id', async (req, res) => {
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
router.post('/logistica', async (req, res) => {

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
router.get('/listar-fretes', async (req, res) => {

    try {

        const fretes = await prisma.logistica.findMany()

        res.status(200).json({ message: 'fretes listados com sucesso!', fretes })

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor tente novamente!" })
    }

})

/*rota de editar clientes*/
router.put('/logistica/:id', async (req, res) => {
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

router.delete('/logistica/:id', async (req, res) => {
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
});




export default router