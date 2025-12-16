import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Users, Clock, Calendar } from 'lucide-react';

export type SortOption = 'name' | 'playtime' | 'players' | 'added';
export type SortOrder = 'asc' | 'desc';

interface FilterBarProps {
  isOpen: boolean;
  filters: {
    players: number | '';
    maxTime: number | '';
    minAge: number | '';
  };
  sort: {
    by: SortOption;
    order: SortOrder;
  };
  onFilterChange: (key: string, value: string | number) => void;
  onSortChange: (by: SortOption, order: SortOrder) => void;
  onClear: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  isOpen, 
  filters, 
  sort, 
  onFilterChange, 
  onSortChange,
  onClear
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-slate-800 border-b border-slate-700 p-4 animate-in slide-in-from-top-2">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Sorting Section */}
        <div className="space-y-2">
           <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <ArrowUpDown size={14} /> Ordenar por
           </label>
           <div className="flex gap-2">
             <select 
               value={sort.by}
               onChange={(e) => onSortChange(e.target.value as SortOption, sort.order)}
               className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
             >
               <option value="name">Nombre</option>
               <option value="playtime">Duración</option>
               <option value="players">Jugadores (Min)</option>
               <option value="added">Recientes</option>
             </select>
             <button 
               onClick={() => onSortChange(sort.by, sort.order === 'asc' ? 'desc' : 'asc')}
               className="p-2.5 bg-slate-700 rounded-lg text-white hover:bg-slate-600 border border-slate-600"
               title={sort.order === 'asc' ? 'Ascendente' : 'Descendente'}
             >
               {sort.order === 'asc' ? '↑' : '↓'}
             </button>
           </div>
        </div>

        {/* Filter Players */}
        <div className="space-y-2">
           <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <Users size={14} /> Jugadores exactos
           </label>
           <input 
             type="number" 
             placeholder="Ej. 4"
             min="1"
             value={filters.players}
             onChange={(e) => onFilterChange('players', e.target.value)}
             className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-600"
           />
        </div>

        {/* Filter Time */}
        <div className="space-y-2">
           <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <Clock size={14} /> Duración Máxima (min)
           </label>
           <input 
             type="number" 
             placeholder="Ej. 60"
             step="15"
             min="0"
             value={filters.maxTime}
             onChange={(e) => onFilterChange('maxTime', e.target.value)}
             className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-600"
           />
        </div>

         {/* Filter Age / Actions */}
        <div className="flex flex-col justify-between">
           <div className="space-y-2 mb-2 md:mb-0">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
               <Calendar size={14} /> Edad Mínima
             </label>
             <input 
               type="number" 
               placeholder="Ej. 10"
               min="0"
               value={filters.minAge}
               onChange={(e) => onFilterChange('minAge', e.target.value)}
               className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-600"
             />
           </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-700 flex justify-end">
          <button 
             onClick={onClear}
             className="text-xs text-slate-400 hover:text-white underline decoration-slate-600 hover:decoration-white underline-offset-4"
          >
            Limpiar filtros
          </button>
      </div>
    </div>
  );
};
