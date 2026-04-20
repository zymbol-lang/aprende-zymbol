# Ejercicios

Aquí encontrarás ejercicios para practicar lo que aprendiste en cada lección. Están ordenados de menor a mayor dificultad dentro de cada sección.

**Consejo:** intenta resolverlos sin releer la lección. Si te trabas, revísala — eso también es aprender. No existe el "hice trampa" cuando se trata de aprender a programar.

Al final del documento hay dos proyectos completos para cuando te sientas lista para un reto mayor.

---

## Lección 02 — Tu primer programa

### Ejercicio 1 — Tarjeta de presentación

Crea un programa que muestre tu información personal como si fuera una tarjeta. Usa variables para cada dato y muéstralos con interpolación.

La salida debe verse así (con tus propios datos):

```
╔══════════════════════════════╗
║      Tarjeta de contacto     ║
╚══════════════════════════════╝
Nombre:     Ana García
Edad:       28 años
Ciudad:     Guadalajara
Profesión:  Diseñadora
```

**Pista:** define una constante para el título del encabezado.

---

### Ejercicio 2 — Calculadora de propina

Una cena costó $450. Escribe un programa que calcule cuánto dejar de propina según tres porcentajes distintos y muestre los tres resultados.

```
Cuenta total: $450

Propina 10%: $45.0   → Total: $495.0
Propina 15%: $67.5   → Total: $517.5
Propina 20%: $90.0   → Total: $540.0
```

**Pista:** guarda el precio en una variable. Calcula cada propina multiplicando por el porcentaje y dividiendo entre 100.

---

## Lección 03 — Decisiones

### Ejercicio 3 — Clasificador de temperatura

Escribe un programa con una variable `temperatura`. Según su valor, muestra un mensaje diferente:

| Condición | Mensaje |
|---|---|
| Menor a 0 | "Bajo cero — abrígate bien" |
| Entre 0 y 14 | "Frío — lleva chamarra" |
| Entre 15 y 25 | "Agradable — día perfecto" |
| Entre 26 y 35 | "Caluroso — mantente hidratada" |
| Mayor a 35 | "Mucho calor — quédate en casa" |

Prueba tu programa con al menos tres valores diferentes: uno negativo, uno en rango medio y uno muy alto.

---

### Ejercicio 4 — Calculadora de envío

Una tienda en línea calcula el costo de envío según el peso del paquete y si el cliente tiene membresía:

- Con membresía: envío gratis para cualquier peso
- Sin membresía:
  - Hasta 1 kg: $50
  - De 1 a 5 kg: $90
  - Más de 5 kg: $150

```
peso      = 3.2
membresia = #0
```

El programa debe mostrar: `"Costo de envío: $90"`

Pruébalo cambiando los valores para cubrir todos los casos.

---

## Lección 04 — Repetición

### Ejercicio 5 — Cuenta regresiva

Escribe un programa que haga una cuenta regresiva desde 10 hasta 1 y al llegar al final muestre `"¡Despegue!"`.

```
10... 9... 8... 7... 6... 5... 4... 3... 2... 1...
¡Despegue!
```

**Pista:** usa un rango hacia atrás y agrega `"..."` después de cada número.

---

### Ejercicio 6 — Tabla de verdad

Muestra todos los pares posibles de valores booleanos y el resultado de aplicarles `&&` y `||`.

```
a     b     a&&b   a||b
─────────────────────────
#1    #1    #1     #1
#1    #0    #0     #1
#0    #1    #0     #1
#0    #0    #0     #0
```

**Pista:** usa dos listas `[#1, #1, #0, #0]` y `[#1, #0, #1, #0]`, recórrelas con un rango `1..4` y accede a cada par por índice.

---

## Lección 05 — Funciones

### Ejercicio 7 — Conversor de unidades

Escribe tres funciones de conversión y un programa que muestre los resultados:

- `km_a_millas(km)` — 1 km = 0.621371 millas
- `celsius_a_fahrenheit(c)` — fórmula: `(c × 9/5) + 32`
- `kg_a_libras(kg)` — 1 kg = 2.20462 libras

```
=== Conversor de unidades ===

100 km      → 62.1371 millas
25 °C       → 77.0 °F
70 kg       → 154.3234 libras
```

---

### Ejercicio 8 — ¿Es par o impar?

Escribe una función `es_par(n)` que devuelva `#1` si el número es par y `#0` si es impar. Luego úsala en un bucle para clasificar los números del 1 al 10:

```
1 → impar
2 → par
3 → impar
4 → par
5 → impar
6 → par
7 → impar
8 → par
9 → impar
10 → par
```

**Pista:** un número es par si `n % 2 == 0`.

---

## Lección 06 — Listas

### Ejercicio 9 — Estadísticas de una lista

Dada esta lista de temperaturas registradas durante una semana:

```
temperaturas = [22, 19, 25, 28, 24, 18, 30]
```

Escribe un programa que calcule y muestre:
- La temperatura más alta
- La temperatura más baja
- El promedio
- Cuántos días estuvo por encima de 24°

```
Temperaturas: [22, 19, 25, 28, 24, 18, 30]

Más alta:  30°
Más baja:  18°
Promedio:  23°
Días > 24: 3
```

**Pista:** para la más alta y más baja, ordena la lista y accede al primer y último elemento.

---

### Ejercicio 10 — Lista de tareas

