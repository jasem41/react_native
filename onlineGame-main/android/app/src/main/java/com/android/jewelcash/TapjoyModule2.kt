package com.android.jewelcash

import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class TapjoyModule2(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        Log.d("TapjoyModule", "Module name requested")
        return "TapjoyModule2"
    }

    @ReactMethod
    fun startTapjoyActivity(userid: String, sdkKey: String, placementName: String) {
        Log.d("TapjoyModule", "startTapjoyActivity called with: userid=$userid, sdkKey=$sdkKey, placementName=$placementName")
        val intent = Intent(reactApplicationContext, TapjoyActivity::class.java)
        intent.putExtra("userid", userid)
        intent.putExtra("sdk_key", sdkKey)
        intent.putExtra("placement_name", placementName)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactApplicationContext.startActivity(intent)
    }
}
