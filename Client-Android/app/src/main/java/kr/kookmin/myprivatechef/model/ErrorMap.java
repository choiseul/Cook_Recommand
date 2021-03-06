package kr.kookmin.myprivatechef.model;

import java.util.HashMap;

public class ErrorMap extends HashMap<String,String> {

    public ErrorMap(){
        this.put("Error.Passport.Password.Invalid","?¨μ€?λ ?μ???λͺ»?μ?΅λ??");
        this.put("Error.Passport.Password.Wrong","?¨μ€?λκ° ?€λ¦?λ€.");
        this.put("Error.Passport.Password.NotSet","?¨μ€?λλ₯??λ ₯?΄μ£Ό?Έμ.");
        this.put("Error.Passport.Username.NotFound","?΄λ¦??μ°Ύμ ???μ΅?λ€.");
        this.put("Error.Passport.User.Exists","?΄λ? ?¬μ©μ€μΈ ?΄λ¦?λ??");
        this.put("Error.Passport.Email.NotFound","?΄λ©?Όμ μ°Ύμ ???μ΅?λ€.");
        this.put("Error.Passport.Email.Missing","?΄λ©???μ???λͺ»?μ?΅λ??");
        this.put("Error.Passport.Email.Exists","?΄λ? κ°?ν ?΄λ©?Όμ?λ€.");
        this.put("Error.Passport.Username.Missing","?΄λ¦ ?μ???λͺ»?μ?΅λ??");
        this.put("Error.Passport.Password.Missing","λΉλ?λ²νΈ ?μ???λͺ»?μ?΅λ??");
        this.put("Error.Passport.Generic","?λ ₯ ?μ???λͺ»?μ?΅λ??");
    }
}
