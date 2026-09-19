# Lección 05 — Azar reproducible

> **Revisado para v0.0.8 — 2026-08-05**

Un juego sin azar es un juego que se juega una vez. La comida tiene que aparecer en un sitio distinto cada partida, y los enemigos tienen que decidir cuándo lanzarse en picado.

Pero «al azar» esconde dos exigencias que tiran en direcciones opuestas: que **no sea igual cada vez que arrancas**, y que **sí sea igual cuando quieres reproducir un fallo**. Esta lección es sobre cómo se consiguen las dos a la vez.

---

## La forma fácil: `std/random`

Para la mayoría de los programas, esto es todo lo que necesitas:

```
<# std/random => azar

dado   = azar::entero(1, 6)
indice = azar::rango(10)          // entre 0 y 9
```

Es cómodo, y para un juego pequeño está bien. Tiene un problema: **no puedes reproducir una partida**. Si el jugador te dice «la comida apareció dentro de la serpiente», no tienes forma de volver a ver esa partida.

Los tres juegos de este nivel no lo usan. Usan un generador escrito en Zymbol, con la semilla a la vista.

---

## Un generador en 3 líneas: el LCG

Un *generador congruencial lineal* es la forma más simple de generador pseudoaleatorio útil. Cabe en una línea:

```
// serpiente/logica.zy
lcg_sig(semilla) {
    <~ (1664525 * semilla + 1013904223) % 2147483647
}
```

Multiplica, suma, saca el resto. Con las constantes correctas —estas son las de *Numerical Recipes*— la secuencia recorre un ciclo larguísimo antes de repetirse, y los números salen razonablemente bien repartidos.

No sirve para criptografía. Sirve perfectamente para decidir dónde cae una manzana.

Encima se construye lo demás:

```
// entero en [min, max] — devuelve (valor, semilla_siguiente)
rango_aleatorio(semilla, min, max) {
    sig = lcg_sig(semilla)
    val = sig % (max - min + 1) + min
    <~ (val, sig)
}

// un emoji de fruta al azar
fruta_aleatoria(semilla) {
    frutas = ["🍎", "🍊", "🍋", "🍇", "🍓", "🫐", "🍑", "🥝", "🍒", "🍉"]
    (ind, s1) = rango_aleatorio(semilla, 1, 10)
    <~ (frutas[ind], s1)
}
```

Hov veS usa exactamente las mismas constantes que Serpiente. No es pereza: es que dos juegos que comparten generador se pueden comparar.

---

## La regla de oro: la semilla siempre vuelve

Mira otra vez las firmas. **Toda función que use azar devuelve la semilla avanzada**, y quien la llama tiene que guardarla:

```
(comida, semilla) = l::nueva_comida(serpiente, AN, AL, semilla)
(fruta,  semilla) = l::fruta_aleatoria(semilla)
```

Si te olvidas de recoger `semilla`, el generador se queda clavado y la siguiente llamada devuelve el mismo número. Es un fallo que no da error: simplemente la comida siempre aparece en el mismo sitio.

Con las funciones aisladas de Zymbol esto no es una convención que puedas romper por descuido: la semilla **tiene** que entrar por parámetro y salir por retorno, porque no hay ningún otro camino. El lenguaje te obliga a hacerlo bien.

> Compáralo con `azar::entero(1, 6)`, donde la semilla vive escondida dentro del módulo. Es más corto de escribir y por eso mismo no puedes ni guardarla ni reponerla.

---

## Sembrar: de dónde sale el primer número

Un LCG con la misma semilla da siempre la misma secuencia. Eso es justo lo que queremos para reproducir — y justo lo que no queremos al arrancar.

La semilla inicial tiene que venir de fuera del programa. Serpiente la saca de **tres fuentes de entropía independientes**, con el operador de shell:

```
// serpiente/juego.zy
_ns  = <\ "date +%N" \>                                       // nanosegundos del reloj
_pid = <\ "echo $$" \>                                        // id del proceso
_rnd = <\ "od -An -N2 -tu2 /dev/urandom | tr -d ' \n'" \>      // 2 bytes del generador del sistema

semilla = (#|_ns| + #|_pid| * 31337 + #|_rnd| * 65537) % 2147483647
```

Tres detalles que valen la pena:

