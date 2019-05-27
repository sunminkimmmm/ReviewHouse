var express = require('express');
var router = express.Router();
var pool = require('../config');

//var elasticsearch = require('@elastic/elasticsearch');
// var elasticsearch = require('elasticsearch');
/*var esclient = new elasticsearch.Client({}
  host: 'localhost:3000'
});
esclient.search({
  index: 'social-*',
  body: {
    query: {
      match: { message: 'myProduct' }
    },
    aggs: {
      top_10_states: {
        terms: {
            field: 'state',
            size: 10
        }
      }
    }
  }
}
).then(function (response) {
    var hits = response.hits.hits;
}
);*/

var multer = require('multer')

var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: _storage });


/* 메인 페이지 */
router.get('/recently', function (req, res, next) {
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "SELECT * FROM house ORDER BY houseIdx DESC LIMIT 5";
    conn.query(sql, (err, row) => {
      conn.release();
      if (err) {
        throw err;
      }
      if (row.length === 0) {
        res.send(300, {
          result: 0,
          msg: "failed"
        });
      } else {
        res.send(200, {
          result: 1,
          check: 0,
          data: row
        })
      }
    })
  })
});


//집주인
/*집 등록하기 */
router.post('/houseRegister', upload.single('photo'), function (req, res, next) {
  var postData = req.body;
  var imgurl = ""
  pool.getConnection(function (err, conn) {
    if (err) throw err;
    if (req.file !== undefined) {
      imgurl = 'images/' + req.file.originalname;
    }
    var sql = "INSERT INTO house (housePic, housePrice, houseSpace, houseComment, houseAddress1, houseAddress2, houseAddress3, userMail) VALUES (?, ?, ?, ?, ?, ?, ?, ?);"

    conn.query(sql, [imgurl, postData.housePrice, postData.houseSpace, postData.houseComment, postData.houseAddress1, postData.houseAddress2, postData.houseAddress3, postData.userMail], function (err, row) {
      conn.release()
      if (err) {
        res.send(200, {
          data: err
        });
      };
      res.send(200, {
        result: 1

      })
    })

  })

})

/*집 삭제 */
router.get('/houseDelete/:houseIdx', function (req, res, next) {
  var houseIdx = req.params.houseIdx;
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "SELECT * FROM house WHERE houseIdx = ?";
    conn.query(sql, [houseIdx], (err, row) => {
      if (err) {
        throw err;
      }
      var sql = "DELETE FROM house WHERE houseIdx = ?";
      conn.query(sql, [houseIdx], function (err) {
        if (err) {
          throw err;
        }
        res.send(200, {
          result: 1
        })
      });
    });
  })
});


/*집 수정 */
router.post('/houseUpdate/:houseIdx', upload.single('photo'), function (req, res, next) {
  var houseIdx = req.params.houseIdx;
  var postData = req.body;
  var imgurl = "";
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    if (req.file !== undefined) {
          imgurl = 'images/' + req.file.originalname;
    
      var sql = `UPDATE house SET
          housePic = ?,
          housePrice = ?,
          houseSpace = ?,
          houseComment = ?,
          houseAddress1 = ?,
          houseAddress2 = ?,
          houseAddress3 = ?
          WHERE houseIdx = ? AND userMail = ?`;
            conn.query(sql, [imgurl, postData.housePrice, postData.houseSpace, postData.houseComment, postData.houseAddress1, postData.houseAddress2, postData.houseAddress3, houseIdx, postData.userMail], (err, row) => {
            conn.release();
            if (err) {
               throw err;
        }
      console.log(row);
      res.send(200, {
        result: 1
      })

    })
  }
  else{
    var sql = `UPDATE house SET
          housePic = ?,
          housePrice = ?,
          houseSpace = ?,
          houseComment = ?,
          houseAddress1 = ?,
          houseAddress2 = ?,
          houseAddress3 = ?
          WHERE houseIdx = ? AND userMail = ?`;
            conn.query(sql, [imgurl, postData.housePrice, postData.houseSpace, postData.houseComment, postData.houseAddress1, postData.houseAddress2, postData.houseAddress3, houseIdx, postData.userMail], (err, row) => {
            conn.release();
            if (err) {
               throw err;
        }
      console.log(row);
      res.send(200, {
        result: 1
      })

    })
  }
  })

})

/*마이페이지(집주인) */
router.get('/ownerMypage/:userMail', function (req, res, next) {
  var userMail = req.params.userMail;
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "SELECT * FROM user WHERE userMail = ?";
    conn.query(sql, [userMail], (err, row) => {
      if (err) {
        throw err;
      }
      var sql = "SELECT * FROM user, house WHERE user.userMail = house.userMail AND user.userMail = ?";
      conn.query(sql, [userMail], (err, row) => {
        conn.release();
        if (err) {
          throw err;
        }
        if (row.length === 0) {
          res.send(300, {
            result: 0,
            msg: "failed"
          });
        } else {
          res.send(200, {
            result: 1,
            data: row
          })
        }
      })

    })
  })
})


