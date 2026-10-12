# Lección 04 — Dibujar solo lo que cambió

> **Revisado para v0.0.8 — 2026-08-05**

La forma obvia de dibujar un juego es: borrar la pantalla, dibujarlo todo, dormir, repetir.

Funciona, y es lo que deberías hacer la primera vez. Pero en una terminal, «dibujarlo todo» significa mandar miles de caracteres por un canal que no es rápido, y el resultado se ve mal: la pantalla **parpadea**, porque durante un instante está vacía.

Esta lección es sobre la alternativa: no borrar nada y tocar solo las celdas que dejaron de ser lo que eran. Se llama *delta rendering* y es lo que hacen los tres juegos.

---

## El problema, con números

Una serpiente de 12 segmentos en una terminal de 80 × 24:

| Estrategia | Celdas escritas por tick |
|---|---|
| Borrar y repintar | 1 920 (la pantalla entera) |
| Solo lo que cambió | **4** |

Cuatro. Y esas cuatro no cambian aunque la serpiente mida cien segmentos:

```
1. la celda de la cabeza nueva          → dibujar ▶
2. la celda de la cabeza anterior       → pasa a ser cuerpo ─
3. la celda de la cola vieja            → borrar (espacio)
4. la celda de la cola nueva            → dibujar el extremo │
```

La serpiente se mueve entera, pero **su dibujo solo cambia en los dos extremos**. Todo lo de en medio ya estaba bien dibujado en el tick anterior y sigue estándolo.

---

## Lo que hay que guardar antes de actualizar

Aquí está el truco, y es la razón de esas dos líneas raras del tick que viste en la lección 02:

```
// serpiente/juego.zy — ANTES de mover
cola_vieja   = serpiente[serpiente$#]
comida_vieja = comida

(vivo, serpiente, puntos, comio) = l::mover(...)
```

Para **borrar** algo hay que saber dónde estaba. Y en cuanto llamas a `mover`, la posición vieja se ha perdido. Así que se guarda antes.

Es la regla general del delta rendering:

> Todo lo que vayas a borrar, guárdalo antes de actualizar el estado.

El dibujo recibe entonces las dos versiones — la vieja y la nueva — y hace la resta:

```
d::dibujar(serpiente, cola_vieja, crecer, comio,
           comida_vieja, comida, fruta, puntos, AN, AL, pos_arroba)
```

Once parámetros. No es una firma bonita, y no es un accidente: cada uno es una cosa que hay que saber para calcular qué celdas cambiaron.

---

## Un tick normal, en código real

```
// serpiente/dibujo.zy
? !comio && !crecer {
    // la vieja cabeza se convierte en cuerpo
    ? serpiente$# >= 3 {
        (py2, px2) = serpiente[2]
        >>~ (py2, px2, 0, VERDE) > _char_cuerpo(serpiente[1], serpiente[2], serpiente[3])
    }
    // se borra la cola vieja
    (ty, tx) = cola_vieja
    >>~ (ty, tx, 0, 0) > " "
    // y se redibuja el nuevo extremo de la cola
    lon = serpiente$#
    (nty, ntx) = serpiente[lon]
    >>~ (nty, ntx, 0, VERDE) > _char_cola(serpiente[lon-1], serpiente[lon])
}

// la cabeza nueva, siempre
>>~ (fy_cab, fx_cab, 0, CABEZA) > _char_cabeza(serpiente[1], serpiente[2])
```

Cuatro `>>~`. Ni un `>>!` a la vista.

### Borrar es escribir un espacio

No hay operador de «borrar celda». Se escribe un espacio con el color de fondo por defecto:

```
>>~ (ty, tx, 0, 0) > " "
```

Y cuando lo que había ocupaba dos columnas — como un emoji — hay que borrar **dos**:

```
(fvy, fvx) = comida_vieja
>>~ (fvy, fvx, 0, 0) > "  "     // ← dos espacios: la fruta ocupa dos columnas
```

Este detalle costó un bug real en Serpiente, y está registrado como BUG-004 en sus hallazgos: *«el emoji de la fruta ocupaba dos columnas de terminal pero se almacenaba en una sola coordenada, así que la serpiente podía entrar por la columna derecha sin registrar la colisión, y borrar el emoji exigía limpiar dos columnas»*.

La lección 06 vuelve sobre las dos columnas, que es un tema más grande de lo que parece.

---

## La forma del cuerpo depende de los vecinos

Un detalle que hace que Serpiente se vea como una tubería y no como una fila de bloques: cada segmento del cuerpo se dibuja mirando **quién tiene delante y quién detrás**.

