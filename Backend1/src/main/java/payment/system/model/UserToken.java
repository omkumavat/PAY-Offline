package payment.system.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usertokens")
public class UserToken {
    private String token;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    public UserToken( Long userId,String token){
        this.token=token;
        this.userId=userId;
    }

    public UserToken() {

    }

    public String getToken() {
        return token;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

}
