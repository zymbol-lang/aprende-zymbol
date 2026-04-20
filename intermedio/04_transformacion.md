# Lección 04 — Transformación de listas

Con bucles puedes hacer cualquier cosa con una lista. Pero hay tres operaciones que aparecen tan frecuentemente que Zymbol les da operadores propios: transformar cada elemento, quedarse solo con los que cumplen una condición, y reducir toda la lista a un único valor.

Estas operaciones se llaman **mapear**, **filtrar** y **reducir**. Son las herramientas fundamentales del procesamiento de datos.

---

## `$>` — Mapear

Aplica una lambda a cada elemento y devuelve una nueva lista con los resultados. La lista original no se modifica.

```
numeros = [1, 2, 3, 4, 5]

dobles = numeros$> (x -> x * 2)
>> dobles ¶    // → [2, 4, 6, 8, 10]
```

Se lee: *"numeros mapeados con x produce x por 2"*.

Otros ejemplos:

```
palabras = ["hola", "mundo", "zymbol"]

// Longitud de cada palabra
longitudes = palabras$> (p -> p$#)
>> longitudes ¶    // → [4, 5, 6]
```

---

## `$|` — Filtrar

Aplica una condición a cada elemento y devuelve solo los que la cumplen:

```
numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

pares = numeros$| (x -> x % 2 == 0)
>> pares ¶    // → [2, 4, 6, 8, 10]

mayores_de_5 = numeros$| (x -> x > 5)
>> mayores_de_5 ¶    // → [6, 7, 8, 9, 10]
```

Se lee: *"numeros filtrados donde x cumple la condición"*.

---

## `$<` — Reducir

Combina todos los elementos en un único valor acumulando desde un valor inicial:

```
numeros = [1, 2, 3, 4, 5]

suma = numeros$< (0, (acc, x) -> acc + x)
>> suma ¶    // → 15
```

Se lee: *"numeros reducidos empezando en 0, donde acc es el acumulador y x es el elemento actual"*.

El primer argumento es el valor inicial del acumulador. La lambda recibe dos parámetros: el acumulador hasta ese momento y el elemento actual.

Más ejemplos:

```
// Producto de todos los elementos
producto = numeros$< (1, (acc, x) -> acc * x)
>> producto ¶    // → 120

// Concatenar textos
palabras = ["uno", "dos", "tres"]
frase = palabras$< ("", (acc, p) -> "{acc} {p}")
>> frase ¶    // →  uno dos tres
```

---

## Funciones con nombre dentro de HOF

Los operadores `$>`, `$|` y `$<` requieren lambdas inline. Si tienes una función con nombre, envuélvela:

```
doble(x) { <~ x * 2 }
es_grande(x) { <~ x > 5 }

numeros = [1, 2, 3, 4, 5, 6, 7, 8]

resultado  = numeros$> (x -> doble(x))
>> resultado ¶    // → [2, 4, 6, 8, 10, 12, 14, 16]

filtrado = numeros$| (x -> es_grande(x))
>> filtrado ¶    // → [6, 7, 8]
```

---

## Encadenar operaciones

Las operaciones se encadenan a través de variables intermedias — el resultado de una se pasa a la siguiente:

```
numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Filtrar los mayores de 3, luego elevar al cuadrado
paso1 = numeros$| (x -> x > 3)
paso2 = paso1$> (x -> x * x)
>> paso2 ¶    // → [16, 25, 36, 49, 64, 81, 100]
```

---

## Reducir con bloque lambda

Cuando la lógica de reducción es más compleja que una expresión simple:

```
datos = [3, 1, 4, 1, 5, 9, 2, 6]

maximo = datos$< (datos[1], (max, x) -> {
    ? x > max { <~ x }
    <~ max
})
>> maximo ¶    // → 9
```

---

## Programa completo de esta lección

Análisis de una lista de calificaciones: promedio, aprobados y reprobados:

```
notas = [85, 42, 91, 67, 38, 76, 55, 90, 29, 83]

aprobadas  = notas$| (n -> n >= 60)
reprobadas = notas$| (n -> n < 60)
suma       = notas$< (0, (acc, n) -> acc + n)
promedio   = suma / (notas$#)

>> "Total:      " (notas$#) ¶
>> "Aprobados:  " (aprobadas$#) ¶
>> "Reprobados: " (reprobadas$#) ¶
>> "Promedio:   " promedio ¶
```

Resultado:
```
Total:      10
Aprobados:  7
Reprobados: 3
Promedio:   65
```

---

## Resumen

| Operador | Nombre | Qué hace | Sintaxis |
|---|---|---|---|
| `$>` | Mapear | Transforma cada elemento | `lista$> (x -> expr)` |
| `$|` | Filtrar | Conserva los que cumplen la condición | `lista$| (x -> condición)` |
| `$<` | Reducir | Acumula todos en un valor | `lista$< (inicio, (acc, x) -> expr)` |

---

Siguiente lección: [05 — Tuberías](intermedio/05_tuberias.md)

[← Lección anterior](intermedio/03_lambdas.md) · [Índice](intermedio/README.md)
