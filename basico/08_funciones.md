# Lección 08 — Funciones

> **Revisado para v0.0.8 — 2026-08-05**

Hasta ahora todo el código que has escrito corre de arriba hacia abajo, una sola vez. Pero ¿qué pasa cuando necesitas hacer la misma operación en varios lugares? ¿La copias y pegas? No — para eso existen las **funciones**.

Una función es un bloque de código con nombre que puedes llamar cuantas veces quieras desde cualquier parte de tu programa.

---

## Definir una función

En Zymbol una función se define así:

```
nombre(parámetros) {
    // instrucciones
}
```

Sin palabras clave — solo el nombre, los parámetros entre paréntesis y las llaves.

```
saludar(nombre) {
    >> "Hola, {nombre}" ¶
}
```

Definir una función no hace nada por sí solo. Para que el código adentro se ejecute, tienes que **llamarla**:

```
saludar("Ana")
saludar("Luis")
saludar("Sofía")
```

Resultado:
```
Hola, Ana
Hola, Luis
Hola, Sofía
```

Tres llamadas, tres resultados. El código dentro de `saludar` se ejecutó tres veces sin que lo tuvieras que repetir.

---

## Devolver un resultado — `<~`

Una función también puede **calcular algo y devolverlo**. Para eso se usa `<~`. Se lee como **"devuelve"** o **"el resultado es"**.

```
sumar(a, b) {
    <~ a + b
}

resultado = sumar(3, 7)
>> resultado ¶
```

Resultado:
```
10
```

Puedes usar el resultado directamente sin guardarlo en una variable:

```
>> "La suma es: " sumar(4, 6) ¶
>> "El doble de 5 es: " sumar(5, 5) ¶
```

### `<~` sale de la función de inmediato

En cuanto Zymbol encuentra `<~`, deja de ejecutar la función y devuelve ese valor. Lo que venga después no se ejecuta:

```
valor_absoluto(n) {
    ? n < 0 { <~ -n }
    <~ n
}

>> valor_absoluto(-8) ¶    // → 8
>> valor_absoluto(3)  ¶    // → 3
```

Se lee: *"En caso de que n sea negativo, devuelve -n y sal. De lo contrario, devuelve n."*

---

## Funciones sin resultado

Si una función solo hace algo (mostrar texto, modificar datos) y no necesita devolver un valor, simplemente no escribes `<~`:

```
mostrar_linea() {
    >> "-------------------" ¶
}

mostrar_linea()
>> "Reporte del día" ¶
mostrar_linea()
```

Resultado:
```
-------------------
Reporte del día
-------------------
```

---

## Varios parámetros

Una función puede recibir tantos parámetros como necesite:

```
presentar(nombre, edad, ciudad) {
    >> "Nombre: {nombre}" ¶
    >> "Edad:   {edad}"   ¶
    >> "Ciudad: {ciudad}" ¶
}

presentar("Ana", 28, "Monterrey")
>> ¶
presentar("Luis", 35, "Bogotá")
```

Resultado:
```
Nombre: Ana
Edad:   28
Ciudad: Monterrey

Nombre: Luis
Edad:   35
Ciudad: Bogotá
```

---

## Las funciones tienen su propio espacio

Las variables que creas dentro de una función **no existen fuera de ella**. Igualmente, las variables de afuera **no son visibles adentro**. Cada función trabaja en su propio espacio aislado.

```
mensaje = "soy de afuera"

mostrar_algo() {
    // 'mensaje' no existe aquí — solo existen los parámetros
    texto = "soy de adentro"
    >> texto ¶
}

mostrar_algo()
>> mensaje ¶
```

Resultado:
```
soy de adentro
soy de afuera
```

Esto es una ventaja: puedes usar el nombre `resultado`, `i`, `temp` adentro de cualquier función sin preocuparte de que choquen con variables del resto del programa.

> ⚠️ **Excepción: las constantes sí entran.** El aislamiento aplica a las variables
> normales (`=`), pero las **constantes** declaradas con `:=` sí son visibles dentro
> de las funciones:
>
> ```
> PI := 3.14
>
> area(radio) {
>     <~ radio * radio * PI    // ✓ PI sí es visible aquí
> }
>
> >> area(2) ¶    // → 12.56
> ```
>
> Desde **v0.0.8** esto vale también en las llamadas anidadas y en la recursión: la
> constante llega a cualquier función, la llames desde donde la llames.
>
> ```
> K := 5
> interna() { <~ K * 2 }
> externa() { <~ interna() + K }
> >> externa() ¶    // → 15
> ```
>
> (En v0.0.7 la segunda de estas dos funciones fallaba con `'K' is undefined`. Si
> ves ese error, tu binario es anterior — comprueba con `zymbol --version`.)

