
// ==UserScript==
// @name         Auto Select Responses
// @namespace    https://github.com/YOUR-USERNAME
// @version      0.0.1
// @description  Automatically selects Yes, Demonstrated, Pass, and Miles responses on demand
// @author       The Wizard
// @match        https://learn.amazon.com/tasks/*/*
// @updateURL    https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/main/auto-select.user.js
// @downloadURL  https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/main/auto-select.user.js
//
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
    'use strict';

    const keywords = [
        'yes',
        'demonstrated',
        'pass',
        'miles'
    ];

    let running = false;


    /*
     * ------------------------------------------------------------
     * Toast Notification
     * ------------------------------------------------------------
     */

    function showToast(message, duration = 2500) {

        const existing = document.getElementById('tm-auto-toast');

        if (existing) {
            existing.remove();
        }

        const toast = document.createElement('div');

        toast.id = 'tm-auto-toast';
        toast.textContent = message;

        Object.assign(toast.style, {
            position: 'fixed',
            top: '25px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '9999999',
            padding: '14px 24px',
            background: 'rgba(30, 30, 30, 0.96)',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
            cursor: 'pointer',
            opacity: '1',
            transition: 'opacity 0.3s ease'
        });

        document.body.appendChild(toast);


        /*
         * Click toast to dismiss immediately
         */

        toast.addEventListener('click', () => {
            toast.remove();
        });


        /*
         * Automatically dismiss after timeout
         */

        setTimeout(() => {

            if (toast.isConnected) {

                toast.style.opacity = '0';

                setTimeout(() => {

                    if (toast.isConnected) {
                        toast.remove();
                    }

                }, 300);
            }

        }, duration);
    }


    /*
     * ------------------------------------------------------------
     * Main Auto Select Function
     * ------------------------------------------------------------
     */

    async function runAutoSelect() {

        if (running) {

            showToast(
                'Auto-Select is already running.',
                2000
            );

            return;
        }

        running = true;

        let count = 0;

        const button =
            document.getElementById('tm-auto-select-button');


        /*
         * Visual start notification
         */

        showToast(
            '▶ Auto-Select started...',
            1800
        );


        /*
         * Update floating button
         */

        if (button) {

            button.textContent = 'Running...';
            button.disabled = true;
            button.style.cursor = 'wait';
            button.style.opacity = '0.7';
        }


        console.log(
            '[Auto-Select] Started.'
        );


        try {

            while (true) {

                const next = [
                    ...document.querySelectorAll(
                        'input[type="radio"], button'
                    )
                ].find(el => {

                    const value = (
                        el.value ||
                        el.textContent ||
                        ''
                    )
                        .toLowerCase()
                        .trim();

                    return (
                        keywords.includes(value) &&
                        !el.checked
                    );
                });


                /*
                 * Nothing else found
                 */

                if (!next) {
                    break;
                }


                /*
                 * Click matching element
                 */

                next.click();

                count++;


                /*
                 * Small delay so the page can react
                 */

                await new Promise(resolve => {
                    setTimeout(resolve, 25);
                });
            }


            /*
             * Finished notification
             */

            showToast(
                `✓ Complete — ${count} response${count === 1 ? '' : 's'} selected`,
                3500
            );


            console.log(
                `[Auto-Select] Finished. ${count} response${count === 1 ? '' : 's'} selected.`
            );

        } catch (error) {

            console.error(
                '[Auto-Select] Error:',
                error
            );


            showToast(
                '⚠ Auto-Select encountered an error.',
                4000
            );

        } finally {

            running = false;


            /*
             * Restore button
             */

            if (button) {

                button.textContent =
                    'Run Auto-Select';

                button.disabled = false;
                button.style.cursor = 'pointer';
                button.style.opacity = '1';
            }
        }
    }


    /*
     * ------------------------------------------------------------
     * Floating Button
     * ------------------------------------------------------------
     */

    function createButton() {

        /*
         * Prevent duplicate buttons
         */

        if (
            document.getElementById(
                'tm-auto-select-button'
            )
        ) {
            return;
        }


        const button =
            document.createElement('button');

        button.id =
            'tm-auto-select-button';

        button.textContent =
            'Run Auto-Select';


        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '999999',
            padding: '10px 16px',
            background: '#222',
            color: '#fff',
            border: '1px solid #888',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.35)'
        });


        button.title =
            'Run Auto-Select\nAlt + Shift + A';


        button.addEventListener(
            'click',
            runAutoSelect
        );


        document.body.appendChild(
            button
        );
    }


    /*
     * ------------------------------------------------------------
     * Keyboard Shortcut
     *
     * ALT + SHIFT + A
     * ------------------------------------------------------------
     */

    document.addEventListener(
        'keydown',
        event => {

            if (
                event.altKey &&
                event.shiftKey &&
                event.key.toLowerCase() === 'a'
            ) {

                event.preventDefault();

                runAutoSelect();
            }
        }
    );


    /*
     * ------------------------------------------------------------
     * Tampermonkey Menu Command
     * ------------------------------------------------------------
     */

    GM_registerMenuCommand(
        'Run Auto-Select',
        runAutoSelect
    );


    /*
     * ------------------------------------------------------------
     * Initialize Button
     * ------------------------------------------------------------
     */

    if (document.body) {

        createButton();

    } else {

        window.addEventListener(
            'DOMContentLoaded',
            createButton
        );
    }

})();
