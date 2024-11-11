# # ARG NODE_VERSION=22.2.0

# FROM node:20-alpine

# WORKDIR /app

# RUN mkdir -p /app && chown -R node:node /app

# COPY package*.json ./


# ENV NODE_ENV=production

# RUN npm install

# COPY . .

# # USER node
# RUN chown -R node:node /app/node_modules


# # Run the application.
# CMD ["npm", "run", "dev"]


FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Skapa mappen och sätt rättigheter
# RUN npm install && \ chown -R node:node /app

# Kopiera package-filerna och installera beroenden

# Installera produktionsberoenden och TypeScript globalt
RUN npm install && npm install -g typescript


RUN mkdir -p /app/dist && chown -R node:node /app/dist
COPY . .
# RUN chown -R node:node /app/dist
# Kopiera all kod

# Bygg TypeScript-koden
RUN npm run build

# Sätt rättigheter på node_modules
RUN chown -R node:node /app/node_modules

# Byt till användaren "node"
USER node

# Starta applikationen
CMD ["npm", "run", "dev"]
