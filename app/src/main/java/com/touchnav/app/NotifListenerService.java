package com.touchnav.app;

import android.content.Intent;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;

public class NotifListenerService extends NotificationListenerService {

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        broadcastCount();
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        broadcastCount();
    }

    private void broadcastCount() {
        int count = 0;
        try {
            StatusBarNotification[] active = getActiveNotifications();
            if (active != null) {
                for (StatusBarNotification sbn : active) {
                    // Kendi bildirimlerimizi sayma
                    if (!sbn.getPackageName().equals(getPackageName())) {
                        count++;
                    }
                }
            }
        } catch (Exception ignored) {}

        Intent i = new Intent(FloatingService.ACTION_NOTIF_UPDATE);
        i.setPackage(getPackageName());
        i.putExtra("count", count);
        sendBroadcast(i);
    }
}
