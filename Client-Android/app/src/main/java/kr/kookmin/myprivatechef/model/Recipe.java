package kr.kookmin.myprivatechef.model;


public class Recipe {

    private String title;       // Recipe Title
    private String id;             // Recipe Id
    private String imageUrl;    // Recipe Thumbnail URL
    private String wasLike;     // Like Id
    private String temperature; // 보관온도
    private int cooktime;       // 조리시간
    private int calorie;        // 칼로리

    public Recipe(String title, String id, String imageUrl, String wasLike, String temperature, int cooktime, int calorie) {
        this.title = title;
        this.id = id;
        this.imageUrl = imageUrl;
        this.wasLike = wasLike;
        this.temperature = temperature;
        this.cooktime = cooktime;
        this.calorie = calorie;
    }

    public String getTitle() { return title; }

    public String getItemId() { return id; }

    public String getImageUrl() { return imageUrl; }

    public String getWasLike(){ return wasLike; }

    public String getTemperature() { return temperature; }

    public int getCooktime() { return cooktime; }

    public int getCalorie() { return calorie; }

    public void setWasLike(String id){ this.wasLike = id; }

    @Override
    public String toString() { return id+""; }
}
