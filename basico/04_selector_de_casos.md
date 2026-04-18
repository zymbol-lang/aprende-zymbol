# Lección 04 — Selector de Casos

En la lección 03 aprendiste a tomar decisiones con `?`, `_?` y `_`. Eso funciona muy bien cuando tienes dos o tres posibilidades. Pero imagina que necesitas hacer algo diferente para cada día de la semana, o para cada nota del 0 al 100, o para cada comando que escriba el usuario.

Con `_?` encadenados el código se vuelve largo y difícil de leer. Para eso existe el **selector de casos**: una forma más limpia y expresiva de comparar un valor contra muchas posibilidades a la vez.

En Zymbol el símbolo del selector de casos es `??`. Se lee como **"según el valor de..."**.

---

## La idea básica

Imagina que tienes un semáforo. Según el color, haces algo diferente:

```
color = "verde"

?? color {
    "rojo"    : { >> "Detente"  ¶ }
    "amarillo": { >> "Precaución" ¶ }
    "verde"   : { >> "Avanza"   ¶ }
    _         : { >> "Color desconocido" ¶ }
}
```

Resultado:
```
Avanza
```

Se lee: *"Según el valor de color: si es 'rojo' haz esto, si es 'amarillo' haz esto, si es 'verde' haz esto. En cualquier otro caso, haz lo de abajo."*

El `_` al final es el caso **"en cualquier otro caso"** — funciona como el `_` que ya conoces de las condiciones. Es opcional, pero si el valor no coincide con ningún caso y no hay `_`, el selector simplemente no hace nada.

---

## Selector que devuelve un valor

Hasta ahora el selector ejecutaba un bloque `{ }`. También puede **devolver un valor directamente** — esto lo hace muy cómodo para asignar resultados:

```
nota = 85

calificacion = ?? nota {
    90..100 : "Excelente"
    80..89  : "Muy bien"
    70..79  : "Bien"
    60..69  : "Suficiente"
    _       : "Reprobado"
}

>> "Calificación: " calificacion ¶
```

Resultado:
```
Calificación: Muy bien
```

Se lee: *"calificacion vale lo que diga el selector según nota."*

Nota que aquí los casos usan rangos (`80..89`) — Zymbol verifica si el valor cae dentro de ese rango. Ambos extremos están incluidos.

---

## La diferencia entre los dos estilos

| Estilo | Cuándo usarlo |
|---|---|
| `caso : valor` | cuando cada caso devuelve un resultado simple |
| `caso : { ... }` | cuando cada caso necesita varias instrucciones |

Puedes mezclarlos en el mismo selector si lo necesitas.

---

## Patrones de comparación

A veces no puedes expresar un caso como un valor exacto o un rango simple. Los **patrones de comparación** te permiten comparar el valor examinado con una expresión, sin repetir el nombre de la variable:

```
temperatura = -5

estado = ?? temperatura {
    < 0  : "Bajo cero — hielo"
    < 15 : "Frío"
    < 25 : "Agradable"
    < 35 : "Caluroso"
    _    : "Muy caluroso"
}

>> estado ¶
```

Resultado:
```
Bajo cero — hielo
```

Los patrones se evalúan de arriba hacia abajo. En cuanto uno coincide, los demás se ignoran. Puedes usar `<`, `>`, `<=`, `>=`, `==` y `<>` (distinto).

```
n = 42
?? n {
    == 0  : "cero"
    < 0   : "negativo"
    _     : "positivo"
}
```

---

## Comparar texto

El selector funciona igual con cadenas:

```
comando = "salir"

?? comando {
    "ayuda"  : { >> "Comandos disponibles: ayuda, inicio, salir" ¶ }
    "inicio" : { >> "Volviendo al menú principal..." ¶ }
    "salir"  : { >> "Hasta luego." ¶ }
    _        : { >> "Comando desconocido: '{comando}'" ¶ }
}
```

Resultado:
```
Hasta luego.
```

---

## Comparar un carácter

```
inicial = 'A'

?? inicial {
    'A' : { >> "Empieza con A" ¶ }
    'B' : { >> "Empieza con B" ¶ }
    _   : { >> "Otra letra" ¶ }
}
```

---

## Comparar una lista

El selector puede comparar el contenido de una lista de dos maneras, según el tipo del valor examinado:

**Coincidencia estructural** (el valor es una lista): posición a posición, con `_` como comodín.

```
comando = ["abrir", "archivo.zy"]

?? comando {
    ["abrir",  _] : { >> "Abriendo archivo..." ¶ }
    ["cerrar", _] : { >> "Cerrando archivo..." ¶ }
    ["ayuda"]     : { >> "Mostrando ayuda..." ¶ }
    []            : { >> "No ingresaste ningún comando" ¶ }
    _             : { >> "Comando no reconocido" ¶ }
}
```

