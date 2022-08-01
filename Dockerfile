FROM public.ecr.aws/lts/ubuntu:20.04

WORKDIR /usr/src/app

COPY  . .
RUN apt update -y && apt -y install curl && curl -sL https://deb.nodesource.com/setup_14.x | bash - && apt -y install nodejs && node -v
RUN npm cache clean --force && npm install --only=prod

ENV CONTAINER=true
ARG MONGO_URI=$MONGO_URI

EXPOSE 80

#CMD  ["npm", "run", "start_container"]
CMD  ["node", "index.js"]
