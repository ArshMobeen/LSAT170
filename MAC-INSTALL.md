# Angel's 170 for MacBook

This is a source build kit, not a finished Mac installer. Build it on macOS to produce DMG installers and application ZIPs for Apple Silicon and Intel. Building needs internet and Node.js 22 or newer.

## Build on a Mac

1. Extract this kit into a folder on the Mac.
2. Install Node.js 22 or newer from https://nodejs.org if it is not installed.
3. Open Terminal, type `cd `, drag the extracted folder into the window, and press Return.
4. Run `bash "Build for Mac.command"`.
5. When the build finishes, the `release` folder opens. Use the `arm64.dmg` for Apple Silicon (M-series) or `x64.dmg` for Intel. Check Apple menu > About This Mac if unsure.
6. Open the DMG and drag Angels 170 to Applications. Eject the DMG and launch the copy in Applications.

The build script uses local ad-hoc signing. It does not provide an Apple Developer identity or Apple notarization. macOS may require approval in System Settings > Privacy & Security when opening a downloaded build. For normal public distribution without that approval, build with a Developer ID Application certificate and notarization credentials on a Mac. Do not disable Gatekeeper.

## Build using GitHub

The included `.github/workflows/mac-build.yml` builds the same installers on a macOS runner. Put the source in your chosen repository, open Actions > Build Mac installers > Run workflow, then download the resulting artifact. No repository has been created or uploaded by this kit. Usage may count toward the repository's Actions allowance.

## Your saved information

Study logs, journal writing, tomorrow's plans, scores, daily plans, question reviews, personal notes, saved quotes, uploaded photos and settings automatically persist locally. They survive normal app quit and reopen. They are not stored inside the app bundle, and replacing the app with an update using the same app name preserves the profile.

Desktop storage is Chromium localStorage in the app's user profile, normally:

- Mac: `~/Library/Application Support/Angels 170/Local Storage/leveldb`
- Windows: `%APPDATA%\Angels 170\Local Storage\leveldb`
- Development (`npm run desktop`) may use `angels-170` as its profile name. Browser previews store data in that browser's site storage for the preview address.

The main localStorage key is `angel170`. An unfinished focus session and its intention use `angel170-focus`; they checkpoint every second and on normal page exit. Reopening restores the timer paused, so time away is not counted as study time. An abrupt power loss can lose the most recent checkpoint. Use Finish & save to add recovered minutes to the study log.

Browser, Windows and Mac profiles are separate. To transfer saved records, choose Settings & backup > Export backup in the existing app, then Restore backup on the Mac. The backup includes logged records and preferences; the unfinished timer is local to each installation. Reset-room effects and disposable vent writing remain temporary unless explicitly saved as an image.

Deleting the profile, clearing browser site data, disk failure or changing computers does not preserve local data automatically. Keep exported JSON backups somewhere you control. Storage errors are shown in the app. There is no cloud synchronization.

## Verification on the Mac

Before relying on the app, log a short session, write a journal sentence, quit with Command-Q and reopen. Confirm both are present. Also check fullscreen, color flow, backup export/restore and the timer's paused recovery. Native Mac execution has not been tested from the Windows development machine.

References: https://www.electronjs.org/docs/latest/api/app and https://www.electronjs.org/docs/latest/tutorial/code-signing
