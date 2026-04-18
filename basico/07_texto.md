# Lección 07 — Texto

El texto es uno de los tipos de datos que más vas a usar: nombres, mensajes, respuestas del usuario, resultados formateados. En esta lección vas a conocer las herramientas que Zymbol ofrece para trabajar con cadenas de texto en profundidad.

La buena noticia: si ya aprendiste a trabajar con listas, muchos operadores te van a resultar familiares. Zymbol los diseñó para que funcionen igual en listas y en texto.

---

## Repaso rápido: qué es una cadena

Una cadena de texto es simplemente una secuencia de caracteres entre comillas dobles:

```
saludo  = "Hola, mundo"
nombre  = "Ana García"
vacia   = ""
```

Puedes pensar en ella como una lista de letras, una pegada a la otra.

---

## Largo del texto — `$#`

Igual que con las listas, `$#` te dice cuántos caracteres tiene:

```
frase = "Buenos días"
largo = frase$#

>> "La frase tiene " largo " caracteres" ¶
```

Resultado:
```
La frase tiene 11 caracteres
```

---

## Acceder a un carácter por posición

También igual que las listas: posiciones desde el **1**, y negativas desde el final.

```
palabra = "Zymbol"

>> palabra[1] ¶     // → Z  (primera letra)
>> palabra[2] ¶     // → y
>> palabra[-1] ¶    // → l  (última letra)
>> palabra[-2] ¶    // → o  (penúltima)
```

> Recordatorio: la posición `0` no existe — causará un error.

---

## Interpolación — meter variables dentro de texto

Ya lo viste en la lección 02, pero vale la pena reforzarlo porque es la herramienta más útil al trabajar con texto:

```
nombre = "Ana"
edad   = 28
ciudad = "Oaxaca"

>> "Hola, soy {nombre}, tengo {edad} años y vivo en {ciudad}." ¶
```

Resultado:
```
Hola, soy Ana, tengo 28 años y vivo en Oaxaca.
```

Funciona en cualquier lugar: dentro de una variable, como argumento de una función, dentro de una lista.

```
etiqueta = "Cliente: {nombre} ({ciudad})"
>> etiqueta ¶
```

### ¿Y si necesito escribir `{` o `}` como texto literal?

Escápala con `\`:

```
>> "El formato es: \{nombre\}" ¶
```

Resultado:
```
El formato es: {nombre}
```

---

## Extraer una parte del texto — `$[inicio..fin]`

Igual que con las listas, puedes recortar una porción. Ambos extremos están incluidos:

```
frase = "Buenos días, mundo"

inicio  = frase$[1..6]
final   = frase$[14..18]

>> inicio ¶    // → Buenos
>> final  ¶    // → mundo
```

---

## Buscar dentro del texto — `$?`

`$?` verifica si una letra o una palabra existe dentro de la cadena:

```
correo = "ana@ejemplo.com"

tiene_arroba = correo$? '@'
tiene_punto  = correo$? '.'
tiene_zz     = correo$? "zz"

>> "¿Tiene @?  " tiene_arroba ¶    // → #1
>> "¿Tiene .?  " tiene_punto  ¶    // → #1
>> "¿Tiene zz? " tiene_zz     ¶    // → #0
```

---

## Dividir texto en partes — `$/`

`$/` corta una cadena cada vez que encuentra el separador que le indiques, y devuelve una lista con las partes:

```
fecha = "2025-04-17"
partes = fecha $/ '-'

>> partes ¶         // → [2025, 04, 17]
>> "Año:  " partes[1] ¶
>> "Mes:  " partes[2] ¶
>> "Día:  " partes[3] ¶
```

Resultado:
```
[2025, 04, 17]
Año:  2025
Mes:  04
Día:  17
```

También funciona con separadores de más de un carácter:

```
csv = "nombre::edad::ciudad"
campos = csv $/ "::"

>> campos ¶    // → [nombre, edad, ciudad]
```

---

## Agregar texto — `$+`

`$+` agrega texto al final de una cadena (igual que con listas):

```
mensaje = "Hola"
mensaje = mensaje$+ ", mundo"
mensaje = mensaje$+ "!"

