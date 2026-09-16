# Dashboard Frontend - Prueba Técnica Angular

Aplicación Angular que implementa un dashboard de datos con tablas paginadas y filtrables para visualizar información de películas (TMDB) y clima (OpenWeatherMap).

**Desarrollado por: Jhonatan Rodriguez**

## 🚀 Características

- **Dashboard de Datos**: Visualización de datos en tiempo real desde APIs públicas
- **Toggle entre Datasets**: Cambio interactivo entre datos de películas y clima
- **Tablas Paginadas**: Paginación del lado del servidor para películas y local para clima
- **Búsqueda en Tiempo Real**: Filtrado por nombre de película o ciudad con debounce
- **Diseño Responsive**: Interfaz adaptable a diferentes tamaños de pantalla
- **Angular Material**: Componentes UI modernos y consistentes
- **Manejo de Errores**: Feedback visual con snackbars y estados de carga
- **Arquitectura Modular**: Estructura clara de carpetas y separación de responsabilidades

## 🛠️ Tecnologías

- **Angular 17.3.0**: Framework principal con standalone components
- **Angular Material 17.3.10**: Biblioteca de componentes UI
- **Tailwind CSS**: Framework de utilidades CSS para diseño moderno y responsive
- **RxJS 7.8.0**: Programación reactiva para manejo de streams
- **TypeScript 5.4.2**: Tipado estático fuerte
- **TMDB API**: Fuente de datos de películas
- **OpenWeatherMap API**: Fuente de datos de clima

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Modelos de datos (Movie, Weather, DatasetType)
│   │   └── services/        # Servicios HTTP (MovieService, WeatherService)
│   ├── features/
│   │   ├── movies/
│   │   │   └── movies-table/    # Componente de tabla de películas
│   │   └── weather/
│   │       └── weather-table/   # Componente de tabla de clima
│   ├── pages/
│   │   └── home/                # Página principal del dashboard
│   ├── shared/
│   │   └── components/
│   │       └── dataset-toggle/  # Componente para cambiar entre datasets
│   ├── app.config.ts            # Configuración de la aplicación
│   ├── app.routes.ts            # Rutas de la aplicación
│   └── app.component.ts         # Componente raíz
├── assets/
│   └── images/                  # Imágenes estáticas (placeholders)
├── environments/
│   ├── environment.ts           # Variables de entorno desarrollo
│   └── environment.prod.ts      # Variables de entorno producción
└── styles.scss                  # Estilos globales
```

## 📦 Instalación

1. **Clonar el repositorio** (si aplica)
```bash
git clone <repository-url>
cd dashboard-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

El proyecto ya incluye configuración para desarrollo. Para producción, edita `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  tmdbApiKey: 'TU_API_KEY_TMDB',
  tmdbReadAccessToken: 'TU_ACCESS_TOKEN_TMDB',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  openWeatherApiKey: 'TU_API_KEY_OPENWEATHER',
  openWeatherBaseUrl: 'https://api.openweathermap.org/data/2.5'
};
```

## 🏃 Ejecutar la Aplicación

### Servidor de Desarrollo
```bash
ng serve
```
La aplicación estará disponible en `http://localhost:4200/`

### Construir para Producción
```bash
ng build
```
Los archivos compilados se guardarán en `dist/dashboard-frontend/`

## 🧪 Testing

### Ejecutar Tests Unitarios
```bash
ng test
```

### Ejecutar Tests con Cobertura
```bash
ng test --code-coverage
```

## 🎯 Arquitectura y Patrones

### Standalone Components
- Todos los componentes usan la arquitectura de standalone components de Angular 17+
- No se usan módulos NgModules tradicionales

### Separación de Responsabilidades
- **Services**: Manejo de HTTP y lógica de negocio
- **Components**: Presentación y manejo de estado UI
- **Models**: Definición de tipos e interfaces

### Manejo de Errores
- Interceptores de errores en servicios HTTP
- Feedback visual con MatSnackBar
- Estados de carga con MatProgressSpinner

### Programación Reactiva
- Uso de RxJS para manejo de streams
- Operadores como `debounceTime`, `distinctUntilChanged`, `map`, `catchError`
- Subjects para comunicación entre componentes

## 🔧 Configuración de APIs

### TMDB (The Movie Database)
1. Regístrate en [themoviedb.org](https://www.themoviedb.org/)
2. Obtén tu API Key y Read Access Token
3. Configúralos en `src/environments/environment.ts`

### OpenWeatherMap
1. Regístrate en [openweathermap.org](https://openweathermap.org/api)
2. Obtén tu API Key gratuita
3. Configúrala en `src/environments/environment.ts`

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: > 768px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## 🎨 Características UI/UX

- **Diseño Moderno**: Tailwind CSS + Angular Material para una interfaz limpia y profesional
- **Tema Personalizado**: Colores personalizados (indigo/purple) con gradientes modernos
- **Animaciones**: Suaves transiciones y efectos fade-in para mejor experiencia
- **Feedback Visual**: Indicadores de carga, mensajes de error, validaciones
- **Responsive**: Diseño móvil-first con breakpoints optimizados
- **Accesibilidad**: Componentes de Angular Material con soporte ARIA
- **Iconos**: Emojis e iconos de Material para mejor identificación visual

## 🚀 Deploy

### GitHub Pages
```bash
ng build --base-href /NOMBRE-REPO/
npx angular-cli-ghpages --dir=dist/dashboard-frontend
```

### Otros Servicios
Los archivos en `dist/dashboard-frontend/` pueden ser desplegados en:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Cualquier servicio de hosting estático

## 📝 Notas Adicionales

- La aplicación usa TypeScript estricto para mayor seguridad de tipos
- Los servicios incluyen manejo robusto de errores HTTP
- Se implementa paginación del lado del servidor para películas y local para clima
- La búsqueda usa debounce para optimizar las llamadas a la API
- **Tailwind CSS**: Configurado con colores personalizados (primary/secondary) que complementan el tema de Angular Material
- **PostCSS**: Configurado para procesar Tailwind CSS durante el build
- **Standalone Components**: Architecture de Angular 17+ sin NgModules tradicionales

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es una prueba técnica para demostrar habilidades en desarrollo frontend con Angular.
