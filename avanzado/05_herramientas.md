# Lección 05 — Herramientas del lenguaje

> **Revisado para v0.0.5 — 2026-05-12**

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

**Máquina virtual** es entre 1.1× y 4.4× más rápida que el árbol de sintaxis para la mayoría de los programas. Úsala cuando el rendimiento importa y el programa ya está probado. Ambos modos producen resultados idénticos en el 99% de los casos.

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

## `zymbol build` — empaquetar a ejecutable standalone

`zymbol build` toma un archivo `.zy` y genera un ejecutable que corre sin tener Zymbol instalado en la máquina destino.

> **¿Qué hace internamente?** No compila código Zymbol a código nativo. Genera un proyecto Rust temporal, embebe el código fuente `.zy` como constante, y ejecuta `cargo build` en ese proyecto. El binario resultante contiene el intérprete completo de Zymbol — al ejecutarse, interpreta el código embebido igual que `zymbol run`.

### Requisitos

Para poder usar `zymbol build` necesitas:

1. **Rust y Cargo instalados** — el proceso ejecuta `cargo build` internamente.
   Instala Rust desde [rustup.rs](https://rustup.rs):
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Checkout completo del repositorio** — el `Cargo.toml` generado referencia los crates de Zymbol por ruta local. No funciona con el binario descargado de una release.
   ```bash
   git clone https://github.com/zymbol-lang/zymbol-lang
   cd zymbol-lang/interpreter
   ```

3. **Ejecutar desde el directorio `interpreter/`** — las rutas a los crates se resuelven desde el directorio de trabajo actual.

### Pasos completos

```bash
# 1. Clonar el repositorio
git clone https://github.com/zymbol-lang/zymbol-lang
cd zymbol-lang/interpreter

# 2. Compilar el intérprete
cargo build --release

# 3. Empaquetar el programa (desde interpreter/)
./target/release/zymbol build mi_programa.zy -o mi_programa --release
```

El flag `--release` activa optimizaciones (LTO, strip, opt-level 3) y reduce el tamaño del ejecutable considerablemente.

### Usar el ejecutable generado

```bash
./mi_programa
```

El binario puede distribuirse a cualquier máquina con el mismo sistema operativo y arquitectura — no necesita Rust ni Zymbol instalados.

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

# 6. Empaquetar a ejecutable para distribución (requiere Rust/Cargo y checkout del repo)
./target/release/zymbol build mi_programa.zy -o mi_programa --release
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
| Empaquetar | `zymbol build archivo.zy -o ejecutable` | Distribución standalone (empaqueta fuente + intérprete) |

---

Siguiente lección: [06 — Proyecto avanzado](avanzado/06_proyecto.md)

[← Lección anterior](avanzado/04_numerales.md) · [Índice](avanzado/README.md)
