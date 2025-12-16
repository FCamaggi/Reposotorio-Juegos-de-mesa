import React, { useState, useEffect } from 'react';
import { X, Save, Box, Smile, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';
import { GameFormData, Expansion, BoardGame } from '../types';

interface AddGameModalProps {
  onClose: () => void;
  onSave: (data: GameFormData, expansions: Expansion[]) => void;
  initialData?: BoardGame;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({ onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  
  // Expansions
  const [expansions, setExpansions] = useState<Expansion[]>([]);
  const [newExpansionName, setNewExpansionName] = useState('');
  const [newExpansionDesc, setNewExpansionDesc] = useState('');

  const [formData, setFormData] = useState<GameFormData>({
    name: '',
    description: '',
    minPlayers: 1,
    maxPlayers: 4,
    playtime: '30-60 min',
    minAge: 10,
    mechanics: [],
    notes: '',
    imageUrl: '', 
    emoji: '🎲'
  });

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setFormData({
        name: initialData.name,
        description: initialData.description,
        minPlayers: initialData.minPlayers,
        maxPlayers: initialData.maxPlayers,
        playtime: initialData.playtime,
        minAge: initialData.minAge,
        mechanics: initialData.mechanics,
        notes: initialData.notes || '',
        imageUrl: initialData.imageUrl || '',
        emoji: initialData.emoji || '🎲'
      });
      setExpansions(initialData.ownedExpansions);
    }
  }, [initialData]);

  const handleAddExpansion = () => {
    if (!newExpansionName.trim()) return;
    
    const newExpansion: Expansion = {
      name: newExpansionName.trim(),
      description: newExpansionDesc.trim() || 'Sin descripción'
    };
    
    setExpansions(prev => [...prev, newExpansion]);
    setNewExpansionName('');
    setNewExpansionDesc('');
  };

  const handleRemoveExpansion = (index: number) => {
    setExpansions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, name: name || formData.name }, expansions);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-slate-800 z-10">
          <h2 className="text-2xl font-bold text-white">
            {initialData ? 'Editar Juego' : 'Agregar Juego'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Main Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Nombre del Juego</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Ej. Catan, Pandemic..."
              required
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Image / Emoji Selection Section */}
              <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                   <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-300">Portada del Juego</label>
                      <p className="text-xs text-slate-500">Emoji (por defecto) o Imagen (URL)</p>
                   </div>
                   
                   {/* Preview Area */}
                   <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-600 flex items-center justify-center shrink-0">
                      {formData.imageUrl ? (
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">{formData.emoji}</span>
                      )}
                   </div>
                </div>

                <div className="grid grid-cols-[80px_1fr] gap-3">
                   {/* Emoji Input */}
                   <div>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={formData.emoji || ''}
                          onChange={e => setFormData({...formData, emoji: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-2 text-white text-center text-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          placeholder="🎲"
                          maxLength={2}
                        />
                        <span className="absolute -top-2 -right-1 bg-slate-800 p-0.5 rounded-full border border-slate-600">
                          <Smile size={12} className="text-slate-400" />
                        </span>
                      </div>
                   </div>

                   {/* Image URL Input */}
                   <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                         <LinkIcon size={16} />
                      </div>
                      <input 
                        type="url" 
                        value={formData.imageUrl || ''}
                        onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                   </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Descripción</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none h-32"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Min Jugadores</label>
                  <input type="number" min="1" 
                    value={formData.minPlayers}
                    onChange={e => setFormData({...formData, minPlayers: parseInt(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Max Jugadores</label>
                  <input type="number" min="1" 
                    value={formData.maxPlayers}
                    onChange={e => setFormData({...formData, maxPlayers: parseInt(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Edad Min</label>
                  <input type="number" min="1" 
                    value={formData.minAge}
                    onChange={e => setFormData({...formData, minAge: parseInt(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Duración</label>
                  <input type="text" 
                    value={formData.playtime}
                    onChange={e => setFormData({...formData, playtime: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Mecánicas</label>
                <input 
                  type="text" 
                  value={formData.mechanics.join(', ')}
                  onChange={e => setFormData({...formData, mechanics: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej. Dados, Gestión de recursos"
                />
              </div>

               {/* Expansions Section */}
              <div className="border border-slate-700 rounded-lg p-3 bg-slate-800/50">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-slate-300">
                        <Box size={16} className="text-indigo-400"/>
                        <span className="text-sm font-medium">Expansiones</span>
                    </div>
                </div>

                {/* Add Expansion Form */}
                <div className="space-y-2 mb-3">
                   <input 
                     type="text" 
                     value={newExpansionName}
                     onChange={(e) => setNewExpansionName(e.target.value)}
                     placeholder="Nombre de la expansión..."
                     className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
                     onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExpansion())}
                   />
                   <div className="flex gap-2">
                     <input 
                       type="text" 
                       value={newExpansionDesc}
                       onChange={(e) => setNewExpansionDesc(e.target.value)}
                       placeholder="Descripción (opcional)..."
                       className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
                       onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExpansion())}
                     />
                     <button 
                       type="button"
                       onClick={handleAddExpansion}
                       disabled={!newExpansionName.trim()}
                       className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 text-white p-2 rounded-lg transition-colors"
                     >
                       <Plus size={16}/>
                     </button>
                   </div>
                </div>
                
                {expansions.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {expansions.map((exp, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-2 p-2 rounded bg-slate-700/50 border border-slate-600">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">
                            {exp.name}
                          </p>
                          <p className="text-xs text-slate-400 line-clamp-1">{exp.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveExpansion(idx)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-500 text-xs">
                    No hay expansiones agregadas
                  </div>
                )}
              </div>

               <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Notas Personales</label>
                <textarea 
                  value={formData.notes || ''}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none h-20"
                  placeholder="A quién le gané, si faltan piezas, etc."
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-700">
             <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">
               Cancelar
             </button>
             <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors shadow-lg shadow-emerald-900/20">
               <Save size={18} />
               {initialData ? 'Guardar Cambios' : 'Agregar Juego'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
