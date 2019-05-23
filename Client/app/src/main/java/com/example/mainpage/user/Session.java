package com.example.mainpage.user;

public class Session {
    private  static Session session = null;
    private Boolean isAuth = false;
    private User user;
    public Session(){
    }

    public synchronized static Session setSession(){
        if(session==null){
            session = new Session();
        }
        return session;
    }

    public static Session getSession() {
        return session;
    }

    public static void setSession(Session session) {
        Session.session = session;
    }

    public Boolean getAuth() {
        return isAuth;
    }

    public void setAuth(Boolean auth) {
        isAuth = auth;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
