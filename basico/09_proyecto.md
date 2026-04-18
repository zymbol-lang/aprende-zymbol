# Lección 09 — Juntando todo

Llegaste a la última lección. En este punto ya conoces los bloques fundamentales de cualquier programa:

- Variables y tipos de datos
- Mostrar texto y pedir información al usuario
- Tomar decisiones con `?`
- Repetir con `@`
- Organizar código en funciones
- Guardar colecciones en listas
- Manipular texto
- Comparar patrones con `??`

Ahora vamos a usarlos todos juntos en un proyecto real, construido paso a paso.

---

## El proyecto: Quiz interactivo

Vamos a construir un juego de preguntas y respuestas. El programa le hace preguntas al usuario, verifica sus respuestas, lleva el puntaje y al final le dice cómo le fue.

Así se ve al ejecutarlo:

```
╔═══════════════════════════════╗
║       Quiz de Zymbol          ║
╚═══════════════════════════════╝

Responde cada pregunta.
Escribe tu respuesta en minúsculas.
¡Buena suerte!

────────────────────────────────
Pregunta 1 de 5:
¿De qué color es el cielo despejado?
> azul
✓ ¡Correcto!

────────────────────────────────
Pregunta 2 de 5:
¿Cuántos lados tiene un triángulo?
> 4
✗ Incorrecto. La respuesta era: 3

...

════════════════════════════════
  Resultado: 4 de 5 correctas
  ¡Muy bien! Casi perfecto.
════════════════════════════════
```

---

## Paso 1 — Las preguntas y respuestas

Guardamos las preguntas en una lista y las respuestas correctas en otra, en el mismo orden:

```
preguntas = [
    "¿De qué color es el cielo despejado?",
    "¿Cuántos lados tiene un triángulo?",
    "¿Cuál es el resultado de 7 × 8?",
    "¿En qué planeta vivimos?",
    "¿Cuántos meses tiene un año?"
]

respuestas_correctas = [
    "azul",
    "3",
    "56",
    "tierra",
    "12"
]
```

La pregunta 1 corresponde a la respuesta 1, la pregunta 2 a la respuesta 2, y así. Cuando recorramos la lista con `@ i:1..5`, usaremos ese mismo `i` para acceder a ambas listas al mismo tiempo.

---

## Paso 2 — Funciones auxiliares

Antes del programa principal, definimos las piezas que vamos a necesitar:

```
// Verifica si la respuesta del usuario es correcta
es_correcta(respuesta, correcta) {
    <~ respuesta == correcta
}

// Muestra una línea separadora
separador() {
    >> "────────────────────────────────" ¶
}

// Muestra la pantalla de bienvenida
bienvenida() {
    >> "╔═══════════════════════════════╗" ¶
    >> "║       Quiz de Zymbol          ║" ¶
    >> "╚═══════════════════════════════╝" ¶
    >> ¶
    >> "Responde cada pregunta." ¶
    >> "Escribe tu respuesta en minúsculas." ¶
    >> "¡Buena suerte!" ¶
    >> ¶
}

// Muestra el resultado final según el puntaje
resultado_final(puntos, total) {
    >> "════════════════════════════════" ¶
    >> "  Resultado: " puntos " de " total " correctas" ¶

    mensaje = ?? puntos {
        _? puntos == total          : "¡Perfecto! Eres increíble."
        _? puntos >= total - 1      : "¡Muy bien! Casi perfecto."
        _? puntos >= total / 2      : "Bien. La práctica hace al maestro."
        _                           : "¡Sigue intentando, tú puedes!"
    }

    >> "  " mensaje ¶
    >> "════════════════════════════════" ¶
}
```

---

## Paso 3 — El bucle principal

Con las funciones listas, el programa principal es sorprendentemente corto:

```
bienvenida()

puntos = 0
total  = preguntas$#

@ i:1..total {
    separador()
    >> "Pregunta " i " de " total ":" ¶
    >> preguntas[i] ¶

    << "> " respuesta

    ? es_correcta(respuesta, respuestas_correctas[i]) {
        >> "✓ ¡Correcto!" ¶
        puntos++
    } _ {
        >> "✗ Incorrecto. La respuesta era: " respuestas_correctas[i] ¶
    }
    >> ¶
}

resultado_final(puntos, total)
```

---

## El programa completo

