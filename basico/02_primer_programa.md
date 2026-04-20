# Lección 02 — Tu primer programa

En esta lección vas a escribir y ejecutar código real. Aprenderás a mostrar texto en pantalla, guardar valores en variables y trabajar con los tipos de datos básicos.

---

## Mostrar texto: el operador `>>`

En Zymbol, para mostrar algo en pantalla se usa `>>`. Piénsalo como una flecha que "empuja" el contenido hacia la pantalla.

```
>> "Hola" ¶
```

Pruébalo: crea un archivo `leccion02.zy` y escribe esa línea. Luego ejecuta:

```bash
zymbol run leccion02.zy
```

Verás `Hola` en pantalla.

### ¿Qué es `¶`?

El símbolo `¶` representa un **salto de línea** — le dice a Zymbol "termina esta línea aquí". Sin él, el texto siguiente aparecería pegado en la misma línea.

```
>> "Primera línea" ¶
>> "Segunda línea" ¶
```

Resultado:
```
Primera línea
Segunda línea
```

Sin `¶`:
```
>> "Primera línea"
>> "Segunda línea"
```

Resultado:
```
Primera líneaSegunda línea
```

> `¶` se escribe con `AltGr + R` en teclado español. En macOS: `Alt + R`.

---

## Mostrar varios valores en una sola línea

Puedes poner varios valores juntos separados por espacio. Zymbol los imprime uno tras otro:

```
>> "Mi nombre es " "Ana" ¶
>> "Tengo " 25 " años" ¶
```

Resultado:
```
Mi nombre es Ana
Tengo 25 años
```

---

## Variables

Una variable es una caja con nombre donde guardas un valor para usarlo después. En Zymbol se asigna con `=`:

```
nombre = "Ana"
edad   = 25
altura = 1.68

>> "Nombre: " nombre ¶
>> "Edad: "   edad   ¶
>> "Altura: " altura ¶
```

Resultado:
```
Nombre: Ana
Edad: 25
Altura: 1.68
```

Las variables pueden cambiar de valor:

```
puntos = 0
>> "Puntos iniciales: " puntos ¶

puntos = 10
>> "Puntos después: " puntos ¶
```

---

## Constantes

Una constante es como una variable, pero su valor **no puede cambiar**. Se define con `:=`:

```
PI        := 3.14159
VELOCIDAD := 299792458

>> "Pi vale " PI ¶
```

Si intentas cambiarla después, Zymbol te dará un error. Esto es útil para valores que deben ser fijos, como la gravedad o el nombre de tu aplicación.

---

## Tipos de datos

Zymbol tiene varios tipos de datos. Estos son los que usarás más al principio:

### Números enteros

```
edad    = 25
anio    = 2025
temperatura = -3
```

### Números decimales

```
precio  = 19.99
altura  = 1.68
PI      := 3.14159
```

### Texto (cadenas)

El texto siempre va entre comillas dobles:

```
nombre   = "Ana"
mensaje  = "Bienvenida a Zymbol"
ciudad   = "Santigo de Chile"
```

### Booleanos (verdadero / falso)

En Zymbol el verdadero es `#1` y el falso es `#0`. No son números — son su propio tipo:

```
activo    = #1
terminado = #0

>> "¿Activo? " activo    ¶
>> "¿Listo?  " terminado ¶
```

Resultado:
```
¿Activo? #1
¿Listo?  #0
```

### Caracteres

Un solo carácter va entre comillas simples:

```
inicial = 'A'
simbolo = '?'

>> "Inicial: " inicial ¶
```

---

## Interpolación de cadenas

Puedes insertar el valor de una variable directamente dentro de un texto usando `{nombre}`:

```
nombre = "Ana"
edad   = 25

mensaje = "Hola, {nombre}. Tienes {edad} años."
>> mensaje ¶
```

Resultado:
```
Hola, Ana. Tienes 25 años.
```

Esto es más cómodo que separar todo con espacios cuando el texto es largo.

---

## Programa completo de esta lección

Junta todo lo que aprendiste en un solo programa. Cópialo, ejecútalo y modifica los valores para ver qué pasa:

```
// Datos personales
nombre  = "Ana"
edad    = 25
ciudad  = "Caracas"
activa  = #1

// Constante
PAIS := "Venezuela"

// Mostrar todo
>> "=== Perfil ===" ¶
>> "Nombre: {nombre}" ¶
>> "Edad:   {edad} años" ¶
>> "Ciudad: {ciudad}, {PAIS}" ¶
>> "Activa: " activa ¶
```

Resultado esperado:
```
=== Perfil ===
Nombre: Ana
Edad:   25 años
Ciudad: Caracas, Venezuela
Activa: #1
```

---

## Resumen

| Concepto | Ejemplo |
|---|---|
| Mostrar texto | `>> "Hola" ¶` |
| Salto de línea | `¶` al final |
| Variable | `nombre = "Ana"` |
| Constante | `PI := 3.14159` |
| Entero | `42` |
| Decimal | `3.14` |
| Texto | `"hola"` |
| Verdadero/Falso | `#1` / `#0` |
| Carácter | `'A'` |
| Interpolación | `"Hola {nombre}"` |

---

Siguiente lección: [03 — Decisiones](basico/03_decisiones.md)

[← Lección anterior](basico/01_instalacion.md) · [Índice](basico/README.md)
