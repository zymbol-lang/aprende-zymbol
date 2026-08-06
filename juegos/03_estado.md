# Lección 03 — El estado del juego

> **Revisado para v0.0.8 — 2026-08-05**

El estado de un juego es todo lo que hay que saber para dibujar el fotograma siguiente: dónde está la serpiente, dónde la comida, cuántos puntos llevas, hacia dónde vas.

En muchos lenguajes ese estado acaba en variables globales, porque es lo cómodo: cualquier función puede leerlo y escribirlo. En Zymbol eso **no se puede hacer**, y esta lección trata sobre por qué eso es una ventaja y qué se hace en su lugar.

---

## Las funciones no ven el exterior

Ya lo viste en el nivel básico, pero aquí es donde se convierte en una decisión de arquitectura:

```
serpiente = [(5,5), (5,4)]

mover_mal() {
    // 'serpiente' NO existe aquí. No es global, es de fuera.
    serpiente = serpiente $+ (5,6)    // ❌ error: 'serpiente' is undefined
}
```

Una función llamada por su nombre ve **sus parámetros y nada más**. No hay excepción para «pero es que es el estado del juego».

Consecuencia directa: el estado tiene que **viajar**. Entra por los parámetros, sale por el valor de retorno.

```
// serpiente/logica.zy — la firma lo dice todo
mover(serpiente, dir, comida, puntos, AN, AL, crecer) {
    ...
    <~ (#1, serpiente, puntos, comio)
}
```

Siete cosas entran, cuatro salen. Nada se esconde. Puedes leer esa línea y saber exactamente de qué depende la función y qué puede cambiar — algo que con estado global no puedes saber sin leerla entera.

> ⚠️ **Las constantes sí entran.** El aislamiento aplica a las variables normales (`=`). Una constante de módulo declarada con `:=` es visible dentro de las funciones de ese módulo, y por eso Serpiente declara sus colores como `BORDE := 8` en vez de pasarlos por parámetro. Desde v0.0.8 esto funciona también en las llamadas anidadas y en la recursión.

---

## Devolver varias cosas: la tupla

Una función solo devuelve un valor. Pero ese valor puede ser una tupla, y desestructurarla en el punto de llamada cuesta una línea:

```
[vivo, serpiente, puntos, comio] =
    l::mover(serpiente, dir, comida, puntos, AN, AL, crecer)
```

Fíjate en algo que parece un error y no lo es: `serpiente` está **a los dos lados**. Entra el estado viejo, sale el nuevo, y la variable se reasigna. Es el patrón central del nivel:

```
estado = paso(estado)
```

Serpiente lo hace con todo:

```
[comida, fruta, semilla] = l::tick_comida(comio, serpiente, AN, AL, semilla, comida, fruta)
[comida, semilla]        = l::nueva_comida(serpiente, AN, AL, semilla)
[fruta,  semilla]        = l::fruta_aleatoria(semilla)
```

### El caso de la semilla

Mira la última columna de esas tres líneas: `semilla` entra y sale siempre. Cualquier función que use azar tiene que devolver la semilla avanzada, porque si no la devuelve, la siguiente llamada empieza donde empezó la anterior y da el mismo número.

```
// serpiente/logica.zy
rango_aleatorio(semilla, min, max) {
    sig = lcg_sig(semilla)
    val = sig % (max - min + 1) + min
    <~ (val, sig)          // ← el valor Y la semilla siguiente
}
```

Eso es un incordio de escribir. Y es exactamente la razón por la que Serpiente es **reproducible**: si arrancas con la misma semilla, sale la misma partida. La lección 05 lo desarrolla.

---

## Cuando devolver no basta: `fn(x<~)`

Hay un caso donde el patrón «entra y sale» se vuelve incómodo: cuando la estructura es **grande** y la función tiene además algo que decir.

El tablero de 囲碁 son hasta 361 puntos. Colocar una piedra lo modifica, pero también hay que saber cuántas piedras se capturaron, dónde quedó el punto de ko, y si la jugada era legal. Devolverlo todo en una tupla de cuatro sería ilegible.

Zymbol permite marcar un parámetro con `<~` para que la función pueda **escribir sobre la variable de quien llamó**:

```
// GO/核/盤.zy — el tablero, las capturas y el ko salen por parámetro;
// el valor de retorno queda libre para el código de estado
着手(局面<~, 路, 起点, 色, 取数<~, コウ点<~) {
    ...
}
```

Traducido: `jugar(tablero<~, tamaño, punto, color, capturas<~, punto_ko<~)`. Y el comentario del propio archivo explica la elección:

> *«La API se lee mejor con un código de estado como valor de retorno y el punto de ko como parámetro de salida que con las dos cosas multiplexadas en un solo valor.»*

La forma general es sencilla:

```
incrementar(contador<~) {
    contador = contador + 1
}

x = 0
incrementar(x)
>> x ¶          // → 1

// también se pueden combinar con un valor de retorno
tomar_y_subir(v<~) {
    v = v + 1
    <~ v
}

// y se pueden marcar varios
intercambiar(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
```

