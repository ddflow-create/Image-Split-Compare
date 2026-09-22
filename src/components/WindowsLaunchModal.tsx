import React, { useState } from 'react';
import { 
  X, 
  Monitor, 
  Download, 
  Terminal, 
  RefreshCw, 
  CheckCircle2, 
  Boxes, 
  Sparkles,
  Zap,
  Globe,
  Server,
  Github
} from 'lucide-react';
import { AppLanguage, AppTheme } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { THEMES } from '../utils/theme';

interface WindowsLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  theme: AppTheme;
}

export const WindowsLaunchModal: React.FC<WindowsLaunchModalProps> = ({ 
  isOpen, 
  onClose,
  language,
  theme
}) => {
  const [activeTab, setActiveTab] = useState<'local' | 'electron' | 'build' | 'update'>('local');

  if (!isOpen) return null;

  const t = TRANSLATIONS[language];
  const themeStyles = THEMES[theme];

  return (
    <div className={`fixed inset-0 z-[100] ${themeStyles.modalBackdrop} flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200`}>
      <div className={`relative w-full max-w-3xl ${themeStyles.modalCard} rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border ${themeStyles.border} animate-in zoom-in-95 duration-200`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 sm:p-5 border-b ${themeStyles.border} bg-black/5 dark:bg-white/5`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-inner">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${themeStyles.textPrimary}`}>
                {language === 'ru' ? 'Справка: Запуск и Компиляция' : 'Help: Run & Compile'}
              </h2>
              <p className={`text-xs ${themeStyles.textSecondary} mt-0.5`}>
                {language === 'ru' ? 'Скрипты, Electron, LAN и Деплой' : 'Scripts, Electron, LAN & Deploy'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border ${themeStyles.border} ${themeStyles.panelSub} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex items-center gap-1 p-3 border-b ${themeStyles.border} overflow-x-auto shrink-0 scrollbar-hide`}>
          <button
            onClick={() => setActiveTab('local')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'local'
                ? `${themeStyles.buttonActive} shadow-sm`
                : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>{language === 'ru' ? 'Локально (Скрипты)' : 'Local (Scripts)'}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('electron')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'electron'
                ? `${themeStyles.buttonActive} shadow-sm`
                : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>{language === 'ru' ? 'Electron (EXE/DMG)' : 'Electron (EXE/DMG)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('build')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'build'
                ? `${themeStyles.buttonActive} shadow-sm`
                : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
            }`}
          >
            <Server className="w-4 h-4" />
            <span>{language === 'ru' ? 'Сборка и LAN' : 'Build & LAN'}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('update')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'update'
                ? `${themeStyles.buttonActive} shadow-sm`
                : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'ru' ? 'Деплой и Обновление' : 'Deploy & Update'}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* TAB 1: LOCAL OS */}
          {activeTab === 'local' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${themeStyles.panelSub} border ${themeStyles.border}`}>
                <h3 className={`text-sm font-bold ${themeStyles.textPrimary} mb-2 flex items-center gap-2`}>
                  <Zap className="w-4 h-4 text-blue-500" />
                  {language === 'ru' ? 'Быстрый локальный запуск' : 'Quick local launch'}
                </h3>
                <p className={`text-xs ${themeStyles.textSecondary} leading-relaxed mb-4`}>
                  {language === 'ru'
                    ? 'Для быстрого запуска без ручного ввода команд в терминале вы можете использовать скрипты для Windows (.bat) и macOS/Linux (.sh). Эти скрипты автоматически скачают зависимости (npm install) и запустят сервер разработчика (npm run dev).'
                    : 'For quick launch without manual terminal commands, use the provided scripts for Windows (.bat) and macOS/Linux (.sh). These scripts will automatically install dependencies and start the dev server.'}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-black/10 dark:bg-black/30 border border-zinc-500/20 rounded-lg">
                    <h4 className="text-xs font-bold mb-2">Windows (.bat)</h4>
                    <pre className="text-[10px] font-mono text-blue-400 mb-2">start.bat</pre>
                    <pre className="text-[10px] font-mono opacity-80 whitespace-pre-wrap">@echo off
:: Install dependencies and start local dev server
npm install
npm run dev</pre>
                  </div>
                  <div className="p-3 bg-black/10 dark:bg-black/30 border border-zinc-500/20 rounded-lg">
                    <h4 className="text-xs font-bold mb-2">macOS / Linux (.sh)</h4>
                    <pre className="text-[10px] font-mono text-emerald-400 mb-2">start.sh</pre>
                    <pre className="text-[10px] font-mono opacity-80 whitespace-pre-wrap">#!/bin/bash
# Install dependencies and start local dev server
npm install
npm run dev</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ELECTRON */}
          {activeTab === 'electron' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${themeStyles.panelSub} border ${themeStyles.border}`}>
                <h3 className={`text-sm font-bold ${themeStyles.textPrimary} mb-2 flex items-center gap-2`}>
                  <Boxes className="w-4 h-4 text-purple-500" />
                  {language === 'ru' ? 'Сборка через Electron' : 'Electron Build'}
                </h3>
                <p className={`text-xs ${themeStyles.textSecondary} leading-relaxed mb-3`}>
                  {language === 'ru'
                    ? 'Приложение можно упаковать как автономную настольную программу. Для этого вам понадобится установить Electron и Electron Builder.'
                    : 'The app can be packaged as a standalone desktop application using Electron and Electron Builder.'}
                </p>
                <ol className={`text-xs ${themeStyles.textSecondary} list-decimal ml-4 space-y-2`}>
                  <li>{language === 'ru' ? 'Установите зависимости: ' : 'Install deps: '} <code className="bg-black/20 px-1 py-0.5 rounded text-purple-400">npm i -D electron electron-builder wait-on concurrently</code></li>
                  <li>{language === 'ru' ? 'Создайте файл ' : 'Create '} <code className="bg-black/20 px-1 py-0.5 rounded text-blue-400">main.js</code> {language === 'ru' ? ' для Electron, который будет загружать локальный сервер или скомпилированные файлы.' : ' to load the app.'}</li>
                  <li>{language === 'ru' ? 'Добавьте в package.json:' : 'Add to package.json:'}
                    <pre className="mt-2 p-2 bg-black/80 rounded border border-zinc-700/50 text-[10px] text-green-400 overflow-x-auto">
{`"main": "main.js",
"scripts": {
  "electron:dev": "concurrently \\"npm run dev\\" \\"wait-on http://localhost:3000 && electron .\\"",
  "electron:build": "npm run build && electron-builder"
}`}
                    </pre>
                  </li>
                  <li>{language === 'ru' ? 'Соберите приложение командой ' : 'Build using '} <code className="bg-black/20 px-1 py-0.5 rounded">npm run electron:build</code></li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: BUILD & LAN */}
          {activeTab === 'build' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${themeStyles.panelSub} border ${themeStyles.border}`}>
                <h3 className={`text-sm font-bold ${themeStyles.textPrimary} mb-2 flex items-center gap-2`}>
                  <Server className="w-4 h-4 text-emerald-500" />
                  {language === 'ru' ? 'Компиляция и доступ по сети (LAN)' : 'Compile & LAN Access'}
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold mb-1">{language === 'ru' ? '1. Правильная компиляция' : '1. Proper compilation'}</h4>
                    <p className={`text-xs ${themeStyles.textSecondary} mb-1`}>
                      {language === 'ru' ? 'Скомпилируйте приложение для продакшена (оптимизация кода):' : 'Compile the app for production:'}
                    </p>
                    <code className="text-[10px] bg-black/20 px-2 py-1 rounded border border-zinc-700/50 text-blue-400 block w-fit">npm run build</code>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold mb-1">{language === 'ru' ? '2. Локальный сервер (Preview)' : '2. Local Preview'}</h4>
                    <p className={`text-xs ${themeStyles.textSecondary} mb-1`}>
                      {language === 'ru' ? 'Для проверки скомпилированного кода используйте:' : 'To test compiled code:'}
                    </p>
                    <code className="text-[10px] bg-black/20 px-2 py-1 rounded border border-zinc-700/50 text-emerald-400 block w-fit">npm run preview</code>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold mb-1">{language === 'ru' ? '3. Доступ по локальной сети' : '3. LAN Access (Mobile devices)'}</h4>
                    <p className={`text-xs ${themeStyles.textSecondary} mb-1`}>
                      {language === 'ru' ? 'Чтобы открыть приложение на телефоне или планшете в той же Wi-Fi сети, запустите dev-сервер с флагом host:' : 'To access from mobile on same Wi-Fi:'}
                    </p>
                    <code className="text-[10px] bg-black/20 px-2 py-1 rounded border border-zinc-700/50 text-amber-400 block w-fit">npm run dev -- --host</code>
                    <p className={`text-xs ${themeStyles.textSecondary} mt-1 opacity-80`}>
                      {language === 'ru' ? 'Vite покажет IP-адрес вашей машины (например: http://192.168.0.10:3000).' : 'Vite will output your network IP (e.g. http://192.168.0.10:3000).'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEPLOY & UPDATE */}
          {activeTab === 'update' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${themeStyles.panelSub} border ${themeStyles.border}`}>
                <h3 className={`text-sm font-bold ${themeStyles.textPrimary} mb-2 flex items-center gap-2`}>
                  <Globe className="w-4 h-4 text-amber-500" />
                  {language === 'ru' ? 'Сборка, Деплой и Github' : 'Deploy & Github'}
                </h3>
                <p className={`text-xs ${themeStyles.textSecondary} leading-relaxed mb-4`}>
                  {language === 'ru'
                    ? 'Чтобы легко делиться приложением с коллегами или настроить систему автообновлений (в случае с Electron), рекомендуется опубликовать код на Github.'
                    : 'To easily share the app or setup auto-updates, publish the code to Github.'}
                </p>
                <ul className={`text-xs ${themeStyles.textSecondary} list-disc ml-4 space-y-2`}>
                  <li>
                    <span className="font-bold">{language === 'ru' ? 'Деплой (Vercel / Netlify / Github Pages)' : 'Web Deploy'}</span>
                    <p className="mt-0.5 opacity-80">
                      {language === 'ru' ? 'Запуште код в репозиторий Github. Подключите репозиторий к Vercel или Netlify. Платформа сама определит настройки Vite и развернет приложение онлайн при каждом коммите.' : 'Push to Github, connect Vercel/Netlify for auto-deploy on commit.'}
                    </p>
                  </li>
                  <li>
                    <span className="font-bold text-blue-400">{language === 'ru' ? 'Обновление настольной версии (Electron Updater)' : 'Desktop Auto-Update'}</span>
                    <p className="mt-0.5 opacity-80">
                      {language === 'ru' ? 'Настройте Github Releases. Добавьте пакет electron-updater. При запуске приложение будет проверять наличие нового тега релиза на Github, скачивать его и автоматически применять обновление.' : 'Configure Github Releases with electron-updater to fetch new versions automatically.'}
                    </p>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2">
                  <Github className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-blue-400">
                    {language === 'ru' ? 'Для работы обновлений код должен быть на Github.' : 'Code must be on Github for auto-updates to work.'}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
