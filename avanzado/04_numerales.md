# Lección 04 — Modos numéricos

> **Revisado para v0.0.8 — 2026-08-05**

El sistema decimal que usamos en Occidente no es el único sistema de dígitos del mundo. El árabe-índico, el devanagari, el tailandés, el bengalí — decenas de culturas tienen sus propios sistemas de dígitos, todos igualmente válidos matemáticamente.

Zymbol trata la internacionalización como parte del lenguaje, no como una capa encima. Con un token de activación puedes cambiar el sistema de dígitos que usa la salida del programa, y escribir literales numéricos directamente en el script que prefieras.

---

## El token de modo `#d0d9#`

Para activar un sistema de dígitos, escribes sus dígitos `0` y `9` entre `#…#`:

```
#०९#    // activa Devanagari
#٠٩#    // activa Árabe-índico
#๐๙#    // activa Tailandés
#09#    // vuelve a ASCII (siempre seguro)
```

El token no imprime nada ni crea variables — es una directiva al intérprete. Una vez activo, el modo persiste hasta el próximo token de cambio en el mismo archivo.

---

## Efecto en la salida

Con un modo activo, `>>` formatea los números en ese sistema:

```
n = 42

>> n ¶          // → 42    (ASCII, modo por defecto)

#०९#
>> n ¶          // → ४२    (Devanagari)
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

#09#
>> n ¶          // → 42    (de vuelta a ASCII)
```

La aritmética interna siempre usa representación binaria estándar — solo la presentación cambia.

---

## Booleanos bajo un modo activo

Los booleanos mantienen el prefijo `#` en ASCII pero adaptan el dígito al modo activo:

```
#๐๙#
>> #1 ¶    // → #๑   (verdadero en Tailandés)
>> #0 ¶    // → #๐   (falso en Tailandés)

x = 28 > 4
>> x ¶     // → #๑   (resultado de comparación también se adapta)
```

Esto garantiza que `#0` (falso) nunca se confunda visualmente con `0` (cero entero) en ningún sistema.

---

## Literales numéricos en código fuente

No necesitas estar en modo ASCII para escribir el código. Los dígitos de cualquier sistema soportado son literales válidos directamente en el fuente:

```
#०९#

n = ४२         // equivale a n = 42
>> n ¶          // → ४२

@ i:१..५ {
    >> i " "
}
>> ¶
// → १ २ ३ ४ ५
```

El lexer normaliza todos los sistemas al mismo valor interno. `४२` y `42` son el mismo número.

---

## Condiciones y match bajo un modo activo

Los booleanos en modo activo se pueden usar en condiciones y selectores de la misma forma:

```
#०९#

? #१ {
    >> "condición verdadera" ¶
}

x = ५ > ३    // resultado: #१ (verdadero en Devanagari)

?? x {
    #१ => { >> "mayor" ¶ }
    #० => { >> "no mayor" ¶ }
}
```

---

## Variables en cualquier script

Zymbol admite identificadores Unicode, lo que significa que puedes escribir nombres de variables en el script que prefieras:

```
#٠٩#

عدد = ٤٢
>> عدد ¶    // → ٤٢
```

```
#०९#

संख्या = ४२
>> संख्या ¶    // → ४२
```

---

## Sistemas soportados

Zymbol soporta 69 bloques de dígitos Unicode. Algunos de los más usados:

| Sistema | Token | Dígitos |
|---|---|---|
| ASCII (por defecto) | `#09#` | `0123456789` |
| Árabe-índico | `#٠٩#` | `٠١٢٣٤٥٦٧٨٩` |
| Árabe-índico extendido | `#۰۹#` | `۰۱۲۳۴۵۶۷۸۹` |
| Devanagari | `#०९#` | `०१२३४५६७८९` |
| Bengali | `#০৯#` | `০১২৩৪৫৬৭৮৯` |
| Tailandés | `#๐๙#` | `๐๑๒๓๔๕๖๗๘๙` |
| Tibetano | `#༠༩#` | `༠༡༢༣༤༥༦༧༨༩` |
| Myanmar | `#၀၉#` | `၀၁၂၃၄၅၆၇၈၉` |
| Matemático Bold | `#𝟎𝟗#` | `𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗` |
| LCD / Segmentado | `#🯰🯹#` | `🯰🯱🯲🯳🯴🯵🯶🯷🯸🯹` |
| Klingon pIqaD | _(PUA CSUR)_ | _(requiere fuente pIqaD)_ |

