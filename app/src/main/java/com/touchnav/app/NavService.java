package com.touchnav.app;

import android.accessibilityservice.AccessibilityService;
import android.content.Intent;
import android.graphics.Rect;
import android.os.Handler;
import android.os.Looper;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityWindowInfo;

import java.util.List;

public class NavService extends AccessibilityService {

    private static NavService instance;
    public static NavService getInstance() { return instance; }

    private boolean keyboardWasVisible = false;

    // getWindows() pahalı bir binder çağrısı; sık tetiklenen olayları 150ms debounce ile birleştir.
    private final Handler kbHandler = new Handler(Looper.getMainLooper());
    private Runnable detectRunnable = null;

    @Override
    public void onServiceConnected() {
        instance = this;
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        int type = event.getEventType();

        // Paket değişimi bildirimi: yalnızca WINDOW_STATE_CHANGED, paket adı zorunlu
        if (type == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
                && event.getPackageName() != null) {
            Intent i = new Intent("com.touchnav.WINDOW_CHANGED");
            i.setPackage(getPackageName());
            i.putExtra("package", event.getPackageName().toString());
            sendBroadcast(i);
        }

        // Klavye tespiti: WINDOWS_CHANGED pencere ekleme/kaldırma için,
        // WINDOW_STATE_CHANGED ise içerik değişimi için tetiklenir.
        // getWindows() yalnızca WINDOWS_CHANGED'da çağrılır + debounce.
        if (type == AccessibilityEvent.TYPE_WINDOWS_CHANGED) {
            scheduleDetectKeyboard();
        }
    }

    private void scheduleDetectKeyboard() {
        if (detectRunnable != null) kbHandler.removeCallbacks(detectRunnable);
        detectRunnable = this::detectKeyboard;
        // 150ms: klavye animasyonu tamamlanır, getWindows() doğru yükseklik verir
        kbHandler.postDelayed(detectRunnable, 150);
    }

    /**
     * Pencere listesinde TYPE_INPUT_METHOD var mı?
     * kb_height: klavye yüksekliği (px)
     * kb_top:    klavyenin ekran üstünden başladığı Y (px) — pozisyon hesabı için kritik
     */
    private void detectKeyboard() {
        boolean kbVisible = false;
        int kbHeight = 0;
        int kbTop = 0;
        try {
            List<AccessibilityWindowInfo> windows = getWindows();
            if (windows != null) {
                for (AccessibilityWindowInfo w : windows) {
                    if (w.getType() == AccessibilityWindowInfo.TYPE_INPUT_METHOD) {
                        Rect bounds = new Rect();
                        w.getBoundsInScreen(bounds);
                        // Yükseklik sıfırsa klavye henüz ölçülmedi; görünmez say
                        if (bounds.height() > 0) {
                            kbVisible = true;
                            kbHeight  = bounds.height();
                            kbTop     = bounds.top;
                        }
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
            i.setPackage(getPackageName());
            if (kbVisible) {
                i.putExtra("kb_height", kbHeight);
                i.putExtra("kb_top",    kbTop);
            }
            sendBroadcast(i);
        }
    }

    @Override
    public void onInterrupt() {}

    @Override
    public void onDestroy() {
        kbHandler.removeCallbacksAndMessages(null);
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
