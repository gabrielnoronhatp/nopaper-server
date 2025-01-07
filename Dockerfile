FROM node:18-alpine

WORKDIR /app

# Instalar ts-node globalmente com permissões de root
RUN npm install -g ts-node typescript

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências do projeto
RUN npm install

# Copiar código fonte
COPY . .

# Definir permissões corretas
RUN chown -R node:node /

# Mudar para o usuário node
USER node

EXPOSE 3001

ENV HOST=0.0.0.0

# Comando para iniciar a aplicação
CMD ["npm", "start"]