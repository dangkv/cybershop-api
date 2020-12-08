#!/bin/bash

# URL
glitch_url="https://onyx-frequent-holiday.glitch.me"
heroku_url="https://cccs425-project1.herokuapp.com"
local_url="localhost:3000"

url=$local_url

clear="\033[0m"
green="\033[0;32m"
red="\033[0;31m"

# signup
curl -X POST -d '{"username": "jon"}' "$url/signup"
curl -X POST -d '{"password": "doe"}' "$url/signup"
curl -X POST -d '{"username": "jon", "password": "doe"}' "$url/signup"
curl -X POST -d '{"username": "jon", "password": "doe"}' "$url/signup"

# login
echo "\n\n\nLogin"
curl -X POST -d '{"username": "jon"}' "$url/login"
curl -X POST -d '{"password": "doe"}' "$url/login"
curl -X POST -d '{"username": "jonn", "password": "doe"}' "$url/login"
curl -X POST -d '{"username": "jon", "password": "do"}' "$url/login"
curl -X POST -d '{"username": "jon", "password": "doe"}' "$url/login"
