# Lección 01 — Tuplas

Las listas guardan colecciones de valores del mismo tipo: una lista de números, una lista de textos. Pero hay situaciones donde necesitas agrupar valores de tipos distintos que describen una sola cosa: el nombre y la edad de una persona, las coordenadas x e y de un punto, el código y el precio de un producto.

Para eso existen las **tuplas**: contenedores inmutables que pueden mezclar tipos y, opcionalmente, nombrar cada campo.

---

## Tupla posicional

La forma más directa: valores entre paréntesis separados por comas. Se acceden por índice (1-based, igual que las listas).

```
punto = (10, 20)
>> punto[1] ¶    // → 10
>> punto[2] ¶    // → 20
```

A diferencia de las listas, una tupla puede mezclar tipos:

```
dato = (42, "activo", #1, 3.14)
>> dato[1] ¶    // → 42
>> dato[2] ¶    // → activo
>> dato[3] ¶    // → #1
```

---

## Tupla con campos nombrados

Cuando la posición no es suficiente para entender qué representa cada valor, los campos nombrados hacen el código autoexplicativo:

```
persona = (nombre: "Ana", edad: 25, activa: #1)

// Acceso por nombre (recomendado)
>> persona.nombre ¶    // → Ana
>> persona.edad ¶      // → 25

// Acceso por índice (también válido)
>> persona[1] ¶        // → Ana
>> persona[2] ¶        // → 25
```

Se lee: *"persona punto nombre"* — como acceder a una propiedad.

---

## Tuplas anidadas

Los campos pueden ser otras tuplas:

```
pos   = (x: 10, y: 20)
circulo = (centro: pos, radio: 5, color: "rojo")

>> circulo.radio ¶        // → 5
>> circulo.centro.x ¶     // → 10
>> circulo.centro.y ¶     // → 20
```

---

## Inmutabilidad

Una tupla no se puede modificar después de crearse. Intentarlo produce un error en tiempo de ejecución:

```
t = (10, 20, 30)
t[1] = 99     // ❌ error: cannot modify tuple 't': tuples are immutable
t[1] += 5     // ❌ mismo error
```

Si necesitas una versión modificada, creas una nueva tupla. Para tuplas posicionales, el operador `$~` lo hace directamente — el original nunca se toca:

```
t  = (10, 20, 30)
t2 = t[2]$~ 999

>> t ¶     // → (10, 20, 30)    ← original intacto
>> t2 ¶    // → (10, 999, 30)   ← nueva tupla
```

Para tuplas con campos nombrados, la reconstrucción explícita es la forma correcta:

```
persona  = (nombre: "Ana", edad: 25)
un_año_mayor = (nombre: persona.nombre, edad: 26)

>> persona.edad ¶        // → 25
>> un_año_mayor.edad ¶   // → 26
```

---

## Tuplas como valores de retorno

Una función puede devolver múltiples valores empaquetados en una tupla:

```
dividir(a, b) {
    cociente  = a / b
    resto     = a % b
    <~ (cociente: cociente, resto: resto)
}

resultado = dividir(17, 5)
>> resultado.cociente ¶    // → 3
>> resultado.resto ¶       // → 2
```

---

## Listas de tuplas

Puedes crear listas donde cada elemento es una tupla — útil para representar tablas de datos:

```
productos = [
    (nombre: "pan",   precio: 1.50),
    (nombre: "leche", precio: 2.00),
    (nombre: "queso", precio: 4.75)
]

@ p:productos {
    >> p.nombre " — $" p.precio ¶
}
```

Resultado:
```
pan — $1.5
leche — $2.0
queso — $4.75
```

---

## Tuplas vs listas

| | Lista `[]` | Tupla `()` |
|---|---|---|
| Tipos de elementos | Homogéneos (todos iguales) | Heterogéneos (pueden mezclar) |
| Tamaño | Dinámico (crece y encoge) | Fijo desde la creación |
| Modificación | Elementos mutables | Inmutable — solo crear nuevas |
| Campos nombrados | No | Sí |
| Uso típico | Colecciones de datos del mismo tipo | Registros con estructura fija |

---

## Resumen

| Concepto | Sintaxis |
|---|---|
| Tupla posicional | `(10, 20, 30)` |
| Tupla con nombres | `(x: 10, y: 20)` |
| Acceso por nombre | `tupla.campo` |
| Acceso por índice | `tupla[1]` |
| Actualización funcional | `tupla[i]$~ nuevo_valor` |
| Reconstrucción con nombre | `(campo: nueva_tupla.campo, ...)` |

---

Siguiente lección: [02 — Desestructuración](02_destructuracion.md)

[← Nivel Básico](../basico/README.md) · [Índice](README.md)
