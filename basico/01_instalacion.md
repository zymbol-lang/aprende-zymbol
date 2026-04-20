# Lección 01 — Instalación

Antes de escribir código necesitas tener Zymbol instalado en tu computadora. Esta lección te lleva paso a paso dependiendo de tu sistema operativo.

> Si no quieres instalar nada todavía, puedes usar el **playground en línea** y escribir código directamente desde el navegador:
> [zymbol-lang.org/playground.html](https://zymbol-lang.org/playground.html)

---

## Descargar Zymbol

Todos los instaladores y binarios están en la página oficial:

**[zymbol-lang.org/install.html](https://zymbol-lang.org/install.html)**

Ahí encontrarás todo lo necesario para Windows, macOS y Linux. Las instrucciones que siguen te explican qué hacer una vez que descargues tu archivo.

---

## Windows

1. Ve a [zymbol-lang.org/install.html#windows](https://zymbol-lang.org/install.html#windows)
2. Descarga el archivo `.msi` (el instalador)
3. Haz doble clic en el archivo descargado y sigue los pasos
4. El instalador agrega `zymbol` al PATH automáticamente — no tienes que hacer nada más

**Verifica que funciona:** abre una terminal nueva (PowerShell o CMD) y escribe:

```
zymbol --version
```

Deberías ver algo como `zymbol 0.0.3`. Si eso aparece, estás lista.

---

## macOS

1. Ve a [zymbol-lang.org/install.html#macos](https://zymbol-lang.org/install.html#macos)
2. Descarga el binario que corresponde a tu Mac:
   - **Apple Silicon** (M1, M2, M3…) → `aarch64`
   - **Intel** → `x86_64`
3. Abre la Terminal y ejecuta estos comandos (cambia el nombre del archivo si descargaste la versión Intel):

```bash
chmod +x zymbol_lang_v0.0.3_aarch64_macos
sudo install -m755 zymbol_lang_v0.0.3_aarch64_macos /usr/local/bin/zymbol
```

4. Si macOS dice "desarrollador no identificado", haz clic derecho en el archivo → Abrir → Abrir

**Verifica que funciona:**

```bash
zymbol --version
```

---

## Linux

1. Ve a [zymbol-lang.org/install.html#linux](https://zymbol-lang.org/install.html#linux)
2. Descarga el paquete que corresponde a tu distribución:

| Distribución | Formato |
|---|---|
| Ubuntu, Debian, Linux Mint | `.deb` |
| Fedora, RHEL, openSUSE | `.rpm` |
| Arch Linux, Manjaro | `.pkg.tar.zst` |

3. Instala el paquete:

```bash
# Ubuntu / Debian
sudo dpkg -i zymbol_lang_v0.0.3_x86_64.deb

# Fedora / RHEL
sudo rpm -i zymbol_lang_v0.0.3_x86_64.rpm

# Arch Linux
sudo pacman -U zymbol_lang_v0.0.3_x86_64.pkg.tar.zst
```

**Verifica que funciona:**

```bash
zymbol --version
```

---

## Editor recomendado: VS Code

Puedes escribir código Zymbol en cualquier editor de texto, pero **VS Code** tiene una extensión oficial que colorea el código y te avisa de errores mientras escribes.

1. Si no tienes VS Code, descárgalo de [code.visualstudio.com](https://code.visualstudio.com)
2. Ve a [zymbol-lang.org/install.html#vscode](https://zymbol-lang.org/install.html#vscode) y descarga el archivo `.vsix`
3. En VS Code: abre el panel de Extensiones (`Ctrl+Shift+X`) → menú `···` → **Instalar desde VSIX…** → selecciona el archivo descargado

---

## Tu primer archivo

Crea una carpeta llamada `mis_programas` donde quieras. Dentro de ella crea un archivo llamado `hola.zy` con este contenido:

```
>> "¡Hola, mundo!" ¶
```

Luego, desde la terminal, ejecuta:

```bash
zymbol run hola.zy
```

Si ves `¡Hola, mundo!` en pantalla, todo está funcionando.

---

Siguiente lección: [02 — Tu primer programa](basico/02_primer_programa.md)

[← Volver al índice](basico/README.md)
