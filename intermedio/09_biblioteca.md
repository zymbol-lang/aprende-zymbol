# Lección 09 — La biblioteca estándar

> **Revisado para v0.0.8 — 2026-08-05**

En la lección anterior aprendiste a crear tus propios módulos. Zymbol también trae módulos **ya hechos**, listos para importar: la **biblioteca estándar**. Cubren lo que casi todo programa necesita en algún momento — matemáticas, números al azar, archivos, datos estructurados, red y bases de datos.

Se importan con la misma sintaxis que tus módulos, usando el prefijo `std/`:

```
<# std/math   => mat
<# std/random => azar
```

> Todas las importaciones van juntas al **inicio del archivo**, antes de cualquier otra instrucción.

---

## `std/math` — matemáticas

Funciones matemáticas y las constantes `PI` y `E`:

```
<# std/math => mat

>> mat::sqrt(144) ¶      // → 12       raíz cuadrada
>> mat::pow(2, 10) ¶     // → 1024     potencia
>> mat::round(3.7) ¶     // → 4        redondear al entero más cercano
>> mat::floor(3.7) ¶     // → 3        redondear hacia abajo
>> mat::ceil(3.2) ¶      // → 4        redondear hacia arriba
>> mat::abs(-5) ¶        // → 5        valor absoluto
>> mat::max(3, 8) ¶      // → 8        el mayor de dos
>> mat::min(3, 8) ¶      // → 3        el menor de dos
>> mat.PI ¶              // → 3.141592653589793
```

También incluye trigonometría (`sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`), logaritmos (`ln`, `log`, `exp`) y funciones hiperbólicas (`sinh`, `cosh`, `tanh`, `sigmoid`).

---

## `std/random` — números al azar

```
<# std/random => azar

dado   = azar::entero(1, 6)    // entero entre 1 y 6, ambos incluidos
indice = azar::rango(10)       // entero entre 0 y 9
```

Con `entero` puedes simular dados, sorteos o elegir un elemento al azar de una lista:

```
frutas   = ["manzana", "pera", "uva", "kiwi"]
elegida  = frutas[azar::entero(1, frutas$#)]
>> "Te tocó: " elegida ¶
```

---

## `std/io` — archivos

Leer, escribir y administrar archivos del disco:

```
<# std/io => io

io::write("notas.txt", "primera línea")     // crea (o reemplaza) el archivo
io::append("notas.txt", "\nsegunda línea")  // agrega al final
contenido = io::read("notas.txt")           // lee todo el contenido
>> contenido ¶

>> io::exists("notas.txt") ¶   // → #1 (sí existe)
io::delete("notas.txt")        // borra el archivo
```

También hay `io::list(carpeta)` para listar el contenido de una carpeta y `io::mkdir(ruta)` para crearla.

### Errores suaves

¿Qué pasa si el archivo no existe? El programa **no se detiene**. La función devuelve un **valor de error suave** que compruebas con `$!` (¿es un error?), como aprendiste en la lección de manejo de errores:

```
contenido = io::read("no_existe.txt")

? contenido$! {
    >> "No se pudo leer el archivo" ¶
} _ {
    >> contenido ¶
}
```

Esta es la convención de toda la biblioteca estándar: los fallos del entorno (archivo que no está, red caída, texto mal formado) devuelven un error suave — `##IO(...)`, `##Network(...)`, `##Parse(...)` — que tú decides cómo manejar. En cambio, un error de programación (pasar un número donde va un texto) sí detiene el programa, porque es un defecto que hay que corregir.

---

## `std/json` — datos estructurados

JSON es el formato de texto más común para intercambiar datos entre programas. `std/json` lo convierte a valores de Zymbol y de vuelta:

```
<# std/json => json

texto = "\{\"nombre\": \"Ana\", \"edad\": 30}"
persona = json::decode(texto)

>> persona.nombre ¶    // → Ana
>> persona.edad ¶      // → 30
```

Un objeto JSON se convierte en una **tupla con campos nombrados** (lección 01), y una lista JSON en una **lista** normal. La dirección contraria es `encode`:

```
de_vuelta = json::encode((ciudad: "Lima", habitantes: 10000000))
>> de_vuelta ¶    // → {"ciudad":"Lima","habitantes":10000000}
```

> Al escribir JSON directamente en el código, la llave `{` se escapa como `\{`, porque una llave sin escapar inicia una interpolación dentro del texto.

