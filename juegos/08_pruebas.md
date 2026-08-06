# Lección 08 — La puerta de completitud

> **Revisado para v0.0.8 — 2026-08-05**

«Los juegos de terminal no se pueden probar automáticamente.»

Eso se creyó durante tres proyectos. Es falso, y esta lección explica qué se prueba, cómo, y por qué la prueba más valiosa de un juego multiidioma no tiene nada que ver con jugar.

---

## Lo que sí se puede probar sin jugar

Un juego TUI tiene mucho más código comprobable de lo que parece. La regla para separarlo:

> Si una función **devuelve** algo, se puede probar. Si una función **dibuja**, se prueba lo que le da de comer.

| Se prueba directo | Se prueba indirecto | No se prueba |
|---|---|---|
| Reglas (`mover`, colisiones, captura) | Los marcos: se comprueban sus **anchos** | El color exacto en pantalla |
| Puntuación | Los catálogos: se comprueba su **completitud** | Que se vea «bonito» |
| El generador de azar | Los menús: se comprueba lo que **devuelven** | |
| Medidas de columna | | |

囲碁 tiene siete suites y ninguna dibuja un tablero de verdad:

```
─── 試験/文字試験.zy    PASS — column arithmetic holds
─── 試験/言語検証.zy    PASS — every key resolves in every locale
─── 試験/api試験.zy     PASS — api/english and api/espanol resolve to the same engine
─── 試験/盤試験.zy      PASS — every rule case behaved
─── 試験/計算試験.zy    PASS — scoring behaved
─── 試験/思考試験.zy    PASS — the engine reads the position
─── 試験/描画試験.zy    PASS — the grid holds together
全試験 PASS
```

---

## La puerta de completitud

Es la prueba estrella de un juego multiidioma, y sale casi gratis del diseño de la lección 07.

Recuerda las dos piezas:

1. El despachador publica el **catálogo maestro de claves** (`claves()`).
2. Una clave sin traducir se devuelve **a sí misma**.

Con eso, la prueba entera es un doble bucle:

```
// serpiente/pruebas/verificación_idioma.zy
claves = idioma::claves()
lista  = idioma::idiomas()

faltan = 0

@ código : lista {
    idioma::fijar(código)
    ausentes = 0

    @ clave : claves {
        ? (idioma::texto(clave)) == clave {
            >> "      FALTA  " clave ¶
            ausentes = ausentes + 1
        }
    }

    faltan = faltan + ausentes
}
```

**Recorre el idioma base también.** No es un descuido: es el punto entero del prefijo de dominio. Sin él, `"puntos"` traduciría a `"Puntos"` en español y no podrías distinguir «traducido» de «no traducido» en el idioma en el que está escrito el programa — que es justo donde más se olvidan claves, porque el autor cree que ya está.

---

## Lo que la puerta de completitud no ve

Una búsqueda estática solo puede **faltar**. Una frase compuesta puede estar **mal**: un número mal formateado, una rama gramatical sin cubrir, un plural que no concuerda.

Así que se ejercitan aparte, con los valores que seleccionan cada rama:

```
// serpiente/pruebas/verificación_idioma.zy
@ código : lista {
    idioma::fijar(código)
    >> "  [" código "] " (idioma::marcador(0)) " · " (idioma::marcador(7)) " · " (idioma::marcador(1234)) ¶
    >> "        " (idioma::texto_partida(1)) ¶
    >> "        " (idioma::texto_partida(12)) ¶
}
```

`0`, `7` y `1234` no son números al azar: son **cero**, **un dígito** y **cuatro dígitos**, que es donde se rompe un marcador con el ancho supuesto. Y `1` y `12` son las dos ramas de `texto_partida`.

Esto no falla solo: hay que **leerlo**. Es una prueba de inspección, y está bien que lo sea — nadie puede escribir un aserto para «esta frase suena natural en coreano».

---

## Probar que el marco sigue cuadrando

La razón por la que Serpiente no tenía i18n era que sus cajas eran literales de ancho fijo. Así que lo que hay que probar no es solo que el texto exista, sino que **el marco siga cuadrando cuando el texto cambia de idioma**:

```
// serpiente/pruebas/verificación_idioma.zy
descuadres = 0
@ código : lista {
    idioma::fijar(código)
    líneas = [ ... construir el panel en este idioma ... ]
    filas = marco::construir(líneas, 3)
    esperado = txt::ancho(filas[1])
    @ f : filas {
        ? txt::ancho(f) <> esperado { descuadres = descuadres + 1 }
    }
}
```

Un panel bien construido tiene **todas sus filas del mismo ancho en columnas de terminal**. Es un aserto de una línea que atrapa el fallo más caro de un TUI multiidioma, y que sí falla solo.

