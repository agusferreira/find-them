# Docker Django API

## First steps & general Info

First steps:

  *  modify and copy the environment file `cp docs/env.txt .env`
  *  modify and copy the local_settings file `cp webproject/webproject/local_settings.py.tpl webproject/webproject/local_settings.py`
  *  Build and run the project with `Make`


## Docker & make instructions ##
To deploy locally or remotely you'll need [docker-compose](https://docs.docker.com/compose/install/) and [docker-engine](https://docs.docker.com/engine/installation/linux/ubuntulinux/)
You can just copy and paste the following commands:

```bash
sudo apt-get install apt-transport-https ca-certificates
sudo apt-get install linux-image-extra-$(uname -r) linux-image-extra-virtual
wget -qO- https://get.docker.com/ | sh
sudo usermod -aG docker $USER
sudo curl -L "https://github.com/docker/compose/releases/download/1.9.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Once set up you can run `make [tab][tab]` to see a list of actions:

  *  `make build` to initially build the containers
  *  `make up` to deploy the containers
  *  `make stop` to turn off containers
  *  `make clean` to remove the containers
