import React from 'react';
import { BoardGame } from '../types';
import { X, Users, Clock, Hash, Box } from 'lucide-react';

interface GameDetailsModalProps {
  game: BoardGame | null;
  onClose: () => void;
}

export const GameDetailsModal: React.FC<GameDetailsModalProps> = ({ game, onClose }) => {
  if (!game) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700 flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Emoji/Cover Section */}
        <div className="w-full md:w-1/2 bg-slate-900 relative min-h-[300px] flex items-center justify-center overflow-hidden">
          {game.imageUrl ? (
            <img 
              src={game.imageUrl} 
              alt={game.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                 (e.target as HTMLImageElement).style.display = 'none';
                 // Sibling fallback handled by visual logic or simple text below
                 const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                     const fallback = document.createElement('div');
                     fallback.className = "flex items-center justify-center w-full h-full text-9xl absolute inset-0";
                     fallback.innerText = game.emoji || '🎲';
                     parent.appendChild(fallback);
                  }
              }}
            />
          ) : (
            <>
              {/* Decorative background */}
              <div className="absolute inset-0 opacity-20" style={{
                   backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', 
                   backgroundSize: '30px 30px'
              }}></div>
              
              <div className="z-10 text-center">
                 <span className="text-9xl filter drop-shadow-2xl animate-in zoom-in duration-300">{game.emoji || '🎲'}</span>
              </div>
            </>
          )}

          <button 
            onClick={onClose}
            className="absolute top-4 left-4 md:hidden p-2 bg-black/50 text-white rounded-full hover:bg-black/80 z-20"
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 hidden md:block p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors"
          >
            <X size={24} />
          </button>

          <h2 className="text-3xl font-bold text-white mb-2">{game.name}</h2>
          
          <div className="flex flex-wrap gap-4 my-4 text-slate-300">
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-700">
              <Users size={18} className="text-emerald-400" />
              <span className="font-medium">{game.minPlayers}-{game.maxPlayers}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-700">
              <Clock size={18} className="text-amber-400" />
              <span className="font-medium">{game.playtime}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-700">
              <Hash size={18} className="text-blue-400" />
              <span className="font-medium">{game.minAge}+</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-2">Descripción</h3>
              <p className="text-slate-300 leading-relaxed text-lg">{game.description}</p>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-2">Mecánicas</h3>
              <div className="flex flex-wrap gap-2">
                {game.mechanics.map((mech, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-sm">
                    {mech}
                  </span>
                ))}
              </div>
            </div>

            {game.ownedExpansions && game.ownedExpansions.length > 0 && (
              <div>
                 <h3 className="flex items-center gap-2 text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">
                   <Box size={16} /> Expansiones en tu colección
                 </h3>
                 <div className="grid gap-3">
                   {game.ownedExpansions.map((exp, i) => (
                     <div key={i} className="bg-slate-700/30 p-3 rounded-lg border border-slate-700/50">
                       <p className="font-bold text-slate-200 text-sm">{exp.name}</p>
                       <p className="text-slate-400 text-xs mt-1">{exp.description}</p>
                     </div>
                   ))}
                 </div>
              </div>
            )}

            {game.notes && (
               <div>
                <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-2">Mis Notas</h3>
                <p className="text-slate-400 italic p-3 bg-slate-900/50 rounded-lg border border-slate-800">{game.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
