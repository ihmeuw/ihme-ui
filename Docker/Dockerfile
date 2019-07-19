# BUILDER STAGE
FROM node:10 as builder

# ARG AUDIENCE=public
# ARG BUILD_TYPE=prod

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
CMD ["node", "server.js"]
