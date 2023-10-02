#!/bin/sh

if [ $# -lt 1 -o "$1" = "-h" -o "$1" = "--help" ]
then
    echo "Usage:"
    echo "    $0 FRONTEND_PORT"
    echo "    $0 FRONTEND_PORT --clean   (NOTE: use this the first time)"
    echo
    echo "Example:"
    echo "    $0 3000 --clean"
    exit 1
fi

if [ "$2" = "--clean" ]
then
    echo Installing from yarn.lock
    yes | sudo apt update && sudo apt upgrade
    yes | sudo apt install curl
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    yes | sudo apt install -y nodejs
    sudo npm install -g yarn
    yarn install --frozen-lockfile
fi


if ! which yarn > /dev/null 2>&1
then
    echo Error: Please install yarn and dependencies with:
    echo '    yes | sudo apt update && sudo apt upgrade'
    echo '    yes | sudo apt install curl'
    echo '    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -'
    echo '    yes | sudo apt install -y nodejs'
    echo '    sudo npm install -g yarn'
    echo '    yarn install --frozen-lockfile'
    exit 1
fi

PORT=$1 yarn start
