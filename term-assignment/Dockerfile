FROM --platform=linux/amd64 node:latest

WORKDIR /app

COPY package.json ./

RUN npm install --silent

COPY . ./

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]