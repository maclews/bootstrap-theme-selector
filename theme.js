/**
 * @copyright Copyright (c) 2024 Maciej Lewandowski
 * @author Maciej Lewandowski <mac.lewandowski@outlook.com>
 * @version 1.0
 * @license AGPL-3.0
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const changeThemeEvent = new Event('changed.bs.theme');
    
    const themeSelectBtn = document.getElementById('theme-selector');
    const themeOptions = document.querySelectorAll('[data-bs-theme-value]');
    const themeSelectBtnIcons = document.querySelectorAll('.theme-select-icon');

    const getLocalStorageThemeValue = () => {
        let ls = localStorage.getItem('theme');
        return (ls == undefined || ls == 'undefined') ? 'auto' : ls;    // prevent `undefined` from breaking functionality
    };
    const setLocalStorageThemeValue = val => localStorage.setItem('theme', val);
    const getBrowserPrefferedTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    /**
     * Checks if theme is defined in data attrbute in source.
     * On failure falls back to browser preference.
     * @returns light|dark|auto
     */
    const getThemeFromDOM = () => {
        if (!!document.documentElement.dataset.bsTheme) {
            updateThemeSelectBtn(document.documentElement.dataset.bsTheme);
            return document.documentElement.dataset.bsTheme;
        } else {
            return getBrowserPrefferedTheme();
        }
    };

    /**
     * Check LocalStorage if theme was previously selected
     * @returns light|dark
     */
    const getThemeFromLocalStorage = () => {
        const storedTheme = getLocalStorageThemeValue();
        if (storedTheme) return storedTheme;
        else return getThemeFromDOM();
    };

    const setTheme = val => {
        let t = getThemeFromLocalStorage();
        let theme = (t === 'auto') ? getBrowserPrefferedTheme() : t;
        document.documentElement.setAttribute('data-bs-theme', theme);
        updateThemeSelectBtn(val);
        window.dispatchEvent(changeThemeEvent);
    };

    const updateThemeSelectBtn = val => {
        if (!!themeSelectBtn) {
            themeOptions.forEach(el => {
                if (el.dataset.bsThemeValue == val) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            });
            themeSelectBtnIcons.forEach(el => {
                if (el.id == `theme-icon-${val}`) {
                    el.classList.remove('d-none');
                } else {
                    el.classList.add('d-none');
                }
            });
        }
    };

    setTheme(getThemeFromLocalStorage());

    if (!document.documentElement.dataset.bsTheme) {
        setLocalStorageThemeValue('auto');
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        setTheme(getThemeFromLocalStorage());
    });

    themeOptions?.forEach(el => {
        el.addEventListener('click', e => {
            setLocalStorageThemeValue(e.target.dataset.bsThemeValue);
            setTheme(e.target.dataset.bsThemeValue);
        });
    });
});
