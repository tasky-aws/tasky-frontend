#!/bin/bash -e
systemctl --user stop tasky-api.service 
systemctl --user stop tasky.service 

function cleanup { 
    echo "Closing down..."
    systemctl --user stop tasky-api.service 
    systemctl --user stop tasky.service 
    systemctl --user status tasky-api.service 
    export RUST_LOG=none
} 

export RUST_LOG=error

trap cleanup EXIT 

systemctl --user start tasky-api.service 
systemctl --user start tasky.service 
# nohup /home/donovand/projects/tasky-frontend/dist/electron/tasky-linux-x64/tasky &>/dev/null &
# /home/donovand/projects/tasky-frontend/dist/electron/tasky-linux-x64/tasky

sleep 10m
journalctl -u tasky-api.service