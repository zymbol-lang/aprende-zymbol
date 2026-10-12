# Lección 01 — La terminal como lienzo

> **Revisado para v0.0.8 — 2026-08-05**

Hasta ahora tu salida ha sido una cinta: `>>` escribe una línea, baja, escribe la siguiente. La terminal parecía una impresora.

No lo es. Es una **rejilla de celdas** con filas y columnas, y puedes escribir en cualquiera de ellas, en cualquier orden, cuantas veces quieras. Esta lección cambia tu forma de ver la pantalla.

---

## El bloque TUI — `>>|`

Una terminal en su estado normal hace tres cosas que estorban a un juego: hace scroll cuando llegas abajo, espera a que pulses `↵` para entregarte lo que escribiste, y dibuja un cursor parpadeante en medio de tu tablero.

`>>|` abre un **bloque TUI** que apaga las tres:

```
>>| {
    // aquí dentro la terminal es tuya
}
// al salir del bloque, la terminal queda como estaba
```

Tres cosas ocurren al entrar:

| Qué | Para qué |
|---|---|
| **Pantalla alterna** | El juego dibuja en una pantalla aparte; al salir reaparece tu shell con su historial intacto |
| **Modo crudo** (*raw mode*) | Las teclas llegan a tu programa en el instante en que se pulsan, sin esperar `↵` |
| **Cursor oculto** | Deja de parpadear encima de tu dibujo |

Y — esto es lo importante — **las tres se deshacen solas al salir del bloque**, incluso si el programa termina por un error. No existe el juego que se cuelga y te deja la terminal inservible.

> ⚠️ `>>|` **falla si no hay una terminal de verdad**. Si rediriges la salida a un archivo (`zymbol run juego.zy > salida.txt`), no arranca. Es lo correcto: no hay nada que dibujar en un archivo.

---

## Limpiar y medir — `>>!` y `>>?`

```
>>!            // borra la pantalla y lleva el cursor a la celda (1, 1)
```

```
(filas, cols) = >>?
>> "Tu terminal mide {filas} filas por {cols} columnas" ¶
```

`>>?` es el operador que separa un juego que se adapta de uno que asume. Serpiente lo usa en la primera línea de su bucle para derivar el tamaño del tablero a partir del tamaño real de la ventana:

```
// serpiente/juego.zy
(filas, cols) = >>?
AN = cols  - 2      // ancho interior: la terminal menos las dos columnas del marco
AL = filas - 2      // alto  interior: la terminal menos las dos filas del marco
```

`AN` y `AL` viajan después como parámetros a casi todas las funciones del juego. **Ningún ancho está tecleado en el programa** — todo se deriva de esas dos líneas.

> **Cuando no hay terminal que medir.** Si la salida está redirigida o el programa corre dentro de un contenedor, `>>?` devuelve `[24, 80]` en vez de fallar — el tamaño clásico. Así un programa que se maqueta con `>>?` sigue funcionando cuando lo canalizas a un archivo; simplemente se maqueta para 80 columnas.

Tanto `>>!` como `>>?` funcionan **fuera** de un bloque `>>|`. Los demás operadores de esta lección, no.

---

## Escribir en una celda concreta — `>>~`

Este es el operador central del nivel. Coloca texto en una posición exacta, con color y estilo:

```
>>~ (fila, columna, estilo, color_texto, color_fondo) > "lo que sea"
```

```
>>| {
    >>!
    >>~ (1, 1)  > "esquina superior izquierda"
    >>~ (5, 20) > "fila 5, columna 20"
    >>~ (10, 1, 0, 196) > "esto sale en rojo"
    <<| _pausa
}
```

Las cinco ranuras de la tupla:

| Ranura | Significado | Valores |
|---|---|---|
| 1 | fila | 1 = la de arriba |
| 2 | columna | 1 = la de la izquierda |
| 3 | estilo | Suma de negrita (1), cursiva (2), subrayado (4). `0` = ninguno |
| 4 | color del texto | Índice ANSI 0–255. `0` = el color por defecto de la terminal |
| 5 | color del fondo | Índice ANSI 0–255 |

