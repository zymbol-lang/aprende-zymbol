# Ejercicios

> **Revisado para v0.0.8 — 2026-08-05**

Aquí encontrarás ejercicios para practicar lo que aprendiste en cada lección. Están ordenados de menor a mayor dificultad dentro de cada sección.

**Consejo:** intenta resolverlos sin releer la lección. Si te trabas, revísala — eso también es aprender. No existe el "hice trampa" cuando se trata de aprender a programar.

Al final del documento hay dos proyectos completos para cuando te sientas lista para un reto mayor.

---

## Lección 01 — Tuplas

### Ejercicio 1 — Inventario de tienda

Crea una tupla `inventario` con campos nombrados para tres productos y su cantidad (por ejemplo `manzanas`, `peras`, `naranjas`). Usa `$~` para producir una nueva tupla donde `manzanas` bajó a 7, sin modificar el original.

```
Original:    (manzanas: 10, peras: 5, naranjas: 8)
Actualizado: (manzanas: 7, peras: 5, naranjas: 8)
```

**Pista:** el campo se direcciona por nombre entre comillas: `inventario["manzanas"]$~ 7`.

---

### Ejercicio 2 — Evaluar alumno

Escribe una función `evaluar(nombre, n1, n2, n3)` que devuelva una tupla con el nombre y el promedio de las tres calificaciones. Pruébala con al menos dos alumnos.

```
Ana: promedio 90
Luis: promedio 76
```

**Pista:** el campo `promedio` de la tupla de retorno se calcula como `(n1 + n2 + n3) / 3`.

---

## Lección 02 — Desestructuración

### Ejercicio 3 — Podio de carrera

Tienes una lista con los cinco primeros lugares de una carrera, en orden. Desestructura los tres primeros como `oro`, `plata` y `bronce`, y el resto en un colector.

```
corredores = ["Ana", "Luis", "Mía", "Caro", "Beto"]
```

```
🥇 Ana
🥈 Luis
🥉 Mía
Quedaron fuera: [Caro, Beto]
```

**Pista:** `[oro, plata, bronce, *resto] = corredores`.

---

### Ejercicio 4 — Registrar pedidos

Dada una lista de tuplas con nombre y campos `cliente` y `producto`, recórrela desestructurando cada tupla dentro del bucle y muestra un ticket por línea.

```
pedidos = [
    (cliente: "Ana",  producto: "café"),
    (cliente: "Luis", producto: "té"),
    (cliente: "Mía",  producto: "chocolate")
]
```

```
Ticket: Ana pidió café
Ticket: Luis pidió té
Ticket: Mía pidió chocolate
```

---

## Lección 03 — Lambdas y Cierres

### Ejercicio 5 — Generador de descuentos

Escribe una función `hacer_descuento(porcentaje)` que devuelva una lambda: al aplicarla a un precio, resta ese porcentaje. Crea `descuento10` y `descuento25` y pruébalas sobre el mismo precio.

```
200 con 10% de descuento: 180
200 con 25% de descuento: 150
```

**Pista:** la lambda que devuelves es `x -> x - (x * porcentaje / 100)`.

---

### Ejercicio 6 — Clasificador de edades

Escribe una lambda con bloque `clasificar` que reciba una edad y devuelva `"niño"` (menor a 13), `"adolescente"` (13 a 17), `"adulto"` (18 a 64) o `"adulto mayor"` (65 o más). Pruébala con cuatro edades distintas.

```
8 → niño
15 → adolescente
40 → adulto
70 → adulto mayor
```

**Pista:** una lambda puede tener un bloque `{ ... }` con varios `?`/`_?` y un `<~` final, igual que una función normal.

---

## Lección 04 — Transformación de listas

### Ejercicio 7 — Rebajar y filtrar precios

Tienes una lista de precios. Usa `$>` para restarle $10 a cada uno, y luego `$|` para quedarte solo con los que quedaron por encima de $50.

```
precios = [120, 45, 300, 75, 10]
```

```
Rebajados: [110, 35, 290, 65, 0]
Caros (>50): [110, 290, 65]
```

---

### Ejercicio 8 — Promedio con reduce

Dada una lista de calificaciones, usa `$<` para sumarlas y calcula el promedio dividiendo entre la cantidad de elementos (`$#`).

```
notas = [70, 88, 95, 82, 65]
```

```
Suma: 400
Promedio: 80
```

---

## Lección 05 — Tuberías

### Ejercicio 9 — Cadena de precio

Escribe dos lambdas, `descuento` (resta 10%) y `impuesto` (suma 16%), y encadénalas con `|>` sobre un precio de 200: primero el descuento, luego el impuesto.

```
200 -> descuento -> impuesto = 208
```

---

### Ejercicio 10 — Reescribe el Ejercicio 7 con tuberías

Toma la lista de precios del Ejercicio 7 y resuelve lo mismo (rebajar, filtrar los mayores a 50) encadenando `$|`, `$>` y `$<` en una sola tubería que además sume el resultado final.

```
Suma de caros rebajados: 465
```

**Pista:** `precios $| (x -> x > 50) $> (x -> x - 10) $< (0, (acc, x) -> acc + x)` — nota que aquí se filtra *antes* de rebajar, así que el conjunto de "caros" se decide sobre el precio original.

---

## Lección 06 — Manejo de errores

### Ejercicio 11 — División segura

Escribe una función `div_segura(a, b)` que devuelva el resultado de `a / b`, o `-1` si `b` es cero, usando `!?` / `:!` con `##Div`.

