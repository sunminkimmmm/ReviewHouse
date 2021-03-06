package com.example.mainpage.user;

import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;
import android.widget.ScrollView;
import android.widget.TextView;

import com.example.mainpage.DetailHousePage;
import com.example.mainpage.House;
import com.example.mainpage.ListViewAdapter;
import com.example.mainpage.MainActivity;
import com.example.mainpage.R;
import com.example.mainpage.SaveSharedPreference;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;

public class UserMypage extends AppCompatActivity{
    String url = "http://54.180.88.98:3000/userMypage/";
    ArrayList<House> houseList = new ArrayList<House>();

    ListViewAdapter adapter;
    ListView listView3;


    TextView ownerName3;
    Button logoutButton3;
    ScrollView user1;

    JSONTask3 Json3 = new JSONTask3();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.user_mypage);


        listView3 = (ListView) findViewById(R.id.listview3);
        logoutButton3 = (Button) findViewById(R.id.logoutButton3);
        ownerName3 = (TextView) findViewById(R.id.ownerName3);
        user1 = (ScrollView) findViewById(R.id.user);
        Json3.execute(url + SaveSharedPreference.getUserMail(UserMypage.this));
       // user1.requestDisallowInterceptTouchEvent(true);



       /*listView.setOnTouchListener(new View.OnTouchListener() {        //리스트뷰 터취 리스너
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                ow.requestDisallowInterceptTouchEvent(true);    // 리스트뷰에서 터취가되면 스크롤뷰만 움직이게
                return false;
            }
        });*/

        logoutButton3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(UserMypage.this, MainActivity.class);

                SaveSharedPreference.clearUserName(UserMypage.this);

                startActivity(intent);
                finish();
            }
        });
    }

    @Override
    public void onBackPressed() {
        if(SaveSharedPreference.getUserMail(UserMypage.this).length() != 0){
            Intent intent = new Intent(UserMypage.this, MainActivity.class);
            startActivity(intent);
        }
        super.onBackPressed();
    }


    public class JSONTask3 extends AsyncTask<String, String, String>{

        @Override
        protected String doInBackground(String... urls){
            try {

                HttpURLConnection con = null;
                BufferedReader reader = null;

                try{
                    URL url = new URL(urls[0]);//url을 가져온다.

                    con = (HttpURLConnection) url.openConnection();
                    con.setDoInput(true);
                    con.connect();//연결 수행


                    //입력 스트림 생성
                    InputStream stream = con.getInputStream();

                    //속도를 향상시키고 부하를 줄이기 위한 버퍼를 선언한다.
                    reader = new BufferedReader(new InputStreamReader(stream));

                    //실제 데이터를 받는곳
                    StringBuffer buffer = new StringBuffer();

                    //line별 스트링을 받기 위한 temp 변수
                    String line = "";

                    //아래라인은 실제 reader에서 데이터를 가져오는 부분이다. 즉 node.js서버로부터 데이터를 가져온다.
                    while((line = reader.readLine()) != null){
                        buffer.append(line);
                    }

                    //다 가져오면 String 형변환을 수행한다. 이유는 protected String doInBackground(String... urls) 니까
                    return buffer.toString();

                    //아래는 예외처리 부분이다.
                } catch (MalformedURLException e){
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                } finally {
                    //종료가 되면 disconnect메소드를 호출한다.
                    if(con != null){
                        con.disconnect();
                    }

                    try {
                        //버퍼를 닫아준다.
                        if(reader != null){
                            reader.close();
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }//finally 부분
            } catch (Exception e) {
                e.printStackTrace();
            }

            return null;
        }

        //doInBackground메소드가 끝나면 여기로 와서 텍스트뷰의 값을 바꿔준다.

        @Override
        public void onPostExecute(String result) {
            super.onPostExecute(result);
            //Log.d("recently", result);
            try {
                JSONObject getKey= new JSONObject(result);

                //Log.d("jsonObject: ", getKey.getString("data").toString());


                JSONArray jsonArray = new JSONArray(getKey.getString("data2").toString());
                for(int i =0; i< jsonArray.length(); i++){
                    JSONObject jsonObject = jsonArray.getJSONObject(i);
                    houseList.add(new House(
                            jsonObject.getString("houseIdx"),
                            jsonObject.getString("housePic"),
                            jsonObject.getString("housePrice"),
                            jsonObject.getString("houseSpace"),
                            jsonObject.getString("houseComment"),
                            jsonObject.getString("houseAddress1"),
                            jsonObject.getString("houseAddress2"),
                            jsonObject.getString("houseAddress3"),
                            jsonObject.getString("userMail")
                    ));
                    Log.d("House" + i + ":", houseList.get(i).toString());
                }

                adapter = new ListViewAdapter(UserMypage.this, R.layout.item, houseList);
                listView3.setAdapter(adapter);
                listView3.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                        Intent intent = new Intent(UserMypage.this, DetailHousePage.class);
                        String hIdx = houseList.get(position).getHouseIdx();
                        intent.putExtra("HouseIndex", hIdx);
                        startActivity(intent);
                    }
                });







            } catch (JSONException e) {
                e.printStackTrace();
            }


        }
    }

}
