# NLW Copa
## Requisitos
Para executar o projeto, será necessário ter instalado:
- NodeJs v16.17 ^
- NPM v8.19 ^
- Expo 6.0.5 ^


## Desenvolvimento
Com os requisitos para uso do projeto, somente será necessário clonar o repositorio para o local de preferencia. 
- `$ cd "diretorio"`
- `$ git clone https://github.com/FI12LHO/NLW-Copa`


## Contrução
- ### Backend (Server)
    - Instale os pacotes com `$ npm install`.
    - Execute `$ npx prisma migrate dev` para rodar as migrations e as seeds.
    - Execute `$ npm run dev` para iniciar o backend (servidor).

- ### Frontend
    - Instale os pacotes com `$ npm install`.
    - Execute `$ npm run dev` para iniciar a aplicação web.

- ### Mobile
    - Instale os pacotes com `$ npm install`.
    - Crie um app no google para poder ter acesso ao OAuth (https://docs.expo.dev/guides/authentication/#google).
    - Renomei o arquivo `.env.exmaple` na raiz do projeto para `.env` e adicione o **cliente id**.
    - Alterar o endereço do arquivo src/services/api.ts colocando o IP da máquina.
    - Execute `$ npm start` ou `$ expo start` para iniciar a aplicação mobile.

    **Lembre-se de configurar o arquivo .env e ter o backend rodando**


## Projeto
Projeto construído utilizando NodeJs(Backend/Server), React(Web), React Native(Mobile) e outras tecnologias. O objetivo do sistema é permitir e demonstrar o cadastro de usuários utilizando autentificação através do Google, obtendo os dados desse usuário(nome, email, avatar-URL) para utilizando da aplicação. Aplicação permite ao usuário criar um bolão(grupo) onde é possível convidar outros usuários(participantes) para darem palpites de placares dos jogos que ocorreram na copa do mundo.


## Tecnologias
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Fastify](https://www.fastify.io/)
- [Prisma](https://www.prisma.io/)
- [TailWindCss](https://tailwindcss.com/)
- [React Native Base](https://nativebase.io/)

## Preview
- ### Mobile
https://user-images.githubusercontent.com/40048345/200393788-e55b5673-44ed-4f1b-8c13-d0ff049d109e.mp4

- ### Web
![localhost-3000](https://user-images.githubusercontent.com/40048345/200394002-8e342f06-6a5e-4a0a-8517-2517a0e0d884.png)


