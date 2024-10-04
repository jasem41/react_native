package com.bigrewards.jewelcash

import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class FyberModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        Log.d("FyberModule", "Module name requested")
        return "FyberModule"
    }

    @ReactMethod
    fun startFyberActivity(userid: String, sdkKey: String, appid: String) {
        Log.d("FyberModule", "startTapjoyActivity called with: userid=$userid, sdkKey=$sdkKey, placementName=$appid")
        val intent = Intent(reactApplicationContext, FyberActivity::class.java)
        intent.putExtra("userid", userid)
        intent.putExtra("security_token", sdkKey)
        intent.putExtra("app_id", appid)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactApplicationContext.startActivity(intent)
    }
}