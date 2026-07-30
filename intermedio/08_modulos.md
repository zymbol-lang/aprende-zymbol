# Lección 08 — Módulos

> **Revisado para v0.0.7 — 2026-07-12**

A medida que un programa crece, mantenerlo todo en un solo archivo se vuelve impráctico. El código se mezcla, las responsabilidades se difuminan, y modificar una parte sin afectar otra se convierte en un ejercicio de cuidado extremo.

Los **módulos** son la respuesta: archivos `.zy` independientes, cada uno con su propia declaración de nombre, que exponen solo lo que deciden exponer y mantienen privado todo lo demás.

---

## Estructura de un módulo

Un módulo es un archivo `.zy` cuyo contenido completo va dentro de un bloque con nombre. El nombre debe coincidir con el nombre del archivo (sin la extensión):

```
// archivo: matematica.zy
# matematica {

}
```

Dentro del bloque, `#>` declara qué se exporta:

```
// archivo: matematica.zy
# matematica {
    #> {
        sumar
        restar
        PI
    }

    PI := 3.14159

    sumar(a, b)  { <~ a + b }
    restar(a, b) { <~ a - b }

    _privado(x) { <~ x * x }    // no está en #> — inaccesible desde fuera
}
```

Lo que no está en `#>` es privado. Llamar a `_privado` desde otro archivo produce un error.

---

## Importar un módulo

En el archivo que usa el módulo, `<#` importa y asigna un alias con `=>`:

```
<# ./matematica => m

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
<# ./modulo => m          // mismo directorio
<# ../compartido => s     // directorio padre
<# ./sub/carpeta => c     // subdirectorio
```

La ruta es relativa al archivo que importa. No se incluye la extensión `.zy`.

> Con la misma sintaxis se importan los módulos de la **biblioteca estándar**: `<# std/math => mat`. Los verás en la lección 09.

---

## Constantes vs variables privadas

Hay una diferencia importante entre `:=` y `=` a nivel de módulo:

| Declaración | Exportable | Accesible externamente | Persiste entre llamadas |
|---|---|---|---|
| `PI := 3.14` | Sí | `alias.PI` (solo lectura) | Sí (inmutable) |
| `contador = 0` | No | ✗ error | **Sí** — se mantiene entre llamadas |
| `funcion()` | Sí (si está en `#>`) | `alias::funcion()` | — |

Las variables con `=` a nivel de módulo son **estado privado mutable** que persiste entre llamadas. Solo son accesibles a través de funciones exportadas, y su valor inicial debe ser un literal simple (un número, un texto o un booleano — no una lista ni una expresión):

```
// archivo: contador.zy
# contador {
    #> { incrementar, obtener }

    cuenta = 0    // privado — solo accesible por las funciones de abajo

    incrementar() { cuenta = cuenta + 1 }
    obtener()     { <~ cuenta }
}
```

```
// archivo: main.zy
<# ./contador => c

c::incrementar()
c::incrementar()
c::incrementar()
n = c::obtener()
>> n ¶    // → 3
```

> ⚠️ **Muta el estado solo en la función llamada con `alias::`.** En v0.0.7, si una
> función exportada delega la modificación del estado a otra función del mismo módulo
> (una ayudante interna), ese cambio **se pierde** al terminar la llamada en el
> intérprete por defecto:
>
> ```
> # contador {
>     #> { incrementar_mal, obtener }
>     cuenta = 0
>     sumar()           { cuenta = cuenta + 1 }   // ayudante interna
>     incrementar_mal() { sumar() }               // ❌ el cambio de 'sumar' se pierde
>     obtener()         { <~ cuenta }
> }
> ```
>
> Regla práctica: la función exportada que recibe la llamada `alias::` debe hacer la
> asignación ella misma; las ayudantes internas pueden **leer** el estado y devolver
> valores, pero no modificarlo.

> ⚠️ **Nunca reasignes una constante del módulo dentro de sus funciones.** Los módulos
> importados en tiempo de ejecución no pasan por el análisis semántico completo, así
> que `MAX = 5` dentro de una función del módulo no da error — y deja el módulo en un
> estado inconsistente: las funciones ven el valor nuevo pero `alias.MAX` sigue
> mostrando el original. Ejecuta `zymbol check modulo.zy` sobre cada archivo de módulo
> para detectar estas reasignaciones antes de ejecutar.

---

## Alias de exportación

Puedes exportar con un nombre diferente al interno usando `=>`:

```
// archivo: utilidades.zy
# utilidades {
    #> {
        _funcion_interna => publica
        CONSTANTE_INTERNA => PUBLICA
    }

    _funcion_interna(x) { <~ x * 2 }
    CONSTANTE_INTERNA := 100
}
```

El llamador usa `alias::publica()` y `alias.PUBLICA` — los nombres internos son invisibles.

---

## Re-exportar desde otro módulo

Un módulo puede importar funciones de otro y re-exportarlas:

```
// archivo: paquete.zy
# paquete {
    <# ./core => c

    #> {
        c::sumar           // re-exporta como es (callers usan alias::sumar)
        c::sumar => suma   // re-exporta con nombre diferente
    }
}
```

Este mecanismo es más poderoso de lo que parece: permite publicar la misma biblioteca con nombres en **varios idiomas** sin duplicar ni una línea de lógica. Lo verás a fondo en la lección avanzada sobre programación multilingüe.

---

## Múltiples importaciones

Un archivo puede importar tantos módulos como necesite, cada uno con su propio alias:

```
<# ./matematica  => mat
<# ./texto       => txt
<# ./validacion  => val

resultado = mat::sumar(10, 5)
saludo    = txt::mayusculas("hola")
valido    = val::es_email("x@y.com")
```

---

## Programa completo de esta lección

Un pequeño sistema de registro dividido en tres archivos:

```
// archivo: validacion.zy
# validacion {
    #> { es_valido_usuario, es_valido_email }

    es_valido_usuario(nombre) {
        <~ (nombre$#) >= 3 && (nombre$#) <= 20
    }

    es_valido_email(email) {
        <~ email$? "@"
    }
}
```

```
// archivo: registro.zy
# registro {
    <# ./validacion => v

    #> { crear_usuario }

    total = 0    // estado privado: cuántos usuarios se han registrado

    crear_usuario(nombre, email) {
        ? !v::es_valido_usuario(nombre) {
            <~ (ok: #0, error: "Nombre inválido")
        }
        ? !v::es_valido_email(email) {
            <~ (ok: #0, error: "Email inválido")
        }
        total = total + 1
        <~ (ok: #1, id: total)
    }
}
```

```
// archivo: main.zy
<# ./registro => reg

pruebas = [
    ("Ana", "ana@ejemplo.com"),
    ("X", "no-es-email"),
    ("Luis", "luis@ok.com")
]

@ p:pruebas {
    [n, e] = p
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
| Declarar módulo | `# nombre { ... }` (el nombre debe coincidir con el archivo) |
| Exportar | `#> { funcion, CONSTANTE }` |
| Importar | `<# ./ruta => alias` |
| Llamar función | `alias::funcion(args)` |
| Leer constante | `alias.CONSTANTE` |
| Exportar con alias | `interno => publico` dentro de `#>` |
| Re-exportar | `alias::funcion` o `alias::funcion => nuevo` dentro de `#>` |
| Estado privado | Variable `=` a nivel de módulo (no exportable, inicial literal) |

---

Siguiente lección: [09 — La biblioteca estándar](intermedio/09_biblioteca.md)

[← Lección anterior](intermedio/07_tipos.md) · [Índice](intermedio/README.md)
