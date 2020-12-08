#!/bin/bash

# URL
glitch_url="https://parallel-third-digit.glitch.me"
heroku_url="https://cyber-shop.herokuapp.com"
local_url="localhost:3000"

url=$glitch_url

clear="\033[0m"
green="\033[0;32m"
red="\033[0;31m"

# signup
curl -X POST -d '{"username": "jon"}' "$url/signup"
curl -X POST -d '{"password": "doe"}' "$url/signup"
curl -X POST -d '{"username": "jon", "password": "doe"}' "$url/signup"
curl -X POST -d '{"username": "jon", "password": "doe"}' "$url/signup"

# login
echo -e "\n\n\nLogin"
curl -X POST -d '{"username": "jon"}' "$url/login"
curl -X POST -d '{"password": "doe"}' "$url/login"
curl -X POST -d '{"username": "jonn", "password": "doe"}' "$url/login"
curl -X POST -d '{"username": "jon", "password": "do"}' "$url/login"
curl -X POST -d '{"username": "jon", "password": "doe"}' "$url/login"

# change-password
curl -XPOST -d '{"oldPassword":"doe","newPassword":"though"}' "$url/change-password"
curl -XPOST -H 'token: 2' -d '{"oldPassword":"doe","newPassword":"though"}' "$url/change-password"
curl -XPOST -H 'token: 1' -d '{"oldPassword":"doe"}' "$url/change-password"
curl -XPOST -H 'token: 1' -d '{"newPassword":"though"}' "$url/change-password"
curl -XPOST -H 'token: 1' -d '{"oldPassword":"do","newPassword":"though"}' "$url/change-password"
curl -XPOST -H 'token: 1' -d '{"oldPassword":"doe","newPassword":"though"}' "$url/change-password"

# create-listing
curl -XPOST -d '{"price":30,"description":"a hat"}' "$url/create-listing"
curl -XPOST -H 'token: 2' -d '{"price":30,"description":"a hat"}' "$url/create-listing"
curl -XPOST -H 'token: 1' -d '{"price":30}' "$url/create-listing"
curl -XPOST -H 'token: 1' -d '{"description":"a hat"}' "$url/create-listing"
curl -XPOST -H 'token: 1' -d '{"price":30,"description":"a hat"}' "$url/create-listing"
