# Lección 06 — Programar en tu idioma

> **Revisado para v0.0.8 — 2026-08-05**

Ya lo habrás notado a lo largo del curso: en Zymbol **no existe ninguna palabra clave en inglés**. Una condición es `?`, una repetición es `@`, devolver un valor es `<~`. Y los nombres que tú eliges — variables, funciones, módulos — pueden estar en cualquier idioma, porque el lenguaje acepta cualquier símbolo Unicode como identificador.

Esta lección lleva esa idea hasta el final. Y empieza separando dos cosas que casi siempre se confunden.

---

## Dos problemas, dos mecanismos

| Qué se traduce | Quién lo lee | Cuándo | Mecanismo |
|---|---|---|---|
| **Identificadores** — nombres de funciones, constantes, módulos | otro programador | al escribir código | Capas de re-exportación |
| **Textos** — rótulos, mensajes, frases | el usuario | en ejecución | Despachador con catálogos |

Confundirlos es el error del que salen todos los demás. Un catálogo de cadenas no sirve para traducir una API — nadie quiere escribir `llamar("sqrt", x)`. Y una capa de re-exportación no sirve para traducir un rótulo, porque el idioma del usuario se elige cuando el programa ya está corriendo.

Esta lección cubre el primero a fondo y presenta el segundo. El [nivel Juegos](juegos/README.md) construye el segundo entero, en su lección 07.

---

## Código en español, de punta a punta

Nada te impide escribir así desde la primera lección:

```
saludar(nombre) {
    <~ "Hola, {nombre}"
}

contar_vocales(palabra) {
    vocales = ["a", "e", "i", "o", "u"]
    cuenta = 0
    @ letra:palabra {
        ? vocales$? "{letra}" { cuenta = cuenta + 1 }
    }
    <~ cuenta
}

>> saludar("Marisol") ¶
>> "vocales de 'murciélago': " contar_vocales("murcielago") ¶
```

El proyecto [Serpiente](https://github.com/zymbol-lang/zySerpiente) está escrito **completamente en español**: cada función, cada variable y cada comentario. Un fragmento real de su lógica:

```
// Entero aleatorio en [min, max] — retorna (valor, semilla_siguiente)
rango_aleatorio(semilla, min, max) {
    sig = lcg_sig(semilla)
    val = sig % (max - min + 1) + min
    <~ (val, sig)
}
```

El texto completo está en un solo idioma, de principio a fin. En los lenguajes tradicionales eso no se puede conseguir: sus palabras reservadas están en inglés, así que aparecen intercaladas por muy bien elegidos que estén los nombres. Zymbol no las tiene.

Y no es solo el español. [囲碁](https://github.com/zymbol-lang/zy-GO) está escrito en japonés — cada identificador, cada nombre de módulo y cada nombre de archivo usa kanji y kana — y [Hov veS](https://github.com/zymbol-lang/zyKlingonGalaxy) en klingon.

---

## Mecanismo 1: adaptar una biblioteca a tu idioma

En la lección intermedia 09 usaste `std/math`, `std/io` y `std/json`, y sus funciones se llaman `sqrt`, `read`, `decode`. Están en inglés, como las de casi cualquier biblioteca publicada para un público internacional, y son el único tramo del programa que no elegiste tú.

Ese tramo también se adapta, con el mecanismo de **re-exportación** de la lección de módulos: un *adaptador*, un módulo de una página que importa la biblioteca y vuelve a publicar cada función con un nombre en español. **Cero lógica, cero coste**: al cargar el programa, cada nombre nuevo queda apuntando directamente a la función original.

```
// archivo: matematica_es.zy — solo re-exporta, cero lógica
# matematica_es {
    <# std/math => _mat

    #> {
        _mat::sqrt  => raiz
        _mat::pow   => potencia
        _mat::round => redondear
        _mat::abs   => absoluto
        _mat::max   => maximo
        _mat::min   => minimo
    }
}
```

Y el programa que lo usa se lee entero en español:

```
<# ./matematica_es => mate
<# ./archivos_es   => arch

>> "raíz de 81: " mate::raiz(81) ¶

arch::escribir("bitacora.txt", "todo en orden")
>> arch::leer("bitacora.txt") ¶
```

Escribes el adaptador **una vez** y lo reutilizas en todos tus proyectos.

### Un adaptador real: `std/term` en español

Serpiente necesita medir texto en columnas de terminal, y esa biblioteca es `std/term`. Su adaptador es el archivo entero:

```
// serpiente/texto.zy
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

A partir de ahí el juego escribe `txt::ancho(…)` y `txt::centrar(…)`, y ni una línea suya está en inglés.

---

## El patrón de tres capas

El mismo mecanismo funciona entre **cualquier par de idiomas**, y es la manera en que los equipos que hablan idiomas distintos comparten código en Zymbol:

```
┌─────────────────────┐      ┌──────────────────────────┐      ┌─────────────────────────┐
│   Módulo base       │      │   Módulo de traducción    │      │   Programa consumidor   │
│   (un idioma)       │  ◄── │   (solo re-exporta)       │  ◄── │   (otro idioma)         │
│                     │      │   cero lógica, cero costo │      │                         │
└─────────────────────┘      └──────────────────────────┘      └─────────────────────────┘
```

1. **Módulo base** — un equipo escribe la biblioteca en su idioma y exporta su API pública.
2. **Módulo de traducción** — un adaptador que importa el módulo base y re-exporta cada símbolo con nombres en otro idioma. No contiene lógica alguna.
3. **Programa consumidor** — importa el módulo de traducción y programa enteramente en su propio idioma, sin leer jamás el idioma original.

Por ejemplo, un equipo hispanohablante publica `matematicas/module.zy` con `sumar`, `restar`, `PI`… y un adaptador griego lo re-exporta:

```
// matematicas/ελληνικά.zy
# ελληνικά {
    <# ./module => mat

    #> {
        mat::sumar  => προσθέτω
        mat::restar => αφαιρώ
        mat.PI      => ΠΙ
    }
}
```

El programa griego que lo consume no sabe —ni necesita saber— que la lógica está escrita en español:

```
<# ./matematicas/ελληνικά => μαθ

