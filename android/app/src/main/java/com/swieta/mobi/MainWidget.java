package com.swieta.mobi;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
/**
 * Implementation of App Widget functionality.
 */
public class MainWidget extends AppWidgetProvider {

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        // Odczyt danych zapisanych przez Capacitor (Preferences)
        // Capacitor domyślnie dodaje prefix "_" do kluczy
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        String day = prefs.getString("widget_day", "--");
        String month = prefs.getString("widget_month", "Brak danych");
        String names = prefs.getString("widget_names", "Imieniny...");
        String holiday = prefs.getString("widget_holiday", "");

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.main_widget);
        views.setTextViewText(R.id.widget_day, day);
        views.setTextViewText(R.id.widget_month, month);
        views.setTextViewText(R.id.widget_names, "Imieniny: " + names);
        views.setTextViewText(R.id.widget_holiday, holiday);

        // Po kliknięciu w widżet otwiera się aplikacja
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_day, pendingIntent); // Zmień na główny kontener jeśli trzeba

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}