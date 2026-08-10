# Ejercicios

> **Revisado para v0.0.8 — 2026-08-05**

Aquí encontrarás ejercicios para practicar lo que aprendiste en cada lección. Están ordenados de menor a mayor dificultad dentro de cada sección.

**Consejo:** intenta resolverlos sin releer la lección. Si te trabas, revísala — eso también es aprender. No existe el "hice trampa" cuando se trata de aprender a programar.

Al final del documento hay un proyecto completo para cuando te sientas lista para un reto mayor. La lección 07 — Proyecto avanzado ya es, en sí misma, el cierre del nivel; este documento cubre las lecciones 01 a 06.

---

## Lección 01 — Alcance y tiempo de vida

### Ejercicio 1 — Cálculo desechable

Dentro de un bloque, usa una variable `_temp` para un resultado intermedio que no necesitas conservar, y una variable regular para el resultado final que sí quieres mostrar fuera del cálculo.

```
Suma: 20
```

**Pista:** `_temp = 10` y `suma = _temp * 2` — `_temp` deja de existir en cuanto termina el bloque; `suma` no.

---

### Ejercicio 2 — Liberar una lista grande

Dentro de un bloque, crea una lista, calcula su suma con `$<`, y libera la lista con `\` antes de mostrar la suma — que debe seguir disponible después.

```
Suma calculada: 55
datos liberado, suma sigue disponible: 55
```

---

## Lección 02 — Indexación multidimensional

### Ejercicio 3 — Diagonal de tres en raya

Representa un tablero de tres en raya como una matriz 3×3 de textos (`"X"`, `"O"` o vacío). Extrae su diagonal principal con una sola expresión de indexación.

```
tablero = [["X","O","O"], ["O","O","X"], ["X","X","O"]]
```

```
Diagonal: [X, O, O]
```

**Pista:** `tablero[1>1 ; 2>2 ; 3>3]`.

---

### Ejercicio 4 — Columna de calificaciones

Dada una matriz donde cada fila es un alumno y cada columna una materia, extrae la segunda columna (la segunda materia de todos los alumnos) con un rango sobre el eje de columnas.

```
calificaciones = [[90, 85, 78], [70, 88, 95], [60, 92, 81]]
```

```
Columna 2: [[85], [88], [92]]
```

**Pista:** `calificaciones[[1>2..2] ; [2>2..2] ; [3>2..2]]` — nota que el resultado son tres listas de un elemento, una por cada grupo separado por `;`, no una lista plana. Es el mismo comportamiento que separa `diagonal` de `esquina_fila1` en la lección.

---

## Lección 03 — Integración con el sistema

### Ejercicio 5 — Mensaje con el año actual

Usa `<\ "date +%Y" \>` para capturar el año del sistema y arma un mensaje de copyright con él.

```
© 2026 — Mi Programa
```

(Tu salida mostrará el año real de cuando lo ejecutes, no necesariamente 2026.)

---

### Ejercicio 6 — Contar líneas de un archivo

Escribe tres líneas a un archivo con `std/io` (una con `io::write`, dos con `io::append`), y luego cuenta las líneas con `<\ "wc -l < archivo.txt" \>`. Borra el archivo al final.

```
Líneas: 2
```

**Pista:** `wc -l` cuenta saltos de línea, no líneas de texto — si la última línea no termina en `\n` (y `io::append` no lo agrega automáticamente), el conteo sale uno menos de lo que esperarías a simple vista.

---

## Lección 04 — Modos numéricos

### Ejercicio 7 — Contador en Devanagari

Activa el modo numeral Devanagari (`#०९#`) y recorre un rango del 1 al 5 mostrando cada número. Vuelve a ASCII (`#09#`) al terminar.

```
१ २ ३ ४ ५
```

---

### Ejercicio 8 — Edades en árabe-índico

Activa el modo árabe-índico (`#٠٩#`) y muestra una lista de edades con sus dígitos convertidos.

```
edades = [8, 25, 60]
```

```
٨ ٢٥ ٦٠
```

**Pista:** para activar un modo hay que primero volver a ASCII con `#09#` y luego activar el nuevo con su propio token — igual que en el ejemplo de la lección.

---

## Lección 05 — Herramientas del lenguaje

### Ejercicio 9 — Encuentra la advertencia

Escribe un archivo `.zy` con una variable que declaras pero nunca usas. Corre `zymbol check archivo.zy` desde la terminal y lee la advertencia que produce. Corrige el archivo y vuelve a correr `check` hasta que no diga nada.

```
$ zymbol check archivo.zy
warning: unused variable 'x' ...

$ zymbol check archivo.zy
No errors or warnings
```

---

### Ejercicio 10 — Formatear un desastre

Escribe a mano un archivo `.zy` con indentación y espaciado inconsistentes (por ejemplo `x=5`, tres espacios antes de `y`, sin espacios en una operación). Corre `zymbol fmt archivo.zy` (sin `--write`, para solo ver el resultado) y compara contra el original.

```
Antes:
x=5
   y  =10
>>x+y¶

Después:
x = 5
y = 10
>> x + y ¶
```

---

## Lección 06 — Programar en tu idioma

### Ejercicio 11 — Tu propio adaptador

Crea un módulo `matematica_es.zy` que importe `std/math` y exponga `raiz` (re-exportando `sqrt` directamente, sin lógica) y `cuadrado` (una función propia que llama a `pow(x, 2)` por dentro). Úsalo desde un script principal.

```
raíz de 81: 9
5 al cuadrado: 25
```

**Pista:** un adaptador puede mezclar re-exportación pura (`#> { _mat::sqrt => raiz }`) con funciones que sí tienen lógica — la diferencia con los adaptadores de la lección es que ellos eligieron no tener ninguna.

---

### Ejercicio 12 — Renombrar un JSON externo

Tienes una respuesta JSON con claves en inglés. Usa `json::decode_map` para leerla con claves en español, sin tocar el texto original.

```
respuesta = "{\"title\": \"Cien años de soledad\", \"pages\": 471}"
```

```
titulo:  Cien años de soledad
paginas: 471
```

**Pista:** el segundo argumento de `decode_map` es una tupla donde cada campo es `clave_original: "clave_nueva"`.

---

## Proyecto completo

### Proyecto — Bitácora de sistema en español

Un programa que reúne varias lecciones de este nivel en una sola herramienta pequeña pero real.

**Lo que debe hacer:**
- Definir un adaptador propio (lección 06) para al menos una función de `std/math` o `std/io` que uses
- Usar `<\ \>` (lección 03) para capturar la fecha del sistema y anotarla en cada entrada de la bitácora
- Guardar las entradas con `std/io`, y liberar con `\` cualquier variable intermedia grande que ya no necesites (lección 01)
- Mostrar un resumen final con los números en un sistema numeral distinto al ASCII (lección 04) — por ejemplo, cuántas entradas se guardaron
- Manejar con `!?`/`:!` el caso de que el archivo de bitácora no se pueda escribir

**Ejemplo de una entrada:**

```
[2026-08-10] Entrada registrada: "revisión de backups completada"
```

**Conceptos que usa:** alcance y `\`, integración con el sistema, adaptadores propios, modos numéricos, manejo de errores.

---

¡Mucho éxito! Recuerda que no hay respuesta incorrecta mientras el programa haga lo que se pide. Hay muchas formas de llegar al mismo resultado — la tuya es válida.

[← Volver al índice](README.md) · [Volver al nivel avanzado](avanzado/README.md)