αποτέλεσμα = μαθ::προσθέτω(10, 5)
>> "Άθροισμα: " αποτέλεσμα ¶
```

Cuando el equipo base agrega una función, el traductor agrega **una línea** al adaptador. Fíjate en el detalle de la sintaxis: **las constantes se re-exportan con `.` y las funciones con `::`**, y así se leen luego (`μαθ.ΠΙ`, `μαθ::προσθέτω(…)`).

Los nombres de archivo también pueden estar en cualquier alfabeto (`ελληνικά.zy`, `日本語.zy`).

### Esto se hace con motores enteros, no con ejemplos

[囲碁](https://github.com/zymbol-lang/zy-GO) está escrito en japonés y publica su motor en inglés y en español mediante dos capas de re-exportación puras:

```
// GO/api/espanol.zy
#> {
    盤::着手  => jugar
    盤::新規  => nuevo
    盤.黒     => NEGRO
}
```

*«Alguien que no lea japonés puede escribir su propio front-end contra `en::play(...)` o `es::jugar(...)` sin abrir nunca un archivo fuente en japonés.»* Las dos capas cubren la superficie pública completa del motor — 21 nombres de un módulo, 6 de otro, 4 de un tercero — y hay una prueba que juega la misma jugada bajo los dos nombres y compara el resultado, porque un re-export roto se nota primero justo ahí.

---

## Mecanismo 2: los textos que lee el usuario

Los adaptadores traducen nombres que tú escribes. No sirven para los rótulos, porque el idioma del usuario se elige **cuando el programa ya está corriendo**.

Para eso: un **despachador**. Un solo módulo por el que pasa toda cadena visible, con el idioma activo guardado como estado de módulo.

```
// serpiente/idioma/despacho.zy
# .idioma_despacho {

    <# ./español => es
    <# ./english => en

    #> { fijar, actual, texto, idiomas, claves }

    idioma_actual = "es"          // ← estado de módulo

    fijar(código) { idioma_actual = código }

    texto(clave) {
        ? idioma_actual == "en" { <~ en::texto(clave) }
        <~ es::texto(clave)
    }
}
```

Y cada idioma es una tabla:

```
// serpiente/idioma/español.zy
texto(clave) {
    <~ ?? clave {
        "menú.velocidad"   => "Elige tu velocidad:"
        "fin.puntaje"      => "Puntaje"
        ...
        _                  => clave       // ← el caso identidad
    }
}
```

Tres decisiones sostienen todo esto, y las tres van a contracorriente de lo habitual:

**1. El idioma es estado de módulo, nunca un parámetro.** Por eso ninguna función de dibujo lleva un `idioma` que solo sirve para pasarlo hacia abajo, y por eso el programa puede cambiar de idioma sin desmontar la pila de llamadas.

**2. Las claves van en el idioma del programa, no en inglés.** Si el programa está escrito en español, `"menú.velocidad"` pide un concepto en español. Meter claves inglesas en un programa español mete el inglés donde nadie lo puso — y en un lenguaje sin palabras reservadas en inglés, eso destroza la premisa.

**3. Toda clave lleva prefijo de dominio** (`"menú.título"`, nunca `"título"`). No es cosmético: es lo que hace la completitud **verificable**. Como una clave sin traducir se devuelve a sí misma, «traducción igual a la clave» significa «falta la traducción» — y eso solo es decidible si una clave no puede coincidir nunca con su propia traducción, **tampoco en el idioma base**.

De ahí sale la prueba que cierra el sistema, en un doble bucle:

```
@ código : idioma::idiomas() {
    idioma::fijar(código)
    @ clave : idioma::claves() {
        ? (idioma::texto(clave)) == clave { >> "FALTA " clave ¶ }
    }
}
```

Añadir un idioma pasa a ser tres ediciones —un archivo, un import, una rama en cada reparto— y la prueba te dice al instante qué olvidaste.

> Esto está desarrollado entero, con código funcionando y pruebas, en la [lección 07 del nivel Juegos](juegos/07_idiomas.md). La doctrina completa está en [USERAPPI18N.md](https://github.com/zymbol-lang/interpreter/blob/main/USERAPPI18N.md), con una lista de comprobación de 14 puntos.

---

## Lo que una tabla no puede: las frases

Un catálogo resuelve las etiquetas. No resuelve las frases con datos dentro, porque cada idioma coloca el número donde le corresponde y no todos marcan el plural igual.

Así que cada idioma implementa además unas pocas funciones que **componen**:

```
// serpiente/idioma/español.zy
texto_partida(n) {
    ? n == 1 { <~ "Primera partida de la sesión" }
    <~ "Partida {n} de la sesión"
}
```

囲碁 lleva esto a cinco idiomas con una frase que ninguna tabla podría contener:

| Idioma | «blancas ganan por 1,5 puntos» |
|---|---|
| 日本語 | 白の1目半勝ち |
| 한국어 | 백 1집반승 |
| 中文 | 白胜1目半 |
| English | White wins by 1.5 points |
| Español | las blancas ganan por 1,5 puntos |

---

## Los datos también hablan tu idioma: `decode_map`

Los adaptadores traducen nombres de funciones. Pero cuando pides datos a un servicio web, las claves del JSON llegan en el idioma del servicio — casi siempre inglés — y `datos.name` se cuela en tu programa en español.

Para eso `std/json` trae `decode_map`: decodifica el JSON **y** renombra las claves a cualquier profundidad, según un diccionario que tú defines — una tupla donde cada campo es la clave original y su valor es el nombre nuevo:

```
<# ./json_es => json    // adaptador: decode_map => decodificar_con

