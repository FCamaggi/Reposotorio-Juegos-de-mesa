import React from 'react';
import { BoardGame } from '../types';
import { Trash2, Users, Clock, Hash, Box, Edit2 } from 'lucide-react';

interface GameCardProps {
  game: BoardGame;
  onDelete: (id: string) => void;
  onEdit: (game: BoardGame) => void;
  onClick: (game: BoardGame) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onDelete, onEdit, onClick }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de eliminar este juego?')) {
      onDelete(game.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(game);
  };

  return (
    <div 
      className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-700 group cursor-pointer relative flex flex-col h-full"
      onClick={() => onClick(game)}
    >
      <div className="relative h-48 w-full bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center">
        {/* Background Pattern or Image */}
        {game.imageUrl ? (
          <img 
            src={game.imageUrl} 
            alt={game.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback to emoji if image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                 const fallback = document.createElement('div');
                 fallback.className = "flex items-center justify-center h-full w-full text-8xl";
                 fallback.innerText = game.emoji || '🎲';
                 parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-slate-900 opacity-50" 
                 style={{backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            </div>
            {/* EMOJI IS KING */}
            <div className="z-10 transition-transform duration-300 group-hover:scale-110">
                <span className="text-8xl filter drop-shadow-2xl">{game.emoji || '🎲'}</span>
            </div>
          </>
        )}

        {/* Edit/Delete Actions */}
        {/* z-30 to ensure it's above everything, pointer-events-auto */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-30 pointer-events-auto">
          <button 
            type="button"
            onClick={handleEdit}
            className="p-2 bg-indigo-500/90 text-white rounded-full hover:bg-indigo-600 backdrop-blur-sm shadow-lg transform active:scale-95 transition-transform"
            title="Editar"
          >
            <Edit2 size={16} />
          </button>
          <button 
            type="button"
            onClick={handleDelete}
            className="p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 backdrop-blur-sm shadow-lg transform active:scale-95 transition-transform"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {game.ownedExpansions && game.ownedExpansions.length > 0 && (
           <div className="absolute top-2 left-2 px-2 py-1 bg-indigo-600/90 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-sm backdrop-blur-sm z-10">
             <Box size={10} />
             <span>+{game.ownedExpansions.length} Exp</span>
           </div>
        )}

        <div className="absolute bottom-0 left-0 p-4 w-full z-10 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent">
          <h3 className="text-xl font-bold text-white truncate shadow-black drop-shadow-md">{game.name}</h3>
        </div>
      </div>

      <div className="p-4 space-y-3 flex flex-col grow bg-slate-800">
        <div className="flex justify-between text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Users size={14} className="text-emerald-400" />
            <span>{game.minPlayers}-{game.maxPlayers}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-amber-400" />
            <span>{game.playtime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Hash size={14} className="text-blue-400" />
            <span>{game.minAge}+</span>
          </div>
        </div>

        <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed grow">
          {game.description}
        </p>

        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-slate-700/50">
          {game.mechanics.slice(0, 3).map((mech, i) => (
            <span key={i} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-slate-700 text-slate-300 rounded-md">
              {mech}
            </span>
          ))}
          {game.mechanics.length > 3 && (
            <span className="text-[10px] px-2 py-1 bg-slate-700 text-slate-300 rounded-md">
              +{game.mechanics.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};