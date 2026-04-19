# Lección 07 — Inspección de tipos

Zymbol es un lenguaje de tipado dinámico: el tipo de una variable no se declara, se infiere del valor que contiene. En la mayoría de los casos eso funciona sin necesidad de pensarlo. Pero hay situaciones donde el programa necesita saber en tiempo de ejecución con qué tipo está tratando — para validar entradas, para tomar decisiones según el tipo, o para convertir datos que llegan como texto.

Para eso existen dos operadores: `#?` para inspeccionar el tipo de un valor, y `#|..|` para convertir texto a número.

---

## `#?` — Metadatos de tipo

`#?` aplicado a cualquier valor devuelve una tupla con tres campos: el símbolo del tipo, el número de dígitos o caracteres, y el valor mismo.

```
meta = 42#?
>> meta ¶    // → (###, 2, 42)
```

La tupla tiene esta estructura: `(símbolo_tipo, tamaño, valor)`.

Para extraer solo el tipo, usa una variable intermedia:

```
meta = 42#?
tipo = meta[1]
>> tipo ¶    // → ###
```

---

## Símbolos de tipo

Cada tipo tiene su símbolo:

| Tipo | Símbolo | Ejemplo | Resultado de `#?` |
|---|---|---|---|
| Entero | `###` | `42#?` | `(###, 2, 42)` |
| Flotante | `##.` | `3.14#?` | `(##., 4, 3.14)` |
| Texto | `##"` | `"hola"#?` | `(##", 4, hola)` |
| Carácter | `##'` | `'A'#?` | `(##', 1, A)` |
| Booleano | `##?` | `#1#?` | `(##?, 1, #1)` |
| Lista | `##]` | `[1,2,3]#?` | `(##], 3, [1, 2, 3])` |
| Tupla | `##)` | `(1,2)#?` | `(##), 2, (1, 2))` |
| Sin valor | `##_` | _(unit)_ | `(##_, 0, _)` |

El campo "tamaño" indica: para enteros, el número de dígitos; para texto, la longitud en caracteres; para listas, la cantidad de elementos.

---

## Usar `#?` para tomar decisiones según el tipo

El tipo extraído por `#?` es un valor interno del lenguaje, no una cadena de texto. Para compararlo, hay que obtener el tipo de un literal conocido y usarlo como referencia:

```
verificar(x) {
    meta = x#?
    tipo = meta[1]

    // Tipos de referencia extraídos de literales conocidos
    ri = 0#?    ;  ti = ri[1]      // tipo Int
    rf = 0.0#?  ;  tf = rf[1]      // tipo Float
    rs = ""#?   ;  ts = rs[1]      // tipo String
    rb = #0#?   ;  tb = rb[1]      // tipo Bool
    rl = []#?   ;  tl = rl[1]      // tipo List

    ? (tipo == ti) { >> "Es un entero: " x ¶ }
    _? (tipo == tf) { >> "Es un flotante: " x ¶ }
    _? (tipo == ts) { >> "Es texto de " (meta[2]) " caracteres" ¶ }
    _? (tipo == tb) { >> "Es booleano" ¶ }
    _? (tipo == tl) { >> "Es lista de " (meta[2]) " elementos" ¶ }
    _ { >> "Otro tipo" ¶ }
}

verificar(42)
verificar(3.14)
verificar("hola")
verificar(#1)
```

Resultado:
```
Es un entero: 42
Es un flotante: 3.14
Es texto de 4 caracteres
Es booleano
```

---

## `#|..|` — Convertir texto a número

`#|expr|` intenta convertir una expresión de texto a su valor numérico. Si la conversión tiene éxito, devuelve el número. Si falla, devuelve el texto original sin lanzar un error.

```
v1 = #|"42"|
>> v1 ¶    // → 42  (entero)

v2 = #|"3.14"|
>> v2 ¶    // → 3.14  (flotante)

v3 = #|"abc"|
>> v3 ¶    // → abc  (no convirtió — devuelve el original)

v4 = #|99|
>> v4 ¶    // → 99  (ya era número, pasa sin cambios)
```

### Verificar si la conversión tuvo éxito

Como `#|..|` no lanza error, necesitas verificar el tipo del resultado para saber si funcionó:

```
intentar_convertir(texto) {
    resultado = #|texto|
    meta = resultado#?
    tipo = meta[1]

    ri = 0#?   ;  ti = ri[1]
    rf = 0.0#? ;  tf = rf[1]
    ? (tipo == ti) || (tipo == tf) {
        >> "Convertido: " resultado ¶
    } _ {
        >> "'" texto "' no es un número" ¶
    }
}

intentar_convertir("123")
intentar_convertir("45.6")
intentar_convertir("xyz")
```

Resultado:
```
Convertido: 123
Convertido: 45.6
'xyz' no es un número
```

---

## Dígitos Unicode

`#|..|` reconoce los 69 sistemas de dígitos que soporta Zymbol, no solo ASCII:

```
v5 = #|"๔๒"|    // dígitos tailandeses
>> v5 ¶          // → 42

v6 = #|"४२"|    // dígitos devanagari
>> v6 ¶          // → 42
```

Todos los sistemas de dígitos que el lexer reconoce como literales numéricos también funcionan dentro de `#|..|`.

---

## Programa completo de esta lección

Un validador de entradas que acepta texto del usuario y verifica que sea un número en rango:

```
validar_entrada(texto, minimo, maximo) {
    valor = #|texto|
    meta  = valor#?
    tipo  = meta[1]

    ri = 0#?   ;  ti = ri[1]
    rf = 0.0#? ;  tf = rf[1]
    ? (tipo <> ti) && (tipo <> tf) {
        <~ (valido: #0, mensaje: "No es un número")
    }

    ? valor < minimo || valor > maximo {
        <~ (valido: #0, mensaje: "Fuera de rango ({minimo}–{maximo})")
    }

    <~ (valido: #1, mensaje: "OK", valor: valor)
}

pruebas = ["25", "abc", "-5", "150", "75"]

@ t:pruebas {
    r = validar_entrada(t, 0, 100)
    ? r.valido {
        >> t " → válido (" r.valor ")" ¶
    } _ {
        >> t " → inválido: " r.mensaje ¶
    }
}
```

Resultado:
```
25 → válido (25)
abc → inválido: No es un número
-5 → inválido: Fuera de rango (0–100)
150 → inválido: Fuera de rango (0–100)
75 → válido (75)
```

---

## Resumen

| Concepto | Sintaxis | Devuelve |
|---|---|---|
| Metadatos de tipo | `valor#?` | `(símbolo, tamaño, valor)` |
| Extraer símbolo | `(valor#?)[1]` | `###`, `##.`, `##"`, etc. |
| Convertir texto a número | `#\|texto\|` | Número o texto original |

---

Siguiente lección: [08 — Módulos](08_modulos.md)

[← Lección anterior](06_errores.md) · [Índice](README.md)
