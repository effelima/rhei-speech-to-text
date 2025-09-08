# Dockerfile (permanece o mesmo)

# Passo 1: Imagem Base
FROM node:20-alpine

# Passo 2: Definir o Diretório de Trabalho
WORKDIR /app

# Passo 3: Copiar e Instalar as Dependências
COPY package*.json ./
RUN npm install

# Passo 4: Copiar o Código da Aplicação
COPY . .

# Passo 5: Expor a Porta
EXPOSE 3000

# Passo 6: Comando de Execução
CMD ["npm", "run", "dev"]