FROM node:20-alpine3.18

# RUN addgroup app && adduser -S -G app app
# RUN addgroup app && adduser -S -G app app

USER app

# WORKDIR /app

COPY package*.json ./
# COPY prisma ./prisma/
# RUN npm install

# # change ownership of the /app directory to the app user
# USER root

# change ownership of the /app directory to the app user
# chown -R <user>:<group> <directory>
# chown command changes the user and/or group ownership of for given file.
# RUN chown -R app:app .

# change the user back to the app user
# USER app

# RUN npm install

# COPY . . 

# EXPOSE 8000 

# CMD npm start
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

EXPOSE 3000 


# Starta applikationen
CMD ["npm", "run", "dev"]
