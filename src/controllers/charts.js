const knex = require("../database/connection");

const listSellersAndSales = async (req, res) => {
  try {
    const listSellersSales = await knex
      .select("se.nome as vendedor")
      .from("sales as s")
      .leftJoin("sellers as se", "se.id", "s.id_seller")
      .sum("valor_venda")
      .groupBy("se.nome");

    return res.status(200).json(listSellersSales);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const listMonthsAndSales = async (req, res) => {
  try {
    const listMonthsSales = await knex
      .select("s.mes")
      .from("sales as s")
      .sum("valor_venda")
      .groupBy("s.mes");

    return res.status(200).json(listMonthsSales);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const listMonthsAndSalesAvg = async (req, res) => {
  try {
    const listMonthsSalesAvg = await knex
      .select("s.mes")
      .from("sales as s")
      .leftJoin("sellers as se", "se.id", "s.id_seller")
      .avg("valor_venda")
      .groupBy("s.mes");

    return res.status(200).json(listMonthsSalesAvg);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const listCarsAndQtd = async (req, res) => {
  try {
    const listCarsQtd = await knex
      .select("se.nome as vendedor")
      .from("sales as s")
      .leftJoin("sellers as se", "se.id", "s.id_seller")
      .count("valor_venda")
      .groupBy("se.nome");

    return res.status(200).json(listCarsQtd);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  listSellersAndSales,
  listMonthsAndSales,
  listMonthsAndSalesAvg,
  listCarsAndQtd,
};