```
// serpiente/dibujo.zy
_char_cuerpo(ant, pos, sig) {
    da = _dir_hacia(pos, ant)
    ds = _dir_hacia(pos, sig)
    ? (da == 'R' && ds == 'L') || (da == 'L' && ds == 'R') { <~ "─" }
    ? (da == 'U' && ds == 'D') || (da == 'D' && ds == 'U') { <~ "│" }
    ? (da == 'R' && ds == 'D') || (da == 'D' && ds == 'R') { <~ "╭" }
    ? (da == 'L' && ds == 'D') || (da == 'D' && ds == 'L') { <~ "╮" }
    ? (da == 'R' && ds == 'U') || (da == 'U' && ds == 'R') { <~ "╰" }
    <~ "╯"
}
```

Seis casos, seis glifos: dos rectas y cuatro codos. La cabeza hace lo mismo con la dirección de avance (`▶ ▲ ◀ ▼`) y la cola con el segmento anterior.

Y aquí está lo bonito de combinarlo con el delta rendering: **solo el segmento 2 puede cambiar de forma**, porque es el único cuyos vecinos cambiaron. Por eso el código de arriba solo redibuja `serpiente[2]` y no recorre el cuerpo entero.

---

## Cuando el delta se complica: los casos especiales

Un tick normal son cuatro celdas. Pero hay ticks que no son normales, y cada uno tiene su propia lista:

| Evento | Celdas que hay que tocar |
|---|---|
| Movimiento normal | cabeza nueva · vieja cabeza → cuerpo · borrar cola vieja · nueva cola |
| Comida ingerida | borrar emoji (2 col) · `@` en la posición de la comida · vieja cabeza → cuerpo · dibujar la comida nueva |
| Tick posterior a comer | la celda `@` no se toca — sigue siendo un segmento del cuerpo |
| La cola alcanza el `@` | el borrado normal de cola lo limpia solo |

Esa tercera fila es lo que hace que un delta sea difícil de razonar: hay estados que duran **varios ticks**, y el dibujo tiene que saber en cuál está. Por eso `dibujar` recibe `comio`, `crecer` y `pos_arroba` — tres banderas que describen no lo que pasó, sino en qué fase de una secuencia de tres ticks estamos.

Hov veS tiene la misma tabla, con una entrada que vale la pena mirar:

| Condición | Celdas actualizadas |
|---|---|
| `hubo_drift == #1` | Borra las posiciones previas y **redibuja la formación entera** |
| `hubo_drift == #0` | Borra únicamente los enemigos destruidos |

Cuando la formación de cincuenta enemigos se desplaza lateralmente, el delta *es* la pantalla entera, y entonces se repinta y ya está. Delta rendering no significa «nunca repintar»: significa **repintar solo cuando repintar es la respuesta correcta**.

---

## Cuándo sí repintar entero

Hay cuatro momentos donde borrar y dibujar de cero es lo correcto, y los tres juegos lo hacen:

1. **Al empezar la partida** — `dibujar_inicio` pinta el marco, la serpiente entera y la comida.
2. **Al volver de una pausa** — el panel de pausa tapó parte del tablero.
3. **Al entrar a un menú** — es otra pantalla, no hay delta que calcular.
4. **Tras un redimensionado** — las coordenadas viejas ya no significan nada.

```
// serpiente/juego.zy
? tecla == 'p' || tecla == 'P' {
    d::pausa(AN, AL)
    d::dibujar_inicio(serpiente, comida, fruta, puntos, AN, AL)   // ← repintado completo
}
```

---

## El orden importa

Dentro de un tick, borrar y dibujar no conmutan. Si la cabeza nueva cae donde estaba la cola vieja —cosa que pasa constantemente— y borras la cola **después** de dibujar la cabeza, borras la cabeza.

La regla es sencilla:

> Primero todos los borrados, después todos los dibujos.

Si miras el código de `dibujar`, la cabeza (`>>~ ... _char_cabeza`) es siempre la **última** línea de la función. No es casualidad.

---

## El ejemplo de esta lección

[`juegos/ejemplos/04_dibujo.zy`](juegos/ejemplos/04_dibujo.zy) enseña la diferencia en vivo: un gusano que recorre la pantalla, con la tecla `m` para cambiar entre repintado completo y delta. Con `m` verás el parpadeo aparecer y desaparecer, y un contador te dice cuántas celdas escribió cada modo en el último tick.

```bash
zymbol run juegos/ejemplos/04_dibujo.zy
```

---

## Resumen

| Idea | Cómo |
|---|---|
| Guardar lo viejo antes de actualizar | `cola_vieja = serpiente[serpiente$#]` |
| Borrar una celda | `>>~ (f, c, 0, 0) > " "` |
| Borrar un glifo ancho | dos espacios, no uno |
| Orden dentro del tick | primero borrar, después dibujar |
| Repintado completo | inicio, vuelta de pausa, menú, redimensionado |
| Delta que es toda la pantalla | también es un delta correcto |

---

Siguiente lección: [05 — Azar reproducible](juegos/05_azar.md)

[← Lección anterior](juegos/03_estado.md) · [Índice del nivel](juegos/README.md)
