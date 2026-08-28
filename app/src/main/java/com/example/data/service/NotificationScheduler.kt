package com.example.data.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat

class NotificationScheduler(private val context: Context) {

    companion object {
        const val CHANNEL_PRAYER = "channel_prayer_times"
        const val CHANNEL_ADHKAR = "channel_adhkar"
    }

    init {
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val prayerChannel = NotificationChannel(
                CHANNEL_PRAYER,
                "مواقيت الصلاة والأذان",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "تنبيهات دخول أوقات الصلاة"
                enableVibration(true)
            }

            val adhkarChannel = NotificationChannel(
                CHANNEL_ADHKAR,
                "الأذكار والتنبيهات اليومية",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "تذكير أذكار الصباح والمساء والصلاة على النبي ﷺ"
            }

            val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(prayerChannel)
            manager.createNotificationChannel(adhkarChannel)
        }
    }

    fun showImmediateNotification(title: String, message: String, isPrayer: Boolean = false) {
        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = if (isPrayer) CHANNEL_PRAYER else CHANNEL_ADHKAR

        val builder = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(if (isPrayer) NotificationCompat.PRIORITY_HIGH else NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)

        manager.notify((System.currentTimeMillis() % 100000).toInt(), builder.build())
    }
}
