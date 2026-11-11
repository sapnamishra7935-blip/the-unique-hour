THE UNIQUE HOUR PRO — ANDROID TERMUX SETUP

WHAT THIS VERSION DOES
- Premium black/red/white gaming cafe website.
- Mobile responsive.
- Game catalogue and ₹40/hour starting rate.
- WhatsApp booking link (configure your WhatsApp number).
- Customer demo login (saved only in this browser).
- Admin PIN demo dashboard (default PIN 2468; change it immediately).
- Start/end gaming sessions with countdown timers.
- Session history and simple recorded revenue.
- Editable hourly rate, cafe address, Maps link, WhatsApp number and station list.
- Local browser storage and basic offline cache.

IMPORTANT LIMITATION
This is a static/offline-first starter. Customer login, admin PIN, bookings and session records are stored in the visitor's browser, not in a shared secure database. The admin PIN is NOT secure authentication. Do not use this version for real payment processing or sensitive customer information. A production multi-device system needs a backend, database, secure authentication and server-side session logic.

TERMUX INSTALL
1. Install Termux from a trusted source (F-Droid or the official Termux GitHub).
2. Open Termux and run:
   pkg update -y && pkg upgrade -y
   pkg install python unzip -y
3. Allow storage access if you want to access Downloads:
   termux-setup-storage
4. Put the ZIP in your phone's Download folder.
5. Run:
   mkdir -p ~/unique-hour
   cp ~/storage/downloads/THE_UNIQUE_HOUR_PRO.zip ~/unique-hour/
   cd ~/unique-hour
   unzip -o THE_UNIQUE_HOUR_PRO.zip
6. Start the local website:
   python -m http.server 8080
7. Open Chrome and visit:
   http://127.0.0.1:8080

STOP SERVER
Press CTRL + C in Termux.

EDIT THE WEBSITE
Edit files inside ~/unique-hour:
- index.html = website content
- styles.css = design and colours
- app.js = settings, games, bookings and session timer

ADMIN SETUP
1. Open website.
2. Tap ADMIN at the bottom.
3. Default demo PIN: 2468.
4. Open Settings.
5. Enter WhatsApp number with country code, e.g. 91 followed by the number.
6. Set hourly rate, current address, Google Maps link and station names.
7. Change the admin PIN and save.
8. Export a JSON backup regularly.

FREE HOSTING
For a public website, upload these website files to a static host such as GitHub Pages or Cloudflare Pages. Create an account, make a repository/project, upload the extracted files and enable deployment. Hosting provider interfaces and terms can change. The static version will be public, but local admin records will NOT sync between devices.

NEXT PRODUCTION UPGRADE
For real customer accounts, shared reservations, secure admin roles and synced timers, add a backend/database (for example Supabase) and server-side access rules. Do not expose secret API keys in app.js.