---

## Llamar una función dentro de otra

Las funciones pueden llamarse entre sí:

```
cuadrado(n) {
    <~ n * n
}

suma_de_cuadrados(a, b) {
    <~ cuadrado(a) + cuadrado(b)
}

>> suma_de_cuadrados(3, 4) ¶
```

Resultado:
```
25
```

---

## Recursión — una función que se llama a sí misma

Una función puede llamarse a sí misma. Esto se llama **recursión** y es útil para problemas que se pueden dividir en versiones más pequeñas del mismo problema.

El ejemplo clásico es el factorial: el factorial de 5 es `5 × 4 × 3 × 2 × 1`.

```
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}

>> factorial(5) ¶    // → 120
>> factorial(6) ¶    // → 720
```

Se lee: *"El factorial de n es: en caso de que n sea 1 o menos, devuelve 1. De lo contrario, devuelve n multiplicado por el factorial de n-1."*

> Toda función recursiva necesita una condición de parada — en este caso `n <= 1`. Sin ella, la función se llamaría a sí misma para siempre.

---

## Programa completo de esta lección

Una calculadora de área para tres figuras geométricas:

```
area_rectangulo(base, altura) {
    <~ base * altura
}

area_triangulo(base, altura) {
    <~ (base * altura) / 2
}

area_circulo(radio) {
    PI := 3.14159
    <~ PI * radio * radio
}

separador() {
    >> "─────────────────" ¶
}

>> "=== Calculadora de áreas ===" ¶
>> ¶

separador()
>> "Rectángulo 8×5:  " area_rectangulo(8, 5) ¶
separador()
>> "Triángulo 6×4:   " area_triangulo(6, 4)  ¶
separador()
>> "Círculo radio 3: " area_circulo(3)        ¶
separador()
```

Resultado:
```
=== Calculadora de áreas ===

─────────────────
Rectángulo 8×5:  40
─────────────────
Triángulo 6×4:   12
─────────────────
Círculo radio 3: 28.27431
─────────────────
```

---

## Resumen

| Concepto | Sintaxis |
|---|---|
| Definir una función | `nombre(params) { }` |
| Llamar una función | `nombre(valores)` |
| Devolver un resultado | `<~ valor` |
| Sin resultado | omite `<~` |
| Función sin parámetros | `nombre() { }` |
| Función dentro de función | llamada normal adentro del bloque |

---

## Así se usan las funciones en un juego real

Una función de [Serpiente](https://github.com/zymbol-lang/zySerpiente), tal cual está en el repositorio. Devuelve la posición de una comida nueva que no caiga encima de la serpiente:

> 🎮 Pruébalo ahora, sin instalar nada: [ábrelo en el playground →](https://zymbol-lang.org/playground.html?open=games/arcade/serpiente.zyp)

```
// serpiente/logica.zy
nueva_comida(serpiente, AN, AL, semilla) {
    (r, s1) = rango_aleatorio(semilla, 2, AL + 1)
    (c, s2) = rango_aleatorio(s1,     2, AN)
    pos = (r, c)
    ? _en_serpiente(serpiente, pos) {
        (r, s1) = rango_aleatorio(s2, 2, AL + 1)
        (c, s2) = rango_aleatorio(s1, 2, AN)
        pos = (r, c)
    }
    <~ (pos, s2)
}
```

Hay cuatro cosas nuevas aquí, y las cuatro son consecuencia del aislamiento que acabas de aprender:

1. **Todo entra por la firma.** `serpiente`, `AN`, `AL` y `semilla` no son variables globales — no existen. La función solo puede ver lo que le pasas.
2. **`<~ (pos, s2)` devuelve dos cosas a la vez**, empaquetadas en una tupla. Es lo que se hace cuando una función tiene más de una respuesta.
3. **`(r, s1) = rango_aleatorio(...)`** desempaqueta esa tupla en dos variables de un golpe. Lo verás con detalle en el nivel intermedio.
4. **`_en_serpiente` empieza por `_`.** Es una función privada del módulo: se usa aquí dentro y no se publica hacia fuera.

Y una decisión que merece la pena entender: **hay un solo reintento, no un bucle**. Si la primera posición cae encima de la serpiente se prueba otra vez, y si esa también falla se acepta igual. Un bucle «hasta encontrar sitio» sobre un tablero casi lleno podría no terminar nunca, y el juego prefiere un fallo rarísimo y visible a un cuelgue.

Si quieres ver funciones así construyendo un juego entero, ese es el [nivel Juegos](juegos/README.md).

---

Siguiente nivel: [Intermedio →](intermedio/README.md)

[← Lección anterior](basico/07_texto.md) · [Índice](basico/README.md)
