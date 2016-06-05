package kr.kookmin.myprivatechef;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Typeface;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.ImageLoader;

import org.json.JSONArray;

import java.util.HashMap;
import java.util.List;

import kr.kookmin.myprivatechef.Request.JsonArrayRequest;
import kr.kookmin.myprivatechef.model.Recipe;
import kr.kookmin.myprivatechef.ui.RecipeActivity;
import kr.kookmin.myprivatechef.util.AppSetting;


public class RecycleAdapter extends RecyclerView.Adapter<RecyclerHolder> {

    private ImageLoader mImageLoader;
    private List<Recipe> list;
    private Context context;

    private String token;
    private String userid;

    public RecycleAdapter(List<Recipe> item, Context context) {
        mImageLoader = AppController.getInstance().getImageLoader();
        this.list = item;
        this.context = context;
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    @Override
    public RecyclerHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        final View view;
        view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_recycle_row, parent, false);
        getPreferenceData();
        return new RecyclerHolder(view);
    }

    public void getPreferenceData() {
        SharedPreferences pref = context.getSharedPreferences("pref", 0);
        this.token = pref.getString("token", "NON");    // get Token
        this.userid = pref.getString("id", "NON");      // get Token
    }

    @Override
    public void onBindViewHolder(RecyclerHolder holder, final int position) {
        setItem(holder, position);
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(view.getContext(), RecipeActivity.class);
                intent.putExtra("id",list.get(position).getItemId()+"");
                intent.putExtra("title", list.get(position).getTitle());
                intent.putExtra("titleThumbnail", list.get(position).getImageUrl());
                intent.putExtra("wasLiked", list.get(position).getWasLike());
                intent.putExtra("temperature", list.get(position).getTemperature());
                intent.putExtra("cooktime", list.get(position).getCooktime());
                intent.putExtra("calorie", list.get(position).getCalorie());
                view.getContext().startActivity(intent);
            }
        });
    }

    @Override
    public int getItemViewType(int position) { return position; }

    private void setItem(final RecyclerHolder holder, int position) {

        final Recipe recipe = list.get(position);

        holder.mRecycleHolder.mTitle.setText(recipe.getTitle());
        holder.mRecycleHolder.mImage.setImageUrl(recipe.getImageUrl(), mImageLoader);
        holder.mRecycleHolder.mTitle.setTypeface(Typeface.createFromAsset(context.getAssets(), "NanumBarunGothic.ttf"));
        if(recipe.getWasLike().equals("false"))                                                 // if wasLike
            holder.mRecycleHolder.mlikeButton.setBackground(context.getResources().getDrawable(R.drawable.ic_icon_dislike));                    // set Like Button wasLike
        holder.mRecycleHolder.mlikeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String recipeid = recipe.getItemId();
                if (recipe.getWasLike().equals("false")) {                                       // was not Like item
                    HashMap<String, String> request = new HashMap<>();
                    request.put("model", Request.Method.POST+"");
                    request.put("url", AppSetting.recipeUrl + "/" + recipeid + "/like");
                    request.put("token", token);

                    JsonArrayRequest recipeRequest = JsonArrayRequest.createJsonRequestToken(request, new Response.Listener<JSONArray>() {
                        @Override
                        public void onResponse(JSONArray response) {
                            Log.i("like", "Success");
                            holder.mRecycleHolder.mlikeButton.setBackground(context.getResources().getDrawable(R.drawable.ic_icon_customer));
                            recipe.setWasLike("true");                // save Like id
                        }
                    }, new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.e("volley", error.toString()+"123");
                        }
                    });
                    AppController.getInstance().addToRequestQueue(recipeRequest);
                } else {
                    HashMap<String, String> request = new HashMap<>();
                    request.put("model", Request.Method.DELETE+"");
                    request.put("url", AppSetting.recipeUrl + "/" + recipeid + "/like");
                    request.put("token", token);

                    JsonArrayRequest recipeRequest = JsonArrayRequest.createJsonRequestToken(request, new Response.Listener<JSONArray>() {
                        @Override
                        public void onResponse(JSONArray response) {
                            Log.i("Cancel like", "Success");
                            holder.mRecycleHolder.mlikeButton.setBackground(context.getResources().getDrawable(R.drawable.ic_icon_dislike));
                            recipe.setWasLike("false");                                        // delete Like id
                        }
                    }, new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.e("volley", error.toString());
                        }
                    });
                    AppController.getInstance().addToRequestQueue(recipeRequest);
                }
            }
        });



    }
}
