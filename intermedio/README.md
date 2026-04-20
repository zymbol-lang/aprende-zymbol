# Aprende Zymbol — Nivel Intermedio

El nivel básico te dio las herramientas para escribir programas que funcionan. Este nivel te da las herramientas para escribir programas que se pueden leer, modificar y ampliar sin que cada cambio rompa algo.

La diferencia no está en aprender más sintaxis — está en cambiar cómo piensas el código. Las ocho lecciones de este nivel abordan problemas reales que aparecen en cuanto los programas crecen más allá de unos pocos archivos.

---

**Tuplas** resuelven el problema de los datos heterogéneos. Las listas agrupan valores del mismo tipo. Cuando necesitas representar una entidad — un punto con coordenadas, un usuario con nombre y edad, un resultado con valor y estado — el tipo correcto es una tupla. Aprendes a crear registros con campos nombrados, a acceder a ellos por nombre, y a producir versiones modificadas sin tocar el original, porque las tuplas son inmutables por diseño.

**Desestructuración** elimina el código repetitivo de extraer campos uno por uno. Cuando una función devuelve una tupla con cuatro campos, sin desestructuración necesitas cuatro líneas para extraerlos. Con desestructuración, lo haces en una. Aplica a listas, a tuplas posicionales y a tuplas con campos nombrados, con soporte para colectores de resto y posiciones descartadas.

**Lambdas y Cierres** cambian lo que puedes pasar como argumento a una función. Hasta aquí, los argumentos eran datos: números, textos, listas. Con lambdas, los argumentos pueden ser comportamiento: una operación que alguien más va a ejecutar. Los cierres van un paso más allá — una lambda que recuerda el entorno donde fue creada, permitiendo construir funciones especializadas a partir de funciones genéricas.

**Transformación de listas** reemplaza los bucles explícitos para las operaciones más comunes sobre colecciones. Mapear aplica una transformación a cada elemento. Filtrar conserva solo los que cumplen una condición. Reducir combina todos los elementos en un único resultado. Estas tres operaciones, combinadas, resuelven la mayoría de los problemas de procesamiento de datos sin escribir un solo `@`.

**Tuberías** conectan transformaciones en secuencia sin acumular variables intermedias. Cuando encadenas cuatro operaciones, sin tuberías necesitas cuatro variables que solo existen para pasar el resultado de una a la siguiente. Con `|>`, el valor fluye directamente de izquierda a derecha. El código expresa el proceso, no la logística del proceso.

**Manejo de errores** es la lección que distingue un programa de ejemplo de un programa real. Los programas reales fallan: índices fuera de rango, divisiones por cero, archivos que no existen. El bloque `!?` envuelve el código que puede fallar, `:!` captura el error por tipo, `:>` garantiza que algo se ejecute siempre. La propagación con `$!!` permite que una función rechace un error hacia quien la llamó sin tener que manejarlo ella misma.

**Inspección de tipos** permite que el programa examine sus propios datos en tiempo de ejecución. `#?` devuelve el tipo, el tamaño y el valor de cualquier expresión como una tupla. `#|..|` convierte texto a número de forma segura, devolviendo el original si la conversión falla en lugar de lanzar un error. Juntos, permiten escribir funciones que validan entradas antes de procesarlas.

**Módulos** cierran el nivel con la respuesta a la pregunta que aparece en todo proyecto que crece: cómo dividir el código en archivos independientes, cada uno con responsabilidades claras. Un módulo declara su nombre, decide qué exporta, y oculta todo lo demás. El estado privado persiste entre llamadas sin ser accesible desde fuera. Las funciones exportadas son la única interfaz pública.

---

Empieza por la [Lección 01 — Tuplas](intermedio/01_tuplas.md) y sigue en orden. Los [ejemplos](intermedio/ejemplos/) son archivos `.zy` listos para ejecutar, uno por lección.

---

[← Nivel Básico](basico/README.md) · [Índice general](README.md) · [Siguiente nivel: Avanzado →](avanzado/README.md)
