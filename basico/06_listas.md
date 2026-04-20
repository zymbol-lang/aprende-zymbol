# Lección 06 — Listas

Hasta ahora cada variable guarda un solo valor: un número, un texto, un booleano. Pero hay situaciones donde necesitas guardar varios valores juntos — los nombres de tus contactos, las calificaciones de un examen, los productos de un carrito de compras.

Para eso existen las **listas** (en programación también llamadas *arrays*).

---

## ¿Qué es una lista?

Imagina una caja con compartimentos numerados. Cada compartimento guarda un valor, y puedes acceder a cualquiera de ellos diciendo su número.

```
colores = ["rojo", "verde", "azul", "amarillo"]
```

Esto crea una lista con 4 elementos. Puedes visualizarla así:

```
posición →   1        2        3         4
           ["rojo", "verde", "azul", "amarillo"]
```

> **Importante:** En Zymbol los números de posición empiezan en **1**, no en 0. El primer elemento siempre está en la posición 1. Esto es diferente a la mayoría de los lenguajes, así que vale la pena grabarlo bien.

### Todos los elementos deben ser del mismo tipo

Una lista de números solo puede tener números. Una lista de textos solo puede tener textos. No puedes mezclar:

```
edades   = [25, 30, 18, 42]       // ✅ lista de enteros
nombres  = ["Ana", "Luis", "Sofía"] // ✅ lista de textos
// mezcla = [1, "dos", 3]          // ✗ error de tipo
```

---

## Mostrar una lista

```
frutas = ["manzana", "pera", "uva"]
>> frutas ¶
```

Resultado:
```
[manzana, pera, uva]
```

---

## Acceder a un elemento por su posición

Usa `lista[posición]` para obtener el elemento en esa posición:

```
frutas = ["manzana", "pera", "uva", "mango"]

>> frutas[1] ¶    // → manzana  (el primero)
>> frutas[2] ¶    // → pera
>> frutas[3] ¶    // → uva
>> frutas[4] ¶    // → mango   (el último)
```

### Acceder desde el final con números negativos

Si usas un número negativo, Zymbol cuenta desde el final. `-1` es siempre el último elemento, `-2` el penúltimo, y así:

```
frutas = ["manzana", "pera", "uva", "mango"]

>> frutas[-1] ¶    // → mango    (último)
>> frutas[-2] ¶    // → uva      (penúltimo)
```

Esto es útil cuando no sabes cuántos elementos tiene la lista pero siempre quieres el último.

> **Cuidado:** `lista[0]` no existe en Zymbol y causará un error. Recuerda siempre empezar desde el 1.

---

## Saber cuántos elementos tiene — `$#`

El operador `$#` devuelve la cantidad de elementos:

```
frutas = ["manzana", "pera", "uva", "mango"]
total  = frutas$#

>> "La lista tiene " total " frutas" ¶
```

Resultado:
```
La lista tiene 4 frutas
```

> Cuando uses `$#` directamente dentro de `>>`, ponlo entre paréntesis: `>> (frutas$#) ¶`

---

## Recorrer una lista

Ya lo viste en la lección de repetición, pero ahora que conoces las listas puedes apreciarlo mejor:

```
compras = ["leche", "pan", "huevos", "café"]

>> "Lista de compras:" ¶
@ producto:compras {
    >> "  • " producto ¶
}
```

Resultado:
```
Lista de compras:
  • leche
  • pan
  • huevos
  • café
```

---

## Modificar un elemento

Puedes cambiar el valor de cualquier posición directamente:

```
notas = [8, 7, 9, 6]
>> notas ¶          // → [8, 7, 9, 6]

notas[2] = 10       // cambia el segundo elemento
>> notas ¶          // → [8, 10, 9, 6]
```

---

## Agregar un elemento al final — `$+`

```
frutas = ["manzana", "pera"]
frutas = frutas$+ "uva"
frutas = frutas$+ "mango"

>> frutas ¶
```

Resultado:
```
[manzana, pera, uva, mango]
```

