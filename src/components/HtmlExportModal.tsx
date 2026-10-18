import React, { useState } from 'react';
import { Copy, Check, Download, Code2, X } from 'lucide-react';
import { generateSingleFileHtml } from '../utils/singleFileHtmlGenerator.ts';

interface HtmlExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

export const HtmlExportModal: React.FC<HtmlExportModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlCode = generateSingleFileHtml(imageSrc);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'game_ghep_hinh_20_10_lop_12A01.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border-4 border-rose-300 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-rose-100 bg-rose-50/80">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-rose-500 text-white shadow-sm">
              <Code2 className="w-5 h-5" />
            </span>
            <div>
              <h3
                id="export-modal-title"
                className="text-base sm:text-lg font-bold text-rose-900 font-serif"
              >
                Mã Nguồn Đơn Lập (.html 1 File Duy Nhất)
              </h3>
              <p className="text-xs text-rose-600">
                Gom toàn bộ HTML, CSS, JavaScript và âm thanh không cần cài đặt gì thêm
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng bảng mã nguồn"
            className="p-1.5 rounded-full text-rose-500 hover:bg-rose-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body with code preview */}
        <div className="p-4 sm:p-5 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">
              game_ghep_hinh_20_10_lop_12A01.html (~15 KB)
            </span>
            <span className="text-xs text-emerald-600 font-medium">
              ✓ Hoạt động offline và tương thích mọi trình duyệt
            </span>
          </div>

          <div className="relative flex-1 min-h-[300px] overflow-auto rounded-xl bg-gray-900 p-4 border border-gray-700 font-mono text-xs text-rose-100">
            <pre className="whitespace-pre">{htmlCode}</pre>
          </div>
        </div>

        {/* Modal Footer actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 p-4 border-t border-rose-100 bg-rose-50/60">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs sm:text-sm shadow-sm border border-rose-300 transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Đã sao chép vào bộ nhớ!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-rose-500" />
                <span>Sao Chép Mã HTML</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-200 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Tải File .html Về Máy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
