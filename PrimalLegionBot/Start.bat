@echo off
echo Starting bot
:main
node app.js
echo Restarting bot
if %ERRORLEVEL% NEQ 1 goto main
