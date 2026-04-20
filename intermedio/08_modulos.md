# Lección 08 — Módulos

A medida que un programa crece, mantenerlo todo en un solo archivo se vuelve impráctico. El código se mezcla, las responsabilidades se difuminan, y modificar una parte sin afectar otra se convierte en un ejercicio de cuidado extremo.

Los **módulos** son la respuesta: archivos `.zy` independientes, cada uno con su propia declaración de nombre, que exponen solo lo que deciden exponer y mantienen privado todo lo demás.

---

## Estructura de un módulo

Un módulo es un archivo `.zy` que comienza con una declaración de nombre:

```
# matematica
```

Luego declara qué exporta con el bloque `#>`:

```
# matematica

#> {
    sumar
    restar
    PI
}

PI := 3.14159

sumar(a, b)  { <~ a + b }
restar(a, b) { <~ a - b }

_privado(x) { <~ x * x }    // no está en #> — inaccesible desde fuera
```

Lo que no está en `#>` es privado. Llamar a `_privado` desde otro archivo produce un error en tiempo de ejecución.

---

## Importar un módulo

En el archivo que usa el módulo, `<#` importa y asigna un alias:

```
<# ./matematica <= m

resultado = m::sumar(5, 3)
>> resultado ¶    // → 8

pi = m.PI
>> pi ¶           // → 3.14159
```

El alias es obligatorio. A través de él accedes a todo lo exportado:

- `alias::funcion(args)` — llamar una función exportada
- `alias.CONSTANTE` — leer una constante exportada

---

## Rutas de importación

```
<# ./modulo <= m          // mismo directorio
<# ../compartido <= s     // directorio padre
<# ./sub/carpeta <= c     // subdirectorio
```

La ruta es relativa al archivo que importa. No se incluye la extensión `.zy`.

---

## Constantes vs variables privadas

Hay una diferencia importante entre `:=` y `=` a nivel de módulo:

| Declaración | Exportable | Accesible externamente | Persiste entre llamadas |
|---|---|---|---|
| `PI := 3.14` | Sí | `alias.PI` (solo lectura) | Sí (inmutable) |
| `contador = 0` | No | ✗ error | **Sí** — se mantiene entre llamadas |
| `funcion()` | Sí (si está en `#>`) | `alias::funcion()` | — |

Las variables con `=` a nivel de módulo son **estado privado mutable** que persiste entre llamadas. Solo son accesibles a través de funciones exportadas:

```
// archivo: contador.zy
# contador

#> { incrementar, obtener }

cuenta = 0    // privado — solo accesible por las funciones de abajo

incrementar() { cuenta = cuenta + 1 }
obtener()     { <~ cuenta }
```

```
// archivo: main.zy
<# ./contador <= c

c::incrementar()
c::incrementar()
c::incrementar()
n = c::obtener()
>> n ¶    // → 3
```

---

## Alias de exportación

Puedes exportar con un nombre diferente al interno:

```
# utilidades

#> {
    _funcion_interna <= publica
    CONSTANTE_INTERNA <= PUBLICA
}

_funcion_interna(x) { <~ x * 2 }
CONSTANTE_INTERNA := 100
```

El llamador usa `alias::publica()` y `alias.PUBLICA` — los nombres internos son invisibles.

---

## Re-exportar desde otro módulo

Un módulo puede importar funciones de otro y re-exportarlas:

```
# paquete

<# ./core <= c

#> {
    c::sumar           // re-exporta como es (callers usan alias::sumar)
    c::sumar <= suma   // re-exporta con nombre diferente
}
```

---

## Múltiples importaciones

Un archivo puede importar tantos módulos como necesite, cada uno con su propio alias:

```
<# ./matematica  <= mat
<# ./texto       <= txt
<# ./validacion  <= val

resultado = mat::sumar(10, 5)
saludo    = txt::mayusculas("hola")
valido    = val::es_email("x@y.com")
```

---

## Programa completo de esta lección

Un pequeño sistema de registro dividido en tres archivos:

```
// archivo: validacion.zy
# validacion

#> { es_valido_usuario, es_valido_email }

es_valido_usuario(nombre) {
    <~ (nombre$#) >= 3 && (nombre$#) <= 20
}

es_valido_email(email) {
    <~ email$? "@"
}
```

```
// archivo: registro.zy
# registro

<# ./validacion <= v

#> { crear_usuario }

usuarios = []    // estado privado — lista de usuarios registrados

crear_usuario(nombre, email) {
    ? !v::es_valido_usuario(nombre) {
        <~ (ok: #0, error: "Nombre inválido")
    }
    ? !v::es_valido_email(email) {
        <~ (ok: #0, error: "Email inválido")
    }
    usuarios = usuarios$+ (nombre: nombre, email: email)
    <~ (ok: #1, id: usuarios$#)
}
```

```
// archivo: main.zy
<# ./registro <= reg

pruebas = [
    ("Ana", "ana@ejemplo.com"),
    ("X", "no-es-email"),
    ("Luis", "luis@ok.com")
]

@ p:pruebas {
    (nombre: n, email: e) = p
    r = reg::crear_usuario(n, e)
    ? r.ok {
        >> "Registrado: " n " (id=" r.id ")" ¶
    } _ {
        >> "Error con " n ": " r.error ¶
    }
}
```

Resultado:
```
Registrado: Ana (id=1)
Error con X: Nombre inválido
Registrado: Luis (id=2)
```

---

## Resumen

| Concepto | Sintaxis |
|---|---|
| Declarar módulo | `# nombre` (primera línea del archivo) |
| Exportar | `#> { funcion, CONSTANTE }` |
| Importar | `<# ./ruta <= alias` |
| Llamar función | `alias::funcion(args)` |
| Leer constante | `alias.CONSTANTE` |
| Exportar con alias | `interno <= publico` dentro de `#>` |
| Estado privado | Variable `=` a nivel de módulo (no en `#>`) |

---

Siguiente nivel: [Avanzado →](avanzado/README.md)

[← Lección anterior](intermedio/07_tipos.md) · [Índice](intermedio/README.md)