/*집 상세보기(집주인)*/
router.get('/houseView/:houseIdx', function (req, res, next) {
  var houseIdx = req.params.houseIdx;
  var data = {};
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "SELECT * FROM house WHERE houseIdx = ?";
    conn.query(sql, [houseIdx], (err, row) => {
      if (err) {
        throw err;
      }
      data.house = row[0];
      var sql = "SELECT * FROM house,review, user WHERE house.houseIdx = review.houseIdx AND review.userMail = user.userMail AND house.houseIdx = ?"
      conn.query(sql, [houseIdx], (err, row) => {
        conn.release();
        if (err) {
          throw err;
        }
        data.review = row;
        console.log(data);
        res.send(200, {
          result: 1,
          data: data
        })
      })
    })
  })
})


/*사용자 */
/*리뷰 등록 */
router.post('/reviewRegister', function (req, res, next) {
  var postData = req.body;
  pool.getConnection(function (err, conn) {
    if (err) throw err;
    var sql = "INSERT INTO review (userMail, reviewComment, houseIdx) VALUES (?, ?, ?);"
    conn.query(sql, [postData.userMail, postData.reviewComment, postData.houseIdx], function (err, row) {
      conn.release()
      if (err) throw err;
      res.send(200, {
        result: 1

      })
    });
  })
})

/*리뷰 삭제 */
router.get('/reviewDelete/:houseIdx/:userMail', function (req, res, next) {
  var houseIdx = req.params.houseIdx;
  var userMail = req.params.userMail;
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "DELETE FROM review WHERE houseIdx = ? AND userMail = ?";
    conn.query(sql, [houseIdx, userMail], function (err) {
      if (err) {
        throw err;
      }
      res.send(200, {
        result: 1
      })
    });
  })
});

/*리뷰 수정 */
router.post('/reviewUpdate/:houseIdx/:userMail', function (req, res, next) {
  var houseIdx = req.params.houseIdx;
  var userMail = req.params.userMail;
  var postData = req.body;
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = `UPDATE review SET reviewComment = ? WHERE houseIdx = ? AND userMail = ?`;
    conn.query(sql, [postData.reviewComment, houseIdx, userMail], (err, row) => {
      conn.release();
      if (err) {
        throw err;
      }
      console.log(row);
      res.send(200, {
        result: 1
      })

    })

  })

})

/*사용자 리뷰 목록(사용자 마이페이지 내에서 이동) */
router.get('/reviewList/:userMail', function (req, res, next) {
  var userMail = req.params.userMail;
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "SELECT * FROM user WHERE userMail = ?";
    conn.query(sql, [userMail], (err, row) => {
      if (err) {
        throw err;
      }
      var sql = "SELECT * FROM user, review WHERE user.userMail = review.userMail AND user.userMail = ?";
      conn.query(sql, [userMail], (err, row) => {
        conn.release();
        if (err) {
          throw err;
        }
        if (row.length === 0) {
          res.send(300, {
            result: 0,
            msg: "failed"
          });
        } else {
          res.send(200, {
            result: 1,
            data: row
          })
        }
      })

    })
  })
})

/*좋아요*/
router.post('/houseLike', function (req, res, next) {
  var postData = req.body;
  pool.getConnection(function (err, conn) {
    if (err) throw err;
    var sql = "SELECT * FROM favorite WHERE userMail = ? AND houseIdx = ? AND favoriteCheck = ?";
    conn.query(sql, [postData.userMail,postData.houseIdx,postData.favoriteCheck], (err, row) => {
      if (err) {
        throw err;
      }
      if(row.length !== 0){
        var sql = "DELETE FROM favorite WHERE userMail = ? AND houseIdx = ? AND favoriteCheck = ?";
         conn.query(sql, [postData.userMail,postData.houseIdx,postData.favoriteCheck], function (err) {
         if (err) {
        throw err;
        }
        res.send(200, {
        result: 1
      })
    });

      }
      else{
        var sql = "INSERT INTO favorite (userMail, houseIdx, favoriteCheck) VALUES (?, ?, ?);"
        conn.query(sql, [postData.userMail, postData.houseIdx, postData.favoriteCheck], function (err, row) {
          conn.release()
          if (err) throw err;
          res.send(200, {
          result: 1

      })
    });
      }
   
  })
})
})

/*좋아요 취소 */
router.get('/houseLikeCancel/:houseIdx/:userMail', function (req, res, next) {
  var houseIdx = req.params.houseIdx;
  var userMail = req.params.userMail;
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "DELETE FROM favorite WHERE houseIdx = ? AND userMail = ?";
    conn.query(sql, [houseIdx, userMail], function (err) {
      if (err) {
        throw err;
      }
      res.send(200, {
        result: 1
      })
    });
  })
});


