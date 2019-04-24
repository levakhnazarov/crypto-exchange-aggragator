#!/usr/bin/env bash

#== Import script args ==

github_token=$(echo "$1")

#== Bash helpers ==

function info {
  echo " "
  echo "--> $1"
  echo " "
}

#== Provision script ==

info "Provision-script user: `whoami`"


info "Install project dependencies"
#mkdir /home/vagrant/node_modules_project
#ln -s /home/vagrant/node_modules_project /app/node_modules/
cd /app
npm i

#info "Init project"

#info "Apply migrations"

info "Install pm2"
sudo npm i pm2 -g
cd /app
pm2 start ecosystem.config.js
sudo pm2 startup ubuntu -u vagrant --hp /home/vagrant
pm2 save

info "Install apidoc"
sudo npm i apidoc -g

#info "Install codeceptjs && webdriverio"
#sudo npm install -g codeceptjs webdriverio

info "Create bash-alias 'app' for vagrant user"
echo 'alias app="cd /app"' | tee /home/vagrant/.bash_aliases

info "Enabling colorized prompt for guest console"
sed -i "s/#force_color_prompt=yes/force_color_prompt=yes/" /home/vagrant/.bashrc
