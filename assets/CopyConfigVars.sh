#!/bin/bash

# ./assets/CopyConfigVars.sh
FROM=org62-tandc
TO=org62-tandc-pr-11
heroku config -a $FROM --json | jq -M -r '. | keys[] as $k | $k, .[$k]' | \
while read -r key; read -r val; do
   heroku config:set -a $TO "$key=$val"
done