Crea una lista de tareas pendientes. El programa debe:
1. Mostrar todas las tareas numeradas
2. Eliminar la segunda tarea
3. Agregar una tarea nueva al final
4. Mostrar la lista actualizada

```
Lista original:
  1. Hacer ejercicio
  2. Comprar despensa
  3. Llamar al médico
  4. Leer 30 minutos

Eliminando tarea 2: "Comprar despensa"
Agregando: "Estudiar Zymbol"

Lista actualizada:
  1. Hacer ejercicio
  2. Llamar al médico
  3. Leer 30 minutos
  4. Estudiar Zymbol
```

---

## Lección 07 — Texto

### Ejercicio 11 — Validador de contraseña

Escribe una función `validar_contrasena(clave)` que revise:
- Que tenga al menos 8 caracteres
- Que contenga al menos un número (verifica si contiene alguno de `"0123456789"`)
- Que contenga al menos una mayúscula (verifica si contiene alguna de `"ABCDEFGHIJKLMNOPQRSTUVWXYZ"`)

Muestra qué condiciones pasa y cuáles falla:

```
Contraseña: "abc"
  ✗ Muy corta (mínimo 8 caracteres)
  ✗ Debe contener al menos un número
  ✗ Debe contener al menos una mayúscula

Contraseña: "MiClave1"
  ✓ Longitud correcta
  ✓ Contiene un número
  ✓ Contiene una mayúscula
  → Contraseña válida
```

---

### Ejercicio 12 — Contador de palabras

Escribe un programa que tome una frase y cuente cuántas palabras tiene. Las palabras están separadas por espacios.

```
frase = "el zorro salta sobre el perro"
```

```
Frase: "el zorro salta sobre el perro"
Palabras: 6
```

**Pista:** divide la frase usando `$/` con el separador `' '` (espacio). El número de partes es el número de palabras.

---

## Lección 08 — Match

### Ejercicio 13 — Piedra, papel o tijeras

Escribe un programa donde dos jugadores elijan su movimiento como variable. Usa `??` para determinar quién gana:

```
jugador1 = "piedra"
jugador2 = "tijeras"
```

```
Jugador 1: piedra
Jugador 2: tijeras
→ ¡Jugador 1 gana! (piedra aplasta tijeras)
```

Cubre todos los casos: empate, jugador 1 gana, jugador 2 gana. Usa `_?` con condiciones `&&` para las combinaciones.

---

### Ejercicio 14 — Calculadora con match

Escribe un programa con tres variables: `a`, `operacion` y `b`. Usa `??` para realizar la operación indicada:

```
a         = 15
operacion = "/"
b         = 4
```

```
15 / 4 = 3
```

Operaciones soportadas: `"+"`, `"-"`, `"*"`, `"/"`, `"%"`. Si la operación no existe, muestra un mensaje de error. Si se intenta dividir entre cero, avisa al usuario.

---

## Proyectos completos

Cuando termines los ejercicios anteriores, estos proyectos te permitirán combinar todo lo aprendido en algo que puedes mostrar y usar.

---

### Proyecto A — Diario de gastos

Un programa que registra gastos, los categoriza y muestra un resumen al final.

**Lo que debe hacer:**
- Tener una lista de gastos con nombre y monto (puedes usar dos listas paralelas como en el quiz)
- Mostrar todos los gastos numerados
- Calcular el gasto total
- Identificar el gasto más alto
- Mostrar cuánto representa cada gasto del total (porcentaje)

**Ejemplo de salida:**

```
╔══════════════════════════════╗
║      Diario de gastos        ║
╚══════════════════════════════╝

  1. Renta           $3,500  (46.7%)
  2. Despensa        $1,200  (16.0%)
  3. Transporte      $  600  ( 8.0%)
  4. Entretenimiento $  450  ( 6.0%)
  5. Servicios       $1,750  (23.3%)

────────────────────────────────
Total:              $7,500
Gasto más alto:     Renta ($3,500)
```

**Conceptos que usa:** listas, funciones, bucles, texto, operaciones aritméticas.

---

### Proyecto B — Juego de adivinanza

El programa elige un número secreto y el usuario tiene que adivinarlo. En cada intento, el programa le da una pista.

**Lo que debe hacer:**
- Tener un número secreto definido como constante (elige uno tú mismo)
- Pedir al usuario que ingrese un número
- Decirle si su intento es mayor, menor o correcto
- Contar los intentos
- Cuando adivine, mostrar un mensaje según cuántos intentos necesitó

**Ejemplo de una partida:**

```
╔══════════════════════════════╗
║     Juego de adivinanza      ║
╚══════════════════════════════╝
Adivina el número (entre 1 y 100)

Intento 1: 50
  → Es mayor. Prueba con un número más grande.

Intento 2: 75
  → Es menor. Prueba con un número más pequeño.

Intento 3: 63
  ✓ ¡Lo lograste en 3 intentos!
  Eso es excelente — eres muy buena adivinando.
```

**Pista para el mensaje final:** usa `??` con `_?` para dar un mensaje diferente según la cantidad de intentos (1-2: genial, 3-5: muy bien, 6-9: bien, más: sigue practicando).

**Conceptos que usa:** constantes, bucle infinito con `@!`, entrada con `<<`, condicionales, match, funciones.

---

¡Mucho éxito! Recuerda que no hay respuesta incorrecta mientras el programa haga lo que se pide. Hay muchas formas de llegar al mismo resultado — la tuya es válida.

[← Volver al índice](basico/README.md)