---

## `std/net` — red

Para hablar con servicios web (APIs):

```
<# std/net => red

respuesta = red::get("https://api.ejemplo.com/datos")
? respuesta$! {
    >> "sin conexión" ¶
} _ {
    datos = json::decode(respuesta)
    // ...
}
```

Están disponibles `get`, `post`, `post_json` y `head`. Los tres primeros aceptan un argumento final opcional con encabezados — una lista de tuplas `(nombre, valor)` — para APIs que piden autenticación. Los fallos de red devuelven un error suave `##Network(...)`.

---

## `std/term` — medir texto en la terminal

Novedad de la **v0.0.8**. Sirve para una pregunta que parece tonta y no lo es: ¿cuánto mide `"手番"` en pantalla?

```
<# std/term => t

>> "手番"$# ¶                  // → 2   caracteres
>> t::width("手番") ¶          // → 4   columnas de terminal
```

Los ideogramas CJK y la mayoría de los emoji ocupan **dos columnas cada uno**. `$#` cuenta unidades de texto, que es lo correcto para casi todo — pero si maquetas una tabla o un marco con ese número, se te descuadra en cuanto aparece un carácter ancho.

```
>> "[" t::pad_right("go", 6) "]" ¶       // → [go    ]
>> "[" t::pad_left("go", 6) "]" ¶        // → [    go]
>> "[" t::center("go", 6) "]" ¶          // → [  go  ]
>> "[" t::truncate("形勢判断", 5) "]" ¶   // → [形勢]
```

| Función | Qué hace |
|---|---|
| `width(s)` | Ancho en columnas de terminal. Acepta texto o un solo carácter |
| `pad_left` / `pad_right` | Rellenan con espacios hasta ocupar N columnas |
| `center` | Centra en N columnas (la columna sobrante va a la derecha) |
| `truncate` | Recorta a N columnas **sin partir un glifo por la mitad** |

Si el texto ya es más ancho que N, las funciones de relleno lo devuelven tal cual: nunca recortan por su cuenta. Y `truncate("形勢判断", 5)` devuelve `"形勢"` (4 columnas) y no medio ideograma.

> Esta biblioteca es la que hace posible que un menú cuadre igual en español, en inglés y en japonés. El [nivel Juegos](juegos/06_marcos.md) la usa para construir paneles enteros sin teclear un solo ancho.

---

## `std/db` — bases de datos

Para programas que guardan datos de forma permanente, `std/db` se conecta a bases de datos (SQLite, PostgreSQL y otras) a través del estándar ODBC del sistema operativo, con `connect`, `query`, `exec` y transacciones.

> **Disponibilidad:** `std/db` viene incluido en los binarios de Windows y en las compilaciones desde código fuente. Los binarios preconstruidos de Linux y macOS no lo incluyen. Es un tema para cuando ya trabajes con datos persistentes; el resto de la biblioteca está disponible en todas las plataformas.

---

## Resumen

| Módulo | Para qué | Funciones principales |
|---|---|---|
| `std/math` | Matemáticas | `sqrt`, `pow`, `round`, `abs`, `max`, `min`, trigonometría, `PI`, `E` |
| `std/random` | Azar | `entero(min, max)`, `rango(n)` |
| `std/io` | Archivos | `read`, `write`, `append`, `exists`, `delete`, `list`, `mkdir` |
| `std/json` | Datos estructurados | `decode`, `encode`, `decode_map` |
| `std/net` | Red | `get`, `post`, `post_json`, `head` |
| `std/term` | Medidas de terminal | `width`, `pad_left`, `pad_right`, `center`, `truncate` |
| `std/db` | Bases de datos | `connect`, `query`, `exec`, transacciones |

Y la regla de oro: **los fallos del entorno son errores suaves** (se comprueban con `$!`), **los errores de programación detienen el programa**.

> ¿Notaste que `sqrt`, `read` o `decode` están en inglés? En el nivel avanzado aprenderás a crear **adaptadores en español** — módulos de una página que re-exportan toda la biblioteca con nombres como `raiz`, `leer` o `decodificar` — usando exactamente el mecanismo de re-exportación de la lección 08.

---

Siguiente nivel: [Avanzado →](avanzado/README.md)

[← Lección anterior](intermedio/08_modulos.md) · [Índice](intermedio/README.md)
