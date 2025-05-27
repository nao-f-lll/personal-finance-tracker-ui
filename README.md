<p align="center">
<img src="/assets/logo.png" alt="PersonalFinanceTracker Logo" width="250" height="250" /><br>
</p>

<h1 align="center">PersonalFinanceTracker</h1><br>

<p align="center">
<a href="#características">Características</a>&nbsp;&bull;&nbsp;<a href="#instalación">Instalación</a><br>
<a href="#uso">Uso</a>&nbsp;&bull;&nbsp;<a href="#stack-tecnológico">Stack tecnológico</a>
</p>

<br>

<p align="center">
<b>PersonalFinanceTracker</b> es un sistema de seguimiento de gastos extremadamente simple, auto alojado, con una visualización moderna de gráfico circular mensual y muestra de flujo de caja.
</p>

<br>

# Características

### Funcionalidad principal

- Seguimiento de gastos solo con detalles esenciales (nombre opcional, fecha, monto y categoría)
- Sistema de almacenamiento de archivos planos (`data/expenses.json`)
- API REST para la gestión de gastos
- Enfocado a un solo usuario (principalmente para una implementación en laboratorio doméstico)
- Exportación e importación de todos los datos de gastos en CSV y JSON desde la interfaz de usuario
- Categorías personalizadas, símbolo de moneda y fecha de inicio a través de la configuración de la aplicación
- Hermosa interfaz que se adapta automáticamente al sistema para tema claro/oscuro
- Identificación de gastos basada en UUID en el backend
- Binario autónomo e imagen de contenedor para garantizar que no haya interacción con internet
- Contenedor Docker multi-arquitectura con soporte para almacenamiento persistente

### Visualización

1. Panel principal - desglose por categorías (gráfico circular)
    - Haz clic en una categoría para excluirla del gráfico y del total; haz clic nuevamente para agregarla de nuevo
    - Esto ayuda a visualizar el desglose sin considerar algunas categorías como Alquiler
    - La leyenda muestra las categorías que componen el gasto total del mes
2. Panel principal - indicador de flujo de caja
    - La configuración predeterminada tiene una categoría `Ingresos`, cuyos elementos no se consideran gastos
    - Si un mes tiene un elemento en `Ingresos`, PersonalFinanceTracker muestra automáticamente el flujo de caja debajo del gráfico
    - El flujo de caja muestra los ingresos totales, los gastos totales y el balance (rojo o verde según sea positivo o negativo)
3. Vista de tabla para listado detallado de gastos
    - Aquí es donde puedes ver los gastos individuales cronológicamente y eliminarlos
    - Puedes usar la búsqueda del navegador para encontrar un nombre si es necesario
4. Navegación mes a mes tanto en vistas de panel como de tabla
5. Página de configuración para configurar la aplicación
    - Reordenar, agregar o eliminar categorías personalizadas
    - Seleccionar una moneda personalizada para mostrar
    - Seleccionar una fecha de inicio personalizada para mostrar gastos de un período diferente
    - Exportar datos como CSV o JSON e importar datos desde JSON o CSV

### Aplicación Web Progresiva (PWA)

El frontend de PersonalFinanceTracker puede instalarse como una Aplicación Web Progresiva en dispositivos de escritorio y móviles (es decir, el backend aún debe estar autoalojado). Para instalar:

- Escritorio: Haz clic en el icono de instalación en la barra de direcciones de tu navegador
- iOS: Usa la opción "Añadir a pantalla de inicio" de Safari en el menú compartir
- Android: Usa la opción "Instalar" de Chrome en el menú

# Instalación

### Instalación con Docker (Recomendada)

Crea un volumen o un directorio para el proyecto:

```bash
mkdir $HOME/personalFinanceTracker
```

```bash
docker run --rm -d \
--name personalFinanceTracker \
-p 8080:8080 \
-v $HOME/personalFinanceTracker:/app/data \
nao-f-lll/personalFinanceTracker:main
```

Para usarlo con Docker compose o un sistema de gestión de contenedores como Portainer o Dockge, usa esta definición YAML:

```yaml
services:
  budgetlord:
    image: nao-f-lll/personalFinanceTracker:main
    restart: unless-stopped
    ports:
      - 5006:8080
    volumes:
      - /home/nao-f-lll/personalFinanceTracker:/app/data # CHANGE DIR
```

### Using the Binary

Download the appropriate binary from the project releases. Running the binary automatically sets up a `data` directory in your CWD. You can visit the frontend at `http://localhost:8080`.

### Compilando desde el código fuente

Para instalar directamente el binario desde el código fuente en tu GOBIN, usa:

```bash
go install github.com/nao-f-lll/personal-finance-tracker-ui/cmd/personalFinanceTracker@latest
```

De lo contrario, para compilarlo tú mismo:

```bash
git clone https://github.com/nao-f-lll/personal-finance-tracker-ui.git && \
cd personalFinanceTracker && \
go build ./cmd/personalFinanceTracker
```

# Uso

Una vez desplegado, usa la interfaz web para hacer todo. Accede a través de tu navegador:

- Dashboard: `http://localhost:8080/`
- Income View: `http://localhost:8080/income`

