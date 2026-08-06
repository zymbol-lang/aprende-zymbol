# Lección 07 — Un juego en varios idiomas

> **Revisado para v0.0.8 — 2026-08-05**

Esta es la lección donde Zymbol enseña para qué sirve no tener palabras reservadas.

En cualquier otro lenguaje, «internacionalizar» significa sacar los textos a un archivo de recursos. Aquí hay **dos** cosas distintas que se pueden traducir, y confundirlas es el error del que salen todos los demás:

| Qué se traduce | Quién lo lee | Mecanismo |
|---|---|---|
| Los **textos** de la interfaz | el jugador | Despachador con catálogos por idioma |
| Los **identificadores** de la API | otro programador | Capas de re-exportación |

Son problemas distintos con soluciones distintas. Esta lección va sobre el primero, que es el que necesita un juego. El segundo lo viste en la [lección avanzada 06](avanzado/06_multilingue.md) y vuelve al final.

---

## Cómo se hace mal (y cómo se sabe)

Hov veS se escribió primero de la forma obvia: el idioma se pasa como parámetro y cada función de dibujo decide qué escribir.

```
// ❌ así NO
dibujar_menu(AN, AL, idioma) {
    ? idioma == "es" { >>~ (5, 10) > "Nueva partida" }
    ? idioma == "en" { >>~ (5, 10) > "New game" }
    ? idioma == "tlh" { >>~ (5, 10) > "" }
}
```

Su README cuenta el resultado sin adornos:

> *«La i18n se escribió primero con el idioma propagado como parámetro por `HuD.zy` y `hov_veS.zy`, y cada cadena visible duplicada una vez por idioma dentro del render: **79 líneas de dibujo condicionadas**.»*

Los tres síntomas de que vas por ahí:

1. **Toda función de dibujo lleva un parámetro `idioma`** que solo sirve para pasarlo hacia abajo.
2. **Añadir un idioma toca todos los archivos**, porque cada rama está donde se dibuja.
3. **Los marcos se descuadran**, porque el ancho se calculó con el texto de un idioma.

---

## Cómo se hace bien: un despachador

Todo el texto visible sale de **un solo módulo**, y el idioma activo vive ahí como estado de módulo:

```
serpiente/
├── dibujo.zy              pide texto, no lo tiene
└── idioma/
    ├── despacho.zy        el despachador — guarda el idioma activo
    ├── español.zy         catálogo es (idioma base)
    └── english.zy         catálogo en
```

El despachador, sin adornos:

```
// serpiente/idioma/despacho.zy
# .idioma_despacho {

    <# ./español => es
    <# ./english => en

    #> { fijar, actual, rotar, idiomas, claves, texto, marcador, texto_partida }

    idioma_actual = "es"          // ← estado de módulo

    idiomas() { <~ ["es", "en"] }

    fijar(código) { idioma_actual = código }
    actual() { <~ idioma_actual }

    texto(clave) {
        ? idioma_actual == "en" { <~ en::texto(clave) }
        <~ es::texto(clave)
    }
}
```

Y lo que compra es esto, escrito en la cabecera de `dibujo.zy`:

> *«Ninguna función de este archivo lleva un parámetro de idioma, y por eso el juego puede cambiar de idioma sin desmontar la pila de llamadas.»*

Cambiar el idioma **en mitad de una partida** es llamar a `idioma::fijar("en")` y volver a dibujar. Nadie más se entera.

---

## Las claves van en el idioma del programa

Aquí está la decisión que más se discute, y la respuesta de Zymbol va a contracorriente de lo que hace casi todo el mundo.

La costumbre en la industria es poner las claves en inglés: `menu.speed`, `game.over`, `panel.captures`. Suena neutral.

**No lo es.** Si el programa está escrito en español, meter claves en inglés significa que el idioma inglés se ha colado en un programa donde nadie lo puso. Y en Zymbol, donde ni siquiera las palabras del lenguaje están en inglés, eso destroza la premisa entera.

Serpiente lo dice en la cabecera de su despachador:

> *«Las claves están en español, porque el programa está escrito en español. El español es la base y los demás idiomas se apoyan sobre ella: cuando `dibujo.zy` pide `"menú.velocidad"` está pidiendo un concepto en español, no un identificador neutro en inglés.»*

Y 囲碁 hace lo mismo en japonés: sus claves son `区画.アゲハマ`, `報せ.コウ`. Un jugador de go sabe qué es un *ko*; no necesita que se lo traduzcan a `rules.ko`.

### El prefijo de dominio no es cosmético

Fíjate en que ninguna clave es una palabra suelta:

```
"menú.título1"      no "título1"
"fin.puntaje"       no "puntaje"
"marcador.puntos"   no "puntos"
"終局.石"            no "石"
```

Esto es lo que hace que el sistema sea **verificable**, y el razonamiento merece leerse despacio:

1. Cuando falta una traducción, la función devuelve **la clave misma** (es el caso `_ => clave` del match).
2. Entonces «traducción igual a la clave» significa «falta la traducción».
3. Pero eso solo funciona si una clave **nunca puede coincidir** con su propia traducción.
4. En español, la clave `"puntos"` traduciría a `"Puntos"`… y `"marcador.puntos"` no puede traducir a `"marcador.puntos"` jamás.

