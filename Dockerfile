# # syntax=docker/dockerfile:1

# # Comments are provided throughout this file to help you get started.
# # If you need more help, visit the Dockerfile reference guide at
# # https://docs.docker.com/go/dockerfile-reference/

# # Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

# ARG NODE_VERSION=22.2.0

# FROM node:${NODE_VERSION}-alpine

# # Use production node environment by default.
# ENV NODE_ENV production


# WORKDIR /usr/src/app

# # Download dependencies as a separate step to take advantage of Docker's caching.
# # Leverage a cache mount to /root/.npm to speed up subsequent builds.
# # Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# # into this layer.
# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=package-lock.json,target=package-lock.json \
#     --mount=type=cache,target=/root/.npm \
#     npm ci --omit=dev

# # Run the application as a non-root user.
# USER node

# # Copy the rest of the source files into the image.
# COPY . .

# # Expose the port that the application listens on.
# EXPOSE 5173

# # Run the application.
# CMD npm run dev


###################
#FRÅN EXEMPEL REPOT
###################

# FROM node:20-alpine3.18

# RUN addgroup app && adduser -S -G app app

# USER app

# WORKDIR /app

# COPY package*.json ./

# # change ownership of the /app directory to the app user
# USER root

# change ownership of the /app directory to the app user
# chown -R <user>:<group> <directory>
# chown command changes the user and/or group ownership of for given file.
# RUN chown -R app:app .

# # change the user back to the app user
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

EXPOSE 8000 


# Starta applikationen
CMD ["npm", "run", "dev"]
