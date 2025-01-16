FROM node:22-alpine

WORKDIR /app

CMD ["npm", "run", "build"]

COPY package.json /app

RUN npm i

COPY . /app
