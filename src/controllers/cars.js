const knex = require("../database/connection");
const { schemaCar } = require("../validations/schemas");

const addCar = async (req, res) => {
  const { nome, marca, quantidade, valor } = req.body;

  try {
    await schemaCar.validate(req.body);

    const checkNomeExists = await knex("cars").where("nome", nome).first();

    if (checkNomeExists) {
      return res.status(400).json({ mensagem: "O carro informado já existe" });
    }

    const insertCar = await knex("cars").insert({
      nome,
      marca,
      quantidade,
      valor,
    });

    if (!insertCar) {
      return res.status(500).json({ mensagem: "O carro não foi cadastrado." });
    }

    const registeredCar = await knex("cars").where("nome", nome).first();

    return res.status(201).json(registeredCar);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const listCars = async (req, res) => {
  try {
    const listClients = await knex("cars").orderBy("id");
    return res.status(200).json(listClients);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const deleteCar = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: "Id não informado!" });
  }

  try {
    const checkAmountCar = await knex("cars").where("id", id);

    if (checkAmountCar.quantidade > 0) {
      return res
        .status(200)
        .json({ mensagem: "O carro não pode ser excluído." });
    }

    const carDeleted = await knex("cars").del().where("id", id);

    if (!carDeleted) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível excluir o carro!" });
    }

    return res.status(200).json({ mensagem: "Carro excluído com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const attCar = async (req, res) => {
  const { id } = req.params;
  const { nome, marca, quantidade, valor } = req.body;

  try {
    await schemaCar.validate(req.body);

    const car = await knex("cars").where("id", id).first();

    if (!car) {
      return res.status(404).json({ mensagem: "Carro não encontrado!" });
    }

    if (car.nome !== nome) {
      const checkCarExists = await knex("cars").where("nome", nome).first();

      if (checkCarExists) {
        return res
          .status(400)
          .json({ mensagem: "O carro informado já existe" });
      }
    }

    const updatedCar = await knex("cars")
      .update({
        nome,
        marca,
        quantidade,
        valor,
      })
      .where("id", id);

    if (!updatedCar) {
      return res.status(500).json({
        mensagem: "Não foi possivel atualizar os dados do carro.",
      });
    }
    return res.status(200).json({ mensagem: "Carro editado com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  addCar,
  listCars,
  deleteCar,
  attCar,
};
