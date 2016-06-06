package kr.kookmin.myprivatechef.model;

import java.io.Serializable;

public class ReviewListData  implements Serializable{

     String username;
     String comment;
     String profileImgName;

    public ReviewListData(String username,String comment,String profileImgName){
        this.username = username;
        this.comment = comment;
        this.profileImgName = profileImgName;
    }

    public String getUsername() {
        return username;
    }

    public String getComment() {
        return comment;
    }

    public String getProfileImgName() {
        return profileImgName;
    }
}
