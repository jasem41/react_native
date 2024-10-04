package com.bigrewards.jewelcash;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.widget.Toast;


import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.fyber.Fyber;
import com.fyber.ads.AdFormat;
import com.fyber.requesters.OfferWallRequester;
import com.fyber.requesters.RequestCallback;
import com.fyber.requesters.RequestError;


public class FyberActivity extends AppCompatActivity {
    private Dialog dialog;

    @Override
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);


            dialog = Util.loadingDiag(FyberActivity.this);
            Intent intent = getIntent();
            String user = intent.getStringExtra("userid");
            String app_id = intent.getStringExtra("app_id");
            String security_token = intent.getStringExtra("security_token");
            if (app_id != null && user != null) {
                if (!dialog.isShowing()) dialog.show();
                try {
                    Fyber.with(app_id, this)
                            .withSecurityToken(security_token)
                            .withUserId(user)
                            .start();
                    OfferWallRequester.create(new RequestCallback() {
                        @Override
                        public void onAdAvailable(Intent intent) {
                            if (dialog.isShowing()) dialog.dismiss();
                            startActivity(intent);
                            new Handler().postDelayed(() -> finish(), 1000);

                        }

                        @Override
                        public void onAdNotAvailable(AdFormat adFormat) {
                            if (dialog.isShowing()) dialog.dismiss();
                            uiToast(FyberActivity.this, "Offer not available");
                            finish();
                        }

                        @Override
                        public void onRequestError(RequestError requestError) {
                            if (dialog.isShowing()) dialog.dismiss();
                            uiToast(FyberActivity.this, "" + requestError.getDescription());
                            finish();
                        }
                    }).request(this);
                } catch (Exception e) {
                    Toast.makeText(this, "" + e.getMessage(), Toast.LENGTH_LONG).show();
                    finish();
                }
            } else {
                finish();
            }


    }



    private void uiToast(final Activity context, final String toast) {
        context.runOnUiThread(() -> Toast.makeText(context, toast, Toast.LENGTH_LONG).show());
    }

    @Override
    protected void onResume() {
        super.onResume();

    }


    @Override
    protected void onDestroy() {
        if(dialog.isShowing()) {
            dialog.dismiss();
        }
        super.onDestroy();
    }

    public static void showMessage(Context context, String message, boolean closeActivity) {
        AlertDialog ad = new AlertDialog.Builder(context)
                .setMessage(message)
                .setCancelable(false)
                .setPositiveButton("Ok", (dialog, id) -> {
                    dialog.dismiss();
                    if (closeActivity) ((Activity) context).finish();
                }).create();
        ad.setOnShowListener(arg0 -> ad.getButton(AlertDialog.BUTTON_POSITIVE).setTextColor(
                ContextCompat.getColor(context, R.color.colorPrimaryDark)
        ));
        ad.show();
    }


}