/*마이페이지(사용자, 좋아요 누른 집 게시물 목록이 나옴) */
router.get('/userMypage/:userMail', function (req, res, next) {
  var userMail = req.params.userMail;
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "SELECT * FROM user WHERE userMail = ?";
    conn.query(sql, [userMail], (err, row) => {
      if (err) {
        throw err;
      }
      var sql = "SELECT * FROM user, house, favorite WHERE user.userMail = favorite.userMail AND favorite.houseIdx = house.houseIdx AND user.userMail = ?";
      conn.query(sql, [userMail], (err, row) => {
        conn.release();
        if (err) {
          throw err;
        }
        if (row.length === 0) {
          res.send(300, {
            result: 0,
            msg: "failed"
          });
        } else {
          res.send(200, {
            result: 1,
            data2: row
          })
        }
      })

    })
  })
})

/*집, 리뷰 검색 */
router.post('/houseSearch', function (req, res, next) {
  
  //console.log(req.body);
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "SELECT searchWord FROM search WHERE similarWord = ? "
    conn.query(sql,[req.body.keyword],(err,rs)=>{
      if (err) {
        throw err;
      }

    var word = rs[0];
    console.log(word)


    var sql = "SELECT * FROM house,review WHERE house.houseIdx = review.houseIdx AND house.housePrice BETWEEN ?-5000 AND ?+5000 AND house.houseSpace BETWEEN ?-10 AND ?+10 AND house.houseAddress1 = ? AND house.houseAddress2 = ? AND house.houseAddress3 = ? AND review.reviewComment LIKE '%' ? '%'";
    conn.query(sql, [req.body.housePrice1,req.body.housePrice2, req.body.houseSpace1,req.body.houseSpace2, req.body.houseAddress1, req.body.houseAddress2, req.body.houseAddress3,word.searchWord], (err, row) => {
      conn.release();
      if (err) {
        throw err;
      }
      if (row.length === 0) {
        res.send(300, {
          result: 0,
          msg: "failed"
        });
      } else {
        console.log(row)
        res.send(200, {
          result: 1,
          data: row

        })
      }
    })
  })

  })
});


  /*pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    }
    var sql = "SELECT * FROM house,review WHERE house.houseIdx = review.houseIdx AND house.housePrice BETWEEN ?-5000 AND ?+5000 AND house.houseSpace BETWEEN ?-10 AND ?+10 AND house.houseAddress1 = ? AND house.houseAddress2 = ? AND house.houseAddress3 = ? AND review.reviewComment LIKE '%' ? '%'";
    conn.query(sql, [req.body.housePrice1,req.body.housePrice2, req.body.houseSpace1,req.body.houseSpace2, req.body.houseAddress1, req.body.houseAddress2, req.body.houseAddress3,req.body.keyword], (err, row) => {
      conn.release();
      if (err) {
        throw err;
      }
      if (row.length === 0) {
        res.send(300, {
          result: 0,
          msg: "failed"
        });
      } else {
        console.log(row)
        res.send(200, {
          result: 1,
          data: row

        })
      }
    })
  })*/

  /**var sql = "SELECT search.searchWord FROM search WHERE search.similarWord = ? "
  conn.query(sql,[req.body.keyword],(err,res)=>{
    conn.release(); */




/* 로그인 요청 */
router.post('/login', function (req, res, next) {
  var postData = req.body;
  pool.getConnection((err, conn) => {
    if (err) throw err;
    var sql = "SELECT * FROM user WHERE userMail = ? AND userPassword = ? AND userCheck = ?";
    conn.query(sql, [postData.userMail, postData.userPassword, postData.userCheck], (err, row) => {
      if (err) {
        res.send(300, {
          result: 0,
          msg: 'DB Error'
        });
      }
      if (row.length === 0) {
        res.send(300, {
          result: 0,
          msg: "failed"
        });
      } else if (postData.userCheck === 0) {         //집주인일때
        res.send(200, {
          result: 1,
          check: 1,
          data: row[0]

        })
      } else {                                  //사용자일때
        res.send(200, {
          result: 1,
          check: 0,
          data: row[0]
        })
      }
    });
  })

});



/*회원가입 요청*/
router.post('/join', function (req, res, next) {
  pool.getConnection(function (err, conn) {
    if (err) throw err;
    var sql = "SELECT * FROM user WHERE userMail=?"
    conn.query(sql, [req.body.userMail], function (err, row) {
      if (err) throw err;
      if (row.length === 0) {
        var sql = "INSERT INTO user VALUES (?, ?, ?, ?);"
        conn.query(sql, [req.body.userMail, req.body.userPassword, req.body.userName, req.body.userCheck], function (err, row) {
          conn.release()
          if (err) throw err;
          res.send(200, {
            result: 1
          })
        });
      } else {
        res.send("중복")
      }
    });
  })


})

router.get('/', (req, res) => {
  var sql = "SELECT * FROM house WHERE housePrice BETWEEN ?-5000 AND ?+5000";
  pool.getConnection((err, conn)=> {
    if(err){
      throw err;
    }
    conn.query(sql, ["15000", "15000"], (err, row) => {
      if(err) throw err;
      console.log(row);
      res.send(row)
    })
  })
});


module.exports = router;