1. **`<\ cmd \>` devuelve texto**, así que hace falta `#|…|` para convertirlo a número.
2. **Tres fuentes, no una.** Los nanosegundos solos bastarían casi siempre; el PID y `/dev/urandom` cubren el caso de dos procesos arrancados en el mismo instante.
3. **Los multiplicadores primos** (31337, 65537) impiden que las tres fuentes se cancelen entre sí al sumarlas.

Y una decisión de diseño que es la verdadera lección:

> **Una sola llamada al shell, al arrancar.** A partir de ahí, todo el azar es Zymbol puro. Un `<\ \>` por tick significaría lanzar un proceso sesenta veces por minuto, y un juego a 40 ms no se lo puede permitir.

Serpiente lo dice en la cabecera de `logica.zy`:

> *«Aleatorio: LCG (Numerical Recipes) implementado en Zymbol puro. La semilla se pasa explícitamente entre llamadores — sin estado oculto. Una llamada BashExec al inicio produce la semilla inicial.»*

---

## Lo que compra ser reproducible

Con la semilla a la vista, dos cosas se vuelven posibles:

**Reproducir una partida.** Cambia la línea de sembrado por `semilla = 12345` y la partida es idéntica cada vez que la ejecutas: la misma comida en los mismos sitios, en el mismo orden. Es la única forma sensata de perseguir un bug que aparece «a veces».

**Medir de verdad.** 囲碁 tiene un banco de pruebas (`棋戦.zy`) que enfrenta a la IA contra sí misma cientos de veces, y su README puede decir *«400 partidas: Principiante pierde el 90 % contra los otros dos niveles»* porque cada partida es repetible. Con `std/random` ese número no significaría nada — no habría forma de volver a jugar la tanda.

---

## Azar que no debe ser uniforme

Un detalle de diseño de juego, no de lenguaje. `rango_aleatorio` reparte igual, pero casi nunca es lo que quieres.

Cuando Serpiente busca sitio para la comida, tiene que evitar la serpiente:

```
// serpiente/logica.zy
nueva_comida(serpiente, AN, AL, semilla) {
    (r, s1) = rango_aleatorio(semilla, 2, AL + 1)
    (c, s2) = rango_aleatorio(s1,     2, AN)
    pos = (r, c)
    ? _en_serpiente(serpiente, pos) {
        (r, s1) = rango_aleatorio(s2, 2, AL + 1)
        (c, s2) = rango_aleatorio(s1, 2, AN)
        pos = (r, c)
    }
    <~ (pos, s2)
}
```

**Un solo reintento**, no un bucle hasta encontrar hueco. Es una decisión deliberada: con una serpiente normal la probabilidad de fallar dos veces seguidas es minúscula, y un bucle `@` sobre un tablero casi lleno podría no terminar nunca. El juego prefiere un fallo rarísimo y visible a un cuelgue.

Fíjate también en el rango de la columna: `rango_aleatorio(s1, 2, AN)`, no `AN + 1`. El comentario del archivo lo explica: *«el emoji ocupa 2 cols, la última col válida es AN»*. Un rango que parece descuadrado por uno y no lo está.

Y en Hov veS el azar está **ponderado por la oleada**: la probabilidad de que un enemigo dispare sube con el número de oleada. El azar no es solo variedad — es dificultad.

---

## El ejemplo de esta lección

[`juegos/ejemplos/05_azar.zy`](juegos/ejemplos/05_azar.zy) no dibuja: imprime. Muestra la misma secuencia saliendo dos veces de la misma semilla, la diferencia al sembrar desde el reloj, un histograma que enseña si el reparto es decente, y el reintento de `nueva_comida`.

```bash
zymbol run juegos/ejemplos/05_azar.zy
zymbol run juegos/ejemplos/05_azar.zy    # las secciones sembradas a mano salen idénticas
```

---

## Resumen

| Idea | Forma |
|---|---|
| Generador | `(1664525 * s + 1013904223) % 2147483647` |
| Contrato | Toda función con azar devuelve `(valor, semilla_siguiente)` |
| Sembrar | Una sola llamada `<\ cmd \>` al arrancar, tres fuentes |
| Convertir texto a número | `#\|texto\|` |
| Reproducir una partida | Fijar la semilla a mano |
| Evitar cuelgues | Reintento acotado, nunca un bucle abierto |

---

Siguiente lección: [06 — Marcos que se miden](juegos/06_marcos.md)

[← Lección anterior](juegos/04_dibujo.md) · [Índice del nivel](juegos/README.md)
