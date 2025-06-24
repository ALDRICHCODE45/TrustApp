# Tabla de Reclutamiento Optimizada

Esta es la versión optimizada de la tabla de reclutamiento que sigue el patrón de la CommercialTable, con componentes separados y optimizaciones de rendimiento.

## Estructura de Archivos

```
table/
├── components/
│   ├── index.ts                 # Exportaciones de componentes
│   ├── TableFilters.tsx         # Componente de filtros optimizado
│   ├── TablePagination.tsx      # Componente de paginación optimizado
│   ├── DataGrid.tsx             # Componente de tabla optimizado
│   └── ColumnSelector.tsx       # Selector de columnas optimizado
├── RecruiterTable.tsx           # Tabla original (legacy)
├── RecruiterTableOptimized.tsx  # Tabla optimizada (nueva)
└── README.md                    # Esta documentación
```

## Optimizaciones Implementadas

### 1. useMemo

- **Datos de la tabla**: Los datos se memoizan para evitar re-renderizaciones innecesarias
- **Cálculos de paginación**: Total de páginas, rangos de filas, etc.
- **Filtros**: Listas de reclutadores, columnas ocultables, etc.

### 2. useCallback

- **Handlers de filtros**: Todos los manejadores de cambios de filtros
- **Handlers de paginación**: Navegación entre páginas y cambio de tamaño
- **Handlers de eventos**: Drag & drop, hover, etc.
- **Funciones de utilidad**: Exportación, refrescado de datos, etc.

### 3. Separación de Componentes

- **TableFilters**: Maneja todos los filtros de la tabla
- **TablePagination**: Maneja la paginación y navegación
- **DataGrid**: Renderiza la tabla con funcionalidades de drag & drop
- **ColumnSelector**: Permite mostrar/ocultar columnas

### 4. Funcionalidades Adicionales

- **Drag & Drop de columnas**: Permite reordenar columnas arrastrándolas
- **Hover effects**: Efectos visuales mejorados en las filas
- **Indicadores de filtros activos**: Badges que muestran filtros aplicados
- **Botón de limpiar filtros**: Resetea todos los filtros de una vez
- **Exportación**: Funcionalidad para exportar datos
- **Refresco de datos**: Botón para actualizar los datos

## Uso

### Importar la versión optimizada:

```tsx
import { RecruiterTable } from "./table/RecruiterTableOptimized";
```

### Importar componentes individuales:

```tsx
import {
  TableFilters,
  TablePagination,
  DataGrid,
  ColumnSelector,
} from "./table/components";
```

## Beneficios de las Optimizaciones

1. **Rendimiento mejorado**: Menos re-renderizaciones innecesarias
2. **Código más mantenible**: Componentes separados y reutilizables
3. **Mejor experiencia de usuario**: Funcionalidades adicionales como drag & drop
4. **Escalabilidad**: Fácil agregar nuevas funcionalidades
5. **Consistencia**: Sigue el mismo patrón que CommercialTable

## Migración

Para migrar de la versión original a la optimizada:

1. Reemplaza las importaciones:

   ```tsx
   // Antes
   import { RecruiterTable } from "./table/RecruiterTable";

   // Después
   import { RecruiterTable } from "./table/RecruiterTableOptimized";
   ```

2. La API pública se mantiene igual, por lo que no se requieren cambios en el uso del componente.

## Notas Técnicas

- Todos los componentes usan TypeScript con tipos genéricos
- Se mantiene compatibilidad con la API existente
- Los filtros personalizados están optimizados para rangos de fechas
- La paginación es responsive y funciona bien en móviles
- Los componentes son completamente accesibles (ARIA labels, keyboard navigation)
