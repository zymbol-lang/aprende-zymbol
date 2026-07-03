# Lección 06 — Programar en tu idioma

> **Revisado para v0.0.7 — 2026-07-03**

Ya lo habrás notado a lo largo del curso: en Zymbol **no existe ninguna palabra clave en inglés**. Una condición es `?`, una repetición es `@`, devolver un valor es `<~`. Y los nombres que tú eliges — variables, funciones, módulos — pueden estar en cualquier idioma, porque el lenguaje acepta cualquier símbolo Unicode como identificador.

Esta lección lleva esa idea hasta el final: programas **completos** escritos en español (o griego, o coreano, o mandarín), bibliotecas que se publican en varios idiomas a la vez, y datos externos cuyas claves en inglés se leen en español. Todo con mecanismos que ya conoces — no hay sintaxis nueva que aprender, solo una forma nueva de usarla.

---

## Código en español, de punta a punta

Nada te impide escribir así desde la primera lección:

```
saludar(nombre) {
    <~ "Hola, {nombre}"
}

contar_vocales(palabra) {
    vocales = ["a", "e", "i", "o", "u"]
    cuenta = 0
    @ letra:palabra {
        ? vocales$? "{letra}" { cuenta = cuenta + 1 }
    }
    <~ cuenta
}

>> saludar("Marisol") ¶
>> "vocales de 'murciélago': " contar_vocales("murcielago") ¶
```

