package kr.kookmin.myprivatechef.ui;

//Sign Up Page Activity

import android.graphics.Typeface;
import android.os.Bundle;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import kr.kookmin.myprivatechef.model.ErrorMap;
import kr.kookmin.myprivatechef.R;
import kr.kookmin.myprivatechef.Request.SignUpRequest;
import kr.kookmin.myprivatechef.util.AppSetting;


public class SignUpActivity extends AppCompatActivity {

    private String mUsername;
    private String mEmail;
    private String mPassword;
    private String mNickname;

    private EditText usernameEt;
    private EditText emailEt;
    private EditText passwordEt;
    private EditText passwordEt2;
    private EditText nickname;
    private TextView join;

    private static final String EMAIL_PATTERN = "^[a-zA-Z0-9#_~!$&'()*+,;=:.\"(),:;<>@\\[\\]\\\\]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*$";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        initView();
    }

    private void initView() {
        Typeface tf = Typeface.createFromAsset(getAssets(), AppSetting.logoFont);

        usernameEt = (EditText) findViewById(R.id.et_signup_username);
        emailEt = (EditText) findViewById(R.id.et_signup_email);
        passwordEt = (EditText) findViewById(R.id.et_signup_password);
        passwordEt2 = (EditText) findViewById(R.id.et_signup_password2);
        nickname = (EditText) findViewById(R.id.et_signup_nickname);
        join = (TextView) findViewById(R.id.Join_title);
        join.setTypeface(tf,Typeface.BOLD);

        final Button sendBt = (Button) findViewById(R.id.bt_signup_send);
        sendBt.setTypeface(Typeface.createFromAsset(getAssets(), AppSetting.appFontBold));
        final View coordinatorLayoutView = findViewById(R.id.sb_signup_snackbarposition);

        sendBt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mUsername = usernameEt.getText().toString();
                mEmail = emailEt.getText().toString();
                mPassword = passwordEt.getText().toString();
                mNickname = nickname.getText().toString();

                if (errorCk()) {

                    signUp(coordinatorLayoutView);
                }
            }
        });
    }

    /**
     * Error Handler Method
     */
    private boolean errorCk(){
        View coordinatorLayoutView = findViewById(R.id.sb_signup_snackbarposition);
        Pattern pattern = Pattern.compile(EMAIL_PATTERN);
        Matcher matcher = pattern.matcher(emailEt.getText().toString());
        if(!matcher.matches()) {
            Snackbar
                    .make(coordinatorLayoutView, "?�메???�식???�바르�? ?�습?�다.", Snackbar.LENGTH_LONG)
                    .show();
            return false;
        }else if(usernameEt.getText().toString().length() < 6) {
            Snackbar
                    .make(coordinatorLayoutView, "?�이?��? 6?�리 ?�상 ?�력?�주?�요.", Snackbar.LENGTH_LONG)
                    .show();
            return false;
        }else if(!passwordEt.getText().toString().equals(passwordEt2.getText().toString())){
            Snackbar
                    .make(coordinatorLayoutView, "비�?번호 ?�인???�릅?�다.", Snackbar.LENGTH_LONG)
                    .show();
            return false;
        }else if(passwordEt.getText().length() < 8) {
            Snackbar
                    .make(coordinatorLayoutView, "비�?번호�?8?�리 ?�상 ?�력?�주?�요.", Snackbar.LENGTH_LONG)
                    .show();
            return false;
        }else if(nickname.getText().length() < 6){
            Snackbar
                    .make(coordinatorLayoutView, "?�네?�을 6?�리 ?�상 ?�력?�주?�요.", Snackbar.LENGTH_LONG)
                    .show();
            return false;
        }
        return true;
    }

    private void signUp(final View coordinatorLayoutView) {
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());

        Request stringRequest = new SignUpRequest(mUsername, mEmail, mPassword, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                HashMap<String, String> map = new ErrorMap();
                try {
                    JSONObject json = new JSONObject(response);
                    if (json.has("error")) {
                        Log.e("SignupError", json.get("error").toString());
                        Log.i("response: 11", response);

//                        Snackbar.make(coordinatorLayoutView, json.get("error").toString(), Snackbar.LENGTH_LONG).show();
                        Snackbar
                                .make(coordinatorLayoutView, "?�못???�메???�는 ?�네???�는 비�?번호?�니??", Snackbar.LENGTH_LONG)
                                .show();
                    } else {
                        Toast.makeText(getApplicationContext(), "가?�이 ?�료?�었?�니??", Toast.LENGTH_SHORT);
                        finish();
                    }

                } catch (JSONException e) {

                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

                Log.e("Volley", "SignUp Request !!: " + error.networkResponse);
            }
        });
        queue.add(stringRequest);
    }

}
