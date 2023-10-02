#!/bin/sh

if [ $# -lt 1 -o "$1" = "-h" -o "$1" = "--help" ]
then
    echo "Usage:"
    echo "    $0 BACKEND_PORT"
    echo "    $0 BACKEND_PORT --clean   (NOTE: use this the first time)"
    echo
    echo "Recommendation (Frontend will connect to 8080 by default):"
    echo "    $0 8080 --clean"
    exit 1
fi

if [ "$2" = "--clean" ]
then
    echo Installing packages
    if uname -a | egrep lubuntu
    then
        echo "Ubuntu operating system detected!"
        yes | sudo apt update
        yes | sudo apt upgrade
        yes | sudo apt install maven
    fi
    mvn install
    mvn compile
fi

if ! which mvn > /dev/null 2>&1
then
    echo Error: Please install maven and dependencies with:
    echo "    yes | sudo apt update"
    echo "    yes | sudo apt upgrade"
    echo "    yes | sudo apt install maven"
    echo "    mvn install"
    echo "    mvn install"
    echo "    mvn compile"
    
    
    exit 1
fi

if [ ! -f requirements.txt ]
then
    echo "Python's requirements.txt is missing."
    echo "Are you running the backend server from the backend directory?"
    echo "Consider:"
    echo "    cd backend"
    exit 1
fi

if ! ps -edaf | grep mongo | grep -v grep > /dev/null 2>&1
then
    export DATABASE_URI='mongodb+srv://movie-monster:movie-monster-pass@movie-monster-backend.p9imp.mongodb.net'
    echo "Mongodb database server not found locally."
    echo "Using cloud mongodb: $DATABASE_URI"
fi

mvn spring-boot:run -Dspring-boot.run.arguments=--server.port="$1"

