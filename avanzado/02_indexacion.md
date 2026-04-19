# Lección 02 — Indexación multidimensional

Las listas de una dimensión se acceden con un índice: `arr[3]`. Pero cuando los datos tienen estructura jerárquica — matrices, cubos de datos, tablas de tablas — necesitas navegar varios niveles en una sola operación.

Zymbol usa el símbolo `>` dentro de los corchetes como separador de profundidad. Cada `>` desciende un nivel en la estructura anidada.

---

## Acceso escalar profundo

`arr[i>j]` accede al elemento en la fila `i`, columna `j`. Todos los índices son 1-based, igual que en listas normales. Los índices negativos funcionan igual: `-1` es el último elemento.

```
m = [[1,2,3], [4,5,6], [7,8,9]]

>> m[2>3] ¶       // → 6    (fila 2, columna 3)
>> m[1>1] ¶       // → 1    (fila 1, columna 1)
>> m[-1>-1] ¶     // → 9    (última fila, última columna)
```

Para estructuras más profundas, añades más separadores `>`:

```
cubo = [[[1,2],[3,4]], [[5,6],[7,8]]]

>> cubo[1>2>1] ¶    // → 3    (capa 1, fila 2, columna 1)
>> cubo[2>2>2] ¶    // → 8    (capa 2, fila 2, columna 2)
```

---

## Índices calculados

Variables simples funcionan directamente como índices. Expresiones con operadores requieren paréntesis:

```
m = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]]
n    = 4
mitad = 2

>> m[n>n] ¶              // → 16   (variables directas, sin paréntesis)
>> m[(mitad+1)>n] ¶      // → 12   (expresión requiere paréntesis)
>> m[3>(mitad*2)] ¶      // → 12
```

La regla: si el índice es un identificador simple, no necesita paréntesis. Si es una expresión aritmética, sí los necesita.

---

## Extracción plana — múltiples rutas

El punto y coma `;` dentro de los corchetes separa múltiples rutas. El resultado es una lista plana con todos los valores extraídos:

```
m = [[1,2,3], [4,5,6], [7,8,9]]

diagonal = m[1>1 ; 2>2 ; 3>3]
>> diagonal ¶    // → [1, 5, 9]

seleccion = m[1>1 ; 2>3 ; 3>2]
>> seleccion ¶   // → [1, 6, 8]
```

Para envolver una sola ruta en lista, usa doble corchete:

```
>> m[[2>3]] ¶    // → [6]    (lista de un elemento)
```

---

## Extracción estructurada — grupos

Cuando cada grupo de rutas va entre `[...]`, el resultado es una lista de listas. Cada grupo se convierte en una sublista:

```
m = [[1,2,3], [4,5,6], [7,8,9]]

// Cada ruta sola → lista de listas de un elemento
>> m[[1>1] ; [2>3] ; [3>2]] ¶       // → [[1], [6], [8]]

// Varias rutas por grupo → sublistas con múltiples elementos
esquinas = m[[1>1, 1>3] ; [3>1, 3>3]]
>> esquinas ¶        // → [[1, 3], [7, 9]]
>> esquinas[1] ¶     // → [1, 3]
>> esquinas[2] ¶     // → [7, 9]
```

---

## Rangos sobre ejes

`..` dentro de un camino de navegación expande un rango en ese eje. La posición del rango determina qué dimensión se expande.

### Rango en el último paso — expande columnas

```
m = [[1,2,3], [4,5,6], [7,8,9]]

// Fila 1, columnas 2 a 3
>> m[[1>2..3]] ¶                       // → [2, 3]

// Dos grupos con rangos de columnas
>> m[[1>2..3] ; [2>2..3]] ¶            // → [[2, 3], [5, 6]]

// Reconstruir la matriz completa
>> m[[1>1..3] ; [2>1..3] ; [3>1..3]] ¶
// → [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
```

### Rango en un paso intermedio — abanico de filas

El rango se expande en esa dimensión y los pasos siguientes se aplican a cada elemento del rango:

```
// Filas 1-2, columna 2; luego filas 2-3, columna 3
>> m[[1..2>2] ; [2..3>3]] ¶    // → [[2, 5], [6, 9]]
```

### Rangos con variables

Los límites del rango pueden ser variables o expresiones:

```
m = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]]
inicio = 2
fin    = 4

>> m[1>inicio..fin] ¶    // → [2, 3, 4]
```

---

## Datos en tres dimensiones

```
cubo = [
    [[1,2,3], [4,5,6], [7,8,9]],
    [[10,11,12], [13,14,15], [16,17,18]]
]

// Capa 1, filas 1 a 3, columna 2
>> cubo[1>1..3>2] ¶    // → [2, 5, 8]

// Capas 1-2, filas 1-2 (fan-out doble)
>> cubo[1..2>1..2] ¶
// → [[1, 2, 3], [4, 5, 6], [10, 11, 12], [13, 14, 15]]
```

---

## Manejo de errores

El índice `0` es siempre inválido. Los índices fuera de rango producen errores atrapables:

```
m = [[1,2], [3,4]]

!? { >> m[1>0] ¶ } :! ##Index {
    >> "índice 0 no válido" ¶
}

!? { >> m[5>1] ¶ } :! ##Index {
    >> "fuera de rango" ¶
}
```

---

## Nota sobre la sintaxis antigua

La forma encadenada `arr[i][j]` aún funciona pero está deprecada. La forma canónica es `arr[i>j]`:

```
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2][3] ¶    // funciona, pero deprecada
>> m[2>3] ¶     // forma canónica
```

---

## Resumen

| Forma | Resultado | Ejemplo |
|---|---|---|
| `arr[i>j]` | Valor escalar | `m[2>3]` → `6` |
| `arr[i>j>k]` | Valor escalar (3D+) | `cubo[1>2>1]` → `3` |
| `arr[(expr)>j]` | Valor escalar con índice calculado | `m[(n+1)>2]` |
| `arr[p ; q ; r]` | Lista plana | `m[1>1 ; 2>2]` → `[1, 5]` |
| `arr[[p] ; [q]]` | Lista de listas | `m[[1>1] ; [3>3]]` → `[[1], [9]]` |
| `arr[[p,q] ; [r,s]]` | Lista de listas agrupadas | esquinas de una matriz |
| `arr[i>a..b]` | Rango en columnas | `m[[1>1..3]]` → `[1, 2, 3]` |
| `arr[a..b>j]` | Rango en filas (abanico) | `m[[1..2>2]]` → `[2, 5]` |

---

Siguiente lección: [03 — Integración con el sistema](03_sistema.md)

[← Lección anterior](01_alcance.md) · [Índice](README.md)