El prefijo es lo que mantiene la comprobación decidible **también en el idioma base**. Sin él, el único idioma que no podrías verificar sería precisamente aquel en el que está escrito el programa.

---

## Un catálogo es un `??` gigante

El idioma base de Serpiente, resumido:

```
// serpiente/idioma/español.zy
# .idioma_español {

    #> { texto, marcador, texto_partida }

    texto(clave) {
        <~ ?? clave {
            "idioma.nombre"    => "Español"

            "menú.título1"     => "Z Y M B O L"
            "menú.título2"     => "S E R P I E N T E"
            "menú.velocidad"   => "Elige tu velocidad:"
            "menú.lento"       => "Lento"
            ...
            "fin.título1"      => "J U E G O"
            "fin.título2"      => "T E R M I N Ó"

            _                  => clave       // ← el caso identidad
        }
    }
}
```

Es un `??` usado como expresión: devuelve el valor de la rama que casa. Un catálogo de 33 claves cabe en una pantalla y se lee de un vistazo.

Y `_ => clave` es la línea más importante del archivo: **una clave sin traducir devuelve la clave**. No revienta, no devuelve vacío, no cae al idioma base. Devuelve algo que se ve raro en pantalla y que un test puede detectar sin ambigüedad.

> Nota que el idioma base **tampoco es una función identidad**. `"menú.velocidad"` no devuelve `"menú.velocidad"`: devuelve `"Elige tu velocidad:"`. La clave es un concepto; la traducción es cómo se dice.

---

## Lo que una tabla no puede: frases compuestas

Una tabla de cadenas resuelve las etiquetas. No resuelve las frases con datos dentro.

«Las blancas ganan por 1,5 puntos» no cabe en una tabla, porque el número va en medio y cada idioma lo coloca donde le corresponde. Así que cada catálogo implementa además unas pocas funciones que **componen**:

```
// serpiente/idioma/español.zy
marcador(puntos) { <~ " ✦ PUNTOS {puntos} ✦ " }

texto_partida(n) {
    ? n == 1 { <~ "Primera partida de la sesión" }
    <~ "Partida {n} de la sesión"
}
```

`texto_partida` tiene una rama gramatical que el inglés resuelve de otra forma. Ese es exactamente el tipo de cosa que se pierde cuando intentas meterlo todo en una tabla y acabas concatenando trozos traducidos por separado.

囲碁 lleva esto más lejos porque lo necesita — su contrato tiene una búsqueda estática y **tres** funciones que componen:

| Función | Qué hace |
|---|---|
| `語(鍵)` | cadena estática para una clave |
| `路盤名(路)` | nombre del tablero — 九路盤 · 9줄 바둑판 · 九路棋盘 · 9×9 |
| `結果文(勝色, 差, 中押)` | la frase de resultado en cinco gramáticas |
| `取石文(数)` | anuncio de captura, con concordancia de plural donde el idioma la pide |

---

## Los números también se traducen

Aquí es donde Zymbol hace algo que ningún otro lenguaje hace.

Hov veS está en klingon, y el klingon escribe sus cifras en pIqaD (U+F8F0–F8F9). Un marcador que dice `4` en un juego cuyo texto está en pIqaD está a medio traducir. Por eso su contrato de idioma incluye:

```
mI'(n)       // un número en la escritura del idioma activo
```

Y su README lo justifica en una línea: *«No es cosmética: el klingon escribe sus cifras en pIqaD y el inglés y el español en ASCII.»*

Para los sistemas de dígitos que Unicode ya cubre, el lenguaje lo trae de fábrica con los modos numéricos de la [lección avanzada 04](avanzado/04_numerales.md):

```
#०९#
>> 42 ¶       // → ४२
#09#
>> 42 ¶       // → 42
```

Y hay una regla de diseño que conviene conocer antes de usarlos en un juego:

> **El modo numeral aplica a todo texto, no solo a lo que se ve.** Si tu programa declara `#०९#`, sus números salen en devanagari **en todas partes** — incluido un nombre de archivo (`"dato{n}.txt"` → `dato४२.txt`), un comando de shell, o una comparación (`"{n}" == "42"` da falso).
>
> Eso **no es un fallo**: es libertad de intención. El programa dijo que sus números se escriben así, y el lenguaje le hace caso en todas partes. Validar las consecuencias es responsabilidad de quien lo declara.
>
> La única excepción son los formatos con gramática propia: `json::encode` sigue emitiendo ASCII, porque un JSON con dígitos devanagari no es un JSON.

Traducción práctica para un juego: activa el modo numeral **para presentar**, no antes de construir una ruta de archivo o una clave de datos.

---

## Añadir un idioma son tres ediciones

Ese es el objetivo de todo lo anterior. Con el despachador montado:

1. Escribir `idioma/<nombre>.zy` contra el contrato de funciones.
2. Importarlo en el despachador.
3. Añadir una rama a cada función de reparto.

