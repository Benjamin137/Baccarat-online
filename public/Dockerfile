FROM node:20-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 2000
# Se usa --port 2000 y --host para que sea accesible desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--port", "2000", "--host"]