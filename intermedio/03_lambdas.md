# Lección 03 — Lambdas y Cierres

En la lección de funciones aprendiste a definir bloques de código con nombre. Pero hay situaciones donde crear una función con nombre es excesivo: una operación de un solo uso, un comportamiento que se pasa como argumento, una transformación que varía según el contexto.

Para eso existen las **lambdas**: funciones sin nombre que se definen en el lugar donde se usan.

---

## Lambda básica

El símbolo `->` separa los parámetros del cuerpo:

```
doble = x -> x * 2
sumar = (a, b) -> a + b
cuadrado = x -> x * x

>> doble(5) ¶      // → 10
>> sumar(3, 7) ¶   // → 10
>> cuadrado(4) ¶   // → 16
```

Se lee: *"x produce x por 2"*, *"a y b producen a más b"*.

Una lambda de un parámetro no necesita paréntesis. Con dos o más, sí.

---

## Lambda con bloque

Cuando el cuerpo requiere más de una expresión, usas llaves y `<~` para devolver el resultado:

```
describir = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "cero"
}

>> describir(5) ¶     // → positivo
>> describir(-3) ¶    // → negativo
>> describir(0) ¶     // → cero
```

---

## Cierres — capturar el entorno

Una lambda puede usar variables del entorno donde fue creada. Eso la convierte en un **cierre**: lleva consigo el estado que necesita.

```
factor = 3
triplicar = x -> x * factor    // captura 'factor'

>> triplicar(7) ¶    // → 21
```

La lambda recuerda el valor de `factor` aunque esa variable esté fuera de su cuerpo.

### Fábrica de funciones

El patrón más útil de los cierres: una función que devuelve lambdas personalizadas según sus argumentos.

```
hacer_sumador(n) { <~ x -> x + n }

sumar10 = hacer_sumador(10)
sumar20 = hacer_sumador(20)

>> sumar10(5) ¶    // → 15
>> sumar20(5) ¶    // → 25
```

Cada llamada a `hacer_sumador` produce una lambda diferente que captura su propio valor de `n`.

---

## Lambdas como valores de primera clase

En Zymbol, las lambdas son valores como cualquier otro — se guardan en variables, en listas, y se pasan como argumentos.

### Guardar en una variable

```
fn = x -> x * x
>> fn(6) ¶    // → 36
```

### Guardar en una lista

```
operaciones = [x -> x + 1, x -> x * 2, x -> x * x]

>> operaciones[1](5) ¶    // → 6   (suma 1)
>> operaciones[2](5) ¶    // → 10  (multiplica por 2)
>> operaciones[3](5) ¶    // → 25  (eleva al cuadrado)
```

### Pasar como argumento

```
aplicar(f, x) { <~ f(x) }

>> aplicar(x -> x * 3, 7) ¶    // → 21
```

Esta capacidad — pasar funciones como argumentos — es la base de la siguiente lección.

---

## Lambda dentro de lambda

Las lambdas pueden anidarse. El cierre interno captura variables del externo:

```
multiplicador(factor) {
    <~ x -> x * factor
}

doble   = multiplicador(2)
triple  = multiplicador(3)

>> doble(10) ¶    // → 20
>> triple(10) ¶   // → 30
```

---

## Cuándo usar lambdas y cuándo usar funciones con nombre

No hay una regla rígida, pero esta guía cubre la mayoría de los casos:

| Situación | Recomendación |
|---|---|
| Operación de un solo uso | Lambda |
| Operación reutilizada en varios lugares | Función con nombre |
| Comportamiento que se pasa como argumento | Lambda |
| Lógica compleja con más de 3-4 líneas | Función con nombre |
| Necesitas recursión | Función con nombre |

---

## Resumen

| Concepto | Sintaxis |
|---|---|
| Lambda un parámetro | `x -> expr` |
| Lambda varios parámetros | `(a, b) -> expr` |
| Lambda con bloque | `x -> { ... <~ resultado }` |
| Cierre (captura variable) | `x -> x * variable_externa` |
| Fábrica de funciones | `fn(n) { <~ x -> x + n }` |
| Lambda como argumento | `aplicar(x -> x * 2, 5)` |

---

Siguiente lección: [04 — Transformación de listas](04_transformacion.md)

[← Lección anterior](02_destructuracion.md) · [Índice](README.md)
