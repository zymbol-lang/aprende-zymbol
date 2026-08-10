# Lección 09 — Proyecto: Atrapa

> **Revisado para v0.0.8 — 2026-08-05**

Las ocho lecciones anteriores desmontaron juegos que ya existían. Esta monta uno.

**Atrapa** es un juego completo: mueves una cesta por el borde inferior, atrapas lo bueno que cae (`●`), esquivas lo malo (`✖`). Tres vidas, cuatro velocidades, dos idiomas, cuatro pantallas y dos suites de pruebas que corren en los dos motores.

```bash
zymbol run juegos/ejemplos/atrapa/atrapa.zy     # español
zymbol run juegos/ejemplos/atrapa/catch.zy      # inglés
bash juegos/ejemplos/atrapa/pruebas/todas.sh    # las pruebas, en los dos motores
```

Cabe en unas 600 líneas repartidas en nueve archivos, y usa **todo** lo del nivel.

---

## La estructura

```
atrapa/
├── atrapa.zy       punto de entrada — preselecciona español   ┐ el mismo juego,
├── catch.zy        punto de entrada — preselecciona inglés    ┘ otro idioma inicial
├── juego.zy        el bucle: semilla, dimensiones, @:main y @:game
├── logica.zy       azar, caída, choques — no dibuja nada
├── dibujo.zy       todo el output: tablero, piezas, menús, paneles
├── marco.zy        paneles construidos midiendo el contenido
├── texto.zy        capa en español sobre std/term
├── idioma/
│   ├── despacho.zy despachador — guarda el idioma como estado de módulo
│   ├── español.zy  idioma base: de aquí salen las claves
│   └── english.zy  inglés
└── pruebas/
    ├── reglas.zy       las reglas del juego, 30 asertos
    ├── verificación.zy la puerta de completitud i18n + los marcos
    └── todas.sh        corre todo en los dos motores
```

Es la misma estructura de Serpiente, con los mismos nombres, a propósito. Cuando abras el repositorio de Serpiente sabrás dónde está cada cosa.

### La regla que ordena los archivos

> `logica.zy` **no sabe dibujar**. `dibujo.zy` **no sabe las reglas**. `juego.zy` es el único que conoce a los dos.

De ahí salen dos propiedades que valen mucho:

- `logica.zy` se puede probar entero sin abrir una terminal, porque todas sus funciones reciben estado y devuelven estado. Son los 30 asertos de `pruebas/reglas.zy`.
- `dibujo.zy` se puede traducir sin tocar una regla, porque no tiene ninguna.

---

## Dónde aparece cada lección

| Lección | En Atrapa |
|---|---|
| 01 lienzo | `>>?` deriva `AN`/`AL`; `>>~` para todo; `<<\|?` en el juego y `<<\|` en los menús; `@~ retardo` |
| 02 bucle | `@:main` (partida tras partida) y `@:game` (tick tras tick), con sus tres salidas |
| 03 estado | Tuplas de retorno en `caer`; `°partidas` y `°marcadores` para la sesión; el idioma como estado de módulo |
| 04 dibujo | `caídas` viaja desde `logica` hasta `dibujo` solo para poder borrar |
| 05 azar | LCG, semilla de tres fuentes, una sola llamada al shell |
| 06 marcos | `texto.zy` + `marco.zy`; ningún ancho tecleado |
| 07 idiomas | Despachador, claves con prefijo de dominio, dos frases compuestas |
| 08 pruebas | Dos suites, los dos motores, la puerta de completitud |

---

## Los tres momentos donde se decidió algo

Leer el código terminado no enseña tanto como saber qué se decidió por el camino. Estos tres son reales — se decidieron construyéndolo.

### 1. El juego tenía que poder perderse

La primera versión daba puntos por atrapar lo bueno y quitaba vida por atrapar lo malo. Sonaba razonable, y era un juego roto: **quien no movía la cesta no perdía nunca**.

```
// logica.zy
} _ {
    // Dejar caer una buena SÍ cuesta vida. Sin esto el juego no
    // tiene final: quien no mueve la cesta no pierde nunca, y un
    // juego que no se puede perder tampoco se puede ganar.
    ? tipo == BUENA { vidas = vidas - 1 }
}
```

No es una regla de programación, es de diseño de juego, y no la habría encontrado leyendo el código: apareció al jugarlo.

### 2. Las piezas no pisan la fila de la cesta

La cesta se dibujaba `╰` en vez de `╰─╯`. La causa tardó un rato:

Cada pieza apunta su posición vieja en `caídas` para que `dibujo.zy` la borre. Una pieza que llegaba a la fila de la cesta apuntaba **esa** celda, y el borrado se comía dos tercios de la cesta.

La corrección no fue un caso especial en el dibujo, sino una regla en la lógica:

```
// La cesta vive en la fila AL+1, así que una pieza que llega a esa
// fila se resuelve y NO se dibuja nunca ahí.
? nf >= AL + 1 {
```

Es la forma buena de arreglar un bug de dibujo: cambiar el estado para que la situación mala no exista, en vez de dibujar alrededor de ella.

### 3. Los corchetes del marcador se quedaban por ahí

