#!/bin/bash
# NEST COMPANY — demo-launcher. Dubbelklik om de site lokaal te starten.
cd "$(dirname "$0")"
PORT=4327
echo "NEST COMPANY — http://localhost:$PORT"
(sleep 1 && open "http://localhost:$PORT") &
python3 -m http.server "$PORT"
