import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Download, Upload, Search, Dice5, LayoutGrid, List as ListIcon, FileJson, SlidersHorizontal } from 'lucide-react';
import { BoardGame, GameFormData, Expansion } from './types';
import { GameCard } from './components/GameCard';
import { GameListView } from './components/GameListView';
import { AddGameModal } from './components/AddGameModal';
import { GameDetailsModal } from './components/GameDetailsModal';
import { JsonEditorModal } from './components/JsonEditorModal';
import { FilterBar, SortOption, SortOrder } from './components/FilterBar';
import { loadGames, saveGames } from './services/storage';

const App: React.FC = () => {
  const [games, setGames] = useState<BoardGame[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJsonEditorOpen, setIsJsonEditorOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [editingGame, setEditingGame] = useState<BoardGame | null>(null);
  const [selectedGame, setSelectedGame] = useState<BoardGame | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter & Sort State
  const [filters, setFilters] = useState({
    players: '' as number | '',
    maxTime: '' as number | '',
    minAge: '' as number | ''
  });
  const [sort, setSort] = useState<{ by: SortOption; order: SortOrder }>({
    by: 'name',
    order: 'asc'
  });

  // Helper to ensure game data integrity, especially IDs
  const sanitizeGames = (rawGames: any[]): BoardGame[] => {
    return rawGames.map(game => ({
      ...game,
      id: game.id ? String(game.id) : uuidv4(), // Ensure ID is string
      ownedExpansions: game.ownedExpansions || [],
      mechanics: game.mechanics || []
    }));
  };

  // Load from Storage on mount
  useEffect(() => {
    const initStorage = async () => {
      const loadedGames = await loadGames();
      setGames(sanitizeGames(loadedGames));
      setIsLoaded(true);
    };
    initStorage();
  }, []);

  // Save to Storage whenever games change
  useEffect(() => {
    if (isLoaded) {
      saveGames(games).catch(err => {
        console.error("Failed to save games", err);
      });
    }
  }, [games, isLoaded]);

  // --- Logic Helpers ---

  // Parses a playtime string (e.g., "30-60 min", "90 min aprox") into usable numbers
  const parsePlaytime = (timeStr: string) => {
    // Extract all numbers
    const numbers = timeStr.match(/\d+/g)?.map(Number) || [];
    
    if (numbers.length === 0) return { min: 0, max: 0, avg: 0 };
    if (numbers.length === 1) return { min: numbers[0], max: numbers[0], avg: numbers[0] };
    
    // Assume format matches min-max, e.g., "30-60"
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const avg = (min + max) / 2;
    return { min, max, avg };
  };

  const processedGames = useMemo(() => {
    let result = [...games];

    // 1. Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(game => 
        game.name.toLowerCase().includes(lowerTerm) ||
        game.mechanics.some(m => m.toLowerCase().includes(lowerTerm))
      );
    }

    // 2. Filters
    if (filters.players !== '') {
      const p = Number(filters.players);
      // Show games that support this player count (min <= p <= max)
      result = result.filter(game => game.minPlayers <= p && game.maxPlayers >= p);
    }

    if (filters.maxTime !== '') {
      const t = Number(filters.maxTime);
      // Show games where the MAX playtime is less than or equal to the filter
      // If a game says "30-60", max is 60. If filter is 45, exclude. If filter is 60, include.
      result = result.filter(game => {
        const { max } = parsePlaytime(game.playtime);
        return max > 0 && max <= t;
      });
    }

    if (filters.minAge !== '') {
      const a = Number(filters.minAge);
      // Show games where minAge is equal or higher? Or suitable for? 
      // Usually filter by "I have a 10 year old", so game.minAge <= 10.
      // BUT typically in stores "Age 10+" means show games where minAge >= 10?
      // Let's assume user wants games appropriate for AT LEAST that age.
      // If input is 12, I probably want games complex enough for 12 year olds (minAge around 12).
      // Let's stick to simple: Show games where minAge <= Filter (Suitable for an X year old).
      // actually, "Age Filter" usually implies "Min Age" property.
      // Let's do: Show games where game.minAge >= filter (Complexity filter).
      result = result.filter(game => game.minAge >= a);
    }

    // 3. Sorting
    result.sort((a, b) => {
      let valA: any, valB: any;

      switch (sort.by) {
        case 'name':
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          return sort.order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        
        case 'players':
          // Sort by minimum players
          valA = a.minPlayers;
          valB = b.minPlayers;
          break;

        case 'playtime':
          // Sort by average playtime
          valA = parsePlaytime(a.playtime).avg;
          valB = parsePlaytime(b.playtime).avg;
          break;

        case 'added':
          valA = a.addedAt || 0;
          valB = b.addedAt || 0;
          break;
          
        default:
          return 0;
      }

      if (valA < valB) return sort.order === 'asc' ? -1 : 1;
      if (valA > valB) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [games, searchTerm, filters, sort]);


  const handleSaveGame = (data: GameFormData, expansions: Expansion[]) => {
    if (editingGame) {
      setGames(prev => prev.map(g => g.id === editingGame.id ? {
        ...g,
        ...data,
        ownedExpansions: expansions
      } : g));
    } else {
      const newGame: BoardGame = {
        id: uuidv4(),
        ...data,
        ownedExpansions: expansions,
        addedAt: Date.now()
      };
      setGames(prev => [newGame, ...prev]);
    }
    setIsModalOpen(false);
    setEditingGame(null);
  };

  const handleJsonSave = (newGames: BoardGame[]) => {
    setGames(sanitizeGames(newGames));
  };

  const handleEditClick = (game: BoardGame) => {
    setEditingGame(game);
    setIsModalOpen(true);
  };

  const handleDeleteGame = (id: string) => {
    setGames(prev => prev.filter(g => String(g.id) !== String(id)));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(games, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boardgames_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          setGames(sanitizeGames(parsed));
          alert('Repositorio importado correctamente.');
        } else {
          alert('El archivo JSON no tiene el formato correcto.');
        }
      } catch (err) {
        console.error(err);
        alert('Error al leer el archivo.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
               <Dice5 className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
              BoardGame Vault
            </h1>
          </div>

          <div className="flex items-center gap-3">
             {/* View Toggle */}
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
               <button 
                 onClick={() => setViewMode('grid')}
                 className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                 title="Vista Cuadrícula"
               >
                 <LayoutGrid size={18} />
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                 title="Vista Lista"
               >
                 <ListIcon size={18} />
               </button>
            </div>

            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Buscar juegos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-indigo-500 placeholder-slate-500 w-64"
              />
            </div>
            
            <div className="flex gap-2">
               <button 
                 onClick={() => setIsFilterOpen(!isFilterOpen)}
                 className={`p-2 rounded-full transition-colors hidden sm:block ${isFilterOpen ? 'bg-indigo-600 text-white shadow-inner' : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'}`}
                 title="Filtros y Orden"
              >
                <SlidersHorizontal size={20} />
              </button>

              <button 
                 onClick={() => setIsJsonEditorOpen(true)}
                 className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-full transition-colors hidden sm:block"
                 title="Editor JSON Avanzado"
              >
                <FileJson size={20} />
              </button>
              <button 
                onClick={handleExport}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors hidden sm:block"
                title="Exportar JSON"
              >
                <Download size={20} />
              </button>
              <label className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer hidden sm:block" title="Importar JSON">
                <Upload size={20} />
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>

            <button 
              onClick={() => {
                setEditingGame(null);
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-indigo-900/50"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nuevo Juego</span>
            </button>
          </div>
        </div>
        
        {/* Filter Bar Integration */}
        <FilterBar 
          isOpen={isFilterOpen}
          filters={filters}
          sort={sort}
          onFilterChange={(key, val) => setFilters(prev => ({...prev, [key]: val}))}
          onSortChange={(by, order) => setSort({ by, order })}
          onClear={() => {
            setFilters({ players: '', maxTime: '', minAge: '' });
            setSort({ by: 'name', order: 'asc' });
          }}
        />
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Search & Controls */}
        <div className="md:hidden mb-6 space-y-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
             <input 
               type="text" 
               placeholder="Buscar en tu colección..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-800 border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500"
             />
           </div>
           <div className="flex justify-end gap-2">
              <button 
                 onClick={() => setIsFilterOpen(!isFilterOpen)}
                 className={`p-2 rounded-lg border border-slate-700 ${isFilterOpen ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                <SlidersHorizontal size={20} />
              </button>
              <button 
                 onClick={() => setIsJsonEditorOpen(true)}
                 className="p-2 bg-slate-800 text-slate-400 rounded-lg border border-slate-700"
              >
                <FileJson size={20} />
              </button>
               <button onClick={handleExport} className="p-2 bg-slate-800 text-slate-400 rounded-lg border border-slate-700">
                <Download size={20} />
              </button>
              <label className="p-2 bg-slate-800 text-slate-400 rounded-lg border border-slate-700">
                <Upload size={20} />
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
           </div>
        </div>

        {/* Empty State */}
        {games.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="bg-slate-800/50 inline-block p-6 rounded-full mb-6">
               <Dice5 className="text-slate-600" size={64} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Tu estantería está vacía</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">Comienza agregando tus juegos de mesa a tu colección personal.</p>
            <button 
              onClick={() => {
                 setEditingGame(null);
                 setIsModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium inline-flex items-center gap-2 text-lg shadow-xl shadow-indigo-900/40"
            >
              <Plus size={24} />
              Agregar mi primer juego
            </button>
          </div>
        ) : (
          /* Content */
          <>
            <div className="mb-4 text-sm text-slate-400 flex justify-between items-center">
               <span>Mostrando {processedGames.length} juegos</span>
               {(filters.players || filters.maxTime || filters.minAge) && (
                 <span className="text-indigo-400 text-xs bg-indigo-900/30 px-2 py-1 rounded">Filtros activos</span>
               )}
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {processedGames.map(game => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    onDelete={handleDeleteGame}
                    onEdit={handleEditClick}
                    onClick={setSelectedGame} 
                  />
                ))}
              </div>
            ) : (
              <GameListView 
                 games={processedGames}
                 onDelete={handleDeleteGame}
                 onEdit={handleEditClick}
                 onClick={setSelectedGame}
              />
            )}
          </>
        )}
        
        {games.length > 0 && processedGames.length === 0 && (
           <div className="text-center py-12">
             <div className="bg-slate-800/50 inline-block p-4 rounded-full mb-4">
                <Search size={32} className="text-slate-500"/>
             </div>
             <p className="text-slate-400 text-lg">No se encontraron juegos con esos filtros.</p>
             <button 
               onClick={() => {
                 setFilters({ players: '', maxTime: '', minAge: '' });
                 setSearchTerm('');
               }}
               className="mt-4 text-indigo-400 hover:text-white underline"
             >
               Limpiar búsqueda
             </button>
           </div>
        )}
      </main>

      {/* Modals */}
      {isModalOpen && (
        <AddGameModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveGame} 
          initialData={editingGame || undefined}
        />
      )}

      {selectedGame && (
        <GameDetailsModal 
          game={selectedGame} 
          onClose={() => setSelectedGame(null)} 
        />
      )}

      {isJsonEditorOpen && (
        <JsonEditorModal 
          games={games}
          onClose={() => setIsJsonEditorOpen(false)}
          onSave={handleJsonSave}
        />
      )}
    </div>
  );
};

export default App;
