tar -xvf tasky-linux-x64.tar.gz
sudo mv tasky-api /usr/local/bin/tasky-api
sudo mv tasky-linux-x64 ~/tasky-frontend

mkdir -p  ~/.config/systemd/user/

sd 'CHANGEME' '$HOME' $(fd --type file) 

tasky-api.service ~/.config/systemd/user/
tasky.service ~/.config/systemd/user/
systemctl --user enable tasky.service
systemctl --user start tasky.service
systemctl --user status tasky.service
systemctl --user status tasky.service
systemctl --user status tasky-api.service

