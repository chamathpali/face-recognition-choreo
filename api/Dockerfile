FROM python:3.10-slim

# Install curl and other dependencies
RUN apt-get update && apt-get install -y curl gnupg

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Verify Node.js and NPM installation
RUN node -v && npm -v

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev
RUN npm rebuild @tensorflow/tfjs-node --build-from-source
RUN npm rebuild @tensorflow/tfjs-node build-addon-from-source

COPY . .



# Create a new user with UID 10016
# RUN addgroup -g 10016 choreo && \
#     adduser  --disabled-password  --no-create-home --uid 10016 --ingroup choreo choreouser
# USER 10016

CMD [ "node", "index.mjs" ]