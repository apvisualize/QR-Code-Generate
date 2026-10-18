import React from 'react';
import { QrOptions } from '../utils/qr-generator.ts';
import { History, Trash2, ArrowUpRight, Clock } from 'lucide-react';

export interface HistoryItem {
  id: string;
  text: string;
  timestamp: number;
  options: QrOptions;
}

interface HistoryDrawerProps {
  items: HistoryItem[];
  onLoadItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  items,
  onLoadItem,
  onClearHistory,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Riwayat QR Terakhir
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">({items.length})</span>
        </div>
        <button
          type="button"
          onClick={onClearHistory}
          className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus Semua</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {items.slice(0, 6).map((item) => {
          const date = new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={item.id}
              onClick={() => onLoadItem(item)}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all cursor-pointer flex items-center justify-between gap-2 group"
            >
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-slate-200 truncate block group-hover:text-indigo-300 transition-colors">
                  {item.text}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> {date} · {item.options.dotStyle}
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 shrink-0 transition-colors" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
