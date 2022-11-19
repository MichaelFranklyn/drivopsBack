const knex = require("../database/connection");
const { schemaSales } = require("../validations/schemas");
const { checkAndUpdateAmount } = require("../utils/checkAndUpdateAmount");

const addSale = async (req, res) => {
  const { id_car, id_seller, valor_carro, desconto, data_venda } = req.body;

  try {
    await schemaSales.validate(req.body);

    const checkCarExists = await knex("cars").where("id", id_car).first();

    if (!checkCarExists) {
      return res.status(400).json({ mensagem: "O carro informado não existe" });
    }

    const checkSellerExists = await knex("sellers")
      .where("id", id_seller)
      .first();

    if (!checkSellerExists) {
      return res
        .status(400)
        .json({ mensagem: "O vendedor informado não existe" });
    }

    if (checkCarExists.quantidade == 0) {
      return res
        .status(400)
        .json({ mensagem: "Não existe carro disponível para venda" });
    }

    const insertSale = await knex("sales").insert({
      id_car,
      id_seller,
      valor_carro,
      desconto,
      valor_venda: `${
        Number(valor_carro) - (Number(valor_carro) * Number(desconto)) / 100
      }`,
      data_venda,
    });

    if (!insertSale) {
      return res.status(500).json({ mensagem: "A venda não foi cadastrada." });
    }

    const updatedCar = await knex("cars")
      .where("id", id_car)
      .update({
        quantidade: Number(checkCarExists.quantidade) - 1,
      });

    if (!updatedCar) {
      return res.status(500).json({
        mensagem: "Não foi possivel atualizar os dados do carro.",
      });
    }

    const salesData = await knex
      .select(
        "s.id",
        "se.nome as vendedor",
        "c.nome as nome_carro",
        "c.marca as marca_carro",
        "s.valor_carro as valor_bruto",
        "s.desconto as desconto",
        "s.valor_venda as valor_liquido",
        "s.data_venda as data_venda"
      )
      .from("sales as s")
      .leftJoin("sellers as se", "se.id", "s.id_seller")
      .leftJoin("cars as c", "c.id", "s.id_car");

    return res.status(200).json(salesData[salesData.length - 1]);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const listSales = async (req, res) => {
  try {
    const salesData = await knex
      .select(
        "s.id",
        "se.nome as vendedor",
        "c.nome as nome_carro",
        "c.marca as marca_carro",
        "s.valor_carro as valor_bruto",
        "s.desconto as desconto",
        "s.valor_venda as valor_liquido",
        "s.data_venda as data_venda"
      )
      .from("sales as s")
      .leftJoin("sellers as se", "se.id", "s.id_seller")
      .leftJoin("cars as c", "c.id", "s.id_car");

    return res.status(200).json(salesData);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const deleteSale = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: "Id não informado!" });
  }

  try {
    const dateSale = await knex("sales").where("id", id).first();

    if (!dateSale) {
      return res.status(400).json({ mensagem: "A venda informada não existe" });
    }

    const saleDeleted = await knex("sales").del().where("id", id);

    if (!saleDeleted) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível excluir a venda!" });
    }

    const checkCarExists = await knex("cars")
      .where("id", dateSale.id_car)
      .first();

    if (!checkCarExists) {
      return res.status(400).json({ mensagem: "O carro informado não existe" });
    }

    const updatedCar = await knex("cars")
      .where("id", dateSale.id_car)
      .update({
        quantidade: Number(checkCarExists.quantidade) + 1,
      });

    if (!updatedCar) {
      return res.status(500).json({
        mensagem: "Não foi possivel atualizar os dados do carro.",
      });
    }

    return res.status(200).json({ mensagem: "Venda excluída com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const attSale = async (req, res) => {
  const { id } = req.params;
  const { id_car, id_seller, valor_carro, desconto, data } = req.body;

  try {
    await schemaSales.validate(req.body);

    const dateSale = await knex("sales").where("id", id).first();

    if (!dateSale) {
      return res.status(404).json({ mensagem: "Venda não encontrada!" });
    }

    const updatedSale = await knex("sales")
      .update({
        id_car,
        id_seller,
        valor_carro,
        desconto,
        valor_venda: `${
          Number(valor_carro) - (Number(valor_carro) * Number(desconto)) / 100
        }`,
        data_venda,
      })
      .where("id", id);

    if (!updatedSale) {
      return res.status(500).json({
        mensagem: "Não foi possivel atualizar os dados da venda.",
      });
    }

    checkAndUpdateAmount(dateSale.id_car, "sum");
    checkAndUpdateAmount(id_car, "less");

    return res.status(200).json({ mensagem: "Venda editada com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  addSale,
  listSales,
  deleteSale,
  attSale,
};
