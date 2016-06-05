package kr.kookmin.myprivatechef.util;

/**
 * Created by lk on 2015. 8. 15..
 */
public class AppSetting {

    /**
     * Server URL Setting
     */
    final public static String serverUrl = "http://52.79.113.52:1337";
    final public static String tokenUrl = serverUrl + "/auth/me";
    final public static String predictionUrl = serverUrl + "/prediction";
    final public static String recipeUrl = serverUrl + "/recipe";
    final public static String likeUrl = serverUrl + "/like";
    final public static String viewUrl = serverUrl + "/view";
    final public static String reviewUrl = serverUrl + "/review";
    final public static String resourceUrl = serverUrl + "/resource";
    final public static String methodUrl = serverUrl + "/method";

    /**
     * Font Setting
     * You can modify the font to put the assets folder
     */

    final public static String logoFont = "Nanumbut.ttf";
    final public static String appFont = "NanumBarunGothic.ttf";
    final public static String appFontBold = "NanumBarunGothicBold.ttf";
}