Aquí está todo junto. Cópialo en un archivo llamado `quiz.zy` y ejecútalo con `zymbol run quiz.zy`:

```
// ─── Datos ───────────────────────────────────────────────

preguntas = [
    "¿De qué color es el cielo despejado?",
    "¿Cuántos lados tiene un triángulo?",
    "¿Cuál es el resultado de 7 × 8?",
    "¿En qué planeta vivimos?",
    "¿Cuántos meses tiene un año?"
]

respuestas_correctas = [
    "azul",
    "3",
    "56",
    "tierra",
    "12"
]

// ─── Funciones ────────────────────────────────────────────

es_correcta(respuesta, correcta) {
    <~ respuesta == correcta
}

separador() {
    >> "────────────────────────────────" ¶
}

bienvenida() {
    >> "╔═══════════════════════════════╗" ¶
    >> "║       Quiz de Zymbol          ║" ¶
    >> "╚═══════════════════════════════╝" ¶
    >> ¶
    >> "Responde cada pregunta." ¶
    >> "Escribe tu respuesta en minúsculas." ¶
    >> "¡Buena suerte!" ¶
    >> ¶
}

resultado_final(puntos, total) {
    >> "════════════════════════════════" ¶
    >> "  Resultado: " puntos " de " total " correctas" ¶

    mensaje = ?? puntos {
        _? puntos == total     : "¡Perfecto! Eres increíble."
        _? puntos >= total - 1 : "¡Muy bien! Casi perfecto."
        _? puntos >= total / 2 : "Bien. La práctica hace al maestro."
        _                      : "¡Sigue intentando, tú puedes!"
    }

    >> "  " mensaje ¶
    >> "════════════════════════════════" ¶
}

// ─── Programa principal ───────────────────────────────────

bienvenida()

puntos = 0
total  = preguntas$#

@ i:1..total {
    separador()
    >> "Pregunta " i " de " total ":" ¶
    >> preguntas[i] ¶

    << "> " respuesta

    ? es_correcta(respuesta, respuestas_correctas[i]) {
        >> "✓ ¡Correcto!" ¶
        puntos++
    } _ {
        >> "✗ Incorrecto. La respuesta era: " respuestas_correctas[i] ¶
    }
    >> ¶
}

resultado_final(puntos, total)
```

---

## Cómo extenderlo

Ahora que tienes el programa funcionando, aquí van algunas ideas para mejorarlo por tu cuenta:

**Fácil:**
- Cambia las preguntas por un tema que te guste: películas, música, historia, deportes
- Agrega más preguntas — solo tienes que agregar elementos a las dos listas

**Un poco más desafiante:**
- Lleva un registro de cuáles preguntas fallaste y muéstralas al final para repasar
- Agrega un sistema de intentos — el usuario tiene dos oportunidades por pregunta antes de revelar la respuesta
- Muestra cuánto tiempo tardó el usuario en responder cada pregunta

---

## Qué aprendiste en este curso

| Lección | Concepto | Símbolo |
|---|---|---|
| 02 | Salida y variables | `>>`, `=`, `:=` |
| 03 | Decisiones | `?`, `_?`, `_` |
| 04 | Repetición | `@`, `@!`, `@>` |
| 05 | Funciones | `nombre() { }`, `<~` |
| 06 | Listas | `[a, b, c]`, `$+`, `$-` |
| 07 | Texto | `$#`, `$?`, `$/`, `$~~` |
| 08 | Match | `??`, `..`, `_?` |

---

## ¿Y ahora qué?

Zymbol tiene más para explorar. Cuando te sientas lista con lo que aprendiste aquí, estos son los temas que siguen:

- **Entrada desde consola** — pedirle datos al usuario en programas interactivos
- **Módulos** — dividir un programa grande en archivos separados
- **Manejo de errores** — qué hacer cuando algo sale mal
- **Funciones de orden superior** — aplicar una función a todos los elementos de una lista de una sola vez

El manual completo está disponible en:
[zymbol-lang.org](https://zymbol-lang.org)

---

Programar es una habilidad que se construye de a poco, con práctica y paciencia. Lo más importante no es memorizar la sintaxis — eso viene solo con el tiempo. Lo importante es aprender a pensar en pasos: descomponer un problema grande en piezas pequeñas, y resolver cada pieza una a la vez.

Ya sabes hacer eso.

---

[← Lección anterior](08_funciones.md) · [Índice](README.md)
