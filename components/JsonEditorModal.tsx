import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, FileJson } from 'lucide-react';
import { BoardGame } from '../types';

interface JsonEditorModalProps {
  games: BoardGame[];
  onClose: () => void;
  onSave: (games: BoardGame[]) => void;
}

export const JsonEditorModal: React.FC<JsonEditorModalProps> = ({ games, onClose, onSave }) => {
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setJsonContent(JSON.stringify(games, null, 2));
  }, [games]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!Array.isArray(parsed)) {
        setError('El contenido debe ser un arreglo (array) de juegos [ ... ].');
        return;
      }
      onSave(parsed);
      onClose();
    } catch (e) {
      setError('JSON inválido: ' + (e as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl border border-slate-700">
         {/* Header */}
         <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 rounded-t-2xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
               <FileJson className="text-indigo-400" />
               Editor JSON Avanzado
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 hover:bg-slate-700 rounded-full transition-colors">
              <X size={24} />
            </button>
         </div>

         {/* Body */}
         <div className="flex-1 p-4 overflow-hidden flex flex-col gap-2">
            <div className="text-sm text-slate-400 mb-2">
              Edita los datos crudos de tu colección. Ten cuidado con la sintaxis JSON.
            </div>
            <div className="bg-slate-900 rounded-lg p-2 flex-1 border border-slate-700 relative shadow-inner">
               <textarea
                  value={jsonContent}
                  onChange={(e) => {
                      setJsonContent(e.target.value);
                      setError(null);
                  }}
                  className="w-full h-full bg-transparent text-slate-300 font-mono text-sm resize-none focus:outline-none p-2 custom-scrollbar leading-relaxed"
                  spellCheck={false}
               />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-300 text-sm bg-red-900/30 p-3 rounded-lg border border-red-900/50 animate-in fade-in slide-in-from-bottom-2">
                 <AlertCircle size={16} className="shrink-0"/>
                 {error}
              </div>
            )}
         </div>

         {/* Footer */}
         <div className="p-4 border-t border-slate-700 flex justify-end gap-3 bg-slate-900/30 rounded-b-2xl">
            <button onClick={onClose} className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
              Cancelar
            </button>
            <button 
              onClick={handleSave} 
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-indigo-900/20 transition-all hover:scale-105 active:scale-95"
            >
               <Save size={18} /> 
               Guardar Cambios
            </button>
         </div>
      </div>
    </div>
  );
}