> **Úsalo con cuidado.** Un parámetro de salida rompe la promesa más útil de una función: que solo devuelve lo que devuelve. Serpiente no usa ninguno en sus 1 400 líneas. Resérvalo para cuando la estructura es grande de verdad, o cuando el valor de retorno ya tiene un trabajo distinto y bien definido.

---

## Estado que sobrevive a la partida: `°`

Hay una clase de estado que no pertenece a la partida sino a la **sesión**: cuántas partidas llevas, el récord, la lista de puntajes.

Ese estado no puede vivir dentro de `@:main`, porque muere y renace con cada partida. Y declararlo antes obliga a inicializarlo a mano y a arrastrarlo.

El operador `°` resuelve las dos cosas: crea la variable en su primer uso, con el valor neutro que corresponda, **anclada al ámbito de arriba del bucle**:

```
// serpiente/juego.zy — al terminar cada partida, dentro de @:main
°partidas += 1
marcadores = °marcadores$+ puntos
```

`°partidas` no está declarada en ninguna parte. En la primera partida vale `0`, se le suma 1, y **sobrevive** a la siguiente vuelta de `@:main` porque el prefijo `°` la ancla al bloque `>>|` que contiene el bucle. `°marcadores` hace lo mismo empezando en `[]`.

Las dos formas y su diferencia:

| Forma | Se ancla a | Vive |
|---|---|---|
| `°x` (prefijo) | El ámbito **de encima** del `@` más cercano | Sobrevive al bucle |
| `x°` (sufijo) | El ámbito del `@` más cercano | Muere con el bucle |

Y los valores neutros:

| Operación | Empieza en |
|---|---|
| `+=` `-=` | `0` |
| `*=` `/=` | `1` |
| `$+` | `[]` |
| yuxtaposición de texto | `""` |

Hov veS lo usa igual para su contador de partidas y su lista acumulada de puntuaciones, y su README lo describe bien: *«persisten entre reinicios dentro de la misma sesión, almacenados en variables hot-definition ancladas al bloque exterior `>>|`»*.

---

## Estado que pertenece a un módulo

Queda un tercer tipo de estado: el que no es de la partida ni de la sesión, sino de **una parte concreta del programa**. El ejemplo canónico es el idioma activo.

Un módulo puede tener variables propias. No son globales — nadie fuera del módulo las ve — pero persisten entre llamadas a sus funciones:

```
// serpiente/idioma/despacho.zy
# .idioma_despacho {

    idioma_actual = "es"          // ← estado del módulo

    fijar(código) { idioma_actual = código }
    actual() { <~ idioma_actual }
}
```

Y esto es lo que compra: **ninguna función de dibujo lleva un parámetro de idioma**. El módulo `dibujo.zy` lo dice en su cabecera:

> *«Ninguna cadena visible se escribe aquí: todas vienen de `idioma/despacho`, que guarda el idioma activo como estado de módulo. Por eso ninguna función de este archivo lleva un parámetro de idioma, y por eso el juego puede cambiar de idioma sin desmontar la pila de llamadas.»*

La alternativa —pasar `idioma` como parámetro— es exactamente lo que hacía Hov veS antes de la v0.0.8, y su README cuenta cómo salió: *«la i18n se escribió primero con el idioma propagado como parámetro por `HuD.zy` y `hov_veS.zy` … 79 líneas de dibujo condicionadas»*. La lección 07 vuelve sobre esto.

---

## Elegir dónde vive cada cosa

| Tipo de estado | Dónde vive | Ejemplo |
|---|---|---|
| Del tick | Variables del bucle, van y vienen por parámetros | `serpiente`, `dir`, `comida` |
| De la partida | Declarado al empezar `@:main` | `puntos`, `semilla` |
| De la sesión | `°var` anclada por encima del bucle | `°partidas`, `°marcadores` |
| De un subsistema | Variable de módulo | `idioma_actual` |
| Constante | `:=` en el módulo | `BORDE := 8` |

La pregunta que decide es siempre la misma: **¿cuánto tiene que durar?** Contéstala y el sitio se elige solo.

---

## El ejemplo de esta lección

[`juegos/ejemplos/03_estado.zy`](juegos/ejemplos/03_estado.zy) no dibuja nada — se ejecuta y escribe en la terminal normal, para que puedas leer los valores. Demuestra los cinco tipos de estado de la tabla de arriba, incluido un parámetro de salida y un `°` que sobrevive a un bucle.

```bash
zymbol run juegos/ejemplos/03_estado.zy
zymbol run --vm juegos/ejemplos/03_estado.zy    # el mismo resultado en el otro motor
```

---

## Resumen

| Concepto | Forma |
|---|---|
| Las funciones no ven el exterior | Solo parámetros (y constantes `:=` del módulo) |
| Estado que va y viene | `[a, b, c] = paso(a, b, c)` |
| Estructura grande o retorno ocupado | `fn(dato<~)` — parámetro de salida |
| Estado de sesión | `°var` — auto-inicia y sobrevive al bucle |
| Estado de subsistema | Variable de módulo |

---

Siguiente lección: [04 — Dibujar solo lo que cambió](juegos/04_dibujo.md)

[← Lección anterior](juegos/02_bucle.md) · [Índice del nivel](juegos/README.md)