**No hace falta escribirlas todas.** Puedes cortar por la derecha, o dejar huecos con comas:

```
>>~ (3, 1) > "solo posición"
>>~ (,,, 196) > "solo color, sin mover el cursor"
>>~ (1,, 1) > "negrita en la fila 1, la columna se queda donde estaba"
```

Y la posición puede venir de una variable, que es lo que hace útil el operador dentro de un bucle:

```
pos = (10, 5)
>>~ pos > "▲"
```

### Los colores como constantes con nombre

Serpiente no escribe `>>~ (f, c, 0, 10) > "─"` por ahí suelto. Declara los índices ANSI una sola vez, arriba del módulo de dibujo:

```
// serpiente/dibujo.zy
BORDE  := 8    // gris oscuro  — paredes del borde
VERDE  := 10   // verde claro  — cuerpo de la serpiente
CABEZA := 2    // verde oscuro — cabeza de la serpiente
COMIDA := 11   // amarillo     — comida / acento marcador
ROJO   := 9    // rojo vivo    — fin de juego / infernal
TEXTO  := 15   // blanco       — texto general
```

Son constantes (`:=`), así que son visibles desde cualquier función del módulo sin pasarlas como parámetro. Cambiar el color del cuerpo de la serpiente en todo el juego es cambiar el número de una línea.

---

## Leer el teclado — `<<|` y `<<|?`

Dentro de un bloque `>>|` hay dos formas de leer una tecla, y la diferencia entre ellas define el género del juego que estás escribiendo.

### `<<|` — bloqueante: el juego espera

```
<<| tecla
```

El programa **se detiene** hasta que se pulse algo. Es lo que quieres en un menú, en una pausa, o en un juego por turnos: mientras el jugador piensa, no pasa nada.

囲碁 usa solo esta forma, y lo dice en su documentación: *«lectura de tecla bloqueante — el juego es por turnos, no en tiempo real»*. Un tablero de go no cambia mientras nadie juega.

### `<<|?` — no bloqueante: el juego sigue

```
<<|? tecla
? tecla <> '\0' {
    // se pulsó algo
}
```

Mira si hay una tecla pendiente y **sigue de largo** si no la hay, dejando `'\0'` en la variable. Es lo que quieres en un juego en tiempo real: la serpiente avanza aunque tú no toques nada.

```
// serpiente/juego.zy — el primer gesto de cada tick
@:game {
    <<|? tecla
    ...
    ? tecla <> '\0' {
        dir = l::nueva_dir(tecla, dir)
    }
```

Fíjate en el orden: la tecla no mueve la serpiente, **cambia su dirección**. El movimiento ocurre después, todos los ticks, con o sin tecla. Esa separación entre «lo que el jugador pide» y «lo que el mundo hace» es la estructura básica de un juego en tiempo real.

### Las teclas especiales

Las flechas llegan como **los propios glifos de flecha**, no como letras:

| Tecla | Valor |
|---|---|
| ↑ ↓ ← → | `'↑'` `'↓'` `'←'` `'→'` |
| Enter | `'\n'` |
| Escape | `'\x1b'` |
| Cualquier otra | el carácter tal cual |

Se comparan directamente, y eso deja **todas las letras libres** para comandos:

```
// serpiente/logica.zy — WASD y flechas, indistintamente
? tecla == 'w' || tecla == '↑' { nueva = '↑' }
? tecla == 's' || tecla == '↓' { nueva = '↓' }
? tecla == 'a' || tecla == '←' { nueva = '←' }
? tecla == 'd' || tecla == '→' { nueva = '→' }
```

> **Ojo con las mayúsculas.** En modo crudo, `q` y `Q` son teclas distintas. Si sales del juego con `q`, alguien con el bloqueo de mayúsculas puesto no podrá salir. Serpiente comprueba las dos: `? tecla == 'q' || tecla == 'Q' { @:game! }`.

---

## Controlar la velocidad — `@~`

