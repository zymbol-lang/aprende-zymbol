# Lección 03 — Decisiones

Los programas no son líneas rectas — son caminos que se bifurcan. En cada bifurcación, el programa se detiene, observa una situación y decide qué hacer. Esa decisión es lo que vas a aprender en esta lección.

---

## El símbolo `?` — El evaluador

En Zymbol, `?` es el símbolo de decisión. Se pronuncia **"en caso de que"** o **"si lógico"**, pero hay una trampa en el español que vale la pena nombrar antes de seguir.

### La trampa del lenguaje

La palabra "si" en español es ambigua. No es lo mismo:

- **Afirmación:** *"Sí, tengo 20 años."* → Es un hecho. No hay duda.
- **Condicional:** *"Si tengo 20 años..."* → Es una evaluación. El programa pregunta: ¿esto es verdad?

El `?` de Zymbol es siempre el segundo caso. No afirma nada — **evalúa**. Por eso se escribe con símbolo y no con palabra: para que no se confunda con el "sí" de afirmar.

> **Regla práctica:** Lee `?` como una pregunta de **Verdadero o Falso**. Si la respuesta es Verdadero, el programa entra a las llaves `{ }`. Si es Falso, las ignora.

---

## Anatomía de una decisión

```
edad = 20

? edad >= 18 {
    >> "Eres mayor de edad" ¶
}
```

Cuando Zymbol llega al `?`, hace tres cosas en orden:

1. **Observa** la condición: `edad >= 18`
2. **Evalúa**: ¿Es cierto que `20 >= 18`? → **Verdadero**
3. **Ejecuta** lo que está dentro de las `{ }` porque la condición se cumplió

Si `edad` fuera `15`, la evaluación daría **Falso** y el bloque completo se saltaría sin ejecutar nada.

La estructura general es:

```
? condición {
    // lo que sucede cuando la condición es Verdadera
}
```

Las llaves `{ }` son **obligatorias**, aunque solo haya una línea adentro. Funcionan como una puerta: solo se abren cuando la condición es verdad.

---

## De lo contrario: `_`

¿Qué pasa cuando la condición es Falsa y quieres hacer algo de todas formas? Para eso existe `_` — el bloque **"de lo contrario"**. En inglés se llama `else`.

```
edad = 15

? edad >= 18 {
    >> "Puedes entrar" ¶
} _ {
    >> "Aún no puedes entrar" ¶
}
```

Se lee: *"En caso de que edad sea mayor o igual a 18, mostrar 'Puedes entrar'. De lo contrario, mostrar 'Aún no puedes entrar'."*

Siempre se ejecuta uno de los dos bloques — nunca los dos, nunca ninguno.

---

## De lo contrario, comprueba: `_?`

Cuando hay más de dos posibilidades, `_?` permite seguir evaluando condiciones en cadena. En inglés se llama `else if`.

```
nota = 75

? nota >= 90 {
    >> "Excelente" ¶
} _? nota >= 70 {
    >> "Bien" ¶
} _? nota >= 50 {
    >> "Suficiente" ¶
} _ {
    >> "Reprobado" ¶
}
```

Se lee: *"En caso de que la nota sea 90 o más... de lo contrario, en caso de que sea 70 o más... de lo contrario, en caso de que sea 50 o más... de lo contrario, 'Reprobado'."*

Zymbol revisa las condiciones de arriba hacia abajo y ejecuta el primer bloque cuya condición se cumpla. En cuanto encuentra uno verdadero, ignora todos los demás.

---

## Operadores de comparación

Estos son los símbolos que usas dentro de las condiciones:

| Símbolo | Significado | Ejemplo |
|---|---|---|
| `==` | igual a | `edad == 18` |
| `<>` | diferente de | `nombre <> "error"` |
| `<` | menor que | `precio < 100` |
| `<=` | menor o igual | `intentos <= 3` |
| `>` | mayor que | `puntaje > 50` |
| `>=` | mayor o igual | `edad >= 18` |

---

## Operadores lógicos

Sirven para combinar condiciones:

| Símbolo | Significado | Ejemplo |
|---|---|---|
| `&&` | y (ambas deben ser Verdadero) | `edad >= 18 && tiene_id == #1` |
| `\|\|` | o (basta con que una sea Verdadero) | `es_admin == #1 \|\| es_mod == #1` |
| `!` | no (invierte el resultado) | `!activo` |

```
edad      = 22
tiene_id  = #1

? edad >= 18 && tiene_id == #1 {
    >> "Acceso permitido" ¶
} _ {
    >> "Acceso denegado" ¶
}
```

```
llueve    = #0
hace_frio = #1

? llueve || hace_frio {
    >> "Lleva abrigo" ¶
}
```

---

## Condiciones con texto

Las comparaciones también funcionan con cadenas:

```
color = "rojo"

? color == "rojo" {
    >> "Color de alerta" ¶
} _? color == "verde" {
    >> "Todo bien" ¶
} _ {
    >> "Color desconocido" ¶
}
```

---

## Condiciones anidadas

Puedes poner un `?` adentro de otro. Úsalo con moderación — demasiados niveles hacen el código difícil de seguir:

```
tiene_cuenta = #1
saldo        = 150

? tiene_cuenta == #1 {
    ? saldo >= 100 {
        >> "Puedes realizar la compra" ¶
    } _ {
        >> "Saldo insuficiente" ¶
    }
} _ {
    >> "Necesitas crear una cuenta" ¶
}
```

---

## Programa completo de esta lección

Un pequeño sistema de calificaciones. Cambia el valor de `nota` y observa qué imprime:

```
nota = 85

? nota < 0 || nota > 100 {
    >> "Nota inválida" ¶
} _? nota >= 90 {
    >> "Calificación: A — Excelente" ¶
} _? nota >= 80 {
    >> "Calificación: B — Muy bien" ¶
} _? nota >= 70 {
    >> "Calificación: C — Bien" ¶
} _? nota >= 60 {
    >> "Calificación: D — Suficiente" ¶
} _ {
    >> "Calificación: F — Reprobado" ¶
}
```

---

## Resumen

| Concepto | En español | Sintaxis |
|---|---|---|
| En caso de que (`if`) | en caso de que... | `? condición { }` |
| De lo contrario (`else`) | de lo contrario... | `} _ { }` |
| De lo contrario, comprueba (`else if`) | de lo contrario, en caso de que... | `} _? condición { }` |
| Igual / diferente | `==` / `<>` | |
| Comparaciones | `<` `<=` `>` `>=` | |
| Y / O / No | `&&` / `\|\|` / `!` | |

---

Siguiente lección: [04 — Selector de Casos](04_selector_de_casos.md)

[← Lección anterior](02_primer_programa.md) · [Índice](README.md)
