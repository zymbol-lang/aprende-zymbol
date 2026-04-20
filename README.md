# Aprende Zymbol

Bienvenido. Este es tu punto de partida para aprender a programar con **Zymbol**, un lenguaje diseñado desde cero para ser expresivo, limpio y diferente.

No necesitas experiencia previa. Solo curiosidad.

---

## ¿Qué es Zymbol?

Zymbol es un lenguaje de programación donde **los símbolos hacen el trabajo** que en otros lenguajes hacen las palabras clave. En lugar de escribir `if`, `for`, `function` o `print`, usas símbolos como `?`, `@`, `->` y `>>`.

Al principio parece extraño. Después de un rato, se vuelve natural — como aprender un nuevo alfabeto.

```
>> "¡Hola, mundo!" ¶
```

```python
# Python equivalente
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
| 09 | [Proyecto básico](basico/09_proyecto.md) | Programa completo con todo lo aprendido |

### Nivel Intermedio

Tipos compuestos, funciones de orden superior, errores y módulos.

| # | Lección | Tema |
|---|---------|------|
| 01 | [Tuplas](intermedio/01_tuplas.md) | Registros inmutables con campos nombrados |
| 02 | [Desestructuración](intermedio/02_destructuracion.md) | Desempacar listas y tuplas |
| 03 | [Lambdas y Cierres](intermedio/03_lambdas.md) | Funciones anónimas y captura de entorno |
| 04 | [Transformación de listas](intermedio/04_transformacion.md) | `$>` map, `$\|` filter, `$<` reduce |
| 05 | [Tuberías](intermedio/05_tuberias.md) | Encadenar transformaciones con `\|>` |
| 06 | [Manejo de errores](intermedio/06_errores.md) | `!?`, `:!`, `:>`, `$!!` |
| 07 | [Inspección de tipos](intermedio/07_tipos.md) | `#?` y `#\|..\|` en tiempo de ejecución |
| 08 | [Módulos](intermedio/08_modulos.md) | Organizar código con `# name`, `#>`, `<#` |

> El nivel intermedio está en desarrollo. Consulta [intermedio/README.md](intermedio/README.md) para el estado actual.

### Nivel Avanzado

Precisión, integración con el sistema y el ecosistema completo del lenguaje.

| # | Lección | Tema |
|---|---------|------|
| 01 | [Alcance y tiempo de vida](avanzado/01_alcance.md) | `_name`, `\ var`, visibilidad entre bloques |
| 02 | [Indexación multidimensional](avanzado/02_indexacion.md) | `arr[i>j]`, rangos sobre ejes, extracción estructurada |
| 03 | [Integración con el sistema](avanzado/03_sistema.md) | `<\ cmd \>`, `</ script.zy />`, automatización |
| 04 | [Modos numéricos](avanzado/04_numerales.md) | `#d0d9#`, 69 sistemas de dígitos Unicode, i18n |
| 05 | [Herramientas del lenguaje](avanzado/05_herramientas.md) | REPL, `check`, `fmt`, `build` |
| 06 | [Proyecto avanzado](avanzado/06_proyecto.md) | Programa completo con todo lo aprendido |

> El nivel avanzado está en desarrollo. Consulta [avanzado/README.md](avanzado/README.md) para el estado actual.

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
| `->` | Lambda / retorno | Guion seguido de `>` |

---

## Características del sitio

El curso incluye:

- **Resaltado de sintaxis** idéntico al del [playground de Zymbol](https://zymbol-lang.github.io/) — mismos colores, mismos tokens.
- **Modo claro y oscuro** con detección automática de la preferencia del sistema. El botón `🌙 / ☀️` está en la esquina inferior derecha.
- **Navegación lateral** con los tres niveles del curso.
- **Búsqueda integrada** en todos los documentos.
- **Paginación** para avanzar y retroceder entre lecciones.

---

## Una nota sobre los errores

Cuando algo sale mal, Zymbol te dice exactamente qué está mal y en qué línea. No te asustes — los errores son parte del proceso. Leerlos con calma es una habilidad que se aprende.

---

Empieza por [la lección 01 — Instalación](basico/01_instalacion.md).
