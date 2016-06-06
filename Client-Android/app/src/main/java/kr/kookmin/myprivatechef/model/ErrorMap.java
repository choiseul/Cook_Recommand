package kr.kookmin.myprivatechef.model;

import java.util.HashMap;

public class ErrorMap extends HashMap<String,String> {

    public ErrorMap(){
        this.put("Error.Passport.Password.Invalid","?�스?�드 ?�식???�못?�었?�니??");
        this.put("Error.Passport.Password.Wrong","?�스?�드가 ?�릅?�다.");
        this.put("Error.Passport.Password.NotSet","?�스?�드�??�력?�주?�요.");
        this.put("Error.Passport.Username.NotFound","?�름??찾을 ???�습?�다.");
        this.put("Error.Passport.User.Exists","?��? ?�용중인 ?�름?�니??");
        this.put("Error.Passport.Email.NotFound","?�메?�을 찾을 ???�습?�다.");
        this.put("Error.Passport.Email.Missing","?�메???�식???�못?�었?�니??");
        this.put("Error.Passport.Email.Exists","?��? 가?�한 ?�메?�입?�다.");
        this.put("Error.Passport.Username.Missing","?�름 ?�식???�못?�었?�니??");
        this.put("Error.Passport.Password.Missing","비�?번호 ?�식???�못?�었?�니??");
        this.put("Error.Passport.Generic","?�력 ?�식???�못?�었?�니??");
    }
}
