const knex = require("../database/connection");
const { schemaSeller } = require("../validations/schemas");

const addSeller = async (req, res) => {
  const { nome, email } = req.body;

  try {
    await schemaSeller.validate(req.body);

    const checkSellerExists = await knex("sellers")
      .where("email", email)
      .first();

    if (checkSellerExists) {
      return res
        .status(400)
        .json({ mensagem: "O vendedor informado já existe" });
    }

    const insertSeller = await knex("sellers").insert({
      nome,
      email,
    });

    if (!insertSeller) {
      return res
        .status(500)
        .json({ mensagem: "O vendedor não foi cadastrado." });
    }

    const registeredSeller = await knex("sellers")
      .where("email", email)
      .first();

    return res.status(201).json(registeredSeller);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const listSellers = async (req, res) => {
  try {
    const listSellers = await knex("sellers").orderBy("id");
    return res.status(200).json(listSellers);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const deleteSellers = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: "Id não informado!" });
  }

  try {
    const sellerDeleted = await knex("sellers").del().where("id", id);

    if (!sellerDeleted) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível excluir o vendedor!" });
    }

    return res.status(200).json({ mensagem: "Vendedor excluído com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const attSeller = async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  try {
    await schemaSeller.validate(req.body);

    const seller = await knex("sellers").where("id", id).first();

    if (!seller) {
      return res.status(404).json({ mensagem: "Vendedor não encontrado!" });
    }

    if (seller.email !== email) {
      const checkSellerExists = await knex("sellers")
        .where("email", email)
        .first();

      if (checkSellerExists) {
        return res
          .status(400)
          .json({ mensagem: "O vendedor informado já existe" });
      }
    }

    const updatedSeller = await knex("sellers")
      .update({
        nome,
        email,
      })
      .where("id", id);

    if (!updatedSeller) {
      return res.status(500).json({
        mensagem: "Não foi possivel atualizar os dados do vendedor.",
      });
    }
    return res.status(200).json({ mensagem: "Vendedor editado com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  addSeller,
  listSellers,
  deleteSellers,
  attSeller,
};
