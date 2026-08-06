# Lección 02 — El bucle de juego

> **Revisado para v0.0.8 — 2026-08-05**

Un juego no es un programa que hace algo y termina. Es un programa que **no termina**: repite el mismo puñado de pasos hasta que alguien decide parar. Esa repetición se llama el *bucle de juego*, y en Zymbol se escribe con `@`.

Lo que hace interesante esta lección no es el bucle en sí — ya sabes escribir `@ { }` desde el nivel básico. Es que un juego de verdad no tiene **un** bucle, sino varios anidados, y necesita salir de cualquiera de ellos desde cualquier profundidad.

---

## Los cinco pasos de un tick

Un *tick* es una vuelta del bucle. Siempre hace lo mismo, en este orden:

```
@ {
    1. leer la entrada        <<|? tecla
    2. actualizar el estado   mover, colisionar, puntuar
    3. comprobar el final     ¿chocó? ¿ganó?
    4. dibujar                >>~ solo lo que cambió
    5. dormir                 @~ retardo
}
```

Cambiar ese orden rompe cosas sutiles. Si dibujas antes de actualizar, la pantalla va un tick por detrás. Si duermes antes de dibujar, el jugador ve el fotograma tarde. Si compruebas el final después de dibujar, se ve un fotograma de la serpiente ya muerta atravesando la pared.

Este es el tick de Serpiente, con las cinco fases marcadas:

```
// serpiente/juego.zy
@:game {
    <<|? tecla                                          // (1)

    ? tecla == 'q' || tecla == 'Q' { @:game! }
    ? tecla <> '\0' { dir = l::nueva_dir(tecla, dir) }

    cola_vieja   = serpiente[serpiente$#]
    comida_vieja = comida

    [vivo, serpiente, puntos, comio] =
        l::mover(serpiente, dir, comida, puntos, AN, AL, crecer)   // (2)

    [comida, fruta, semilla] =
        l::tick_comida(comio, serpiente, AN, AL, semilla, comida, fruta)

    ? !vivo { @:game! }                                 // (3)

    d::dibujar(serpiente, cola_vieja, crecer, comio,
               comida_vieja, comida, fruta, puntos, AN, AL, pos_arroba)   // (4)
    @~ retardo                                          // (5)
}
```

Las dos líneas que guardan `cola_vieja` y `comida_vieja` **antes** de actualizar existen para la fase 4: para borrar lo viejo hay que saber dónde estaba. Es la lección 04, sembrada aquí.

---

## Bucles con nombre — `@:etiqueta`

Un juego tiene, como mínimo, dos bucles anidados:

```
@:main {              // ← una partida tras otra
    // preparar tablero, serpiente, comida...

    @:game {          // ← un tick tras otro
        // el tick de arriba
    }

    // aquí se llega cuando la partida termina:
    // enseñar el marcador y preguntar si otra
}
```

Estando dentro de `@:game`, `@!` sale del bucle *más interno*. Pero cuando la serpiente choca contra la pared, lo que quieres a veces es salir de la partida **y** del juego entero. Para eso los bucles llevan nombre:

| Sintaxis | Qué hace |
|---|---|
| `@:nombre { }` | Declara un bucle con nombre |
| `@:nombre!` | **Rompe** ese bucle — sigue después de su llave de cierre |
| `@:nombre>` | **Continúa** ese bucle — salta a su siguiente vuelta |
| `@!` / `@>` | Lo mismo, sobre el bucle más interno |

El nombre no es decorativo: es lo que te permite saltar dos niveles de golpe sin inventar variables bandera.

```
// sin etiquetas: hay que arrastrar una bandera hasta arriba
salir = #0
@ {
    @ {
        ? condición { salir = #1  @! }
    }
    ? salir { @! }
}

// con etiquetas: se dice lo que se quiere
@:main {
    @:game {
        ? condición { @:main! }
    }
}
```

---

## Los tres finales de una partida

En Serpiente, `@:game` puede terminar por tres motivos distintos, y cada uno usa una salida diferente. Compararlos es la mejor forma de entender las etiquetas:

```
// 1. El jugador pulsa q — se acaba la partida, se va al menú final
? tecla == 'q' || tecla == 'Q' { @:game! }

// 2. La serpiente choca — igual, se acaba la partida
? !vivo { @:game! }

// 3. La terminal cambió de tamaño — la partida NO vale,
//    hay que empezar otra en el tablero nuevo
? filas_act <> ult_filas || cols_act <> ult_cols {
    AN = cols_act - 2
    AL = filas_act - 2
    ...
    @:main>          // ← «vuelve a empezar la vuelta de @:main»
}
```

