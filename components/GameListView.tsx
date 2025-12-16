import React from 'react';
import { BoardGame } from '../types';
import { Trash2, Edit2, Users, Clock, Box } from 'lucide-react';

interface GameListViewProps {
  games: BoardGame[];
  onDelete: (id: string) => void;
  onEdit: (game: BoardGame) => void;
  onClick: (game: BoardGame) => void;
}

export const GameListView: React.FC<GameListViewProps> = ({ games, onDelete, onEdit, onClick }) => {
  
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de eliminar este juego?')) {
        onDelete(id);
    }
  };

  const handleEdit = (e: React.MouseEvent, game: BoardGame) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(game);
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold w-20">Icon</th>
              <th className="p-4 font-semibold">Nombre</th>
              <th className="p-4 font-semibold w-32 hidden sm:table-cell">Jugadores</th>
              <th className="p-4 font-semibold w-32 hidden md:table-cell">Tiempo</th>
              <th className="p-4 font-semibold w-32 hidden lg:table-cell">Mecánicas</th>
              <th className="p-4 font-semibold w-24 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {games.map(game => (
              <tr 
                key={game.id} 
                className="hover:bg-slate-700/50 transition-colors group cursor-pointer"
                onClick={() => onClick(game)}
              >
                <td className="p-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-700/50 overflow-hidden border border-slate-600 flex items-center justify-center shadow-sm relative">
                      {game.imageUrl ? (
                        <img 
                          src={game.imageUrl} 
                          alt="" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                             (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-2xl">{game.emoji || '🎲'}</span>
                      )}
                      {/* Fallback text if img hidden via JS, or if pure emoji, handled by logic above. If image fails, emoji isn't auto-shown in this tiny box efficiently without more complex state, but default box bg remains. */}
                  </div>
                </td>
                <td className="p-3">
                  <div className="font-semibold text-white">{game.name}</div>
                  <div className="text-xs text-slate-500 sm:hidden">
                    {game.minPlayers}-{game.maxPlayers} players • {game.playtime}
                  </div>
                  {game.ownedExpansions.length > 0 && (
                     <div className="flex items-center gap-1 text-[10px] text-indigo-400 mt-1">
                        <Box size={10} /> +{game.ownedExpansions.length} exp
                     </div>
                  )}
                </td>
                <td className="p-3 hidden sm:table-cell text-slate-300">
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-emerald-500" />
                    {game.minPlayers}-{game.maxPlayers}
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell text-slate-300">
                   <div className="flex items-center gap-1">
                    <Clock size={14} className="text-amber-500" />
                    {game.playtime}
                  </div>
                </td>
                <td className="p-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {game.mechanics.slice(0, 2).map((m, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded">
                        {m}
                      </span>
                    ))}
                    {game.mechanics.length > 2 && <span className="text-[10px] text-slate-500">+{game.mechanics.length - 2}</span>}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                     <button 
                      type="button"
                      onClick={(e) => handleEdit(e, game)}
                      className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => handleDelete(e, game.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
