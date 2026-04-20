# Lección 06 — Manejo de errores

Hasta aquí todos los programas que has escrito asumen que todo saldrá bien: que la lista tiene elementos, que el número no es cero, que el archivo existe. En programas reales eso no se puede asumir.

El **manejo de errores** no es una característica avanzada — es parte del diseño de cualquier programa que interactúa con el mundo real. Zymbol ofrece un mecanismo explícito y tipificado para atrapar, identificar y responder a errores sin que el programa termine abruptamente.

---

## `!?` — Bloque de intento

`!?` envuelve el código que podría fallar. Si algo falla dentro del bloque, la ejecución salta al manejador correspondiente. Si no falla nada, los manejadores se saltan.

```
!? {
    x = 10 / 0
    >> "nunca llega aquí" ¶
} :! ##Div {
    >> "división por cero atrapada" ¶
}
```

Resultado:
```
división por cero atrapada
```

---

## `:!` — Capturar un error tipificado

Zymbol identifica los errores por tipo. Puedes tener varios manejadores, uno por tipo:

```
!? {
    arr = [1, 2, 3]
    v = arr[10]
} :! ##Index {
    >> "índice fuera de rango" ¶
} :! ##Div {
    >> "división por cero" ¶
} :! {
    >> "otro error: " _err ¶
}
```

Los manejadores se evalúan en orden. En cuanto uno coincide, los demás se ignoran. El manejador genérico `:!` sin tipo atrapa cualquier error que no fue capturado antes — la variable `_err` contiene el mensaje del error.

### Tipos de error disponibles

| Tipo | Cuándo ocurre |
|---|---|
| `##Div` | División por cero |
| `##Index` | Índice fuera de rango |
| `##Type` | Tipo incorrecto en una operación |
| `##Parse` | Fallo al convertir texto a número |
| `##IO` | Operaciones de archivos o red |
| `##Network` | Errores de red |
| `##_` | Comodín — atrapa cualquier tipo |

---

## `:>` — Bloque final (finally)

`:>` se ejecuta **siempre**, ocurra un error o no. Es el lugar correcto para liberar recursos, cerrar conexiones o registrar que la operación terminó:

```
!? {
    x = 10 / 0
    >> "no llega aquí" ¶
} :! ##Div {
    >> "error atrapado" ¶
} :> {
    >> "esto siempre se ejecuta" ¶
}
```

Resultado:
```
error atrapado
esto siempre se ejecuta
```

Si no hay error:

```
!? {
    >> "operación exitosa" ¶
} :! {
    >> "error" ¶
} :> {
    >> "siempre" ¶
}
```

Resultado:
```
operación exitosa
siempre
```

---

## `$!` — Comprobar si un valor es un error

`$!` aplicado a cualquier valor devuelve `#1` si ese valor es un error, `#0` en caso contrario:

```
x = 42
>> x$! ¶    // → #0  (no es un error)
```

Útil para verificar resultados de operaciones antes de usarlos.

---

## `$!!` — Propagar un error al llamador

`$!!` reenvía un valor de error al llamador de la función, pero **solo si el valor ya es un error** (resultado de una operación fallida). El operador `$!` comprueba si un valor es error antes de propagar:

```
buscar(arr, indice) {
    resultado = arr[indice]    // puede producir ##Index si está fuera de rango
    ? resultado$! {            // $! devuelve #1 si el valor es un error
        resultado$!!           // propaga el error al llamador
    }
    <~ resultado
}

!? {
    nums = [10, 20, 30]
    v = buscar(nums, 99)    // índice fuera de rango
    >> v ¶
} :! {
    >> "error propagado: " _err ¶
}

v2 = buscar([10, 20, 30], 2)
>> v2 ¶    // → 20
```

> `$!!` propaga solo si el valor es un error producido por el runtime. No lanza errores desde valores normales. Solo funciona dentro de **funciones con nombre**.

---

## Bloques `!?` anidados

Un bloque `!?` puede estar dentro de otro. El error lo atrapa el manejador más cercano que coincida:

```
!? {
    !? {
        x = 10 / 0
    } :! ##Div {
        >> "inner: división por cero" ¶
    }
    >> "continúa después del inner" ¶
} :! {
    >> "outer: error general" ¶
}
```

Resultado:
```
inner: división por cero
continúa después del inner
```

El bloque exterior nunca ve el error porque el interior ya lo manejó.

---

## Programa completo de esta lección

Una función que convierte texto a número y maneja los casos de fallo:

```
convertir_nota(texto) {
    !? {
        n = #|texto|
        ? n < 0 || n > 100 {
            n$!!
        }
        <~ n
    } :! ##Parse {
        >> "'" texto "' no es un número válido" ¶
        <~ -1
    } :! {
        >> "'" texto "' fuera del rango 0-100" ¶
        <~ -1
    }
}

entradas = ["85", "abc", "150", "60"]

@ e:entradas {
    nota = convertir_nota(e)
    ? nota >= 0 {
        >> "Nota válida: " nota ¶
    }
}
```

---

## Resumen

| Concepto | Sintaxis |
|---|---|
| Bloque de intento | `!? { ... }` |
| Captura tipificada | `:! ##Tipo { ... }` |
| Captura genérica | `:! { ... _err ... }` |
| Bloque final | `:> { ... }` |
| Comprobar si es error | `valor$!` |
| Propagar al llamador | `? v$! { v$!! }` |

---

Siguiente lección: [07 — Inspección de tipos](intermedio/07_tipos.md)

[← Lección anterior](intermedio/05_tuberias.md) · [Índice](intermedio/README.md)
