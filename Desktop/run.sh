#!/usr/bin/env bash

echo -en "\033[36mResolving dependencies... \033[0m"
pip install -r requirements.txt >/dev/null
echo -e "\033[1;32mDone.\033[0m"

python3 src/main.py
