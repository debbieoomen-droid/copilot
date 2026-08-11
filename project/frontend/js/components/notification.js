/**
 * components/notification.js
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  Lab 1 – NotificationBanner                                       ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  The stub below exports a `showNotification(message, type)`       ║
 * ║  function.  Currently it does nothing.                             ║
 * ║                                                                    ║
 * ║  Your task (with GitHub Copilot):                                  ║
 * ║  1. Create a banner <div> with the correct CSS classes             ║
 * ║     (see variables.css – use .notification and .notification--     ║
 * ║      {success|error|warning|info})                                 ║
 * ║  2. Append it to #notification-area in index.html                  ║
 * ║  3. Auto-dismiss after 4 seconds                                   ║
 * ║  4. Add a close (×) button that dismisses immediately              ║
 * ║  5. Animate in and out (CSS transition or animation)               ║
 * ║                                                                    ║
 * ║  Hint: ask Copilot                                                  ║
 * ║    "Implement showNotification using the DOM API.                  ║
 * ║     The banner should auto-dismiss after 4 seconds with a          ║
 * ║     slide-in animation using the .notification CSS classes."       ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

/**
 * Display a notification banner inside #notification-area.
 *
 * @param {string} message - The text to display.
 * @param {'success' | 'error' | 'warning' | 'info'} [type='info'] - Banner type.
 * @returns {void}
 *
 * TODO Lab 1: Implement this function.
 */
export function showNotification(message, type = 'info') {
  // TODO: implement notification banner
  // Remove this console.log once you have a real implementation.
  console.log(`[Notification – ${type}] ${message}`);
}
