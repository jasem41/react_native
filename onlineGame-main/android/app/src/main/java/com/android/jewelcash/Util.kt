package com.bigrewards.jewelcash


import android.app.Activity
import android.app.Dialog
import android.content.ActivityNotFoundException

import android.content.Context
import android.content.Intent
import android.util.Base64;
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.view.Gravity
import android.view.LayoutInflater
import android.view.Window
import android.view.WindowManager
import android.widget.ImageView
import android.widget.Toast
import androidx.core.content.ContextCompat



import com.google.android.gms.ads.identifier.AdvertisingIdClient


import java.text.SimpleDateFormat
import java.util.*


object Util {

    @JvmStatic
    fun decoratedDiag(context: Context, layout: Int, opacity: Float): Dialog {
        val dialog = Dialog(context, android.R.style.Theme_Translucent_NoTitleBar)
        val view = LayoutInflater.from(context).inflate(layout, null)
        dialog.setContentView(view)
        dialog.setCancelable(false)
        dialog.setCanceledOnTouchOutside(false)
        val w = dialog.window
        val lp = w?.attributes
        lp?.width = WindowManager.LayoutParams.MATCH_PARENT
        lp?.height = WindowManager.LayoutParams.WRAP_CONTENT
        lp?.dimAmount = opacity
        lp?.flags = WindowManager.LayoutParams.FLAG_DIM_BEHIND
        w?.attributes = lp
        w?.setGravity(Gravity.CENTER)
        w?.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
        w?.statusBarColor = ContextCompat.getColor(context, R.color.colorPrimaryDark)
        w?.navigationBarColor = ContextCompat.getColor(context, R.color.colorPrimaryDark)
        return dialog
    }


    @JvmStatic
    fun  loadingDiag(context: Context): Dialog {
        val loadingDialog = decoratedDiag(context, R.layout.dialog_loading, 0.8f)
        loadingDialog.setCancelable(false)
        val imageView = loadingDialog.findViewById<ImageView>(R.id.dialog_loading_imageView)
        return loadingDialog
    }



    fun getAdvertisingID(context: Context): String? {
        return try {
            val adInfo = AdvertisingIdClient.getAdvertisingIdInfo(context)
            adInfo.id
        } catch (e: Exception) {
            null
        }
    }

    fun encodeString(input: String): String {
        return Base64.encodeToString(input.toByteArray(), Base64.DEFAULT)
    }




    fun showToast(context: Context, strMessage: String) {
        Toast.makeText(context, strMessage, Toast.LENGTH_SHORT).show()
    }





    fun parseTimeString(time: Long, pattern: String): String {
        val sdf = SimpleDateFormat(
            pattern,
            Locale.US
        )
        return sdf.format(Date(time))
    }




    private fun setWindowFlag(bits: Int, on: Boolean, window: Window) {
        val winParams = window.attributes
        if (on) {
            winParams.flags = winParams.flags or bits
        } else {
            winParams.flags = winParams.flags and bits.inv()
        }
        window.attributes = winParams
    }




    fun openUrl(content: Context, strUrl: String) {

        try {
            content.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(strUrl)))
        } catch (e: android.content.ActivityNotFoundException) {
            content.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(strUrl)))
        }
    }








}