>> mensaje ¶    // → Hola, mundo!
```

---

## Eliminar texto — `$-` y `$--`

`$-` elimina la **primera vez** que aparece una letra o fragmento. `$--` los elimina **todos**:

```
frase = "la casa de la laguna"

sin_primera_la = frase$- "la"
>> sin_primera_la ¶    // → " casa de la laguna"

sin_todas_las = frase$-- "la"
>> sin_todas_las ¶     // → " casa de  guna"
```

---

## Reemplazar texto — `$~~`

`$~~` busca un fragmento y lo reemplaza por otro. La sintaxis es `$~~[buscar:reemplazar]`:

```
texto = "el gato y el perro"

nuevo = texto$~~["el":"un"]
>> nuevo ¶    // → un gato y un perro
```

Si solo quieres reemplazar la primera vez que aparece, agrega `:1` al final:

```
solo_primero = texto$~~["el":"un":1]
>> solo_primero ¶    // → un gato y el perro
```

---

## Recorrer letra por letra

Igual que con las listas, `@` recorre cada carácter:

```
palabra = "hola"

@ letra:palabra {
    >> letra " "
}
>> ¶
```

Resultado:
```
h o l a
```

Un ejemplo más útil — contar cuántas vocales tiene una palabra:

```
contar_vocales(texto) {
    vocales  = "aeiouáéíóúAEIOUÁÉÍÓÚ"
    conteo   = 0
    @ c:texto {
        ? vocales$? c { conteo++ }
    }
    <~ conteo
}

>> contar_vocales("murciélago") ¶    // → 5
>> contar_vocales("Zymbol")     ¶    // → 1
```

---

## Programa completo de esta lección

Un analizador de correos electrónicos. Dado un correo, extrae el nombre de usuario y el dominio, y verifica si parece válido:

```
analizar_correo(correo) {
    >> "=== Analizando: {correo} ===" ¶

    // ¿Tiene arroba?
    ? !(correo$? '@') {
        >> "  ✗ No es un correo válido (falta @)" ¶
        <~
    }

    // Dividir por @
    partes  = correo $/ '@'
    usuario = partes[1]
    dominio = partes[2]

    // ¿Tiene punto en el dominio?
    ? !(dominio$? '.') {
        >> "  ✗ Dominio inválido (falta .)" ¶
        <~
    }

    largo_usuario = usuario$#
    largo_dominio = dominio$#

    >> "  ✓ Usuario: {usuario} ({largo_usuario} caracteres)" ¶
    >> "  ✓ Dominio: {dominio} ({largo_dominio} caracteres)" ¶
    >> "  ✓ Correo válido" ¶
}

analizar_correo("ana@ejemplo.com")
>> ¶
analizar_correo("luis.garcia@correo.mx")
>> ¶
analizar_correo("esto-no-es-un-correo")
```

Resultado:
```
=== Analizando: ana@ejemplo.com ===
  ✓ Usuario: ana (3 caracteres)
  ✓ Dominio: ejemplo.com (11 caracteres)
  ✓ Correo válido

=== Analizando: luis.garcia@correo.mx ===
  ✓ Usuario: luis.garcia (11 caracteres)
  ✓ Dominio: correo.mx (9 caracteres)
  ✓ Correo válido

=== Analizando: esto-no-es-un-correo ===
  ✗ No es un correo válido (falta @)
```

---

## Resumen

| Qué quieres hacer | Cómo |
|---|---|
| Largo del texto | `texto$#` |
| Leer carácter N | `texto[N]` |
| Último carácter | `texto[-1]` |
| Meter variable en texto | `"Hola {nombre}"` |
| Extraer fragmento | `texto$[1..5]` |
| ¿Contiene letra/palabra? | `texto$? 'a'` o `texto$? "hola"` |
| Dividir por separador | `texto $/ ','` |
| Agregar al final | `texto = texto$+ "más"` |
| Eliminar primera ocurrencia | `texto$- "x"` |
| Eliminar todas las ocurrencias | `texto$-- "x"` |
| Reemplazar todo | `texto$~~["viejo":"nuevo"]` |
| Reemplazar solo la primera vez | `texto$~~["viejo":"nuevo":1]` |
| Recorrer letra por letra | `@ c:texto { }` |

---

Siguiente lección: [08 — Funciones](08_funciones.md)

[← Lección anterior](06_listas.md) · [Índice](README.md)