La lista completa (69 bloques) está en `interpreter/crates/zymbol-lexer/src/digit_blocks.rs`.

---

## Reglas del sistema

| Regla | Detalle |
|---|---|
| Modo por defecto | ASCII (`0`–`9`) |
| Alcance del modo | Local al archivo — cada archivo empieza en ASCII |
| Qué afecta | Todo número que el programa produzca como texto: `>>`, interpolación, y de ahí a donde vaya |
| Qué no afecta | El contenido literal de las cadenas que tú escribes |
| Punto decimal | Siempre ASCII `.` sin importar el modo activo |
| Prefijo booleano | `#` siempre ASCII, el dígito se adapta al modo activo |
| Resetear | `#09#` |

---

## Libertad y responsabilidad

Aquí está la parte que hay que entender antes de usar esto en un programa de verdad, y que sorprende a casi todo el mundo la primera vez.

**El modo numeral no es una opción de presentación: aplica a todo texto que el programa genere.** Si declaras `#०९#`, tus números se escriben en devanagari **en todas partes**:

```
#०९#
n = 42

archivo = "dato{n}.txt"        // → "dato४२.txt"
<\ "echo {n}" \>               // → ejecuta: echo ४२
? "{n}" == "42" { ... }        // → falso: "४२" no es "42"
```

Esto **no es un fallo**. Es la doctrina del lenguaje, y tiene nombre: **libertad de intención**. El programa declaró que sus números se escriben así, y Zymbol le hace caso sin preguntar dónde. Un lenguaje que decidiera por su cuenta que «aquí sí y aquí no» estaría adivinando qué querías.

La contrapartida es la **responsabilidad del desarrollador**: validar las consecuencias es cosa de quien escribe el programa, no del intérprete.

> **La única excepción son los formatos con gramática propia.** `json::encode` sigue emitiendo dígitos ASCII, porque un JSON con dígitos devanagari no es un JSON — ahí el contrato con el exterior manda sobre la intención del programa.

### Cómo se usa esto sin hacerse daño

La regla práctica cabe en una línea:

> Activa el modo numeral **para presentar**, no antes de construir una ruta de archivo, una clave de datos o un comando.

En un programa bien organizado eso sale solo, porque la presentación ya está separada del resto. En el juego [囲碁](https://github.com/zymbol-lang/zy-GO), por ejemplo, los registros de partidas se guardan siempre en ASCII: *«un conjunto de datos partido en dos idiomas son dos conjuntos de datos»*. Los rótulos que ve el jugador son otra cosa, y esos sí van en su escritura.

> 🎮 Pruébalo ahora, sin instalar nada: [ábrelo en el playground →](https://zymbol-lang.org/playground.html?open=games/classic/go.zyp)

Y donde Unicode no llega, se hace a mano. El juego [Hov veS](https://github.com/zymbol-lang/zyKlingonGalaxy) está en klingon, cuyas cifras viven en un bloque de uso privado, así que su capa de idioma tiene una función propia para eso:

> 🎮 Pruébalo ahora, sin instalar nada: [ábrelo en el playground →](https://zymbol-lang.org/playground.html?open=games/arcade/klingon_galaxy.zyp)

```
mI'(n)       // un número en la escritura del idioma activo
```

Su README lo justifica en una línea que resume la lección entera: *«No es cosmética: el klingon escribe sus cifras en pIqaD y el inglés y el español en ASCII.»*

---

## `#|..|` con dígitos Unicode

El operador de conversión `#|..|` (visto en la lección de tipos) reconoce los mismos sistemas que el lexer:

```
>> #|"๔๒"| ¶    // → 42   (dígitos tailandeses → entero ASCII interno)
>> #|"४२"| ¶    // → 42   (dígitos devanagari → mismo resultado)
```

Todos los sistemas Unicode soportados son intercambiables internamente.

---

## Resumen

| Concepto | Sintaxis |
|---|---|
| Activar modo | `#d0d9#` (dígito cero y nueve del sistema) |
| Volver a ASCII | `#09#` |
| Literal en modo activo | Escribir directamente los dígitos del sistema |
| Booleano en modo activo | `#` + dígito del sistema (`#१`, `#٠`, etc.) |

---

Siguiente lección: [05 — Herramientas del lenguaje](avanzado/05_herramientas.md)

[← Lección anterior](avanzado/03_sistema.md) · [Índice](avanzado/README.md)
