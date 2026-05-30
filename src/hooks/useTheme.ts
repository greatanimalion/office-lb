import { useState, useEffect, useCallback } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

const isSystemDarkMode = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

export const useTheme = () => {
    const [mode, setMode] = useState<ThemeMode>(() => {
        const savedMode = localStorage.getItem('themeMode');
        return (savedMode as ThemeMode) || 'system';
    });
    const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
    const updateEffectiveTheme = useCallback(() => {
        if (mode === 'system') {
            setEffectiveTheme(isSystemDarkMode() ? 'dark' : 'light');
        } else {
            setEffectiveTheme(mode);
        }
    }, [mode]);
    useEffect(() => {
        if (effectiveTheme === 'dark') {
            document.documentElement.style.setProperty('--scroll-thumb', '#595959');
            document.documentElement.style.setProperty('--scroll-bg', '#262626');
        } else {
            document.documentElement.style.setProperty('--scroll-thumb', '#d9d9d9');
            document.documentElement.style.setProperty('--scroll-bg', '#f5f5f5');
        }
    }, [effectiveTheme]);
    useEffect(() => {
        updateEffectiveTheme();
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    // 监听系统主题变化
    useEffect(() => {
        if (mode !== 'system') return;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => updateEffectiveTheme();
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [mode]);

    const changeMode = (newMode: ThemeMode) => {
        setMode(newMode);
    };

    return { mode, effectiveTheme, changeMode };
};