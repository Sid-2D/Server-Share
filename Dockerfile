FROM ubuntu:14.04

# Set working directory as /app
WORKDIR /app

# Copy current directory to /app
ADD . /app

RUN sudo apt-get update -yq && apt-get upgrade -yq build-essential -yq 

# Install Python
RUN sudo apt-get install python python-dev python-pip -yq && \
	sudo apt-get install -yq curl git

# Install Node
RUN curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash - && \
	sudo apt-get install -y nodejs

RUN npm install

CMD node server.js