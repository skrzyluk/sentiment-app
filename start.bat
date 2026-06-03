@echo off
chcp 65001 >nul
title Sentiment Analysis App
cd /d "%~dp0"

echo ============================================
echo   Sentiment Analysis App
echo ============================================
echo.

REM Sprawdzenie czy Node.js jest zainstalowany
where node >nul 2>nul
if errorlevel 1 (
    echo [BLAD] Nie znaleziono Node.js. Zainstaluj go z https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Sprawdzenie czy istnieje plik .env
if not exist ".env" (
    echo [BLAD] Brak pliku .env z tokenem HF_TOKEN.
    echo Skopiuj .env.example do .env i uzupelnij token.
    echo.
    pause
    exit /b 1
)

REM Instalacja zaleznosci przy pierwszym uruchomieniu
if not exist "node_modules" (
    echo Instalowanie zaleznosci...
    call npm install
    echo.
)

echo Uruchamianie serwera...
echo Przegladarka otworzy sie automatycznie. Aby zatrzymac: zamknij to okno lub nacisnij Ctrl+C.
echo.

node app.js

pause