respuesta = "\{\"name\": \"Río Amazonas\", \"length_km\": 6800}"

diccionario = (name: "nombre", length_km: "longitud_km")
rio = json::decodificar_con(respuesta, diccionario)

>> rio.nombre ¶         // → Río Amazonas
>> rio.longitud_km ¶    // → 6800
```

Las claves que no aparecen en el diccionario se conservan tal cual. Define el diccionario una sola vez —dentro de tu adaptador de JSON, por ejemplo— y todos tus programas leerán las respuestas de la API en español.

---

## Y los números

Con los modos numéricos de la [lección 04](avanzado/04_numerales.md), hasta los **dígitos** de la salida se muestran en el sistema de numeración de tu cultura. Recuerda la doctrina que viste allí: el modo aplica a todo texto que el programa genere, no solo a lo que se ve en pantalla, y validar las consecuencias es responsabilidad de quien lo declara.

Donde Unicode no llega, la capa de idioma lo resuelve a mano. Hov veS tiene una función `mI'(n)` en su contrato de idioma porque el klingon escribe sus cifras en un bloque de uso privado.

---

## Lo que se queda en inglés

Por completitud, porque no todo se traduce. Estos son contratos con el exterior y se quedan como están:

| Qué | Por qué |
|---|---|
| Códigos ISO 639-1 (`"es"`, `"ja"`) | Convenio internacional |
| Formatos de datos en disco | Un conjunto de datos partido en dos idiomas son dos conjuntos de datos |
| Teclas físicas del teclado | La tecla `Q` está en el teclado, no en el idioma |
| `json::encode` | Un JSON con dígitos devanagari no es un JSON |

Y un matiz de diseño, de Serpiente: los atajos de una letra (`N` nuevo, `S` salir) se quedan **fijos en español** aunque el menú se traduzca, y las etiquetas llevan su inicial entre corchetes en el idioma que sea. *«Un atajo que cambia de tecla al cambiar de idioma es peor que un atajo fijo.»*

---

## Resumen

| Idea | Mecanismo |
|---|---|
| Identificadores en cualquier idioma | Soporte Unicode nativo — no hay palabras reservadas |
| Biblioteca estándar en español | Adaptador que re-exporta: `_mat::sqrt => raiz` |
| Compartir código entre idiomas | Patrón de tres capas: base → traducción → consumidor |
| Constantes vs funciones al re-exportar | `alias.CONST` y `alias::funcion` |
| Rótulos que lee el usuario | Despachador + catálogos, idioma como estado de módulo |
| Claves del catálogo | En el idioma del programa, con prefijo de dominio |
| Verificar que no falta nada | Claves × idiomas, buscando el caso identidad |
| Frases con datos dentro | Funciones que componen, una por idioma |
| Claves JSON en tu idioma | `json::decode_map(texto, diccionario)` |
| Dígitos en tu sistema numérico | Modos numéricos (lección 04) |

El ejemplo ejecutable de esta lección ([06_multilingue.zy](avanzado/ejemplos/06_multilingue.zy)) incluye los adaptadores en español listos para copiar. Para el despachador completo, ve al [nivel Juegos](juegos/07_idiomas.md).

---

Siguiente lección: [07 — Proyecto avanzado](avanzado/07_proyecto.md)

[← Lección anterior](avanzado/05_herramientas.md) · [Índice](avanzado/README.md)
