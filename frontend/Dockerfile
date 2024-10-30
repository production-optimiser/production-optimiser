FROM node:alpine

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

RUN npm audit fix --force

COPY . /app/

EXPOSE 3000

CMD ["npm", " start"]