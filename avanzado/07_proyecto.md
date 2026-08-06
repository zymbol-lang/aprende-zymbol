# Lección 07 — Proyecto avanzado

> **Revisado para v0.0.8 — 2026-08-05**

Esta lección no introduce sintaxis nueva. Es la oportunidad de aplicar todo lo aprendido en los tres niveles del curso en un programa real: con estructura de archivos, módulos, errores, integración con el sistema y datos compuestos.

El proyecto es un **analizador de logs**. Lee un archivo de registro del sistema, extrae métricas, detecta errores y genera un reporte formateado. Es el tipo de herramienta que se escribe una vez y se usa muchas veces.

---

## Estructura del proyecto

```
analizador/
├── main.zy
├── parser.zy       # módulo: parsear líneas de log
├── metricas.zy     # módulo: calcular estadísticas
└── reporte.zy      # módulo: formatear la salida
```

---

## `parser.zy` — parsear líneas de log

Cada línea del log tiene el formato:
```
2026-04-18 14:23:01 ERROR Tiempo de espera agotado
2026-04-18 14:23:05 INFO  Conexión establecida
2026-04-18 14:23:09 WARN  Reintento 2 de 3
```

```
# parser {
    #> { parsear_linea, es_error, es_advertencia }

    parsear_linea(linea) {
        // Extraer fecha, hora, nivel y mensaje
        partes = linea$/" "    // dividir por espacio
        ? (partes$#) < 4 {
            <~ (valida: #0)
        }
        // El mensaje son todas las palabras desde la cuarta en adelante:
        // se parte de la cuarta y se le van uniendo las siguientes
        mensaje = partes$[5..-1]$< (partes[4], (acc, p) -> "{acc} {p}")
        <~ (
            valida:   #1,
            fecha:    partes[1],
            hora:     partes[2],
            nivel:    partes[3],
            mensaje:  mensaje
        )
    }

    es_error(entrada) {
        <~ entrada.nivel == "ERROR"
    }

    es_advertencia(entrada) {
        <~ entrada.nivel == "WARN"
    }
}
```

---

## `metricas.zy` — calcular estadísticas

```
# metricas {
    #> { calcular }

    calcular(entradas) {
        total    = entradas$#
        errores  = entradas$| (e -> e.nivel == "ERROR")
        warns    = entradas$| (e -> e.nivel == "WARN")
        infos    = entradas$| (e -> e.nivel == "INFO")

        <~ (
            total:     total,
            errores:   errores$#,
            warnings:  warns$#,
            infos:     infos$#,
            tasa_error: errores$# * 100 / total
        )
    }
}
```

---

## `reporte.zy` — formatear la salida

```
# reporte {
    #> { imprimir }

    imprimir(metricas, entradas) {
        >> "==============================" ¶
        >> "  Reporte de análisis de log" ¶
        >> "==============================" ¶
        >> ¶
        >> "Total de entradas : " metricas.total ¶
        >> "Errores           : " metricas.errores ¶
        >> "Advertencias      : " metricas.warnings ¶
        >> "Informativos      : " metricas.infos ¶
        >> "Tasa de error     : " metricas.tasa_error "%" ¶
        >> ¶

        ? metricas.errores > 0 {
            >> "--- Detalle de errores ---" ¶
            errores = entradas$| (e -> e.nivel == "ERROR")
            @ e:errores {
                >> "  [" e.hora "] " e.mensaje ¶
            }
        }
    }
}
```

---

## `main.zy` — programa principal

```
<# std/io     => io
<# ./parser   => par
<# ./metricas => met
<# ./reporte  => rep

// Procesar el contenido completo del log, línea por línea
analizar(contenido) {
    lineas   = contenido$/"\n"
    entradas = []

    @ linea:lineas {
        ? (linea$#) == 0 { @> }    // saltar líneas vacías

        entrada = par::parsear_linea(linea)
        ? entrada.valida {
            entradas = entradas$+ entrada
        }
    }

    ? (entradas$#) == 0 {
        >> "No se encontraron entradas válidas" ¶
    } _ {
        metricas = met::calcular(entradas)
        rep::imprimir(metricas, entradas)
    }
}

// Leer el archivo de log con la biblioteca estándar.
// Si el archivo no existe, io::read no detiene el programa:
// devuelve un valor de error suave que comprobamos con $!
archivo   = "sistema.log"
contenido = io::read(archivo)

? contenido$! {
    >> "No se pudo leer: " archivo ¶
    >> "Asegúrate de que el archivo existe." ¶
} _ {
    analizar(contenido)
}
```

---

## Ejecutar el proyecto

```bash
# Verificar sin ejecutar
zymbol check main.zy

# Ejecutar
zymbol run main.zy

# Modo VM para archivos de log grandes
zymbol run --vm main.zy

# Formatear todos los archivos
zymbol fmt main.zy --write
zymbol fmt parser.zy --write
zymbol fmt metricas.zy --write
zymbol fmt reporte.zy --write

# Empaquetar a ejecutable distribuible (empaqueta fuente + intérprete; no es compilación nativa)
# Requisitos: Rust/Cargo instalado, checkout completo del repo, ejecutar desde interpreter/
zymbol build main.zy -o analizador-log
./analizador-log
```

---

## Qué usa este proyecto

| Característica | Dónde |
|---|---|
| Módulos con estado y exportaciones | `parser.zy`, `metricas.zy`, `reporte.zy` |
| Biblioteca estándar (`std/io`) | `io::read(archivo)` en `main.zy` |
| Errores suaves comprobados con `$!` | lectura del archivo en `main.zy` |
| Transformación de listas (`$>`, `$|`, `$<`) | `metricas.zy` |
| Desestructuración y tuplas con campos | `parsear_linea` devuelve tupla nombrada |
| Bucles con `@>` para saltar elementos | Líneas vacías en `main.zy` |
| Herramientas del lenguaje | `check`, `fmt`, `build` en el flujo de trabajo |

---

## Para seguir practicando

Algunas extensiones posibles sobre este mismo proyecto:

- Agregar soporte para múltiples archivos de log pasados como argumentos
- Filtrar por rango de fechas usando comparaciones de texto
- Exportar el reporte a un archivo con `io::write` en lugar de imprimirlo
- Agregar modos numéricos para salida internacionalizada
- Si los logs vienen en formato JSON, decodificarlos con `std/json` (`json::decode`)

---

Has cubierto el lenguaje completo. Lo que sigue es usarlo.

---

[← Lección anterior](avanzado/06_multilingue.md) · [Índice](avanzado/README.md)
