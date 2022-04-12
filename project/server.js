const express = require('express');
const app = express();


const {Client}  = require('@elastic/elasticsearch')
const client = new Client({
    node : "http://elastic:alpaco*5700@192.168.30.30:9200"
})   


async  function chart1() {
     const result1 = await client.search({
        index : "garbage11",
        body : {
            query : {
                match : {
                    "시도명" : "전라북도"    //조건
                }
            },
            size : 0,
            aggs : {
                "garbageType" : {
                    "terms" : {
                        "field" : "종량제봉투종류"      //규격봉투, 재사용규격봉투, 특수규격마대 등
                    },
                    "aggs" : {      // 하위 만든 aggregation
                        "garbage5" : {
                            "avg" :{
                                "field" : "5ℓ가격"               
                            }
                        },
                        "garbage10" : {
                            "avg" :{
                                "field" : "10ℓ가격"             
                            }
                        },
                        "garbage20" : {
                            "avg" :{
                                "field" : "20ℓ가격"              
                            }
                        },
                        "garbage50" : {
                            "avg" :{
                                "field" : "50ℓ가격"              
                            }
                        },
                        "garbage120" : {
                            "avg" :{
                                "field" : "120ℓ가격"                
                            }
                        }
                    }
                }
            }
        }
    })   
    global.result1 = result1;   //result1 변수를 밖에서도 사용하기 위해서
}

// 지역에 따른 폐기용량별 min max avg sum count 값    
async function chart2(){
    const result2 = await client.search({
        index : "garbage11",
        body : {
            size : 0,
            aggs : {
                "district" :{
                    "terms" : {
                        "field" : "시도명"
                    },
                    aggs :{
                        "g5": {
                            "stats":{
                                "field" : "5ℓ가격"  
                            }
                        },
                        "g75": {
                            "stats":{
                                "field" : "75ℓ가격"  
                            }
                        },
                        "g30": {
                            "stats":{
                                "field" : "30ℓ가격"  
                            }
                        },
                        "g20": {
                            "stats":{
                                "field" : "20ℓ가격"  
                            }
                        },
                        "g10": {
                            "stats":{
                                "field" : "10ℓ가격"  
                            }
                        },
                        "g100": {
                            "stats":{
                                "field" : "100ℓ가격"  
                            }
                        }
                    }
                }
            }
        }
    })
    global.result2=result2
}

async function chart3(){
    const result3 = await client.search({
        index : "garbage11",
        body : {
            size : 0,
            aggs : {
                "manageDepartment" : {
                    "terms" : {
                        "field" : "관리부서명"
                    }
                }
            }
        }
    })
    global.result3=result3;
}

async function chart4(){
    const result4 = await client.search({
        index : "garbage11",
        body : {
            "sort": [
                {
                  "시군구명": {
                    "order": "asc",
                    "unmapped_type": "boolean"
                  }
                }
              ],
            "size" : 50,
            "_source": ["시군구명","10ℓ가격","20ℓ가격","50ℓ가격","75ℓ가격","데이터기준일자"],
            "query": {
              "bool": {
                "must": [],
                "filter": [
                  {
                    "bool": {
                      "filter": [
                        {
                          "bool": {
                            "should": [
                              {
                                "range": {
                                  "10ℓ가격": {
                                    "gt": "0"
                                  }
                                }
                              }
                            ],
                            "minimum_should_match": 1
                          }
                        },
                        {
                          "bool": {
                            "should": [
                              {
                                "range": {
                                  "데이터기준일자": {
                                    "gte": "2021-01-01",
                                    "time_zone": "Asia/Seoul"
                                  }
                                }
                              }
                            ],
                            "minimum_should_match": 1
                          }
                        }
                      ]
                    }
                  },
                  {
                    "match_phrase": {
                      "시도명": "경기도"
                    }
                  },
                  {
                    "match_phrase": {
                      "종량제봉투종류": "규격봉투"
                    }
                  },
                  {
                    "match_phrase": {
                      "종량제봉투처리방식": "소각용"
                    }
                  },
                  {
                    "match_phrase": {
                      "종량제봉투용도": "생활쓰레기"
                    }
                  },
                  {
                    "match_phrase": {
                      "종량제봉투사용대상": "가정용"
                    }
                  }
                ]
              }
            }
        }
    })
    global.result4=result4;
}



async function run(){
    await chart1();
    await chart2();
    await chart3();
    await chart4();  
    c1 = result1.aggregations.garbageType.buckets;   //global로 result사용가능
    c2 = result2.aggregations.district.buckets; 
    c3 = result3.aggregations.manageDepartment.buckets;
    c4 = result4.hits.hits;
    console.log(c4);

    context = {     //var 없으면 전역변수 
        c1, c2, c3,c4
    };

    app.get('/', function(req, res){
        // res.json({data : 'jsondata'});            // res.json은 화면 출력,, 
        //console.log(c2);
        res.render('render.ejs',context);    //views디렉토리 안 //html불가 
    })
    app.listen(8080);

}

run().catch(console.log);