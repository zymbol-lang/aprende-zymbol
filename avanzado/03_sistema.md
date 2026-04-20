# Lección 03 — Integración con el sistema

Un programa que solo calcula con datos que él mismo genera tiene un alcance limitado. En la práctica, los programas útiles leen archivos, consultan el sistema operativo, llaman a otras herramientas y encadenan procesos. Zymbol tiene dos operadores para esto: `<\ cmd \>` para ejecutar comandos del sistema, y `</ script.zy />` para ejecutar otros archivos Zymbol.

---

## `<\ cmd \>` — Ejecutar un comando del sistema

`<\ cmd \>` ejecuta un comando de shell y captura su salida estándar como texto. El salto de línea final se elimina automáticamente, igual que en la sustitución de comandos `$(...)` de bash.

```
fecha = <\ "date +%Y-%m-%d" \>
>> "Hoy es: " fecha ¶
```

Resultado (ejemplo):
```
Hoy es: 2026-04-18
```

El comando se pasa como texto. Si el comando falla, produce un error de tipo `##IO` que puedes atrapar con `!?`.

---

## Variables en los comandos

Puedes usar variables directamente en el texto del comando mediante interpolación:

```
archivo = "datos.txt"
contenido = <\ "cat {archivo}" \>
>> contenido
```

O concatenando con el identificador directamente:

```
dir = "/tmp"
listado = <\ "ls " dir \>
>> listado ¶
```

---

## Capturar resultados de comandos complejos

El operador captura todo lo que el comando imprime en stdout, incluyendo saltos de línea internos:

```
// Contar archivos en un directorio
total = <\ "ls /tmp | wc -l" \>
>> "Archivos en /tmp: " total ¶

// Obtener memoria disponible (en KB)
mem_kb = <\ "grep MemAvailable /proc/meminfo | tr -s ' ' | cut -d' ' -f2" \>
>> "Memoria disponible (KB): " mem_kb ¶

// Calcular con bc
resultado = <\ "echo 'scale=4; 355/113' | bc" \>
>> "π ≈ " resultado ¶
```

---

## Manejo de errores con comandos del sistema

Si el comando no existe o falla, se produce un error `##IO`:

```
!? {
    salida = <\ "comando_inexistente" \>
    >> salida
} :! ##IO {
    >> "El comando falló o no existe" ¶
} :! {
    >> "Error inesperado: " _err ¶
}
```

---

## Construir comandos dinámicamente

Como el comando es texto, puedes construirlo con interpolación:

```
buscar_en(directorio, patron) {
    resultado = <\ "grep -r '{patron}' {directorio}" \>
    <~ resultado
}

coincidencias = buscar_en("/home/usuario/proyectos", "TODO")
>> coincidencias ¶
```

---

## `</ script.zy />` — Ejecutar otro archivo Zymbol

`</ archivo.zy />` ejecuta otro programa Zymbol y captura todo lo que ese programa imprime con `>>`. El archivo se ejecuta con sus propios módulos y scope — no comparte variables con el llamador.

```
// subscript.zy
>> "resultado del subscript" ¶
>> 42 ¶
```

```
// main.zy
salida = </ ./subscript.zy />
>> salida
```

Resultado:
```
resultado del subscript
42
```

---

## Pasar datos a un subscript

La forma más directa de pasar datos a un subscript es a través de argumentos de línea de comandos, leyéndolos con `<<` en el subscript. Alternativamente, puedes construir el comando con `<\ \>` y pasar los argumentos en el texto del comando:

```
// procesador.zy
entrada = << "Dame un número: "
n = #|entrada|
>> n * 2 ¶
```

```
// orquestador.zy — construir el comando completo
resultado = <\ "echo '21' | zymbol run procesador.zy" \>
>> resultado ¶    // → 42
```

---

## Casos de uso típicos

### Leer un archivo completo

```
ruta = "./config.txt"
config = <\ "cat {ruta}" \>
>> config ¶
```

### Verificar si un archivo existe

```
ruta = "./datos.csv"
existe = <\ "test -f {ruta} && echo si || echo no" \>
? existe == "si" {
    >> "El archivo existe" ¶
} _ {
    >> "No encontrado" ¶
}
```

### Obtener la fecha y hora actuales

```
ahora = <\ "date '+%Y-%m-%d %H:%M:%S'" \>
>> "Ejecutado el: " ahora ¶
```

### Encadenar varias herramientas

```
// Top 5 archivos más grandes en el directorio actual
grandes = <\ "du -sh * | sort -rh | head -5" \>
>> "Archivos más grandes:" ¶
>> grandes ¶
```

---

## Consideraciones de seguridad

Los comandos se ejecutan en el shell del sistema con los permisos del usuario que corre el programa. Nunca construyas un comando interpolando directamente texto que venga de una entrada externa sin validarlo — es el origen de vulnerabilidades de inyección de comandos.

```
// ❌ Peligroso si 'nombre_usuario' viene de entrada externa
salida = <\ "ls /home/{nombre_usuario}" \>

// ✓ Validar antes de usar en un comando
? nombre_usuario$? "/" || nombre_usuario$? ".." {
    >> "Nombre de usuario inválido" ¶
} _ {
    salida = <\ "ls /home/{nombre_usuario}" \>
    >> salida ¶
}
```

---

## Resumen

| Operador | Sintaxis | Qué hace |
|---|---|---|
| Ejecutar comando | `<\ "comando" \>` | Captura stdout como texto |
| Comando con variable | `<\ "cmd {var}" \>` | Interpolación en el comando |
| Ejecutar script Zymbol | `</ ./archivo.zy />` | Captura salida del script |

---

Siguiente lección: [04 — Modos numéricos](avanzado/04_numerales.md)

[← Lección anterior](avanzado/02_indexacion.md) · [Índice](avanzado/README.md)