`_marcador` dibuja `┤ ✦ PUNTOS 7 ✦ ├` centrado sobre el borde superior. Cuando el puntaje pasó de 9 a 10 la insignia creció, se recentró… y el `┤` de la posición anterior siguió en pantalla.

```
// Repintar antes un tramo de borde más ancho que la insignia:
// cuando el puntaje pasa de 9 a 10 la insignia crece y los
// corchetes viejos se quedarían por ahí.
limpio = ancho + 8
>>~ (1, col - 4, 0, BORDE) > ("─" $* limpio)
```

Es el delta rendering mordiendo: **si lo que dibujas cambia de tamaño, borrar «lo de antes» no es borrar la misma celda**.

---

## El hallazgo que se llevó el proyecto

Y uno que no es de Atrapa sino del lenguaje. `pruebas/reglas.zy` pasaba 30/30 con el tree-walker y 25/30 con `--vm`. Los cinco fallos eran todos así:

```
FALLA baja una fila   esperado: [(6, 10, 1)]   real: [(6, 10, 1)]
```

Esperado y real **idénticos**, y aun así el aserto fallaba. La causa, reducida al mínimo:

```
a = [1, 2, 3]
b = [1, 2, 3]
>> (a == b) ¶      // tree-walker → #1     ·     --vm → #0
>> ([] == []) ¶    // tree-walker → #1     ·     --vm → #0
>> ((1,2) == (1,2)) ¶   // los dos → #1
```

**`==` sobre dos arrays no significa lo mismo en los dos motores de Zymbol 0.0.8.** Las tuplas sí se comparan bien en ambos, así que la suite compara los arrays elemento a elemento:

```
iguales(a, b) {
    ? (a$#) <> (b$#) { <~ #0 }
    i = 1
    @ i <= (a$#) {
        ? a[i] <> b[i] { <~ #0 }
        i++
    }
    <~ #1
}
```

Esto es la lección 08 cobrándose su precio en directo: si las pruebas de Atrapa solo se hubieran corrido en el motor por defecto, el juego se habría publicado con una divergencia dentro. **Correr los dos motores no es rigor decorativo.**

---

## Ahora te toca

El juego está terminado y funciona. Estas siete cosas no están, y cada una toca exactamente una lección del nivel:

| Añade | Toca la lección |
|---|---|
| Un tercer idioma (japonés, portugués, el que hables) | 07 — tres ediciones, ni una en `dibujo.zy` |
| Que la dificultad suba sola cada 100 puntos | 02 — el retardo deja de ser constante |
| Piezas de varios valores (`●` 10, `◆` 50, `★` 200) | 03 — el tipo deja de ser un booleano disfrazado |
| Un `▓▓▓` de tres columnas que caiga y haya que esquivar | 04 — borrar tres columnas, no una |
| Guardar el récord entre ejecuciones con `std/io` | intermedio 09 — el récord deja de morir con la sesión |
| Que las piezas caigan en diagonal | 05 — una dirección más que sortear |
| Una prueba que compruebe que ninguna pieza aparece fuera del tablero | 08 — 2000 tiradas, cero fuera de rango |

Y una que vale por todas: **coge el juego, quítale `texto.zy` y `marco.zy`, y teclea los anchos a mano**. Tradúcelo después. Verás en dos minutos por qué existe la lección 06.

---

## Qué hacer con esto

Cuando termines de romper Atrapa, los tres proyectos de verdad te esperan, y ya sabes leerlos:

- **[Serpiente](https://github.com/zymbol-lang/zySerpiente)** — el mismo esqueleto que acabas de estudiar, con delta rendering de verdad y su registro de hallazgos. [Pruébalo aquí →](https://zymbol-lang.org/playground.html?open=games/arcade/serpiente.zyp)
- **[Hov veS](https://github.com/zymbol-lang/zyKlingonGalaxy)** — orquestación de cinco módulos, IA de formación, dos sistemas de proyectiles. [Pruébalo aquí →](https://zymbol-lang.org/playground.html?open=games/arcade/klingon_galaxy.zyp)
- **[囲碁](https://github.com/zymbol-lang/zy-GO)** — 361 puntos de estado, recorrido recursivo de grafos, IA por capas y cinco idiomas. [Pruébalo aquí →](https://zymbol-lang.org/playground.html?open=games/classic/go.zyp)

Los tres tienen un archivo de hallazgos donde está anotado lo que se rompió y por qué. Es la parte que casi ningún proyecto publica y la que más se aprende leyendo.

---

## Resumen del nivel

| Lo que sabes hacer ahora |
|---|
| Dibujar en una terminal cuyo tamaño no controlas |
| Escribir un bucle de juego con sus cinco fases y sus salidas |
| Mantener estado sin una sola variable global |
| Dibujar solo lo que cambió, y saber cuándo no vale la pena |
| Producir azar reproducible con la semilla a la vista |
| Construir paneles que cuadran en cualquier idioma |
| Traducir un juego entero sin tocar el código de dibujo |
| Probar todo lo anterior, en los dos motores |

---

[← Lección anterior](juegos/08_pruebas.md) · [Índice del nivel](juegos/README.md) · [Índice general](README.md)
