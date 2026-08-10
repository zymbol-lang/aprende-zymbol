# Aprende Zymbol — Nivel Juegos

> **Revisado para v0.0.8 — 2026-08-05**

Los tres niveles anteriores te enseñaron el lenguaje. Este te enseña a **construir algo con él**.

El objeto de estudio es un juego de terminal. No porque hacer juegos sea el destino natural de Zymbol, sino porque un juego obliga a resolver, todos a la vez, los problemas que un programa de ejercicio nunca plantea: hay que dibujar en una pantalla cuyo tamaño no controlas, reaccionar a un teclado que no espera, mantener un estado que cambia sesenta veces por minuto sin ensuciar el resto del programa, y hacerlo lo bastante rápido como para que se note fluido.

---

## De dónde sale el código de este nivel

Todo lo que vas a leer aquí es código **real, publicado y en funcionamiento**. No hay fragmentos inventados para la ocasión.

| Proyecto | Idioma del código | Qué aporta a este nivel | Pruébalo |
|---|---|---|---|
| **[Serpiente](https://github.com/zymbol-lang/zySerpiente)** | español | La espina dorsal. Casi todo el código que leerás sale de aquí | [▶ Abrir](https://zymbol-lang.org/playground.html?open=games/arcade/serpiente.zyp) |
| **[Hov veS](https://github.com/zymbol-lang/zyKlingonGalaxy)** | klingon (pIqaD) | Estado de sesión con `°`, catálogo i18n con cifras propias | [▶ Abrir](https://zymbol-lang.org/playground.html?open=games/arcade/klingon_galaxy.zyp) |
| **[囲碁 (zy-GO)](https://github.com/zymbol-lang/zy-GO)** | japonés | Parámetros de salida `fn(x<~)`, recursión sobre grafos, 5 idiomas | [▶ Abrir](https://zymbol-lang.org/playground.html?open=games/classic/go.zyp) |

Serpiente lleva la voz cantante por una razón práctica: **está escrito íntegramente en español**, igual que este curso. Cuando leas `mover(serpiente, dir, comida, puntos, AN, AL, crecer)` no estarás traduciendo mentalmente nada — es el mismo idioma en el que estás aprendiendo.

Los otros dos aparecen solo en recuadros cortos, donde hacen algo que Serpiente no hace.

> **Un aviso honesto sobre estos ejemplos.** El código real no siempre es el código bonito. Verás nombres cortos (`AN`, `AL`), verás una función `_en_serpiente` que recorre un array con un `while` en vez de usar `$?`, y verás comentarios que explican por qué algo *no* se hizo de la forma obvia. Eso es parte de la lección: un programa que corre en producción tiene cicatrices, y saber leerlas vale más que ver diez ejemplos perfectos.

---

## Lo que necesitas antes de empezar

- Los tres niveles anteriores, en particular **módulos** (intermedio 08) y **tuplas** (intermedio 01).
- El intérprete **v0.0.8 o posterior** — las lecciones 06, 07 y 08 dependen de `std/term`, que no existe antes.
- Una terminal de verdad. Los operadores de este nivel se niegan a arrancar si la salida está redirigida a un archivo, y tienen razón: no hay nada que dibujar.

```bash
zymbol --version    # debe decir 0.0.8 o superior
```

---

## Lecciones

| # | Lección | Qué aprenderás |
|---|---------|----------------|
| [01](juegos/01_lienzo.md) | La terminal como lienzo | `>>\|`, `>>!`, `>>?`, `>>~`, `<<\|`, `<<\|?`, `@~` |
| [02](juegos/02_bucle.md) | El bucle de juego | `@:etiqueta`, reinicio y salida, qué hacer con un redimensionado |
| [03](juegos/03_estado.md) | El estado del juego | Funciones aisladas, tuplas de retorno, `fn(x<~)`, `°var` |
| [04](juegos/04_dibujo.md) | Dibujar solo lo que cambió | Delta rendering: por qué no se borra la pantalla cada tick |
| [05](juegos/05_azar.md) | Azar reproducible | LCG en Zymbol puro, semilla por entropía, `<\ cmd \>` |
| [06](juegos/06_marcos.md) | Marcos que se miden | `std/term`, por qué `$#` no sirve para maquetar |
| [07](juegos/07_idiomas.md) | Un juego en varios idiomas | Despachador, estado de módulo, claves con prefijo de dominio |
| [08](juegos/08_pruebas.md) | La puerta de completitud | Probar un TUI, verificar traducciones, los dos motores |
| [09](juegos/09_proyecto.md) | Proyecto: Atrapa | Un juego completo, en dos idiomas, de principio a fin |

---

## El hilo conductor

Las ocho primeras lecciones desmontan un juego que ya existe. La novena te hace montar uno.

```
01 lienzo ─┐
02 bucle  ─┤
03 estado ─┼─→ 09 Atrapa — tu propio juego, cuatro módulos,
04 dibujo ─┤        dos idiomas, marcos medidos y pruebas
05 azar   ─┤
06 marcos ─┤
07 idiomas─┤
08 pruebas─┘
```

Cada lección incluye un ejemplo ejecutable en [`juegos/ejemplos/`](https://github.com/zymbol-lang/aprende-zymbol/tree/main/juegos/ejemplos). Los de las lecciones 01–07 son programas de una sola pantalla que aíslan un mecanismo; el de la 09 es el juego entero.

Este nivel no tiene una página de ejercicios aparte: sus ejercicios son [siete formas de ampliar Atrapa](juegos/09_proyecto.md#ahora-te-toca), una por cada lección del nivel, al final del proyecto final.

---

Empieza por la [Lección 01 — La terminal como lienzo](juegos/01_lienzo.md).

[← Nivel Avanzado](avanzado/README.md) · [Índice general](README.md)
