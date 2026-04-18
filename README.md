# Aprende Zymbol

Bienvenido. Este es tu punto de partida para aprender a programar con **Zymbol**, un lenguaje diseñado desde cero para ser expresivo, limpio y diferente.

No necesitas experiencia previa. Solo curiosidad.

---

## ¿Qué es Zymbol?

Zymbol es un lenguaje de programación donde **los símbolos hacen el trabajo** que en otros lenguajes hacen las palabras clave. En lugar de escribir `if`, `for`, `function` o `print`, usas símbolos como `?`, `@`, `->` y `>>`.

Al principio parece extraño. Después de un rato, se vuelve natural — como aprender un nuevo alfabeto.

```
// Zymbol "hola mundo"
>> "¡Hola, mundo!" ¶
```

```
// Python equivalente
print("¡Hola, mundo!")
```

---

## Contenido del curso

### Nivel Básico

Fundamentos del lenguaje, sin experiencia previa necesaria.

| # | Lección | Tema |
|---|---------|------|
| 01 | [Instalación](basico/01_instalacion.md) | Cómo instalar Zymbol y ejecutar tu primer programa |
| 02 | [Tu primer programa](basico/02_primer_programa.md) | Salida, variables y tipos de datos |
| 03 | [Decisiones](basico/03_decisiones.md) | Condicionales con `?` |
| 04 | [Selector de Casos](basico/04_selector_de_casos.md) | Comparación por patrones con `??` |
| 05 | [Repetición](basico/05_repeticion.md) | Bucles con `@` |
| 06 | [Listas](basico/06_listas.md) | Arrays y cómo recorrerlos |
| 07 | [Texto](basico/07_texto.md) | Cadenas, interpolación y caracteres |
| 08 | [Funciones](basico/08_funciones.md) | Definir y llamar funciones |

### Nivel Intermedio

Tipos compuestos, funciones de orden superior, errores y módulos.

| # | Lección | Tema |
|---|---------|------|
| 01 | Tuplas | Registros inmutables con campos nombrados |
| 02 | Desestructuración | Desempacar listas y tuplas |
| 03 | Lambdas y Cierres | Funciones anónimas y captura de entorno |
| 04 | Transformación de listas | `$>` map, `$\|` filter, `$<` reduce |
| 05 | Tuberías | Encadenar transformaciones con `\|>` |
| 06 | Manejo de errores | `!?`, `:!`, `:>`, `$!!` |
| 07 | Inspección de tipos | `#?` y `#\|..\|` en tiempo de ejecución |
| 08 | Módulos | Organizar código con `# name`, `#>`, `<#` |

> El nivel intermedio está en desarrollo. Consulta [intermedio/README.md](intermedio/README.md) para el estado actual.

---

## Antes de empezar

Zymbol usa algunos símbolos que no están en el teclado español estándar. El más importante es `¶` (la marca de párrafo), que representa un salto de línea en la salida.

| Símbolo | Nombre | Cómo escribirlo |
|---------|--------|-----------------|
| `¶` | Pilcrow (salto de línea) | `AltGr + R` en teclado español |
| `>>` | Salida | Dos signos `>` seguidos |
| `<<` | Entrada | Dos signos `<` seguidos |
| `?` | Si (condicional) | Tecla normal |
| `@` | Bucle | Tecla normal |

---

## Una nota sobre los errores

Cuando algo sale mal, Zymbol te dice exactamente qué está mal y en qué línea. No te asustes — los errores son parte del proceso. Leerlos con calma es una habilidad que se aprende.

---

Empieza por [la lección 01 — Instalación](basico/01_instalacion.md).
