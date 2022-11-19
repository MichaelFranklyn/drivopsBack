const yup = require("./settings");

const schemaUser = yup.object().shape({
  nome: yup.string().required(),
  senha: yup.string().required().min(8).max(15),
});

const schemaCar = yup.object().shape({
  nome: yup.string().required(),
  marca: yup.string().required(),
  quantidade: yup.string().required(),
  valor: yup.string().required(),
});

const schemaSeller = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().required(),
});

const schemaSales = yup.object().shape({
  id_car: yup.string().required(),
  id_seller: yup.string().required(),
  valor_carro: yup.string().required(),
  desconto: yup.string().required(),
  data: yup.string().required(),
});

module.exports = {
  schemaUser,
  schemaCar,
  schemaSeller,
  schemaSales,
};
