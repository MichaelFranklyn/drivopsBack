const knex = require("../database/connection");

const checkAndUpdateAmount = async (id, type) => {
  const checkCarExists = await knex("cars").where("id", id).first();

  if (!checkCarExists) {
    return res.status(400).json({ mensagem: "O carro informado não existe" });
  }

  const updatedCar = await knex("cars")
    .where("id", id)
    .update({
      quantidade: `${
        type === "sum"
          ? Number(checkCarExists.quantidade) + 1
          : Number(checkCarExists.quantidade) - 1
      }`,
    });

  if (!updatedCar) {
    return res.status(500).json({
      mensagem: "Não foi possivel atualizar os dados do antigo carro.",
    });
  }
};

module.exports = { checkAndUpdateAmount };
