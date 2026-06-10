# Sentiment Analysis App

Prosta aplikacja webowa do analizy sentymentu tekstu w języku angielskim, korzystająca z modelu Hugging Face przez REST API.

## Funkcje

- Wpisanie zdania i automatyczna analiza sentymentu (POSITIVE / NEGATIVE / NEUTRAL)
- Tabela z wynikami przechowywana w `sessionStorage`
- Usuwanie wpisów
- Eksport wyników do pliku Markdown (`.md`)

## Technologie

- **Backend:** Node.js, Express
- **Frontend:** HTML, CSS, Vanilla JS
- **AI:** Hugging Face Inference API
- **Inne:** `dotenv`, `node-fetch`

## Wymagania

- Node.js >= 18
- Konto i klucz API na [huggingface.co](https://huggingface.co)

## Instalacja

```bash
git clone https://github.com/skrzyluk/sentiment.git
cd sentiment
npm install
```

Utwórz plik `.env` w katalogu głównym i dodaj swój klucz API:

```env
HF_API_KEY=hf_twoj_klucz_api
```

## Uruchomienie

```bash
node app.js
```

Aplikacja będzie dostępna pod adresem: `http://localhost:3000`

## Struktura projektu

```
sentiment/
├── app.js            # Serwer Express + endpoint /analyze
├── server.js         # (plik pomocniczy)
├── public/
│   ├── index.html    # Interfejs użytkownika
│   ├── script.js     # Logika frontendowa
│   └── style.css     # Style
├── .env              # Zmienne środowiskowe (nie commituj!)
└── package.json
```

## Użycie

1. Wpisz zdanie po angielsku w pole tekstowe.
2. Kliknij **Add & Analyze** — wynik pojawi się w tabeli.
3. Aby usunąć wpis, kliknij **Usuń**.
4. Aby wyeksportować wyniki, kliknij **Zapisz jako MD**.

## Licencja

MIT — autor: **skrzyluk**