> Nota que escribimos `frutas = frutas$+ "uva"`. Los operadores de lista **devuelven una nueva lista** — hay que guardarla de nuevo en la variable. Si solo escribes `frutas$+ "uva"` sin el `frutas =` al inicio, el resultado se pierde.

---

## Eliminar un elemento

### Por valor — `$-`

Elimina la primera vez que aparece ese valor:

```
numeros = [1, 2, 3, 2, 4]
numeros = numeros$- 2

>> numeros ¶    // → [1, 3, 2, 4]
```

### Por posición — `$-[i]`

Elimina el elemento en esa posición:

```
frutas = ["manzana", "pera", "uva", "mango"]
frutas = frutas$-[2]    // elimina "pera"

>> frutas ¶    // → [manzana, uva, mango]
```

---

## Verificar si un valor existe — `$?`

```
frutas = ["manzana", "pera", "uva"]

tiene_pera  = frutas$? "pera"
tiene_melon = frutas$? "melón"

>> "¿Tiene pera?  " tiene_pera  ¶    // → #1
>> "¿Tiene melón? " tiene_melon ¶    // → #0
```

---

## Ordenar una lista — `$^+` y `$^-`

`$^+` ordena de menor a mayor (o de la A a la Z). `$^-` ordena de mayor a menor:

```
numeros = [5, 2, 8, 1, 9, 3]
palabras = ["naranja", "manzana", "pera", "uva"]

ordenados   = numeros$^+
descendente = numeros$^-
alfabetico  = palabras$^+

>> ordenados   ¶    // → [1, 2, 3, 5, 8, 9]
>> descendente ¶    // → [9, 8, 5, 3, 2, 1]
>> alfabetico  ¶    // → [manzana, naranja, pera, uva]
```

El original no cambia — siempre obtienes una lista nueva que debes guardar en una variable.

---

## Obtener una parte de la lista — `$[inicio..fin]`

A veces solo necesitas una porción. Indica desde qué posición hasta cuál (ambas incluidas):

```
numeros = [10, 20, 30, 40, 50]

primeros_tres = numeros$[1..3]
ultimos_dos   = numeros$[4..5]

>> primeros_tres ¶    // → [10, 20, 30]
>> ultimos_dos   ¶    // → [40, 50]
```

---

## Programa completo de esta lección

Un sistema sencillo de calificaciones que calcula el promedio y muestra la nota más alta y la más baja:

```
calificaciones = [85, 92, 78, 96, 74, 88]

// Calcular suma total
suma = 0
@ nota:calificaciones {
    suma = suma + nota
}

total    = calificaciones$#
promedio = suma / total

ordenadas = calificaciones$^+
mas_baja  = ordenadas[1]
mas_alta  = ordenadas[-1]

>> "=== Reporte de calificaciones ===" ¶
>> ¶
>> "Calificaciones: " calificaciones ¶
>> "Total de notas: " total           ¶
>> "Promedio:       " promedio        ¶
>> "Nota más baja:  " mas_baja        ¶
>> "Nota más alta:  " mas_alta        ¶
```

Resultado:
```
=== Reporte de calificaciones ===

Calificaciones: [85, 92, 78, 96, 74, 88]
Total de notas: 6
Promedio:       85
Nota más baja:  74
Nota más alta:  96
```

---

## Resumen

| Qué quieres hacer | Cómo |
|---|---|
| Crear una lista | `lista = [a, b, c]` |
| Ver el elemento N | `lista[N]` |
| Ver el último | `lista[-1]` |
| Cuántos elementos tiene | `lista$#` |
| Recorrer todos | `@ elemento:lista { }` |
| Cambiar el elemento N | `lista[N] = nuevo` |
| Agregar al final | `lista = lista$+ valor` |
| Eliminar por valor | `lista = lista$- valor` |
| Eliminar por posición | `lista = lista$-[N]` |
| ¿Contiene un valor? | `lista$? valor` |
| Ordenar menor a mayor | `lista$^+` |
| Ordenar mayor a menor | `lista$^-` |
| Tomar una porción | `lista$[inicio..fin]` |

---

Siguiente lección: [07 — Texto](basico/07_texto.md)

[← Lección anterior](basico/05_repeticion.md) · [Índice](basico/README.md)
