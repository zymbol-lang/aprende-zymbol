# Lección 05 — Tuberías

Cuando encadenas varias transformaciones, el código tiende a llenarse de variables intermedias que solo existen para pasar el resultado de una operación a la siguiente:

```
paso1 = datos$| (x -> x > 0)
paso2 = paso1$> (x -> x * 2)
paso3 = paso2$< (0, (acc, x) -> acc + x)
```

Las **tuberías** eliminan esas variables intermedias conectando operaciones directamente, de izquierda a derecha. El resultado de cada expresión fluye hacia la siguiente sin necesidad de nombrar cada paso.

---

## El operador `|>`

`|>` pasa el valor de la izquierda como argumento a la función de la derecha. El símbolo `_` marca exactamente dónde entra ese valor:

```
doble = x -> x * 2

r = 5 |> doble(_)
>> r ¶    // → 10
```

Se lee: *"5 pasa a doble"*. El `_` indica la posición del valor entrante dentro de los argumentos.

---

## `_` como marcador de posición

El `_` es obligatorio — indica exactamente dónde entra el valor que viene por la tubería. Esto permite usarlo en cualquier posición del argumento:

```
sumar = (a, b) -> a + b

// El valor de la tubería entra como primer argumento
r1 = 10 |> sumar(_, 5)
>> r1 ¶    // → 15

// El valor de la tubería entra como segundo argumento
r2 = 5 |> sumar(2, _)
>> r2 ¶    // → 7
```

---

## Tubería encadenada

El valor fluye de izquierda a derecha por todos los pasos:

```
inc    = x -> x + 1
doble  = x -> x * 2

r = 5 |> doble(_) |> inc(_) |> doble(_)
>> r ¶    // → 22    (5 → 10 → 11 → 22)
```

Cada `|>` toma el resultado anterior y lo pasa al siguiente. Sin tuberías el mismo cálculo requiere tres variables intermedias o paréntesis anidados difíciles de leer.

---

## Tubería con lambda inline

No necesitas tener la lambda en una variable — puedes escribirla directamente en la tubería:

```
r = 5 |> (x -> x * 3)(_)
>> r ¶    // → 15
```

---

## Tubería con cierre

La lambda puede capturar variables del entorno donde está definida:

```
factor = 4
r = 7 |> (x -> x * factor)(_)
>> r ¶    // → 28
```

---

## Tuberías con transformación de listas

Las tuberías se combinan naturalmente con `$>`, `$|` y `$<` para expresar pipelines de datos de forma legible:

```
numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Sin tuberías
paso1 = numeros$| (x -> x % 2 == 0)
paso2 = paso1$> (x -> x * x)
suma  = paso2$< (0, (acc, x) -> acc + x)
>> suma ¶    // → 220

// Con encadenamiento directo (equivalente, más legible)
resultado = numeros $| (x -> x % 2 == 0) $> (x -> x * x) $< (0, (acc, x) -> acc + x)
>> resultado ¶    // → 220
```

Para cadenas largas, las variables intermedias suelen ser más legibles. Usa tuberías cuando la cadena tiene dos o tres pasos y cada uno cabe cómodamente en una línea.

---

## Cuándo usar tuberías

Las tuberías son más útiles cuando:

- La cadena de transformaciones es lineal (un resultado → siguiente paso)
- Los pasos intermedios no tienen nombre propio útil
- Quieres leer el código como una secuencia de acciones

Las variables intermedias son mejores cuando:

- Quieres depurar un paso específico
- Cada paso tiene un nombre que clarifica el código
- La cadena tiene bifurcaciones (el mismo resultado se usa en dos sitios)

---

## Resumen

| Concepto | Sintaxis |
|---|---|
| Tubería básica | `valor \|> funcion(_)` |
| Posición específica | `valor \|> funcion(arg, _, arg)` |
| Lambda inline | `valor \|> (x -> expr)(_)` |
| Encadenado | `valor \|> f(_) \|> g(_) \|> h(_)` |

---

Siguiente lección: [06 — Manejo de errores](intermedio/06_errores.md)

[← Lección anterior](intermedio/04_transformacion.md) · [Índice](intermedio/README.md)
