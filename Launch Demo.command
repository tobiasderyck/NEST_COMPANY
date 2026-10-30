#!/bin/bash
# NEST Company: dubbelklik om de site lokaal te starten (met de Tina-bewerkomgeving op /admin/index.html).
cd "$(dirname "$0")"
PORT=4327
echo "NEST Company: http://localhost:$PORT"
(sleep 4 && open "http://localhost:$PORT") &
npm run dev
