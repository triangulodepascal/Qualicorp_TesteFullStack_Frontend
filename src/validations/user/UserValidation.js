import * as yup from 'yup'

export default class UserValidation {
  createContextSchema(usersList) {
    return yup.object({
      name: yup.string().required('Digite seu nome completo'),
      cpf: yup
        .string()
        .required('Digite seu CPF')
        .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Digite seu CPF')
        .notOneOf(
          usersList.map(i => i.cpf.toLowerCase()),
          'Já existe um usuário cadastrado com este CPF'
        ),
      email: yup.string().required('Digite seu email').email('Email inválido'),
      telefone: yup
        .number()
        .required('Digite seu número de telefone com DDD')
        .typeError('Apenas números são permitidos')
        .min(11000000000, 'Digite seu número de telefone com DDD')
        .max(99999999999, 'Digite seu número de telefone com DDD'),
    })
  }
}
