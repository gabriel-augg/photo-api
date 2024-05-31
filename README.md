# PHOTO-API RESTFul

Esta API foi desenvolvida seguindo os padrões REST, e foi feita em conjunto com o projeto Photo.

Photo é uma aplicação de gerenciamento de imagens, sua abordagem é semelhante ao Vsco. No total há 2 CRUDs, sendo eles seguindo o modelo: USER e PHOTOS.

Clique [aqui](https://github.com/gabriel-augg/photo) para mais informações sobre o projeto Photo.

## 💻 Tecnologias

- TypeScript
- Express
- Mongoose
- MongoDB
- MVC
- JWT
- Bcrypt
- CORS
- Jest
- Mongo-memory-server
- Cookie-parser

## 🚀 Getting started

Para rodar esta API localmente, é necessério fazer clone do projeto, instalar todas as suas dependências, configurar variáveis de ambiente e configurar o banco de dados localmente.

### Requisitos

- Git
- Node
- NPM

### Clonando o repositório, instalando as dependências e configurando o banco de dados.

1 - Clonando o repositório

```bash
git clone https://github.com/gabriel-augg/photo-api
```

2 - Entrando no projeto e instalando dependências

```bash
cd photo-api
git clone https://github.com/gabriel-augg/photo-api
```

3 - Configurando o banco de dados

Você deve consultar um video no youtube sobre o tema, pois é mais fácil configurar um banco de dados MySQL pelo youtube.


### Configurando variáveis .env

Crie um arquivo .env no raiz  do repositório e defina as seguintes variáveis:

```yaml
MONGO_URI=""
MONGO_URI_DEV=""
JWT_SECRET=""
NODE_ENV="" development | production | test
PORT=""
```

Defina os valores das variáveis de acordo com as suas configurações.

### Iniciando o projeto

```bash
npm start
```
