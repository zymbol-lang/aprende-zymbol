# Lección 01 — Alcance y tiempo de vida

> **Revisado para v0.0.8 — 2026-08-05**

En las lecciones anteriores aprendiste que las variables viven dentro del bloque donde se declaran y desaparecen cuando ese bloque termina. Eso es el comportamiento predeterminado. Pero Zymbol ofrece dos mecanismos adicionales para controlar la vida de una variable con más precisión: el prefijo `_` y el operador de destrucción explícita `\`.

---

## Variables `_nombre` — alcance estrictamente local

Una variable cuyo nombre empieza con `_` tiene una restricción adicional: **no es visible desde bloques internos**. Solo existe exactamente en el bloque donde se declara — ni más arriba, ni más abajo.

```
? #1 {
    _temporal = 42
    >> _temporal ¶    // → 42  (dentro del mismo bloque: accesible)
}
// _temporal ya no existe aquí
```

Hasta aquí se parece a una variable normal. La diferencia aparece cuando intentas acceder a ella desde un bloque anidado:

```
? #1 {
    _dato = 100

    ? #1 {
        >> _dato ¶    // ❌ error semántico: no se puede acceder a _dato desde un bloque interno
    }
}
```

Una variable regular sí sería visible ahí. El prefijo `_` lo impide explícitamente.

---

## Por qué existe esta restricción

Las variables `_` comunican intención: *este valor es estrictamente temporal y no debe escapar de aquí*. El compilador lo verifica en la fase de análisis semántico, antes de ejecutar el programa.

Esto evita un error sutil: declarar algo como "temporal" en un bloque exterior y luego accidentalmente modificarlo desde un bucle o condición interior, alterando su valor de formas inesperadas.

```
// Correcto — _resultado solo vive en su bloque
? necesita_calculo {
    _resultado = calcular()
    guardar(_resultado)
}   // _resultado destruido aquí, imposible acceder desde fuera

// También correcto — dos _temp independientes en bloques hermanos
? condicion_a {
    _temp = valor_a()
    procesar(_temp)
}
? condicion_b {
    _temp = valor_b()    // este _temp es completamente independiente del anterior
    procesar(_temp)
}
```

---

## Variables `_` en bucles

El mismo principio aplica en `@`. La variable del bloque no puede modificarse desde adentro del bucle si tiene prefijo `_`:

```
// Incorrecto — _contador no puede accederse desde el cuerpo del bucle
_contador = 0
@ i:1..5 {
    _contador = _contador + 1    // ❌ error semántico
}

// Correcto — usar variable regular para acumular entre iteraciones
contador = 0
@ i:1..5 {
    contador = contador + 1    // ✓
}
>> contador ¶    // → 5
```

---

## `\ var` — destrucción explícita

Por defecto, una variable vive hasta el final de su bloque. Con `\` puedes destruirla antes — en el momento exacto en que ya no la necesitas:

```
? #1 {
    datos = cargar_archivo()
    procesar(datos)
    \ datos              // destruida aquí, antes de que termine el bloque
    hacer_otra_cosa()    // datos ya no existe — imposible usarla por error
}
```

Funciona con variables regulares y con variables `_`:

```
? #1 {
    _recurso = abrir_conexion()
    usar(_recurso)
    \ _recurso           // liberada explícitamente
    continuar()
}
```

> ℹ️ **Corregido en v0.0.8.** En v0.0.7, destruir una variable dentro de una función
> marcaba el **nombre** como destruido para todo el programa: si quien llamaba tenía
> su propia variable con ese nombre, al volver de la llamada la veía "destruida" y el
> programa fallaba con `use after destruction`. Desde v0.0.8 la destrucción es local
> al ámbito donde ocurre, en los dos motores:
>
> ```
> limpiar() {
>     x = 5
>     \ x        // solo destruye la 'x' de esta función
>     <~ 1
> }
>
> x = 10
> r = limpiar()
> >> x ¶         // → 10   ✓ la x de fuera nunca se tocó
> ```
>
> Si ves ese error, tu binario es anterior — comprueba con `zymbol --version`.
>
> Regla práctica: usa `\` solo en el nivel superior del programa o con nombres que
> no se repitan fuera de la función (los nombres `_` ayudan a garantizarlo).

---

## La variable del bucle `@` y las variables externas

La variable contadora de un `@` vive dentro del bucle y desaparece al terminar —
**salvo que ya exista una variable con ese nombre afuera**. En ese caso el bucle
la reutiliza, y después del bucle conserva el último valor de la iteración:

```
@ i:1..3 { >> i ¶ }
>> i ¶            // ❌ error: 'i' no existe fuera del bucle
```

```
i = 99
@ i:1..3 { >> i ¶ }
>> i ¶            // → 3  (el bucle reutilizó y sobrescribió la 'i' externa)
```

Si no quieres que un bucle pise una variable tuya, no uses el mismo nombre para
el contador — o usa un contador con prefijo `_` cuando no lo necesites en el cuerpo.

---

## Cuándo usar cada mecanismo

| Mecanismo | Úsalo cuando... |
|---|---|
| Variable regular | El valor necesita ser leído o modificado desde bloques internos |
| `_nombre` | El valor es estrictamente local al bloque actual — no debe filtrarse |
| `\ var` | Quieres liberar un recurso o señalar explícitamente que ya terminaste con ese valor |

---

## Resumen

| Concepto | Sintaxis | Efecto |
|---|---|---|
| Variable con alcance estricto | `_nombre = valor` | No accesible desde bloques internos |
| Destrucción explícita | `\ nombre` | Libera la variable antes del fin del bloque |

---

Siguiente lección: [02 — Indexación multidimensional](avanzado/02_indexacion.md)

[← Nivel Intermedio](intermedio/README.md) · [Índice](avanzado/README.md)