```
@~ 130      // duerme 130 milisegundos
```

En un juego en tiempo real, esto **es** la velocidad. El bucle de Serpiente hace su trabajo y luego duerme; cuanto menos duerme, más rápido va la serpiente:

```
// serpiente/dibujo.zy — el menú de velocidad es una lista de milisegundos
retardos = [160, 130, 100, 70, 40]
```

| Retardo | Etiqueta en el juego |
|---|---|
| 160 ms | Lento |
| 130 ms | Normal |
| 100 ms | Rápido |
| 70 ms | Infernal |
| 40 ms | Demencial |

Elegir la dificultad de Serpiente es elegir el argumento de un `@~`. No hay más.

---

## Todo junto

Un programa mínimo que usa los seis operadores: mide la terminal, dibuja un marco, mueve un `▲` con las flechas y sale con `q`.

```
>>!
(filas, cols) = >>?

>>| {
    // marco
    i = 1
    @ i <= cols {
        >>~ (1, i, 0, 8) > "─"
        >>~ (filas, i, 0, 8) > "─"
        i++
    }

    f = filas / 2
    c = cols / 2

    @:juego {
        <<|? tecla

        ? tecla == 'q' || tecla == 'Q' { @:juego! }

        // borra la posición vieja antes de calcular la nueva
        >>~ (f, c) > " "

        ? tecla == '↑' && f > 2       { f = f - 1 }
        ? tecla == '↓' && f < filas-1 { f = f + 1 }
        ? tecla == '←' && c > 1       { c = c - 1 }
        ? tecla == '→' && c < cols    { c = c + 1 }

        >>~ (f, c, 0, 10) > "▲"
        >>~ (1, 3, 0, 15) > " fila {f} col {c} — q para salir "

        @~ 60
    }
}

>> "Terminal restaurada." ¶
```

El ejemplo completo y comentado está en [`juegos/ejemplos/01_lienzo.zy`](juegos/ejemplos/01_lienzo.zy):

```bash
zymbol run juegos/ejemplos/01_lienzo.zy
```

Fíjate en una línea concreta: `>>~ (f, c) > " "` **antes** de mover. Si no borras donde estabas, dejas un rastro. Ese detalle — borrar lo viejo y dibujar lo nuevo, en vez de repintar la pantalla entera — es la lección 04 completa, y aquí ya lo has hecho sin querer.

> ⚠️ **`>>|` es un bloque, y los bloques tienen su propio alcance.** Una variable creada dentro del bloque TUI **muere al salir de él**. Si quieres enseñar el marcador final cuando el juego termina, declara la variable *antes* del `>>|`:
>
> ```
> pasos = 0            // ✓ vive fuera del bloque
> >>| {
>     pasos = pasos + 1
> }
> >> "Diste {pasos} pasos" ¶
> ```
>
> Y ten cuidado con el fallo silencioso: si la variable no existe, la interpolación **no da error** — imprime `{pasos}` tal cual, con las llaves. Un marcador que sale con llaves alrededor casi siempre significa que declaraste la variable dentro de un bloque y la estás leyendo fuera. En la [lección 03](juegos/03_estado.md) verás `°var`, la forma de anclar una variable al bloque de arriba a propósito.

---

## Resumen

| Operador | Qué hace | ¿Necesita `>>\|`? |
|---|---|---|
| `>>\| { }` | Abre el bloque TUI: pantalla alterna, modo crudo, cursor oculto | — |
| `>>!` | Limpia la pantalla | no |
| `>>?` | Devuelve `[filas, columnas]` de la terminal | no |
| `>>~ (f,c,estilo,fg,bg) > items` | Escribe en una celda concreta | sí |
| `<<\| var` | Lee una tecla, **esperando** | sí |
| `<<\|? var` | Lee una tecla **sin esperar** (`'\0'` si no hay) | sí |
| `@~ ms` | Duerme N milisegundos | no |

---

Siguiente lección: [02 — El bucle de juego](juegos/02_bucle.md)

[Índice del nivel](juegos/README.md)
