# BUILDER STAGE
FROM node:10

COPY src /src
COPY package.json  ./

COPY webpack.base.config.js ./
COPY webpack.demo.config.js ./

COPY .babelrc ./

COPY scripts /scripts
COPY server /server

RUN npm install
RUN npm run demo compositions/map

EXPOSE 8181
CMD ["node", "/server/server.js"]