El proyecto [Serpiente](https://github.com/zymbol-lang/zy-Serpiente) — el juego clásico de la serpiente corriendo en la terminal — está escrito **completamente en español**: tres módulos (`serpiente.zy`, `logica.zy`, `dibujo.zy`) donde cada función, cada variable y cada comentario están en el idioma de quien lo escribió. Un fragmento real de su lógica:

```
// Entero aleatorio en [min, max] — retorna (valor, semilla_siguiente)
rango_aleatorio(semilla, min, max) {
    sig = lcg_sig(semilla)
    val = sig % (max - min + 1) + min
    <~ (val, sig)
}

// Genera posición de comida sin superponerse con la serpiente
nueva_comida(serpiente, AN, AL, semilla) {
    [r, s1] = rango_aleatorio(semilla, 2, AL + 1)
    [c, s2] = rango_aleatorio(s1,     2, AN)
    ...
}
```

No hay ni una palabra de otro idioma interrumpiendo la lectura. Eso es imposible en los lenguajes tradicionales, donde las palabras reservadas siempre están en inglés.

---

## El único inglés que queda: la biblioteca estándar

En la lección intermedia 09 usaste `std/math`, `std/io` y `std/json` — y sus funciones se llaman `sqrt`, `read`, `decode`. Es el último rincón en inglés de un programa en español.

La solución es el mecanismo de **re-exportación** de la lección de módulos: un *adaptador* — un módulo de una página que importa la biblioteca y vuelve a publicar cada función con un nombre en español. **Cero lógica, cero costo**: al cargar el programa, cada nombre nuevo queda conectado directamente a la función original.

```
// archivo: matematica_es.zy — solo re-exporta, cero lógica
# matematica_es {
    <# std/math => _mat

    #> {
        _mat::sqrt  => raiz
        _mat::pow   => potencia
        _mat::round => redondear
        _mat::abs   => absoluto
        _mat::max   => maximo
        _mat::min   => minimo
    }
}
```

```
// archivo: archivos_es.zy — lo mismo para std/io
# archivos_es {
    <# std/io => _io

    #> {
        _io::read   => leer
        _io::write  => escribir
        _io::append => agregar
        _io::exists => existe
        _io::delete => borrar
    }
}
```

Y el programa que los usa ya no tiene una sola palabra en inglés:

```
<# ./matematica_es => mate
<# ./archivos_es   => arch

>> "raíz de 81: " mate::raiz(81) ¶

arch::escribir("bitacora.txt", "todo en orden")
>> arch::leer("bitacora.txt") ¶
```

Escribes el adaptador **una vez** y lo reutilizas en todos tus proyectos.

---

## El patrón de tres capas

El mismo mecanismo funciona entre **cualquier par de idiomas**, y es la manera en que los equipos que hablan idiomas distintos comparten código en Zymbol:

```
┌─────────────────────┐      ┌──────────────────────────┐      ┌─────────────────────────┐
│   Módulo base       │      │   Módulo de traducción    │      │   Programa consumidor   │
│   (un idioma)       │  ◄── │   (solo re-exporta)       │  ◄── │   (otro idioma)         │
│                     │      │   cero lógica, cero costo │      │                         │
└─────────────────────┘      └──────────────────────────┘      └─────────────────────────┘
```

1. **Módulo base** — un equipo escribe la biblioteca en su idioma y exporta su API pública.
2. **Módulo de traducción** — un adaptador que importa el módulo base y re-exporta cada símbolo con nombres en otro idioma. No contiene lógica alguna.
3. **Programa consumidor** — importa el módulo de traducción y programa enteramente en su propio idioma, sin leer jamás el idioma original.

Por ejemplo, un equipo hispanohablante publica `matematicas/module.zy` con `sumar`, `restar`, `PI`… y un adaptador griego lo re-exporta:

```
// matematicas/ελληνικά.zy
# ελληνικά {
    <# ./module => mat

    #> {
        mat::sumar  => προσθέτω
        mat::restar => αφαιρώ
        mat.PI      => ΠΙ
    }
}
```

El programa griego que lo consume no sabe — ni necesita saber — que la lógica está escrita en español:

```
<# ./matematicas/ελληνικά => μαθ

αποτέλεσμα = μαθ::προσθέτω(10, 5)
>> "Άθροισμα: " αποτέλεσμα ¶
```

Cuando el equipo base agrega una función, el traductor agrega **una línea** al adaptador. Los nombres de archivo también pueden estar en cualquier alfabeto (`ελληνικά.zy`, `한국인.zy`). El repositorio del intérprete incluye este ejemplo completo con adaptadores a griego, hebreo, coreano y mandarín en [`tests/i18n/`](https://github.com/zymbol-lang/interpreter/tree/main/tests/i18n), y el documento [`I18N.md`](https://github.com/zymbol-lang/interpreter/blob/main/I18N.md) describe el patrón en detalle.

---

## Los datos también hablan tu idioma: `decode_map`

Los adaptadores traducen **nombres de funciones**. Pero cuando pides datos a un servicio web, las claves del JSON llegan en el idioma del servicio — casi siempre inglés — y `datos.name` se cuela en tu programa en español.

Para eso `std/json` trae `decode_map` (novedad de la v0.0.7): decodifica el JSON **y** renombra las claves a cualquier profundidad, según un diccionario que tú defines — una tupla donde cada campo es la clave original y su valor es el nombre nuevo:

```
<# ./json_es => json    // adaptador: decode_map => decodificar_con

respuesta = "\{\"name\": \"Río Amazonas\", \"length_km\": 6800}"

diccionario = (name: "nombre", length_km: "longitud_km")
rio = json::decodificar_con(respuesta, diccionario)

>> rio.nombre ¶         // → Río Amazonas
>> rio.longitud_km ¶    // → 6800
```

Las claves que no aparecen en el diccionario se conservan tal cual. Define el diccionario una sola vez — dentro de tu adaptador de JSON, por ejemplo — y todos tus programas leerán las respuestas de la API en español.

---

## Y los números: los modos numéricos

Recuerda la lección 04 de este nivel: con los modos numéricos (`#d0d9#` y compañía), hasta los **dígitos** de la salida pueden mostrarse en el sistema de numeración de tu cultura — devanagari, árabe-índico, tailandés… La internacionalización en Zymbol no es una biblioteca aparte: atraviesa el diseño completo del lenguaje.

---

## Resumen

| Idea | Mecanismo |
|---|---|
| Identificadores en cualquier idioma | Soporte Unicode nativo — no hay palabras reservadas |
| Biblioteca estándar en español | Adaptador que re-exporta: `_mat::sqrt => raiz` |
| Compartir código entre idiomas | Patrón de tres capas: base → traducción → consumidor |
| Claves JSON en tu idioma | `json::decode_map(texto, diccionario)` |
| Dígitos en tu sistema numérico | Modos numéricos (lección 04) |
| Proyecto real 100% en español | [Serpiente](https://github.com/zymbol-lang/zy-Serpiente) |

El ejemplo ejecutable de esta lección ([06_multilingue.zy](avanzado/ejemplos/06_multilingue.zy)) incluye los tres adaptadores en español listos para copiar a tus proyectos.

---

Siguiente lección: [07 — Proyecto avanzado](avanzado/07_proyecto.md)

[← Lección anterior](avanzado/05_herramientas.md) · [Índice](avanzado/README.md)
