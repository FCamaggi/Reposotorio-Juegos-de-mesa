# 🎲 BoardGame Vault

Una aplicación moderna para gestionar tu colección personal de juegos de mesa. Lleva el control de todos tus juegos, expansiones, mecánicas y organiza tu ludoteca de forma sencilla y visual.

## ✨ Características

- 📚 **Gestión completa de juegos**: Agrega, edita y elimina juegos de tu colección
- 🔍 **Búsqueda y filtros avanzados**: Encuentra juegos por nombre, mecánicas, número de jugadores, duración o edad
- 📊 **Vistas múltiples**: Visualiza tu colección en formato grid o lista
- 🎨 **Interfaz moderna**: Diseño oscuro y elegante con Tailwind CSS
- 💾 **Almacenamiento local**: Tus datos se guardan en IndexedDB
- 📦 **Gestión de expansiones**: Registra las expansiones que posees de cada juego
- 📥 **Importar/Exportar**: Realiza backups de tu colección en formato JSON
- ✏️ **Editor JSON avanzado**: Edita directamente el JSON de tu colección

## 🚀 Instalación

**Prerequisitos:** Node.js (v20.19+ o v22.12+)

1. Clona o descarga el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en `http://localhost:5173`

## 📖 Uso

### Primera vez
Al iniciar la aplicación por primera vez, se cargará automáticamente una colección de juegos de ejemplo desde el archivo JSON incluido.

### Agregar un juego
1. Haz clic en "Nuevo Juego"
2. Completa la información del juego (nombre, descripción, jugadores, edad, duración, mecánicas)
3. Opcionalmente agrega expansiones
4. Guarda el juego

### Filtrar y buscar
- Usa la barra de búsqueda para encontrar juegos por nombre o mecánica
- Abre los filtros avanzados para filtrar por número de jugadores, duración o edad mínima
- Ordena tu colección por nombre, jugadores, duración o fecha de agregado

### Exportar/Importar
- **Exportar**: Descarga tu colección completa en formato JSON
- **Importar**: Carga una colección desde un archivo JSON

## 🛠️ Tecnologías

- React 19
- TypeScript
- Vite
- Tailwind CSS
- IndexedDB (vía idb-keyval)
- Lucide React (iconos)

## 📝 Estructura del proyecto

```
├── components/          # Componentes React
│   ├── AddGameModal.tsx
│   ├── FilterBar.tsx
│   ├── GameCard.tsx
│   ├── GameDetailsModal.tsx
│   ├── GameListView.tsx
│   └── JsonEditorModal.tsx
├── services/           # Lógica de negocio
│   └── storage.ts      # Gestión de almacenamiento
├── public/            # Archivos estáticos
│   └── boardgames_backup_2025-12-16 (2).json
├── App.tsx           # Componente principal
├── types.ts          # Definiciones de tipos
└── index.tsx         # Punto de entrada

```

## 📄 Licencia

Este proyecto es de uso personal y educativo.

---

Hecho con ❤️ para amantes de los juegos de mesa
