FROM node

WORKDIR /copyNoon

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm" , "run" , "start:dev" ]