Los dos primeros salen de `@:game` y caen en el código de después: marcador, menú, «¿otra partida?». El tercero **salta por encima de todo eso** y reinicia `@:main` desde el principio, que es donde se construyen la serpiente y la comida centradas en el nuevo tamaño.

Un `@:game!` en el caso del redimensionado habría enseñado la pantalla de fin de partida con un puntaje que el jugador no perdió. La etiqueta correcta es parte de la corrección del juego, no un detalle de estilo.

---

## Reaccionar al redimensionado

Es lo que separa un juego de terminal decente de uno frágil. La ventana puede cambiar de tamaño en cualquier momento, y `>>?` cuesta muy poco, así que se pregunta **cada tick**:

```
// serpiente/juego.zy
[filas_act, cols_act] = >>?
? filas_act <> ult_filas || cols_act <> ult_cols {
    AN = cols_act - 2
    AL = filas_act - 2
    fila_c = AL / 2 + 1
    col_c  = AN / 2 + 1
    ult_filas = filas_act
    ult_cols  = cols_act
    @:main>
}
```

El patrón tiene tres partes: **guardar** el tamaño anterior (`ult_filas`, `ult_cols`), **comparar** con el actual, y **recalcular todo lo derivado** antes de saltar. Si recalculas `AN` pero olvidas `col_c`, la serpiente aparece descentrada en la partida siguiente.

---

## El menú también es un bucle

Un menú no es una pantalla: es un bucle que dibuja, espera una tecla bloqueante, y decide si repetir o salir. Este es el de Serpiente, resumido:

```
// serpiente/dibujo.zy — menu_velocidad
sel = 1
retardos = [160, 130, 100, 70, 40]

@:sel {
    // ... construir y pintar el menú con `sel` resaltada ...

    <<| tecla                                   // bloqueante: aquí no corre el tiempo

    ? tecla == '↑' { sel = sel - 1  ? sel < 1 { sel = 5 } }
    ? tecla == '↓' { sel = sel + 1  ? sel > 5 { sel = 1 } }
    ? tecla == '\n' { @:sel! }
    ? tecla == 'l' || tecla == 'L' { idioma::rotar() }
}

<~ retardos[sel]
```

Tres detalles que valen para cualquier menú que escribas:

1. **`<<|` bloqueante, no `<<|?`.** En un menú no pasa nada mientras el jugador piensa, así que no hay ninguna razón para girar en vacío quemando CPU.
2. **La selección da la vuelta.** `? sel < 1 { sel = 5 }` — subir desde la primera opción lleva a la última. Cuesta una línea y se nota mucho.
3. **El menú devuelve un valor.** No cambia una variable global ni dibuja el juego: calcula `retardos[sel]` y lo devuelve. Quien lo llamó decide qué hacer con eso.

---

## Cuándo *no* usar un bucle infinito

`@ { }` sin condición gira para siempre y solo sale con un `@!`. Es lo correcto para el bucle de juego, donde el final depende de un choque o de una tecla.

No lo es para todo lo demás. Serpiente usa las tres formas según lo que sepa de antemano:

```
// sé exactamente cuántas: bucle de rango
i = 1
@ i <= 5 {
    fila = marco::fila_menú(i, etiquetas[i], i == sel)
    ...
    i++
}

// tengo la lista delante: para cada uno
@ l : líneas {
    ? l <> SEPARADOR { ... }
}

// no sé cuándo acaba: infinito con salida explícita
@:game {
    ...
    ? !vivo { @:game! }
}
```

---

## El ejemplo de esta lección

[`juegos/ejemplos/02_bucle.zy`](juegos/ejemplos/02_bucle.zy) es un juego de reflejos completo en 70 líneas: aparece un `●` en un sitio al azar, tienes que pulsar la tecla de su columna antes de que se acabe el tiempo. Tiene los dos bucles anidados (`@:partida` y `@:ronda`), reacciona al redimensionado y pregunta si quieres otra.

```bash
zymbol run juegos/ejemplos/02_bucle.zy
```

Léelo buscando las cinco fases del tick y las tres salidas de bucle. Están todas.

---

## Resumen

| Concepto | Forma |
|---|---|
| Bucle de juego | `@:game { leer · actualizar · comprobar · dibujar · dormir }` |
| Salir de un bucle concreto | `@:nombre!` |
| Reiniciar un bucle exterior | `@:nombre>` |
| Partida tras partida | `@:main { @:game { } · marcador · ¿otra? }` |
| Redimensionado | `>>?` cada tick, recalcular lo derivado, `@:main>` |
| Menú | Bucle con `<<\|` bloqueante que **devuelve** la elección |

---

Siguiente lección: [03 — El estado del juego](juegos/03_estado.md)

[← Lección anterior](juegos/01_lienzo.md) · [Índice del nivel](juegos/README.md)
