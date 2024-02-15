FROM ubuntu:18.04

RUN apt update -y \
    && apt install -y nginx \
    && apt-get install -y software-properties-common \
    && add-apt-repository ppa:certbot/certbot -y \
    && apt-get update -y \
    && apt-get install -y python-certbot-nginx \
    && apt-get clean

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