Y ya. Ni una línea de `dibujo.zy` se toca, porque `dibujo.zy` nunca supo qué idioma estaba activo.

囲碁 tiene cinco idiomas —japonés, coreano, mandarín, inglés y español— y dice lo mismo: *«Añadir un sexto son tres ediciones: un archivo de idioma, un import y un caso en cada despacho.»*

---

## Cambiar de idioma desde dentro del juego

Un detalle que parece menor y no lo es. Serpiente tiene dos puntos de entrada, `serpiente.zy` y `snake.zy`, que solo se diferencian en el idioma con el que arrancan.

No basta:

```
// serpiente/idioma/despacho.zy
// «El idioma se puede cambiar desde dentro del juego y no solo
//  eligiendo con qué archivo se arranca — que es justo lo que no
//  sirve a quien no sabe leer el idioma en curso.»
rotar() { fijar(_siguiente()) }
```

Quien arranca `serpiente.zy` sin saber español **no puede saber que existe `snake.zy`**, porque esa información está escrita en español. La tecla `L` dentro del juego es lo que hace que el otro archivo sea una comodidad y no el único camino.

### Un detalle de implementación que vale como advertencia

`rotar` son dos funciones y no una: una pura que calcula, otra sin retorno que escribe.

```
_siguiente() {           // pura: calcula el siguiente código
    ...
    <~ lista[pos + 1]
}

rotar() { fijar(_siguiente()) }    // efecto: escribe
```

Empezó siendo el rodeo de un bug (HLZ-SRP-001: el tree-walker perdía la escritura cuando una función de módulo escribía estado **y además** devolvía un valor con `<~`). El bug está corregido en v0.0.8, y la separación se quedó igualmente. La razón que da el propio archivo es buena:

> *«Aquel fallo era silencioso: con un binario sin el arreglo, la versión de una sola función no da error, deja el idioma anterior y sigue. Separar el cálculo del efecto es además buena forma por sí sola.»*

---

## El otro mecanismo: traducir la API

Para cerrar el círculo. Lo de arriba traduce lo que lee **el jugador**. Cuando lo que quieres traducir es lo que lee **otro programador**, el mecanismo es distinto y ya lo conoces: capas de re-exportación.

```
// GO/api/espanol.zy — cero lógica, cero coste
#> {
    盤::着手  => jugar
    盤::新規  => nuevo
    盤.黒     => NEGRO
}
```

Alguien que no lea japonés puede escribir su propio front-end contra `es::jugar(...)` sin abrir jamás un archivo fuente en japonés. Las constantes se re-exportan con `.` y las funciones con `::`.

Es el mismo mecanismo que `texto.zy` de la lección 06, que traduce `std/term` al español. La regla para elegir:

| Si lo lee… | Usa |
|---|---|
| el jugador, en tiempo de ejecución | despachador + catálogos |
| un programador, al escribir código | capa de re-exportación |

---

## El ejemplo de esta lección

[`juegos/ejemplos/07_idiomas.zy`](juegos/ejemplos/07_idiomas.zy) construye el mismo panel en tres idiomas —español (base), inglés y japonés— con **una sola función que no recibe el idioma**, demuestra la rotación, enseña las frases compuestas y termina con el caso identidad: al catálogo inglés le falta `"fin.récord"` a propósito, y se ve en pantalla.

```bash
zymbol run juegos/ejemplos/07_idiomas.zy
zymbol run --vm juegos/ejemplos/07_idiomas.zy
```

El despachador y los tres catálogos están en [`juegos/ejemplos/idioma/`](juegos/ejemplos/idioma/) y están pensados para copiarse: cambia los catálogos y tienes el i18n de tu juego resuelto.

> **Un detalle de sintaxis que muerde.** Un módulo que vive en un subdirectorio declara su ruta en el nombre, **con un punto delante**:
>
> ```
> // archivo: idioma/despacho.zy
> # .idioma_despacho {
> ```
>
> Sin el punto, `zymbol check idioma/despacho.zy` exige que se llame `despacho` y el importador exige que se llame `idioma_despacho` — con el punto valen las dos.

---

## Resumen

| Idea | Forma |
|---|---|
| El idioma es estado de módulo | `idioma_actual = "es"` en el despachador |
| Ninguna función de dibujo lo recibe | Ni un parámetro `idioma` en todo el render |
| Claves en el idioma del programa | `"menú.velocidad"`, no `"menu.speed"` |
| Prefijo de dominio obligatorio | Hace la completitud verificable en el idioma base |
| Falta una clave | `_ => clave` — devuelve la clave misma |
| Frases con datos | Funciones que **componen**, no concatenación de trozos |
| Cifras del idioma | Función `mI'(n)` o modos numéricos `#d0d9#` |
| Añadir un idioma | Tres ediciones, ninguna en el código de dibujo |

---

Siguiente lección: [08 — La puerta de completitud](juegos/08_pruebas.md)

[← Lección anterior](juegos/06_marcos.md) · [Índice del nivel](juegos/README.md)
