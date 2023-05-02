@echo off

echo | set /p="[36mResolving dependencies... [0m"
pip install -r requirements.txt >nul
echo [1;32mDone.[0m

python3 src/main.py