```
10 / 2 = 5
10 / 0 = -1
```

---

### Ejercicio 12 — Acceso seguro a una lista

Escribe una función `obtener_seguro(lista, indice)` que devuelva el elemento en esa posición, o `"N/D"` si el índice está fuera de rango, capturando `##Index`.

```
frutas = ["manzana", "pera", "uva"]
```

```
índice 2: pera
índice 99: N/D
```

---

## Lección 07 — Inspección de tipos

### Ejercicio 13 — Verificador de tipo

Escribe una función `describir(x)` que use `#?` para reportar si el valor es entero, flotante o texto (como hace el ejemplo de la lección, pero con tus propios valores). Pruébala con al menos un entero, un flotante y un texto.

```
describir(42)     → "es un entero"
describir(3.14)   → "es un flotante"
describir("hola") → "es un texto"
```

**Pista:** compara `x#?` (posición 1, el tipo) contra el tipo de referencia de un literal: `0#?`, `0.0#?`, `""#?`.

---

### Ejercicio 14 — Suma selectiva de texto

Tienes una lista de textos que deberían ser números, pero algunos no lo son. Usa `#|..|` para convertir cada uno y `#?` para descartar los que no se convirtieron, sumando solo los válidos.

```
entradas = ["10", "abc", "25", "xyz", "7"]
```

```
Suma válidos: 42
```

**Pista:** si `#|texto|` falla, devuelve el texto original sin cambios — por eso comparar el tipo del resultado contra el tipo `Int` te dice si la conversión funcionó.

---

## Lección 08 — Módulos

### Ejercicio 15 — Módulo de temperatura

Crea un módulo `modulo_temperatura` que exporte `celsius_a_fahrenheit(c)` y `fahrenheit_a_celsius(f)`. Impórtalo desde un script principal y pruébalo en ambas direcciones.

```
25C = 77F
98.6F = 37C
```

---

### Ejercicio 16 — Módulo con estado: semáforo

Crea un módulo `modulo_semaforo` con un campo privado `estado` que empieza en `"rojo"`, y una función `siguiente()` que lo hace avanzar rojo → verde → amarillo → rojo. Exporta también `estado_actual()`.

```
Inicial: rojo
1: verde
2: amarillo
3: rojo
```

**Pista:** el estado privado de un módulo solo puede inicializarse con un literal simple (`estado = "rojo"`), nunca con una lista o una expresión — es una limitación real del lenguaje, no un detalle de estilo.

---

## Lección 09 — La biblioteca estándar

### Ejercicio 17 — Calculadora geométrica

Usa `std/math` para calcular el área de un círculo de radio 5 (`mat.PI * mat::pow(radio, 2)`, redondeada con `mat::round`) y la hipotenusa de un triángulo de catetos 3 y 4 (`mat::sqrt`).

```
Área círculo r=5: 78.53981633974483
Área redondeada: 79
Hipotenusa 3-4: 5
```

---

### Ejercicio 18 — Bitácora con std/io

Escribe un programa que use `std/io` para: crear un archivo con una primera línea, agregarle una segunda con `io::append`, leerlo completo, confirmar que existe, y borrarlo al final.

```
inicio de sesión
venta registrada: $120
¿existe? #1
tras borrar: #0
```

---

## Proyectos completos

Cuando termines los ejercicios anteriores, estos proyectos te permitirán combinar todo lo aprendido en algo más cercano a un programa real.

---

### Proyecto A — Registro de ventas de una cafetería

Un programa que procesa una lista de ventas del día y produce un reporte.

**Lo que debe hacer:**
- Representar cada venta como una tupla con `producto`, `cantidad` y `precio_unitario`
- Calcular el total de cada venta con `$>` (`cantidad * precio_unitario`)
- Filtrar con `$|` las ventas que superan $100
- Sumar el total del día con `$<`
- Calcular el ticket promedio con una división protegida por `!?`/`:! ##Div` (por si la lista viniera vacía)
- Validar con `#|..|` y `#?` una cantidad que llega como texto desde afuera (por ejemplo `"3"` o `"tres"`), descartando la venta si no es un número válido

**Conceptos que usa:** tuplas, transformación de listas, tuberías (opcional, para encadenar filtrar+sumar), manejo de errores, inspección de tipos.

---

### Proyecto B — Cierre de caja con módulo y bitácora

Un módulo que lleva las cuentas de una caja registradora, y un script principal que la usa y deja constancia en un archivo.

**Lo que debe hacer:**
- Un módulo `modulo_caja` con estado privado (`total_acumulado`, `num_ventas`, ambos inicializados en `0`) que exporte `registrar(monto)`, `total()`, `contador()` y `cerrar()`
- El script principal registra varias ventas desde una lista, y calcula el ticket promedio (`std/math` opcional, para redondear)
- Arma un reporte de texto con `$++` y lo guarda con `io::write`
- Lo vuelve a leer con `io::read` y lo muestra en pantalla
- Cierra la caja y confirma que el total volvió a `0`

**Ejemplo de una corrida:**

```
Ventas: 5 | Total: $550 | Promedio: $110
guardado? #1
tras cerrar: 0
```

**Conceptos que usa:** módulos con estado privado, `std/io`, `std/math`.

---

¡Mucho éxito! Recuerda que no hay respuesta incorrecta mientras el programa haga lo que se pide. Hay muchas formas de llegar al mismo resultado — la tuya es válida.

[← Volver al índice](README.md) · [Volver al nivel intermedio](intermedio/README.md)
