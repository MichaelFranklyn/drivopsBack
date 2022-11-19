const knex = require("../database/connection");
const jwt = require("jsonwebtoken");
const securePassword = require("secure-password");
const pwd = securePassword();
const { schemaUser } = require("../validations/schemas");

const addUser = async (req, res) => {
  const { nome, senha } = req.body;

  try {
    await schemaUser.validate(req.body);

    const checkUserExists = await knex("manager").where("nome", nome).first();

    if (checkUserExists) {
      return res
        .status(400)
        .json({ mensagem: "O nome de usuário informado já existe" });
    }

    const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");

    const insertUser = await knex("manager").insert({
      nome,
      senha: hash,
    });

    if (!insertUser) {
      return res
        .status(500)
        .json({ mensagem: "O usuário não foi cadastrado." });
    }

    const userRegistered = await knex("manager")
      .select("id", "nome")
      .where("nome", nome)
      .first();

    return res.status(201).json(userRegistered);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const loginUser = async (req, res) => {
  const { nome, senha } = req.body;

  try {
    await schemaUser.validate(req.body);

    const checkUserExists = await knex("manager").where("nome", nome).first();

    if (!checkUserExists) {
      return res
        .status(400)
        .json({ mensagem: "O nome ou a senha estão incorretos" });
    }

    const checkPassword = await pwd.verify(
      Buffer.from(senha),
      Buffer.from(checkUserExists.senha, "hex")
    );

    switch (checkPassword) {
      case securePassword.INVALID_UNRECOGNIZED_HASH:
      case securePassword.INVALID:
        return res.status(400).json({ mensagem: "Email ou senha incorretos." });
      case securePassword.VALID:
        break;
      case securePassword.VALID_NEEDS_REHASH:
        try {
          const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
          await knex("usuarios").update({ senha: hash }).where("email", email);
        } catch {
          return res.status(500).json({ mensagem: error.message });
        }
        break;
    }

    const token = jwt.sign(
      {
        id: checkUserExists.id,
        nome: checkUserExists.nome,
      },
      process.env.SEGREDO_JWT,
      {
        expiresIn: "1h",
      }
    );

    const returnedUser = {
      usuario: {
        id: checkUserExists.id,
        nome: checkUserExists.nome,
      },
      token: token,
    };

    return res.status(200).json(returnedUser);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = { loginUser, addUser };
