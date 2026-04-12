package com.touchnav.app;

import android.accessibilityservice.AccessibilityService;
import android.content.Intent;
import android.graphics.Rect;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityWindowInfo;

import java.util.List;

public class NavService extends AccessibilityService {

    private static NavService instance;
    public static NavService getInstance() { return instance; }

    private boolean keyboardWasVisible = false;

    @Override
    public void onServiceConnected() {
        instance = this;
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        int type = event.getEventType();

        if (type == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
                || type == AccessibilityEvent.TYPE_WINDOWS_CHANGED) {

            if (type == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
                    && event.getPackageName() != null) {
                // Pencere değişimini FloatingService'e bildir (otomatik gizle)
                Intent i = new Intent("com.touchnav.WINDOW_CHANGED");
                i.setPackage(getPackageName()); // Android 12+ için zorunlu
                i.putExtra("package", event.getPackageName().toString());
                sendBroadcast(i);
            }

            detectKeyboard();
        }
    }

    /**
     * Pencere listesinde TYPE_INPUT_METHOD var mı?
     * Varsa klavye yüksekliğini (kb_height) broadcast'a ekler.
     * setPackage() olmadan Android 12+'de broadcast sessizce düşer.
     */
    private void detectKeyboard() {
        boolean kbVisible = false;
        int kbHeight = 0;
        try {
            List<AccessibilityWindowInfo> windows = getWindows();
            if (windows != null) {
                for (AccessibilityWindowInfo w : windows) {
                    if (w.getType() == AccessibilityWindowInfo.TYPE_INPUT_METHOD) {
                        kbVisible = true;
                        Rect bounds = new Rect();
                        w.getBoundsInScreen(bounds);
                        kbHeight = bounds.height();
                        break;
                    }
                }
            }
        } catch (Exception ignored) {}

        if (kbVisible != keyboardWasVisible) {
            keyboardWasVisible = kbVisible;
            Intent i = new Intent(kbVisible
                ? FloatingService.ACTION_KEYBOARD_SHOW
                : FloatingService.ACTION_KEYBOARD_HIDE);
            i.setPackage(getPackageName()); // kritik: Android 12+
            if (kbVisible && kbHeight > 0) {
                i.putExtra("kb_height", kbHeight);
            }
            sendBroadcast(i);
        }
    }

    @Override
    public void onInterrupt() {}

    @Override
    public void onDestroy() {
        instance = null;
        super.onDestroy();
    }

    public void doAction(int action) {
        switch (action) {
            case SettingsManager.ACTION_BACK:
                performGlobalAction(GLOBAL_ACTION_BACK); break;
            case SettingsManager.ACTION_FORWARD:
                performGlobalAction(GLOBAL_ACTION_BACK); break;
            case SettingsManager.ACTION_HOME:
                performGlobalAction(GLOBAL_ACTION_HOME); break;
            case SettingsManager.ACTION_RECENTS:
                performGlobalAction(GLOBAL_ACTION_RECENTS); break;
            case SettingsManager.ACTION_NOTIFICATIONS:
                performGlobalAction(GLOBAL_ACTION_NOTIFICATIONS); break;
            case SettingsManager.ACTION_APP_DRAWER:
                openAppDrawer(); break;
        }
    }

    private void openAppDrawer() {
        Intent i = new Intent(Intent.ACTION_MAIN);
        i.addCategory(Intent.CATEGORY_HOME);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(i);
    }
}
