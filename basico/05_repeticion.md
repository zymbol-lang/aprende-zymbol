# Lección 05 — Repetición

Imagina que quieres mostrar los números del 1 al 100. Podrías escribir 100 líneas con `>>`, pero eso sería ridículo. Para eso existen los **bucles**: bloques de código que se repiten automáticamente.

En Zymbol el símbolo de bucle es `@`. Obsérvalo un momento: es una espiral — una letra que da vueltas sobre sí misma hasta que algo la detiene. Eso es exactamente lo que hace un bucle: girar, repetir, volver al inicio, una y otra vez. Se lee como **"repite"**.

---

## Repetir mientras una condición se cumpla

La forma más directa: el bloque se repite mientras la condición sea verdadera. En cuanto deja de cumplirse, el programa sigue adelante.

```
cuenta = 1

@ cuenta <= 5 {
    >> cuenta " "
    cuenta++
}
>> ¶
```

Resultado:
```
1 2 3 4 5
```

Se lee: *"Repite mientras cuenta sea menor o igual a 5. Dentro: muestra cuenta, luego auméntala en 1."*

> `cuenta++` es una forma corta de escribir `cuenta = cuenta + 1`. Suma 1 a la variable.

---

## Repetir exactamente N veces

La forma más directa cuando solo te importa cuántas veces: escribe el número después del `@`. El bloque se ejecuta exactamente ese número de veces y se detiene solo.

```
@ 5 {
    >> "Zz"
}
>> ¶
```

Resultado:
```
ZzZzZzZzZz
```

No hay variable de contador, no hay condición que mantener. El lenguaje cuenta por ti.

> El analizador muestra un aviso `loop condition should be Bool, got Int` porque internamente comparte la gramática con el while. El aviso es esperado e inofensivo — el intérprete reconoce la forma y ejecuta exactamente N veces.

---

## Repetir un número fijo de veces con contador — rango

Cuando necesitas saber en qué vuelta estás, usa un rango con `..`. El número a la izquierda es el inicio, el de la derecha es el fin (ambos **incluidos**):

```
@ i:1..5 {
    >> "Vuelta número " i ¶
}
```

Resultado:
```
Vuelta número 1
Vuelta número 2
Vuelta número 3
Vuelta número 4
Vuelta número 5
```

Se lee: *"Repite con i tomando los valores 1, 2, 3, 4 y 5."*

La variable `i` cambia sola en cada vuelta — no tienes que aumentarla tú.

### Rango con paso

Puedes indicar de cuánto en cuánto avanza el contador añadiendo un tercer número:

```
@ i:0..10:2 {
    >> i " "
}
>> ¶
```

Resultado:
```
0 2 4 6 8 10
```

### Rango hacia atrás

Si el inicio es mayor que el fin, el bucle cuenta hacia atrás:

```
@ i:5..1:1 {
    >> i " "
}
>> ¶
```

Resultado:
```
5 4 3 2 1
```

---

## Recorrer una lista

Para pasar por cada elemento de una lista uno por uno, usa `elemento:lista`:

```
frutas = ["manzana", "pera", "uva", "mango"]

@ fruta:frutas {
    >> "- " fruta ¶
}
```

Resultado:
```
- manzana
- pera
- uva
- mango
```

Se lee: *"Para cada fruta en la lista frutas, muestra su nombre."*

---

## Recorrer un texto letra por letra

El mismo símbolo funciona con cadenas — itera carácter a carácter:

```
palabra = "hola"

@ letra:palabra {
    >> letra "-"
}
>> ¶
```

Resultado:
```
h-o-l-a-
```

---

## Detener un bucle antes de tiempo — `@!`

`@!` detiene el bucle en ese momento y el programa continúa después de él. Se lee **"para"** o **"detente"**.

```
@ i:1..10 {
    ? i == 6 { @! }
    >> i " "
}
>> ¶
```

Resultado:
```
1 2 3 4 5
```

En cuanto `i` llega a 6, el bucle se detiene. El 6 nunca se imprime porque `@!` actúa antes del `>>`.

---

## Saltar una vuelta — `@>`

`@>` salta el resto de la vuelta actual y pasa directamente a la siguiente. Se lee **"siguiente"** o **"sáltate esta"**.

```
@ i:1..8 {
    ? i % 2 == 0 { @> }
    >> i " "
}
>> ¶
```

Resultado:
```
1 3 5 7
```

Se lee: *"En caso de que i sea par, sáltate esta vuelta. De lo contrario, muéstralo."*

> `%` es el operador **módulo** — devuelve el resto de una división. Si `i % 2` es `0`, el número es par.

---

## Bucle infinito

Un `@` sin condición repite para siempre. Siempre debe tener un `@!` adentro para poder salir:

```
intentos = 0

@ {
    intentos++
    ? intentos >= 3 { @! }
    >> "Intento " intentos ¶
}
>> "Fin" ¶
```

Resultado:
```
Intento 1
Intento 2
Fin
```

Úsalo cuando no sabes de antemano cuántas vueltas necesitas — por ejemplo, pedir datos al usuario hasta que ingrese algo válido.

---

## Programa completo de esta lección

Una tabla de multiplicar. Cambia el valor de `numero` para ver otra tabla:

```
numero = 7

>> "=== Tabla del " numero " ===" ¶
>> ¶

@ i:1..10 {
    resultado = numero * i
    >> numero " × " i " = " resultado ¶
}
```

Resultado:
```
=== Tabla del 7 ===

7 × 1 = 7
7 × 2 = 14
7 × 3 = 21
7 × 4 = 28
7 × 5 = 35
7 × 6 = 42
7 × 7 = 49
7 × 8 = 56
7 × 9 = 63
7 × 10 = 70
```

---

## Resumen

| Concepto | Sintaxis |
|---|---|
| Repite mientras... | `@ condición { }` |
| Repite N veces (simple) | `@ N { }` |
| Repite N veces con contador | `@ i:1..N { }` |
| Rango con paso | `@ i:0..10:2 { }` |
| Para cada elemento | `@ elemento:lista { }` |
| Bucle infinito | `@ { }` |
| Detener el bucle | `@!` |
| Saltar esta vuelta | `@>` |

---

Siguiente lección: [06 — Listas](basico/06_listas.md)

[← Lección anterior](basico/04_selector_de_casos.md) · [Índice](basico/README.md)
