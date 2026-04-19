# Lección 02 — Desestructuración

Cuando una función devuelve una tupla o cuando recorres una lista de registros, frecuentemente necesitas extraer varios valores al mismo tiempo. Sin desestructuración, eso requiere una línea por campo:

```
punto = (x: 10, y: 20, z: 30)
x = punto.x
y = punto.y
z = punto.z
```

La **desestructuración** hace lo mismo en una sola línea, asignando cada parte de una colección directamente a variables individuales.

---

## Desestructuración de listas

Coloca los nombres de las variables entre corchetes a la izquierda del `=`:

```
arr = [10, 20, 30, 40, 50]

[a, b, c] = arr    // a=10  b=20  c=30
```

Solo se asignan las posiciones que declaras — el resto de la lista se ignora.

### Colector de resto `*nombre`

`*nombre` captura todos los elementos que sobran como una nueva lista:

```
[primero, *resto] = arr    // primero=10  resto=[20, 30, 40, 50]

[cabeza, segundo, *cola] = arr    // cabeza=10  segundo=20  cola=[30, 40, 50]
```

### Descartar con `_`

`_` ocupa una posición sin crear ninguna variable:

```
[x, _, z] = [1, 2, 3]    // x=1  z=3  (el 2 se descarta)
```

---

## Desestructuración de tuplas posicionales

Usa paréntesis en lugar de corchetes:

```
punto = (100, 200)
(px, py) = punto    // px=100  py=200

triple = (1, 2, 3)
(h, *cola) = triple    // h=1  cola=[2, 3]
```

---

## Desestructuración de tuplas con nombres

Con tuplas nombradas, especificas el campo que quieres y el nombre de la variable local que lo recibirá:

```
persona = (nombre: "Ana", edad: 25, ciudad: "Lima")

(nombre: n, edad: a) = persona    // n="Ana"  a=25
```

No tienes que extraer todos los campos — solo los que necesitas:

```
(ciudad: donde) = persona    // donde="Lima"
```

Puedes cambiar el nombre libremente:

```
(nombre: quien, ciudad: donde) = persona    // quien="Ana"  donde="Lima"
```

---

## Desestructuración en bucles

Desestructurar dentro de un `@` es especialmente útil cuando recorres listas de tuplas:

```
contactos = [
    (nombre: "Ana", tel: "555-0001"),
    (nombre: "Luis", tel: "555-0002"),
    (nombre: "Mía", tel: "555-0003")
]

@ c:contactos {
    (nombre: n, tel: t) = c
    >> n ": " t ¶
}
```

Resultado:
```
Ana: 555-0001
Luis: 555-0002
Mía: 555-0003
```

---

## Desestructuración de valores de retorno

Cuando una función devuelve una tupla, la desestructuración evita crear una variable intermedia:

```
dividir(a, b) {
    <~ (cociente: a / b, resto: a % b)
}

(cociente: q, resto: r) = dividir(17, 5)
>> "Cociente: " q ¶    // → Cociente: 3
>> "Resto: " r ¶       // → Resto: 2
```

---

## Lo que la desestructuración no hace

Desestructurar siempre **crea nuevas variables** — no actualiza variables existentes:

```
x = 100
[x, y] = [1, 2]    // crea un nuevo x=1, no modifica el x=100 anterior
```

Todos los patrones se resuelven de izquierda a derecha. Si el patrón tiene más variables que elementos en la colección, el programa produce un error en tiempo de ejecución.

---

## Resumen

| Patrón | Ejemplo | Resultado |
|---|---|---|
| Lista básica | `[a, b, c] = [1, 2, 3]` | `a=1 b=2 c=3` |
| Con colector | `[h, *t] = [1, 2, 3]` | `h=1 t=[2,3]` |
| Descartar | `[x, _, z] = [1, 2, 3]` | `x=1 z=3` |
| Tupla posicional | `(px, py) = (10, 20)` | `px=10 py=20` |
| Tupla nombrada | `(campo: var) = tupla` | `var=tupla.campo` |

---

Siguiente lección: [03 — Lambdas y Cierres](03_lambdas.md)

[← Lección anterior](01_tuplas.md) · [Índice](README.md)
