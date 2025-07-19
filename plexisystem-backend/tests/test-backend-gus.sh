#!/bin/bash
# test-backend-gus.sh - Test API GUS przez backend

echo "=== Test API GUS przez backend ==="
echo ""

# Sprawdź czy backend działa
echo "1. Sprawdzanie statusu backendu..."
curl -s http://localhost:3001/api/health | jq '.' || echo "Backend nie odpowiada"
echo ""

# Test z przykładowym NIP-em (PlexiSystem)
echo "2. Test wyszukiwania po NIP 5252344078 (PlexiSystem)..."
curl -s http://localhost:3001/api/gus/5252344078 | jq '.' || echo "Błąd pobierania danych"
echo ""

# Test z innym NIP-em
echo "3. Test wyszukiwania po NIP 5213870274 (Google Poland)..."
curl -s http://localhost:3001/api/gus/5213870274 | jq '.' || echo "Błąd pobierania danych"
echo ""

# Test z nieprawidłowym NIP-em
echo "4. Test z nieprawidłowym NIP..."
curl -s http://localhost:3001/api/gus/0000000000 | jq '.' || echo "Błąd pobierania danych"
echo ""

echo "=== Koniec testów ==="
