# Lección 06 — Proyecto avanzado

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
# parser

#> { parsear_linea, es_error, es_advertencia }

parsear_linea(linea) {
    // Extraer fecha, hora, nivel y mensaje
    partes = linea$/" "    // dividir por espacio
    ? (partes$#) < 4 {
        <~ (valida: #0)
    }
    <~ (
        valida:   #1,
        fecha:    partes[1],
        hora:     partes[2],
        nivel:    partes[3],
        mensaje:  partes[4]
    )
}

es_error(entrada) {
    <~ entrada.nivel == "ERROR"
}

es_advertencia(entrada) {
    <~ entrada.nivel == "WARN"
}
```

---

## `metricas.zy` — calcular estadísticas

```
# metricas

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
```

---

## `reporte.zy` — formatear la salida

```
# reporte

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
```

---

## `main.zy` — programa principal

```
<# ./parser   <= par
<# ./metricas <= met
<# ./reporte  <= rep

// Leer el archivo de log desde el sistema
archivo = "sistema.log"

!? {
    contenido = <\ "cat {archivo}" \>
} :! ##IO {
    >> "No se pudo leer: " archivo ¶
    >> "Asegúrate de que el archivo existe." ¶
    @!
}

// Procesar línea por línea
lineas   = contenido$/" \n"
entradas = []

@ linea:lineas {
    ? (linea$#) == 0 { @> }    // saltar líneas vacías

    entrada = par::parsear_linea(linea)
    ? entrada.valida {
        entradas = entradas$+ entrada
    }
}

? (entradas$#) == 0 {
    >> "No se encontraron entradas válidas en " archivo ¶
} _ {
    metricas = met::calcular(entradas)
    rep::imprimir(metricas, entradas)
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

# Compilar a ejecutable distribuible
zymbol build main.zy -o analizador-log
./analizador-log
```

---

## Qué usa este proyecto

| Característica | Dónde |
|---|---|
| Módulos con estado y exportaciones | `parser.zy`, `metricas.zy`, `reporte.zy` |
| Manejo de errores tipificado | `!? :! ##IO` en `main.zy` |
| Integración con el sistema | `<\ "cat {archivo}" \>` |
| Transformación de listas (`$>`, `$|`, `$<`) | `metricas.zy` |
| Desestructuración y tuplas con campos | `parsear_linea` devuelve tupla nombrada |
| Bucles con `@>` para saltar elementos | Líneas vacías en `main.zy` |
| Herramientas del lenguaje | `check`, `fmt`, `build` en el flujo de trabajo |

---

## Para seguir practicando

Algunas extensiones posibles sobre este mismo proyecto:

- Agregar soporte para múltiples archivos de log pasados como argumentos
- Filtrar por rango de fechas usando comparaciones de texto
- Exportar el reporte a un archivo en lugar de imprimirlo
- Agregar modos numéricos para salida internacionalizada
- Usar indexación multidimensional si los logs tienen estructura jerárquica (JSON logs)

---

Has cubierto el lenguaje completo. Lo que sigue es usarlo.

---

[← Lección anterior](avanzado/05_herramientas.md) · [Índice](avanzado/README.md)
