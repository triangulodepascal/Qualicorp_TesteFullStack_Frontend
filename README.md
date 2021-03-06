# Frontend da aplicação de teste para o processo seletivo (Qualicorp)

## Objetivos

O objetivo dessa aplicação é integrar visualmente o uso da API criada para o processo seletivo (Veja [repositório da API](https://github.com/triangulodepascal/Qualicorp_TesteFullStack_backend/)).

### Distribuição

A distribuição da aplicação foi feita através do [Heroku](https://www.heroku.com/) e pode ser acessada através [deste link](https://qualicorp-teste-frontend.herokuapp.com/).

### Exemplo de uso

Um exemplo de uso da aplicação pode ser visto através [deste link](https://www.youtube.com/watch?v=k8si0KpbK2k)

### Desenvolvimento

O desenvolvimento visual do frontend foi feito através do framework [VueJs](https://vuejs.org/) utilizando o Vue3 e a compositionAPI.

### Principais dependências

As principais dependências do projeto são:

- O cliente de requisições HTTP [axios](https://www.npmjs.com/package/axios) responsável pelas chamadas à API.
- A biblioteca de componentes open source [PrimeVue](https://primefaces.org/primevue/showcase/) que possibilitou o design system do projeto e a agilidade de desenvolvimento.
- O construtor de esquemas de validação [Yup](https://github.com/jquense/yup) que permitiu uma menor complexidade de validações na API e redução de erros durante a apresentação de dados.
- O framework de testes [Jest](https://jestjs.io/pt-BR/) utilizado para escrever os testes unitários das validações criadas através do yup, garantindo uma maior segurança contra bugs na aplicação.
