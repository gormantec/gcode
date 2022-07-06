/* Feature Name: Help Menu */

export const menuMetadata = { "id": "androidEmulator", "class": "pageLeftToolbarButton", "materialIcon": "android" };

export function menuAction() {
    console.log("Help");

    const filename = document.getElementById("filename").innerText.trim();
    const code = window.editor.getValue();
    var appName = code.replace(/\/\*.*?appName:.*?([A-Za-z0-9 ]*)[\n].*?\*\/.*/s, '$1');
    if (!appName || appName == code) appName = null;
    else appName=appName.trim();

    if (filename.endsWith(".mjs") && appName && window.myLoginID) {
        let html = '<div id="apple_alertdialog" class="alertdialog">' +
            '    <h3>Running in Apple XCode Emulator</h3>' +
            '    <pre>' +
            '<code id="apple_script" contenteditable spellcheck="false">#run in ios emulator' +
            'VM="iPhone XR"; \\' +
            'APPID=f00000000; \\' +
            'xcrun simctl boot $VM 2> /dev/null; \\' +
            'open /Applications/Xcode.app/Contents/Developer/\\' +
            'Applications/Simulator.app; \\' +
            'xcrun simctl terminate "${VM}" ~/Downloads/48ugm4xy6k.ipa; \\' +
            'xcrun simctl install "${VM}" ~/Downloads/48ugm4xy6k.ipa; \\' +
            'xcrun simctl launch "${VM}" com.gormantec.${APPID}' +
            '</code>' +
            '    </pre>' +
            '    <button type="button" id="apple_alertdonebutton" class="button">Done</button>' +
            '</div>' +
            '<div id="android_alertdialog" class="alertdialog">' +
            '    <h3>Running in Android Emulator</h3>' +
            '    <pre>' +
            '<code contenteditable spellcheck="false">#start emulator' +
            'ATOOLS=~/Library/Android/sdk/platform-tools; \\' +
            'nohup $ATOOLS/../emulator/emulator -avd Pixel_XL_API_24 \\' +
            '-netdelay none -netspeed full & </code>' +
            '<code id="android_script" contenteditable spellcheck="false">#load and start APK' +
            'APPID=f00000000; \\' +
            'ATOOLS=~/Library/Android/sdk/platform-tools; \\' +
            '$ATOOLS/adb install -r ~/Downloads/48ugm4xy6k.apk; \\' +
            '$ATOOLS/adb \\' +
            'shell am start -S -n \\' +
            'com.gormantec.${APPID}/\\' +
            'com.gormantec.${APPID}.MainActivity</code>' +
            '    </pre>' +
            '    <button type="button" id="android_alertdonebutton" class="button">Done</button>' +
            '</div>';

        let android_alertdialog = document.createElement("div");
        android_alertdialog.id = "android_alertdialog";
        android_alertdialog.className = "alertdialog";
        android_alertdialog.innerHTML = '    <h3>Running in Android Emulator</h3>' +
            '    <pre style="padding-left: 0px;border-left-width: 0px; ">' +
            '<code contenteditable spellcheck="false">#start emulator\n' +
            'EMUDIR=~/Library/Android/sdk/emulator; \\\n' +
            'PIXEL=$EMUDIR/emulator -list-avds | grep -m 1 Pixel; \\\n' +
            'nohup $EMUDIR/emulator -avd ${PIXEL} \\\n' +
            '-netdelay none -netspeed full & </code>' +
            '<code id="android_script" contenteditable spellcheck="false">#load and start APK\n' +
            'APPID='+window.myLoginID+'-'+appName.replace(/ /g,"-")+'; \\\n' +
            'APPNAME="'+appName+'"; \\\n' +
            'PWAURI="https://gcode.com.au/apps"; \\' +
            'wget $PWAURL/$APPID/apk/${APPNAME}.apk; \\\n' +
            'ATOOLS=~/Library/Android/sdk/platform-tools; \\\n' +
            '$ATOOLS/adb install -r ./${APPNAME}.apk; \\\n' +
            '$ATOOLS/adb \\\n' +
            'shell am start -S -n \\\n' +
            'au.com.gcode.${APPID}/\\\n' +
            'au.com.gcode.${APPID}.LauncherActivity</code>' +
            '    </pre>' +
            '    <button type="button" id="android_alertdonebutton" onclick="document.getElementById(\'android_alertdialog\').remove();" class="button">Done</button>';
        document.body.appendChild(android_alertdialog);
        android_alertdialog.style.display = "block";
    }




}