> Fíjate en que se mide con `txt::ancho`, no con `$#`. Una prueba que mida grafemas daría PASS sobre un panel japonés visiblemente roto.

---

## Sí se puede probar el TUI de verdad

`>>|` se niega a arrancar sin una terminal, y de ahí salió la creencia de que un juego TUI solo se prueba a ojo.

No es cierto. Se abre un **pseudoterminal**, se le fija el tamaño, se le mandan las teclas y se captura la salida; luego se reconstruye la pantalla interpretando las secuencias de posicionamiento sobre una rejilla de filas × columnas. Con eso puedes afirmar «tras pulsar ↓ ↓ ↵, la fila 7 dice *Rápido*» y que sea verdad.

Dos avisos de quien ya se dio con la piedra:

- Al reconstruir la rejilla hay que medir el ancho con las reglas de East Asian Width (W y F ocupan 2 columnas), o los CJK y los emoji te descuadran el volcado y creerás que el fallo es del juego.
- `script -qec` también captura, pero reporta la terminal como 0 × 0 y las coordenadas salen desbordadas. El pty con el tamaño fijado explícitamente es la vía buena.

Es más trabajo que las otras pruebas, y por eso se reserva para lo que solo se puede comprobar así: que los cuatro paneles de Serpiente y los cinco de Hov veS salen bien **en cada idioma**.

---

## Los dos motores

Zymbol tiene dos formas de ejecutar el mismo programa: el tree-walker (por defecto) y la VM de registros (`--vm`, entre 4 y 14 veces más rápida).

Deberían dar el mismo resultado. Cuando no lo dan, es un bug del intérprete — y los tres juegos han encontrado varios así. Por eso las suites se corren **en los dos**:

```bash
# serpiente/pruebas/todas.sh, en esencia
for prueba in pruebas/*.zy; do
    zymbol run       "$prueba"
    zymbol run --vm  "$prueba"
done
```

囲碁 salió primero solo con tree-walker porque `--vm` descartaba en silencio los parámetros de salida de funciones de módulo y no sabía cortar un String dentro de una. Ambos corregidos, y ahora *«las seis suites —y el juego mismo— corren idénticas bajo `zymbol run` y `zymbol run --vm`»*.

Si escribes un juego y solo lo pruebas en un motor, no sabes si funciona: sabes que funciona en uno.

---

## Casos de prueba que se leen a ojo

Un último truco, de 囲碁. Sus casos de reglas se escriben como **diagramas de texto**:

```zymbol
局面 = 図::読図([
    ".OX..",
    "O.OX.",      // negras juegan 7 y capturan la piedra blanca de 8;
    ".OX..",      // blancas no pueden recapturar en 8 — eso es el ko
    ".....",
    "....."
])
```

Un lector (`図.zy`, unas pocas decenas de líneas) convierte esas cadenas en el estado interno del tablero. La ventaja no es escribir menos: es que **un jugador de go puede revisar el caso sin saber programar**, y detectar que el caso de prueba está mal planteado.

Cuando tus datos de prueba tengan forma —un tablero, un mapa, una formación—, escríbelos con esa forma.

---

## El ejemplo de esta lección

[`juegos/ejemplos/08_pruebas.zy`](juegos/ejemplos/08_pruebas.zy) es la puerta de completitud del despachador de la lección 07, entera y funcionando. La ejecutas y **falla**, porque al catálogo inglés le falta `"fin.récord"` a propósito:

```bash
zymbol run juegos/ejemplos/08_pruebas.zy
zymbol run --vm juegos/ejemplos/08_pruebas.zy
```

Añade la clave que falta a [`juegos/ejemplos/idioma/english.zy`](juegos/ejemplos/idioma/english.zy) y vuelve a ejecutarla: eso es el ciclo completo de trabajo con la puerta puesta.

---

## Resumen

| Qué probar | Cómo |
|---|---|
| Reglas, puntuación, azar | Directo: son funciones que devuelven |
| Completitud de traducciones | Catálogo maestro × idiomas, buscando el caso identidad |
| El idioma base | **También** — para eso está el prefijo de dominio |
| Frases compuestas | Con los valores que seleccionan cada rama (`0`, `7`, `1234`, `1`, `12`) |
| Marcos | Todas las filas del mismo `txt::ancho` |
| La pantalla de verdad | Pseudoterminal + reconstrucción de la rejilla |
| Todo lo anterior | En los dos motores, `run` y `run --vm` |

---

Siguiente lección: [09 — Proyecto: Atrapa](juegos/09_proyecto.md)

[← Lección anterior](juegos/07_idiomas.md) · [Índice del nivel](juegos/README.md)
