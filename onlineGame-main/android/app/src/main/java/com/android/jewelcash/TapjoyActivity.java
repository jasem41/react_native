package com.android.jewelcash;

import android.app.Activity;
import android.app.Dialog;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;


import androidx.appcompat.app.AppCompatActivity;

import com.tapjoy.TJActionRequest;
import com.tapjoy.TJConnectListener;
import com.tapjoy.TJError;
import com.tapjoy.TJPlacement;
import com.tapjoy.TJPlacementListener;
import com.tapjoy.TJSetUserIDListener;
import com.tapjoy.Tapjoy;
import com.tapjoy.TapjoyConnectFlag;


import java.util.Hashtable;

public class TapjoyActivity extends AppCompatActivity {

    private Dialog dialog;
    TJPlacementListener placementListener;
    TJPlacement p;
    private TJSetUserIDListener tjSetUserIDListener;
    private TJConnectListener tjConnectListener;

    String myData,pName,user;

    @Override
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        Intent intent = getIntent();

          dialog = Util.loadingDiag(this);
          myData = intent.getStringExtra("sdk_key");
          pName = intent.getStringExtra("placement_name");
          user = intent.getStringExtra("userid");
        if ( user != null) {
            dialog.show();
            Tapjoy.setActivity(TapjoyActivity.this);
            placementListener = new TJPlacementListener() {
                @Override
                public void onRequestSuccess(TJPlacement tjPlacement) {
                    if (!tjPlacement.isContentAvailable()) {
                        if (dialog.isShowing()) dialog.dismiss();
                        uiToast(TapjoyActivity.this, "ad not available");
                        finish();
                    }
                }

                @Override
                public void onRequestFailure(TJPlacement tjPlacement, TJError tjError) {
                    if (dialog.isShowing()) dialog.dismiss();
                    uiToast(TapjoyActivity.this, tjError.message);
                    finish();
                }

                @Override
                public void onContentReady(TJPlacement tjPlacement) {
                    tjPlacement.showContent();
                    if (dialog.isShowing()) dialog.dismiss();
                }

                @Override
                public void onContentShow(TJPlacement tjPlacement) {

                }

                @Override
                public void onContentDismiss(TJPlacement tjPlacement) {
                    if (dialog.isShowing()) dialog.dismiss();
                    finish();
                }

                @Override
                public void onPurchaseRequest(TJPlacement tjPlacement, TJActionRequest tjActionRequest, String s) {

                }

                @Override
                public void onRewardRequest(TJPlacement tjPlacement, TJActionRequest tjActionRequest, String s, int i) {

                }

                @Override
                public void onClick(TJPlacement tjPlacement) {

                }
            };
             p = Tapjoy.getPlacement(pName, placementListener);
            tjSetUserIDListener = new TJSetUserIDListener() {
                @Override
                public void onSetUserIDSuccess() {
                    if (!isFinishing() && !isDestroyed())
                        p.requestContent();
                }

                @Override
                public void onSetUserIDFailure(String s) {
                    if (dialog.isShowing()) dialog.dismiss();
                    uiToast(TapjoyActivity.this, "" + s);
                    finish();
                }
            };
            tjConnectListener = new TJConnectListener() {
                @Override
                public void onConnectSuccess() {

                    Tapjoy.setUserID(user, tjSetUserIDListener);
                }


            };

            Hashtable<String, Object> connectFlags = new Hashtable<>();
            connectFlags.put(TapjoyConnectFlag.ENABLE_LOGGING, "true");
            Tapjoy.connect(TapjoyActivity.this,myData , connectFlags,tjConnectListener);


        } else {
            finish();
        }
    }

    @Override
    protected void onDestroy() {
        if(dialog.isShowing()) {
            dialog.dismiss();
        }
        placementListener = null;
        p = null;
        tjSetUserIDListener = null;
        tjConnectListener = null;
        super.onDestroy();
    }




    @Override
    public void onBackPressed() {
        if (placementListener != null) {
            placementListener = null;
        }
        if (p != null) {
            p = null;
        }
        if (tjSetUserIDListener != null) {
            tjSetUserIDListener = null;
        }
        if (tjConnectListener != null) {
            tjConnectListener = null;
        }
        if (dialog.isShowing()) dialog.dismiss();
        finish();
        super.onBackPressed();
    }

    private void uiToast(final Activity context, final String toast) {
        context.runOnUiThread(() -> Toast.makeText(context, toast, Toast.LENGTH_LONG).show());
    }
}