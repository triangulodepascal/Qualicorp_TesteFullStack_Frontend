import UserValidation from '../../../src/validations/user/UserValidation'

describe('Testing User Schema Validation', () => {
  let userSchema
  let test
  let usersList = []
  let newUser

  beforeEach(async () => {
    userSchema = new UserValidation().createContextSchema(usersList)
    usersList = [
      { name: 'user1', cpf: '123.456.789-00', email: 'user1@qualicorp.com.br', telefone: 11998765432 },
      { name: 'teste', cpf: '963.852.741-21', email: 'qa@qualicorp.com.br', telefone: 11951623784 },
    ]
    newUser = {
      name: 'Samuel Alves Chagas',
      cpf: '145.486.986-04',
      email: 'samuelchagasalves@gmail.com',
      telefone: 35998942677,
    }
  })

  afterEach(() => {
    test = null
  })

  it('Tests whether users name may be empty', () => {
    try {
      newUser.name = ''
      test = userSchema.validateSyncAt('name', newUser)
    } catch (err) {
      test = err?.message
    }

    expect(test).toBe('Digite seu nome completo')
  })

  it('Tests whether users CPF may be empty', () => {
    try {
      newUser.cpf = ''
      test = userSchema.validateSyncAt('cpf', newUser)
    } catch (err) {
      test = err?.message
    }

    expect(test).toBe('Digite seu CPF')
  })

  it('Tests whether the users CPF may not follow the CPF standard', () => {
    try {
      newUser.cpf = '14548698604'
      test = userSchema.validateSyncAt('cpf', newUser)
    } catch (err) {
      test = err?.message
    }

    expect(test).toBe('Digite seu CPF')
  })

  it('Tests whether the users CPF may be the same as another users cpf', () => {
    try {
      newUser.cpf = '963.852.741-21'
      test = userSchema.validateSyncAt('cpf', newUser)
    } catch (err) {
      test = err?.message
    }

    expect(test).toBe('Já existe um usuário cadastrado com este CPF')
  })

  it('Tests whether the users email may be empty', () => {
    try {
      newUser.email = ''
      test = userSchema.validateSyncAt('email', newUser)
    } catch (err) {
      test = err?.message
    }

    expect(test).toBe('Digite seu email')
  })

  it('Tests whether the users email may not follow the E-mail standard', () => {
    try {
      newUser.email = 'samuelchagasalves@gmail'
      test = userSchema.validateSyncAt('email', newUser)
    } catch (err) {
      test = err?.message
    }

    expect(test).toBe('Email inválido')
  })

  // it('Tests whether the users phone may be a string', () => {
  //   try {
  //     newUser.telefone = '35998942677'
  //     test = userSchema.validateSyncAt('telefone', newUser)
  //   } catch (err) {
  //     test = err?.message
  //   }

  //   expect(test).toBe('Apenas números são permitidos')
  // })

  it('Tests whether the users phone may be empty', () => {
    try {
      delete newUser.telefone
      test = userSchema.validateSyncAt('telefone', newUser)
    } catch (err) {
      test = err?.message
    }

    expect(test).toBe('Digite seu número de telefone com DDD')
  })

  it('Tests whether the users phone may be out of phone standard', () => {
    try {
      newUser.telefone = 10998947756
      test = userSchema.validateSyncAt('telefone', newUser)
    } catch (err) {
      test = err?.message
    }

    expect(test).toBe('Digite seu número de telefone com DDD')

    try {
      newUser.telefone = 199999999999
      test = userSchema.validateSyncAt('telefone', newUser)
    } catch (err) {
      test = err?.message
    }

    expect(test).toBe('Digite seu número de telefone com DDD')
  })
})