Resultado:
```
Abriendo archivo...
```

**Contenencia** (el valor es un número, texto u otro escalar): ¿está el valor dentro de la lista?

```
n = 3
?? n {
    [1, 2] : "bajo"
    [3, 4] : "medio"
    [5, 6] : "alto"
    _      : "otro"
}
// → medio

dia = "lun"
?? dia {
    ["lun", "mar", "mie", "jue", "vie"] : "día hábil"
    ["sab", "dom"]                       : "fin de semana"
    _                                    : "desconocido"
}
// → día hábil
```

## Patrón de variable (ident)

Si usas el nombre de una variable como patrón, Zymbol la busca en tiempo de ejecución:
- Si es un **escalar** → comprueba igualdad con el valor examinado.
- Si es una **lista** → comprueba que el valor examinado esté en ella.

```
dias_habiles = ["lun", "mar", "mie", "jue", "vie"]
hoy = "mar"

tipo = ?? hoy {
    dias_habiles : "día hábil"
    _            : "fin de semana"
}
>> tipo ¶    // → día hábil
```

---

## Guardar el resultado en una variable

El selector siempre devuelve su resultado a una variable. Desde ahí puedes usarlo en cualquier parte:

```
mes = 4

nombre_mes = ?? mes {
    1  : "enero"
    2  : "febrero"
    3  : "marzo"
    4  : "abril"
    5  : "mayo"
    6  : "junio"
    7  : "julio"
    8  : "agosto"
    9  : "septiembre"
    10 : "octubre"
    11 : "noviembre"
    12 : "diciembre"
    _  : "inválido"
}

>> "El mes " mes " es " nombre_mes ¶
```

Resultado:
```
El mes 4 es abril
```

---

## ¿Cuándo usar `??` y cuándo usar `?`?

No hay una regla rígida, pero esta guía te ayuda a decidir:

| Situación | Recomendación |
|---|---|
| Dos posibilidades | `? ... { } _ { }` |
| Tres o más valores exactos | `??` |
| Rangos de números | `??` con `..` |
| Comparaciones (`< 0`, `>= 100`) | `??` con patrón de comparación |
| Condiciones complejas (`&&`, `\|\|`) | `? ... _? ...` |
| Escalar dentro de lista de valores | `??` con patrón de lista `[v1, v2]` |
| Escalar contra variable lista | `??` con patrón ident |
| Comparar texto o listas | `??` |

---

## Programa completo de esta lección

Una calculadora de descuentos según la categoría del cliente:

```
calcular_precio(precio_base, categoria) {
    descuento = ?? categoria {
        "vip"      : 30
        "regular"  : 10
        "nuevo"    : 5
        _          : 0
    }

    ahorro      = precio_base * descuento / 100
    precio_final = precio_base - ahorro

    >> "  Categoría:    {categoria}"   ¶
    >> "  Precio base:  ${precio_base}" ¶
    >> "  Descuento:    {descuento}%"   ¶
    >> "  Ahorro:       ${ahorro}"      ¶
    >> "  Precio final: ${precio_final}" ¶
}

>> "=== Calculadora de descuentos ===" ¶
>> ¶
calcular_precio(1000, "vip")
>> ¶
calcular_precio(1000, "regular")
>> ¶
calcular_precio(1000, "visitante")
```

Resultado:
```
=== Calculadora de descuentos ===

  Categoría:    vip
  Precio base:  $1000
  Descuento:    30%
  Ahorro:       $300
  Precio final: $700

  Categoría:    regular
  Precio base:  $1000
  Descuento:    10%
  Ahorro:       $100
  Precio final: $900

  Categoría:    visitante
  Precio base:  $1000
  Descuento:    0%
  Ahorro:       $0
  Precio final: $1000
```

---

## Resumen

| Concepto | Sintaxis |
|---|---|
| Selector básico | `?? valor { caso : resultado }` |
| Caso con bloque | `caso : { ... }` |
| Rango de números | `80..89 : resultado` |
| Comparación | `< 0 : resultado` |
| Variable escalar | `nombre_var : resultado` |
| Variable lista (contenencia) | `lista_var : resultado` |
| Varios valores | `[1, 2] : resultado` |
| Caso por defecto | `_ : resultado` |
| Comodín en lista | `["abrir", _] : resultado` |

---

Siguiente lección: [05 — Repetición](05_repeticion.md)

[← Lección anterior](03_decisiones.md) · [Índice](README.md)
