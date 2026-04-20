# Aprende Zymbol — Nivel Avanzado

Llegaste aquí sabiendo escribir programas. Sabes declarar variables, controlar el flujo, definir funciones, transformar colecciones, manejar errores y organizar código en módulos. El lenguaje ya no es el obstáculo.

El nivel avanzado no enseña más sintaxis — enseña a usarla con precisión. La diferencia entre un programa que funciona y uno que es correcto, predecible y mantenible está en los detalles que este nivel cubre.

---

**Alcance y tiempo de vida** empieza donde terminó la lección de variables. En los niveles anteriores aprendiste a crear variables y a usarlas. Aquí aprendes a controlar exactamente cuándo existen y cuándo dejan de existir. Las variables con prefijo `_` tienen un alcance estrictamente local al bloque donde se declaran — no son visibles ni desde adentro ni desde afuera. El operador `\ var` destruye una variable antes de que termine su bloque. Estas herramientas no son decorativas: son la diferencia entre código que libera recursos cuando debe y código que los retiene más tiempo del necesario.

**Indexación multidimensional** resuelve el problema de los datos anidados. Hasta ahora accedías a listas con un índice. Cuando los datos tienen estructura — matrices, tablas, respuestas de API, configuraciones jerárquicas — necesitas navegar múltiples niveles en una sola expresión. El operador `>` dentro de los corchetes desciende un nivel por cada separador. Las extracciones estructuradas y los rangos sobre ejes específicos permiten obtener subconjuntos de datos con una sintaxis consistente y sin bucles auxiliares.

**Integración con el sistema** conecta Zymbol con el entorno donde corre. El operador `<\ cmd \>` ejecuta cualquier comando de shell y captura su salida como una cadena de texto. `</ script.zy />` ejecuta otro archivo Zymbol y captura lo que imprime. Esto convierte a Zymbol en una herramienta real de automatización: puede leer archivos, consultar el sistema, encadenar procesos, y actuar sobre el resultado de comandos externos.

**Modos numéricos** es la lección más inusual del curso. Zymbol soporta 69 sistemas de dígitos Unicode — Devanagari, árabe-índico, tailandés, bengalí, Klingon pIqaD y decenas más. Con un token de activación, todos los números en la salida se muestran en el sistema elegido, y los literales en el código fuente se pueden escribir directamente en ese sistema. No es un detalle cosmético: es parte del diseño del lenguaje, que trata la internacionalización como un ciudadano de primera clase.

**Herramientas del lenguaje** cubre el resto del ecosistema que rodea al intérprete. El REPL permite explorar expresiones de forma interactiva sin crear archivos. `zymbol check` valida un programa sin ejecutarlo — útil en CI y en editores. `zymbol fmt` formatea el código automáticamente con indentación configurable. `zymbol build` compila un archivo `.zy` en un ejecutable standalone que corre sin tener Zymbol instalado. Conocer estas herramientas cambia cómo trabajas con el lenguaje en el día a día.

**Proyecto avanzado** cierra el nivel con un programa que usa todo lo anterior: estructura de archivos real, módulos con estado privado, manejo de errores tipificado, integración con el sistema, y al menos una característica del lenguaje que en los niveles anteriores habrías evitado por complejidad.

---

Al terminar este nivel habrás cubierto la totalidad del lenguaje documentado en el manual. Lo que venga después no es aprender Zymbol — es usarlo.

Se recomienda completar el [nivel intermedio](intermedio/README.md) antes de continuar.

---

Empieza por la [Lección 01 — Alcance y tiempo de vida](avanzado/01_alcance.md) y sigue en orden. Los [ejemplos](avanzado/ejemplos/) son archivos `.zy` listos para ejecutar, uno por lección.

---

## Lecciones

| # | Lección | Qué aprenderás |
|---|---------|----------------|
| [01](avanzado/01_alcance.md) | Alcance y tiempo de vida | `_name`, `\ var`, reglas de visibilidad entre bloques |
| [02](avanzado/02_indexacion.md) | Indexación multidimensional | `arr[i>j]`, rangos sobre ejes, extracciones estructuradas |
| [03](avanzado/03_sistema.md) | Integración con el sistema | `<\ cmd \>`, `</ script.zy />`, automatización |
| [04](avanzado/04_numerales.md) | Modos numéricos | `#d0d9#`, 69 sistemas de dígitos, i18n en código fuente |
| [05](avanzado/05_herramientas.md) | Herramientas del lenguaje | REPL, `check`, `fmt`, `build`, flujo de trabajo profesional |
| [06](avanzado/06_proyecto.md) | Proyecto avanzado | Programa completo de principio a fin |

---

[← Nivel Intermedio](intermedio/README.md) · [Índice general](README.md)
