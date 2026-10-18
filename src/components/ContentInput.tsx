import React, { useState, useEffect } from 'react';
import {
  Link2,
  FileText,
  Wifi,
  Phone,
  UserSquare2,
  Mail,
  ExternalLink,
  Check,
  Sparkles,
} from 'lucide-react';

export type ContentType = 'url' | 'text' | 'wifi' | 'whatsapp' | 'vcard' | 'email';

interface ContentInputProps {
  value: string;
  onChange: (newContent: string) => void;
}

export const ContentInput: React.FC<ContentInputProps> = ({ value, onChange }) => {
  const [activeType, setActiveType] = useState<ContentType>('url');

  // URL state
  const [urlInput, setUrlInput] = useState<string>('https://google.com');

  // Text state
  const [textInput, setTextInput] = useState<string>('Halo! Selamat datang di QR Studio Pro.');

  // WiFi state
  const [wifiSsid, setWifiSsid] = useState<string>('WiFi_RuangTamu');
  const [wifiPassword, setWifiPassword] = useState<string>('KopiEnak123');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState<boolean>(false);

  // WhatsApp state
  const [waPhone, setWaPhone] = useState<string>('6281234567890');
  const [waMessage, setWaMessage] = useState<string>('Halo, saya ingin bertanya tentang layanan Anda.');

  // vCard state
  const [vcardName, setVcardName] = useState<string>('Budi Santoso');
  const [vcardPhone, setVcardPhone] = useState<string>('+6281234567890');
  const [vcardEmail, setVcardEmail] = useState<string>('budi@example.com');
  const [vcardOrg, setVcardOrg] = useState<string>('Studio Kreatif Indonesia');
  const [vcardWebsite, setVcardWebsite] = useState<string>('https://budisantoso.id');

  // Email state
  const [emailTo, setEmailTo] = useState<string>('kontak@perusahaan.com');
  const [emailSubject, setEmailSubject] = useState<string>('Pertanyaan Kerjasama Bisnis');
  const [emailBody, setEmailBody] = useState<string>('Halo Tim, saya tertarik untuk mendiskusikan peluang kolaborasi.');

  // Synchronize active content whenever inputs or activeType change
  useEffect(() => {
    switch (activeType) {
      case 'url': {
        const clean = urlInput.trim();
        onChange(clean.length > 0 ? clean : 'https://google.com');
        break;
      }
      case 'text': {
        onChange(textInput);
        break;
      }
      case 'wifi': {
        const hStr = wifiHidden ? 'H:true;' : '';
        const rawWifi = `WIFI:T:${wifiAuth};S:${wifiSsid};P:${wifiPassword};${hStr};`;
        onChange(rawWifi);
        break;
      }
      case 'whatsapp': {
        const cleanPhone = waPhone.replace(/[^0-9]/g, '');
        const encodedMsg = encodeURIComponent(waMessage);
        const waUrl = `https://wa.me/${cleanPhone}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
        onChange(waUrl);
        break;
      }
      case 'vcard': {
        const vcard = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${vcardName}`,
          `ORG:${vcardOrg}`,
          `TEL:${vcardPhone}`,
          `EMAIL:${vcardEmail}`,
          `URL:${vcardWebsite}`,
          'END:VCARD',
        ].join('\n');
        onChange(vcard);
        break;
      }
      case 'email': {
        const mailto = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        onChange(mailto);
        break;
      }
    }
  }, [
    activeType,
    urlInput,
    textInput,
    wifiSsid,
    wifiPassword,
    wifiAuth,
    wifiHidden,
    waPhone,
    waMessage,
    vcardName,
    vcardPhone,
    vcardEmail,
    vcardOrg,
    vcardWebsite,
    emailTo,
    emailSubject,
    emailBody,
  ]);

  const tabs: { id: ContentType; label: string; icon: React.ReactNode }[] = [
    { id: 'url', label: 'URL', icon: <Link2 className="w-3.5 h-3.5" /> },
    { id: 'text', label: 'Teks', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'wifi', label: 'Wi-Fi', icon: <Wifi className="w-3.5 h-3.5" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <Phone className="w-3.5 h-3.5" /> },
    { id: 'vcard', label: 'Kontak', icon: <UserSquare2 className="w-3.5 h-3.5" /> },
    { id: 'email', label: 'Email', icon: <Mail className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-3.5">
      {/* Type Selector Tabs */}
      <div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80">
          {tabs.map((tab) => {
            const isActive = activeType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveType(tab.id)}
                className={`flex items-center justify-center gap-1.5 py-1.5 sm:py-2 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Form per Content Type */}
      <div>
        {activeType === 'url' && (
          <div className="space-y-2.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  URL Website
                </label>
                {urlInput.startsWith('https://') && (
                  <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    <Check className="w-3 h-3" /> HTTPS
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://domain.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-2 px-3 text-sm text-slate-100 placeholder:text-slate-600 font-mono transition-colors outline-none"
                />
                {urlInput && (
                  <a
                    href={urlInput.startsWith('http') ? urlInput : `https://${urlInput}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2 top-1.5 px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors flex items-center gap-1"
                  >
                    <span>Uji</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {activeType === 'text' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Pesan Teks / Catatan QR
              </label>
              <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                {textInput.length} karakter
              </span>
            </div>
            <textarea
              rows={3}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Tuliskan teks, instruksi, nomor seri, atau memo rahasia di sini..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
            />
          </div>
        )}

        {activeType === 'wifi' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nama Wi-Fi (SSID)
              </label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="Contoh: Kafe_WiFi_5G"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Kata Sandi Wi-Fi
              </label>
              <input
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="Password jaringan"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Keamanan Jaringan
              </label>
              <select
                value={wifiAuth}
                onChange={(e) => setWifiAuth(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Umum)</option>
                <option value="WEP">WEP (Lama)</option>
                <option value="nopass">Tanpa Sandi (Terbuka)</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="wifi-hidden"
                checked={wifiHidden}
                onChange={(e) => setWifiHidden(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
              />
              <label htmlFor="wifi-hidden" className="text-xs text-slate-300 select-none cursor-pointer">
                Jaringan Tersembunyi (Hidden SSID)
              </label>
            </div>
          </div>
        )}

        {activeType === 'whatsapp' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nomor WhatsApp (dengan Kode Negara, tanpa + atau spasi)
              </label>
              <input
                type="text"
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
                placeholder="6281234567890"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Pesan Pembuka Otomatis (Opsional)
              </label>
              <textarea
                rows={2}
                value={waMessage}
                onChange={(e) => setWaMessage(e.target.value)}
                placeholder="Tuliskan salam atau format pemesanan..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </div>
          </div>
        )}

        {activeType === 'vcard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={vcardName}
                onChange={(e) => setVcardName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nomor Telepon</label>
              <input
                type="text"
                value={vcardPhone}
                onChange={(e) => setVcardPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={vcardEmail}
                onChange={(e) => setVcardEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nama Usaha / Perusahaan</label>
              <input
                type="text"
                value={vcardOrg}
                onChange={(e) => setVcardOrg(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Website Pribadi / Portofolio</label>
              <input
                type="url"
                value={vcardWebsite}
                onChange={(e) => setVcardWebsite(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono outline-none"
              />
            </div>
          </div>
        )}

        {activeType === 'email' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Alamat Email Tujuan</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subjek Email</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Isi Pesan Email</label>
              <textarea
                rows={2}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
