#!/usr/bin/env bash
# ============================================================
# pruebas/todas.sh — todas las suites, en los DOS motores
#
# Zymbol tiene dos formas de ejecutar el mismo programa: el
# tree-walker (por defecto) y la VM de registros (--vm). Deberían
# dar el mismo resultado; cuando no lo dan, es un bug del
# intérprete. Si solo pruebas en uno, no sabes si tu juego
# funciona: sabes que funciona en uno.
#
#   bash pruebas/todas.sh
# ============================================================
set -u
cd "$(dirname "$0")/.."

fallos=0

for motor in "" "--vm"; do
    etiqueta="tree-walker"
    [ -n "$motor" ] && etiqueta="VM de registros"
    echo "═══ $etiqueta ═══"

    for prueba in pruebas/*.zy; do
        salida=$(zymbol run $motor "$prueba" 2>&1)
        veredicto=$(printf '%s\n' "$salida" | tail -1)
        case "$veredicto" in
            PASA*) printf '─── %-28s %s\n' "$prueba" "$veredicto" ;;
            *)     printf '─── %-28s %s\n' "$prueba" "$veredicto"
                   printf '%s\n' "$salida"
                   fallos=$((fallos + 1)) ;;
        esac
    done
done

echo
if [ "$fallos" -eq 0 ]; then
    echo "todas PASA"
else
    echo "todas FALLA — $fallos suite(s)"
    exit 1
fi
