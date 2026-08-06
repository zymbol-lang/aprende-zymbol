# Lección 06 — Marcos que se miden

> **Revisado para v0.0.8 — 2026-08-05**

Esta lección empieza con una pregunta que parece tonta:

> ¿Cuánto mide `"手番"`?

Depende de qué llames «medir». Son **dos** caracteres. Ocupa **cuatro** columnas en la terminal. Y si construyes un panel usando el primer número, el marco te sale torcido.

---

## `$#` cuenta grafemas, no columnas

```
>> "手番"$# ¶             // → 2   (dos caracteres)
```

Pero en pantalla:

```
┌────┐
│手番│      ← cuatro columnas de ancho
└────┘
```

Los ideogramas CJK, la mayoría de los emoji y las formas de ancho completo ocupan **dos columnas cada uno**. `$#` no lo sabe, porque `$#` cuenta unidades de texto, que es lo correcto para casi todo lo demás.

Para maquetar hace falta otra medida, y desde v0.0.8 la trae la biblioteca estándar.

---

## `std/term` — medir en columnas

```
<# std/term => t

>> t::width("手番") ¶                    // → 4
>> "[" t::pad_right("go", 6) "]" ¶       // → [go    ]
>> "[" t::center("go", 6) "]" ¶          // → [  go  ]
>> "[" t::truncate("形勢判断", 4) "]" ¶   // → [形勢]
```

| Función | Qué hace |
|---|---|
| `width(s)` | Ancho en **columnas de terminal**. Acepta un texto o un carácter |
| `pad_left(s, n)` | Rellena por la izquierda hasta ocupar `n` columnas |
| `pad_right(s, n)` | Rellena por la derecha |
| `center(s, n)` | Centra en `n` columnas (la columna sobrante va a la derecha) |
| `truncate(s, n)` | Recorta a `n` columnas **sin partir un glifo por la mitad** |

Si el texto ya es más ancho que `n`, las funciones de relleno lo devuelven tal cual: nunca recortan por su cuenta.

> `truncate` es la que más trabajo hace. Cortar `"形勢判断"` a 5 columnas no puede devolver medio ideograma, así que devuelve `"形勢"` (4 columnas) y no `"形勢判"` (6) ni un carácter partido.

---

## La capa fina: la biblioteca en tu idioma

Serpiente habla español. `std/term` habla inglés. La solución es un módulo de una página:

```
// serpiente/texto.zy — el archivo entero
# texto {

    #> {
        t::width      => ancho
        t::pad_left   => izquierda
        t::pad_right  => derecha
        t::center     => centrar
        t::truncate   => recortar
    }

    <# std/term => t
}
```

Cero lógica. Solo re-exporta cada función con su nombre en español. A partir de ahí, todo el juego escribe `txt::ancho(…)` y `txt::centrar(…)`, y el programa se lee entero en un idioma.

Y no cuesta nada en ejecución: al cargar el módulo, cada nombre nuevo queda apuntando directamente a la función original. Es el mecanismo de la lección [avanzado 06](avanzado/06_multilingue.md), aplicado al sitio donde más se nota.

---

## Por qué esto es un tema de i18n y no de estética

Aquí está el corazón de la lección. Mira cómo se escribía un menú **antes**:

```
"│   [1]  Lento      160 ms     │"
```

Una línea, con el relleno contado a mano. Funciona perfectamente… en español. Cambia `"Lento"` por `"Slow"` y el marco se descuadra, porque **el relleno vive dentro de la misma cadena que el texto**.

Serpiente tenía diez literales así solo para el menú de velocidad: cinco opciones × dos estados (seleccionada o no). Y el comentario de `marco.zy` no se anda con rodeos:

> *«Un marco no se teclea: se mide. … eso ata la traducción a la aritmética de la caja: cambiar "Lento" por "Slow" descuadra el marco, porque el relleno vive dentro de la misma cadena que el texto.»*

La regla que sale de ahí, y que es doctrina en los tres juegos:

> **Ningún ancho se teclea.** Ni el del marco, ni el de las columnas internas del panel.

---

## Cómo se construye un marco medido

El contenido llega como una lista de líneas **ya traducidas**. Se mide la más ancha, y el marco se construye alrededor:

```
// serpiente/marco.zy
construir(líneas, hueco) {
    w = ancho_de(líneas)
    borde = "─" $* (w + hueco * 2)
    margen = " " $* hueco
    filas = ["╭" $+ borde $+ "╮"]
    @ l : líneas {
        ? l == SEPARADOR {
            filas = filas $+ ("├" $+ borde $+ "┤")
        } _ {
            cuerpo = _desnudo(l)
            ? cuerpo <> l {
                filas = filas $+ ("│" $+ margen $+ txt::centrar(cuerpo, w) $+ margen $+ "│")
            } _ {
                filas = filas $+ ("│" $+ margen $+ txt::derecha(l, w) $+ margen $+ "│")
            }
        }
    }
    filas = filas $+ ("╰" $+ borde $+ "╯")
    <~ filas
}
```

**Todas las filas que devuelve miden exactamente lo mismo, en el idioma que sea.** Ese es el contrato completo.

Y `ancho_de` es lo que parece:

```
ancho_de(líneas) {
    w = 0
    @ l : líneas {
        ? l <> SEPARADOR {
            c = txt::ancho(_desnudo(l))
            ? c > w { w = c }
        }
    }
    <~ w
}
```

### Las marcas de control

Hay dos glifos que no son texto sino instrucciones para el constructor del marco:

