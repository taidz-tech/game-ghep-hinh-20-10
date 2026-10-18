import React, { useState } from 'react';
import { Copy, Check, Download, Code2, X, Globe, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'download' | 'code' | 'guide'>('download');

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
    link.download = 'index.html'; // Default index.html so it works directly on GitHub Pages root!
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
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border-4 border-rose-300 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-rose-100 bg-rose-50/80">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm">
              <Globe className="w-5 h-5" />
            </span>
            <div>
              <h3
                id="export-modal-title"
                className="text-base sm:text-lg font-bold text-rose-900 font-serif"
              >
                Code 1 File Duy Nhất Đưa Lên GitHub Tạo Web
              </h3>
              <p className="text-xs text-rose-600">
                Gộp toàn bộ HTML, CSS, JavaScript, ảnh và âm thanh vào 1 file index.html duy nhất
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

        {/* Modal Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-rose-100 bg-rose-50/30">
          <button
            onClick={() => setActiveTab('download')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'download'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-gray-500 hover:text-rose-600'
            }`}
          >
            📥 Tải File index.html (Nhanh Nhất)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'guide'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-gray-500 hover:text-rose-600'
            }`}
          >
            📖 Hướng Dẫn GitHub Pages (30 Giây)
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'code'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-gray-500 hover:text-rose-600'
            }`}
          >
            💻 Xem & Sao Chép Mã
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {activeTab === 'download' && (
            <div className="flex flex-col items-center text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-3xl shadow-inner">
                📄
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800 font-serif">
                  File Đã Được Đóng Gói Hoàn Chỉnh: index.html
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mt-1">
                  Chỉ cần bấm nút tải dưới đây, bạn sẽ có ngay 1 file <code>index.html</code> duy nhất. 
                  Bạn có thể nhấp đúp để mở chạy ngay trên máy tính hoặc tải thẳng lên GitHub để tạo web miễn phí!
                </p>
              </div>

              <div className="w-full max-w-md bg-rose-50/70 p-4 rounded-2xl border border-rose-200 text-left space-y-2 text-xs text-rose-900">
                <div className="font-bold flex items-center gap-1.5 text-rose-800">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  Đặc điểm nổi bật của file này:
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-700 pl-1">
                  <li><strong>Bố cục song song:</strong> Ảnh gốc đối chiếu + Khung tranh + Khay mảnh ghép đủ full.</li>
                  <li><strong>Tự sinh âm thanh:</strong> Dùng Web Audio API, không lo thiếu file mp3 hay lỗi 404.</li>
                  <li><strong>Tích hợp sẵn ảnh:</strong> Ảnh đã được nhúng trực tiếp dạng base64 bên trong.</li>
                  <li><strong>Tương thích 100% GitHub Pages:</strong> Chỉ cần đặt tên là <code>index.html</code>.</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 w-full">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-200 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File index.html Về Máy Ngay</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-rose-50 text-rose-700 font-bold text-sm shadow-sm border border-rose-300 transition-all active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Đã Sao Chép Toàn Bộ Mã!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-rose-500" />
                      <span>Sao Chép Code HTML</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs sm:text-sm text-gray-700">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium">
                💡 Bạn chỉ cần làm theo 3 bước cực kỳ đơn giản sau để có ngay link web chia sẻ cho Cô và cả lớp:
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white border-2 border-rose-100 shadow-xs flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">Tạo kho lưu trữ (Repository) trên GitHub</h5>
                    <p className="text-gray-600 mt-0.5">
                      Đăng nhập <a href="https://github.com" target="_blank" rel="noreferrer" className="text-rose-600 underline font-semibold">GitHub.com</a>, bấm <strong>New repository</strong>, đặt tên (ví dụ: <code>ghep-hinh-20-10</code>), chọn chế độ <strong>Public</strong> rồi bấm <strong>Create repository</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border-2 border-rose-100 shadow-xs flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">Tải file index.html lên</h5>
                    <p className="text-gray-600 mt-0.5">
                      Bấm vào <strong>uploading an existing file</strong> hoặc tạo file mới đặt tên là <code>index.html</code>, sau đó dán code hoặc kéo thả file <code>index.html</code> vừa tải ở tab trước vào và bấm <strong>Commit changes</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border-2 border-rose-100 shadow-xs flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">Bật GitHub Pages (Tạo Web Tự Động)</h5>
                    <p className="text-gray-600 mt-0.5">
                      Vào tab <strong>Settings</strong> của kho lưu trữ đó ➔ chọn mục <strong>Pages</strong> (menu bên trái) ➔ Ở phần <strong>Branch</strong>, chọn nhánh <strong>main</strong> (hoặc master) và thư mục <code>/ (root)</code> rồi bấm <strong>Save</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <span>🎉</span>
                <span>
                  Sau 1-2 phút, GitHub sẽ cấp cho bạn đường link web miễn phí vĩnh viễn dạng: <br/>
                  <code className="text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">https://tên_của_bạn.github.io/ghep-hinh-20-10/</code>
                </span>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="flex flex-col h-full space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Mã nguồn hoàn chỉnh <code>index.html</code>:</span>
                <button
                  onClick={handleCopy}
                  className="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  {copied ? '✓ Đã sao chép!' : '📋 Sao chép nhanh'}
                </button>
              </div>

              <div className="relative min-h-[300px] max-h-[420px] overflow-auto rounded-xl bg-gray-900 p-4 border border-gray-700 font-mono text-xs text-rose-100">
                <pre className="whitespace-pre">{htmlCode}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-rose-100 bg-rose-50/60">
          <span className="text-xs text-gray-500">
            Dành tặng Cô và các bạn nữ Lớp 12A01 🌸
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs shadow-xs border border-rose-300 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Đã Sao Chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sao Chép Code</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải File .html</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
