package kr.kookmin.myprivatechef.ui;

import android.app.ProgressDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Typeface;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;

import kr.kookmin.myprivatechef.AppController;
import kr.kookmin.myprivatechef.R;
import kr.kookmin.myprivatechef.Request.JsonArrayRequest;
import kr.kookmin.myprivatechef.Request.JsonObjectRequest;
import kr.kookmin.myprivatechef.model.ReviewListData;
import kr.kookmin.myprivatechef.util.AppSetting;
import kr.kookmin.myprivatechef.util.ReviewListAdapter;

public class ReviewActivity extends ActionBarActivity implements SwipeRefreshLayout.OnRefreshListener {
    private ListView mListView;
    private EditText mCommentEt;
    private String Comment;
    private String Username;
    private Button mRegisterBT;
    private String token;
    public ArrayList<ReviewListData> reviewListData;
    private String userid;
    private String recipeId;
    private SwipeRefreshLayout mSwipeRefresh;
    private ProgressDialog progressDialog;

    private ReviewListAdapter reviewListAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_review);

        getPreferenceData();

        init();

        loadRecipeList();
    }

    private void init() {
        Intent intent = getIntent();
        recipeId = intent.getStringExtra("recipeid");

        mListView = (ListView) findViewById(R.id.activity_review_lv);

        mCommentEt = (EditText) findViewById(R.id.activity_review_commentET);
        mRegisterBT = (Button) findViewById(R.id.activity_review_registerBt);
        mRegisterBT.setTypeface(Typeface.createFromAsset(getAssets(), "NanumBarunGothicBold.ttf"));
        mCommentEt.setTypeface(Typeface.createFromAsset(getAssets(), "NanumBarunGothicBold.ttf"));
        mSwipeRefresh = (SwipeRefreshLayout)findViewById(R.id.swipe_layout);

        ListView listView = (ListView) findViewById(R.id.activity_review_lv);
        reviewListData = new ArrayList<>();
        reviewListAdapter = new ReviewListAdapter(this, R.layout.review_custom_list,reviewListData);
        listView.setAdapter(reviewListAdapter);
        reviewListAdapter.notifyDataSetChanged();
        mSwipeRefresh.setOnRefreshListener(this);

        //mSwipeRefresh.setColorSchemeColors(R.color.color1, R.color.color2, R.color.color3, R.color.color4);

        mRegisterBT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                registerComment(mCommentEt.getText().toString());
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                init();
                loadRecipeList();
            }
        });
    }

    public void getPreferenceData() {
        SharedPreferences pref = getSharedPreferences("pref", MODE_PRIVATE);
        Username = pref.getString("useranme","testname");   // get Email
        Comment = pref.getString("comment","hello");       // get Comment
        token = pref.getString("token", "NON");             // get Token
        this.userid = pref.getString("id", "NON");          // get userId
    }
    public void onRefresh() {
        //새로고침시 이벤트 구현
        init();
        loadRecipeList();
        //새로고침 작업이 끝나고 애니메이션효과도 닫혀야 되기 때문에 setRefreshing(false)로 하여 작업을 종료합니다.
        mSwipeRefresh.setRefreshing(false);
    }


    private void loadRecipeList() {
        HashMap<String, String> request = new HashMap<>();
        request.put("model", Request.Method.GET+"");
        request.put("url", AppSetting.recipeUrl  + "/" + recipeId + "/review");
        request.put("token", token);

        JsonArrayRequest reviewRequest = JsonArrayRequest.createJsonRequestToken(request, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                hideprograssDialog();
                ArrayList<HashMap<String, String>> ReviewList = new ArrayList<HashMap<String, String>>(2);

                for (int i = 0; i < response.length(); i++) {
                    try {
                        JSONObject jsonObject = response.getJSONObject(i);

                        JSONObject author = jsonObject.getJSONObject("author");
                        Log.i("username" , author.getString("username"));

                        Log.i("content", jsonObject.getString("content"));

                        ReviewListData data = new ReviewListData(author.getString("username"),jsonObject.getString("content"),"imgurl");

                        reviewListData.add(data);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                reviewListAdapter.notifyDataSetChanged();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("volley", error.toString());
            }
        });
        AppController.getInstance().addToRequestQueue(reviewRequest);
    }


    private void registerComment(String content) {
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());

        HashMap<String, String> request = new HashMap<>();
        request.put("model", Request.Method.POST+"");
        request.put("url", AppSetting.reviewUrl);
        request.put("token", token);
        request.put("author", userid);
        request.put("recipe", recipeId);
        request.put("content", content);

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(request, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                Log.e("Volley", "success!!:" + response.toString());

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("volley", error.toString());
            }
        });
        queue.add(jsonObjectRequest);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_review, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
    private void hideprograssDialog() {
        if (progressDialog != null) {
            progressDialog.dismiss();
            progressDialog = null;
        }
    }
}