```
SEPARADOR := "␟"    // esta línea es una regla horizontal
CENTRADO  := "␝"    // prefijo: centra esta línea dentro del marco
```

Están elegidos con cuidado: son glifos de control que **no aparecen en ningún texto de interfaz**, así que ninguna traducción puede chocar con ellos por accidente.

`CENTRADO` es un prefijo y no un parámetro por una razón que se explica sola en el comentario del archivo:

> *«Centrar hay que hacerlo aquí y no antes: el ancho del marco no se conoce hasta haber medido todas las líneas, así que una línea centrada contra un ancho supuesto queda descentrada en cuanto otra línea del mismo panel es más larga.»*

---

## El detalle que hace que el cursor no mueva las filas

Un menú tiene una marca `►` delante de la opción seleccionada. La tentación es dibujarla al pintar. Es un error:

```
// serpiente/marco.zy
fila_menú(número, etiqueta, seleccionada) {
    marca = "  "
    ? seleccionada { marca = "► " }
    <~ "{marca}[{número}]  {etiqueta}"
}
```

La marca se pone **antes de medir**, y las filas no seleccionadas llevan dos espacios en su lugar. Así el marco reserva sitio para ella en todos los idiomas, y las filas no se desplazan lateralmente cuando mueves el cursor.

Hov veS hace lo mismo en `gho.zy` y lo documenta con las mismas palabras. Es el tipo de detalle que nadie nota cuando está bien y todo el mundo nota cuando está mal.

---

## Medir también para colocar

El marco construido hay que ponerlo en algún sitio. Centrarlo es medir otra vez:

```
// serpiente/dibujo.zy
_esquina(filas, AN, AL) {
    ancho = txt::ancho(filas[1])
    alto  = filas$#
    <~ (2 + (AL - alto) / 2, 2 + (AN - ancho) / 2)
}
```

Fíjate en la asimetría, que es correcta: el **ancho** se mide con `txt::ancho` (columnas), el **alto** con `$#` (número de filas). Una fila es una fila; una columna no siempre es un carácter.

Lo mismo con el marcador que va sobre el borde:

```
_marcador(puntos, AN) {
    insignia = idioma::marcador(puntos)
    ancho = txt::ancho(insignia)
    col = (AN + 2 - ancho) / 2 + 1
    >>~ (1, col - 1, 0, BORDE) > "┤"
    >>~ (1, col, 0, COMIDA) > insignia
    >>~ (1, col + ancho, 0, BORDE) > "├"
}
```

La versión anterior de esta función colocaba cinco trozos con los desplazamientos `-7`, `+1`, `+10`, `+12` y `+15`, sacados de la longitud de la palabra «PUNTOS» y del supuesto de que el puntaje cabe en dos dígitos. Ahora el idioma compone la insignia entera y aquí solo se mide y se centra — así vale para `"SCORE"`, para cuatro dígitos y para un idioma de columnas dobles.

---

## Cuando las dos columnas se vuelven estructura

囲碁 lleva esto al extremo. En un tablero de go cada intersección tiene que ocupar exactamente lo mismo, o la rejilla se desmonta. Su solución no es medir cada caso: es **hacer que todas las celdas midan dos columnas siempre**, en los tres temas de fichas.

| Tema | Negras | Blancas | Ancho |
|---|---|---|---|
| 石 (piedra) | ⚫ | ⚪ | 2 columnas |
| 月 (luna) | 🌑 | 🌕 | 2 columnas |
| 字 (ASCII) | `X` | `O` | 1 columna + conector |

Y una advertencia que vale para cualquier juego de terminal: el tema ASCII evita a propósito `●` y `○`. Esos caracteres son de ancho *East Asian Ambiguous* — una columna en una terminal occidental, **dos** en una configurada para CJK. Exactamente la clase de glifo que rompe la aritmética de columnas sin que puedas hacer nada.

> Si tienes que elegir un glifo para un juego que se va a ver en terminales ajenas: quédate con ASCII puro, o con emoji claramente de doble ancho. Lo ambiguo es lo peligroso.

---

## El ejemplo de esta lección

[`juegos/ejemplos/06_marcos.zy`](juegos/ejemplos/06_marcos.zy) construye el mismo panel en español, en inglés y en japonés con **una sola función y ninguna rama por idioma**, y comprueba después que todas las filas de cada panel miden exactamente lo mismo. Luego alarga una etiqueta y el marco crece solo. Al final, la versión rota —con el relleno tecleado— para comparar.

Trae dos módulos que puedes copiar tal cual a tus proyectos: [`texto.zy`](juegos/ejemplos/texto.zy) (la capa en español sobre `std/term`) y [`marco.zy`](juegos/ejemplos/marco.zy) (el constructor de paneles).

```bash
zymbol run juegos/ejemplos/06_marcos.zy
```

---

## Resumen

| Idea | Forma |
|---|---|
| Ancho de pantalla | `t::width(s)` — **nunca** `s$#` |
| Rellenar / centrar / recortar | `pad_left` `pad_right` `center` `truncate` |
| Biblioteca en tu idioma | Módulo que solo re-exporta: `t::width => ancho` |
| Construir un marco | Medir la línea más ancha, construir alrededor |
| Marca de selección | Ponerla **antes** de medir |
| Alto de un panel | Sí es `$#` — una fila es una fila |
| Glifos peligrosos | East Asian Ambiguous (`●`, `○`): evítalos |

---

Siguiente lección: [07 — Un juego en varios idiomas](juegos/07_idiomas.md)

[← Lección anterior](juegos/05_azar.md) · [Índice del nivel](juegos/README.md)
