# Lección 05 — Herramientas del lenguaje

El intérprete de Zymbol no es solo `zymbol run`. Viene con un conjunto de herramientas que cambian la forma en que trabajas con el lenguaje en el día a día: un entorno interactivo para explorar, un verificador sin ejecución, un formateador automático y un compilador a ejecutable standalone.

Esta lección cubre cada una de ellas.

---

## `zymbol run` — ejecutar un programa

Ya lo conoces. Dos modos de ejecución:

```bash
zymbol run programa.zy          # árbol de sintaxis — mensajes de error detallados
zymbol run --vm programa.zy     # máquina virtual — más rápido para cálculo intensivo
```

**Árbol de sintaxis** es el modo canónico. Produce los mensajes de error más claros y soporta todas las características del lenguaje. Úsalo mientras desarrollas.

**Máquina virtual** es entre 1.1× y 1.5× más rápida que Python para la mayoría de los programas. Úsala cuando el rendimiento importa y el programa ya está probado. Ambos modos producen resultados idénticos en el 99% de los casos.

---

## `zymbol repl` — entorno interactivo

El REPL (*Read–Eval–Print Loop*) ejecuta expresiones y statements de Zymbol de forma interactiva, sin necesidad de crear un archivo:

```bash
zymbol repl
```

```
zymbol> x = 10
zymbol> y = 20
zymbol> >> x + y ¶
30
zymbol> doble = n -> n * 2
zymbol> >> doble(7) ¶
14
```

El REPL es útil para explorar la sintaxis, probar una función antes de integrarla, o verificar el resultado de una expresión rápidamente. El historial de sesión se mantiene mientras dure la sesión.

El modo numérico activo también funciona en el REPL — un `#०९#` en el REPL afecta todas las expresiones siguientes de esa sesión.

---

## `zymbol check` — verificar sin ejecutar

`zymbol check` analiza un programa sin ejecutarlo. Detecta errores de sintaxis, variables no declaradas, variables `_` accedidas desde bloques internos, importaciones circulares y variables no utilizadas:

```bash
zymbol check programa.zy
```

Si todo está bien, no imprime nada y termina con código 0. Si hay problemas, los reporta con número de línea y descripción.

```bash
$ zymbol check mi_programa.zy
error[semantic]: variable '_dato' declared with underscore prefix cannot be accessed from inner scope
  --> mi_programa.zy:8:5

warning[unused]: variable 'temporal' declared but never used
  --> mi_programa.zy:12:3
```

Úsalo en pipelines de integración continua para verificar el código antes de ejecutarlo, o en tu editor para detectar errores mientras escribes.

---

## `zymbol fmt` — formatear el código

`zymbol fmt` formatea un archivo `.zy` aplicando las reglas de estilo estándar del lenguaje: indentación consistente, espaciado alrededor de operadores, alineación de bloques.

```bash
zymbol fmt programa.zy              # muestra el resultado formateado en stdout
zymbol fmt programa.zy --write      # escribe el resultado de vuelta al archivo
```

La indentación por defecto es de 4 espacios. Si tu proyecto usa otro estándar:

```bash
zymbol fmt programa.zy --indent 2 --write    # indentación de 2 espacios
```

`zymbol fmt` es idempotente: formatear un archivo ya formateado no produce ningún cambio. Puedes integrarlo como paso de pre-commit o como acción automática en tu editor.

---

## `zymbol build` — compilar a ejecutable standalone

`zymbol build` toma un archivo `.zy` y genera un ejecutable que corre sin tener Zymbol instalado en la máquina destino:

```bash
zymbol build programa.zy -o mi_programa
```

Esto produce un binario `mi_programa` que puede distribuirse y ejecutarse directamente:

```bash
./mi_programa
```

El ejecutable embebe el intérprete y el código fuente en un solo archivo. Es la forma de distribuir programas Zymbol a usuarios finales que no tienen el lenguaje instalado.

---

## Flujo de trabajo típico

Durante el desarrollo de un programa:

```bash
# 1. Explorar ideas en el REPL
zymbol repl

# 2. Verificar el código sin ejecutarlo
zymbol check mi_programa.zy

# 3. Ejecutar en modo árbol de sintaxis (errores detallados)
zymbol run mi_programa.zy

# 4. Formatear antes de guardar
zymbol fmt mi_programa.zy --write

# 5. Ejecutar en modo VM cuando el programa está listo
zymbol run --vm mi_programa.zy

# 6. Compilar a ejecutable para distribución
zymbol build mi_programa.zy -o mi_programa
```

---

## Resumen

| Herramienta | Comando | Para qué |
|---|---|---|
| Ejecutar (árbol) | `zymbol run archivo.zy` | Desarrollo — errores detallados |
| Ejecutar (VM) | `zymbol run --vm archivo.zy` | Producción — mayor velocidad |
| REPL interactivo | `zymbol repl` | Explorar, probar expresiones |
| Verificar | `zymbol check archivo.zy` | CI, editor, detección temprana |
| Formatear | `zymbol fmt archivo.zy --write` | Estilo consistente |
| Compilar | `zymbol build archivo.zy -o ejecutable` | Distribución standalone |

---

Siguiente lección: [06 — Proyecto avanzado](06_proyecto.md)

[← Lección anterior](04_numerales.md) · [Índice](README.md)
