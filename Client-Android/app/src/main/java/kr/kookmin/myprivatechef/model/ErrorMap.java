package kr.kookmin.myprivatechef.model;

import java.util.HashMap;

public class ErrorMap extends HashMap<String,String> {

    public ErrorMap(){
        this.put("Error.Passport.Password.Invalid","?¨ìŠ¤?Œë“œ ?•ì‹???˜ëª»?˜ì—ˆ?µë‹ˆ??");
        this.put("Error.Passport.Password.Wrong","?¨ìŠ¤?Œë“œê°€ ?¤ë¦…?ˆë‹¤.");
        this.put("Error.Passport.Password.NotSet","?¨ìŠ¤?Œë“œë¥??…ë ¥?´ì£¼?¸ìš”.");
        this.put("Error.Passport.Username.NotFound","?´ë¦„??ì°¾ì„ ???†ìŠµ?ˆë‹¤.");
        this.put("Error.Passport.User.Exists","?´ë? ?¬ìš©ì¤‘ì¸ ?´ë¦„?…ë‹ˆ??");
        this.put("Error.Passport.Email.NotFound","?´ë©”?¼ì„ ì°¾ì„ ???†ìŠµ?ˆë‹¤.");
        this.put("Error.Passport.Email.Missing","?´ë©”???•ì‹???˜ëª»?˜ì—ˆ?µë‹ˆ??");
        this.put("Error.Passport.Email.Exists","?´ë? ê°€?…í•œ ?´ë©”?¼ì…?ˆë‹¤.");
        this.put("Error.Passport.Username.Missing","?´ë¦„ ?•ì‹???˜ëª»?˜ì—ˆ?µë‹ˆ??");
        this.put("Error.Passport.Password.Missing","ë¹„ë?ë²ˆí˜¸ ?•ì‹???˜ëª»?˜ì—ˆ?µë‹ˆ??");
        this.put("Error.Passport.Generic","?…ë ¥ ?•ì‹???˜ëª»?˜ì—ˆ?µë‹ˆ??");
    }
}