> [!NOTE]
> Esta aplicación no tiene autenticación, así que despliégala con cuidado. Funciona muy bien con un proxy inverso como Nginx Proxy Manager y está principalmente destinada para uso en laboratorio doméstico. La aplicación no ha pasado por una prueba de penetración para permitir cualquier despliegue en producción. Debe implementarse estrictamente en un entorno de laboratorio doméstico, detrás de autenticación, y para solo uno (o unos pocos no destructivos) usuario(s).

Si se requieren automatizaciones de línea de comandos para usar con la API REST, ¡sigue leyendo!

### Ejecutable

El binario de la aplicación puede ejecutarse directamente dentro de CLI para cualquier sistema operativo y arquitectura común:

```bash
./personalFinanceTracker
# or from a custom directory
./personalFinanceTracker -data /custom/path
```

### REST API

PersonalFinanceTracker proporciona una API para permitir agregar gastos a través de automatizaciones o simplemente a través de cURL, atajos de Siri u otras automatizaciones.

Agregar Gasto:

```bash
curl -X PUT http://localhost:8080/expense \
-H "Content-Type: application/json" \
-d '{
 "name": "Groceries",
 "category": "Food",
 "amount": 75.50,
 "date": "2024-03-15T14:30:00Z"
}'
```

Obtener Todos los Gastos:

```bash
curl http://localhost:8080/expenses
```

### Opciones de Configuración

La configuración principal se almacena en el directorio de datos en el archivo `config.json`. Una configuración predefinida se inicializa automáticamente. La moneda en uso y las categorías se pueden personalizar desde el punto final `/settings` dentro de la interfaz de usuario.

PersonalFinanceTracker admite múltiples monedas a través de la variable de entorno CURRENCY. Si no se especifica, por defecto es USD ($). Todas las opciones disponibles se muestran en la página de configuración de la interfaz de usuario.

Si está configurando por primera vez, se puede usar una variable de entorno para facilitar las cosas. Por ejemplo, para usar Euro:

```bash
CURRENCY=eur ./personalFinanceTracker
```

PersonalFinanceTracker también admite categorías personalizadas. Un conjunto predeterminado se precarga en la configuración para facilitar el uso y se puede cambiar fácilmente dentro de la interfaz de usuario.

Al igual que la moneda, si está configurando por primera vez, las categorías se pueden especificar en una variable de entorno así:

```bash
EXPENSE_CATEGORIES="Rent,Food,Transport,Fun,Bills" ./personalFinanceTracker
```

> [!TIP]
> Las variables de entorno se pueden configurar en un stack de compose o usando `-e` en la línea de comandos con un comando Docker. Sin embargo, recuerda que solo son efectivas para configurar la configuración de la primera vez. De lo contrario, usa la interfaz de usuario de configuración.

De manera similar, la fecha de inicio también se puede establecer a través de la interfaz de usuario de configuración o la variable de entorno `START_DATE`.

### Data Import/Export

PersonalFinanceTracker contiene un método sofisticado para importar y exportar gastos. La página de configuración proporciona las opciones para exportar todos los datos de gastos como JSON o CSV. La misma página también permite importar datos en formatos JSON y CSV.

**Importando CSV**

PersonalFinanceTracker está destinado a simplificar las cosas, y la importación de CSV cumple con la misma filosofía. PersonalFinanceTracker aceptará cualquier archivo CSV siempre que contenga las columnas - `name`, `category`, `amount` y `date`. Esto no distingue entre mayúsculas y minúsculas, por lo que no importa si es `name` o `Name`.

> [!TIP]
> Esta característica permite a PersonalFinanceTracker usar datos exportados de cualquier herramienta siempre que estén presentes las categorías requeridas, lo que facilita enormemente el cambio desde cualquier proveedor.

**Importando JSON**

Principalmente, PersonalFinanceTracker mantiene un backend JSON para almacenar tanto los datos de gastos como los de configuración. Si hiciste una copia de seguridad de un volumen de Docker que contiene los archivos `config.json` y `expenses.json`, la forma recomendada de restaurar es montando el mismo volumen (o directorio) en tu nuevo contenedor. Todos los datos serán inmediatamente utilizables.

Sin embargo, en caso de que necesites importar datos con formato JSON desde otro lugar (esto generalmente es raro), puedes usar la función de importación JSON.

> [!WARNING]
> Si el campo de tiempo no es una cadena de fecha adecuada (es decir, que incluya la hora y la zona), PersonalFinanceTracker hará una suposición para establecer la hora a la medianoche equivalente UTC. Esto se debe a que las zonas horarias son un... tema

> [!NOTE]
> PersonalFinanceTracker examina cada fila en los datos importados y fallará inteligentemente en filas que tengan datos inválidos o ausentes. Hay un retraso de 10 milisegundos por registro para reducir la sobrecarga del disco, así que permite el tiempo apropiado para la ingestión (por ejemplo, 10 segundos para 1000 registros).

# Stack Tecnológico

- Backend: Go
- Storage: JSON file system
- Frontend: Chart.js and vanilla web stack (HTML, JS, CSS)
- Interface: CLI + Web UI
