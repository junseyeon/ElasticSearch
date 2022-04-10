'use strict'

const { Client} = require('@elastic/elasticsearch')     //require모듈 불러다 쓰기 ex)내가 생성한 chart.js를 불러다 쓰는 것 
console.log(Client)
const client = new Client({ 
    node: 'http://elastic:alpaco*5700@192.168.30.30:9200'
})   

async function run() {
    const result = await client.search({
        index : 'garbage11',
        body: {
            query : {
             match : { "시도명" :  "전라북도" }    //조건 값
            },
            "size" : 0,       //"hits":[]에 불필요한 도큐먼트 내용이 나타나지 않아 fecth해 오는 과정 생략 가능 
            "aggs" : {
                "price" : {
                    "stats" : {         // min, max, sum, avg,count / stats는 4개값 모두 +count값
                        "field" : "50ℓ가격"  
                    }
                },
                "uniq_department" : {
                    "cardinality":{
                        "field": "관리부서명"
                    }
                },
                "price_percentile_ranks": {
                    "percentile_ranks" : {
                        "field" : "50ℓ가격",
                        "values" : [900,1200]           ///values값이 object로 출력됨... 
                    }
                },
                "price_range" : {
                    "range":{
                        "field" : "50ℓ가격",
                        "ranges":[
                        {
                            "to" : 1000
                        },
                        {
                            "from" : 1000,
                            "to" : 1500
                        },
                        {
                            "from" : 2000
                        }
                        ]
                    }    
                },
                "price_his" :{
                    "histogram" : {
                        "field" : "50ℓ가격",
                        "interval" : 1000
                    }
                },
                "garbageType" : {
                    "terms" : {
                        "field" : "종량제봉투종류"      //규격봉투, 재사용규격봉투, 특수규격마대 등
                    },
                    "aggs" : {      // 하위 만든 aggregation
                        "garbageUsage" : {
                            "avg" :{
                                "field" : "50ℓ가격"      //의미: 종량제봉투종류에 따른 종량제봉투용도 출력
                            }
                        }
                    }
                }
            }
    }
}, (err, result) => {
   console.log("log:" + err, result)    // 여기 안은 실행이 안되는 거 같은데 이유를 모름..
})

   // *결과 값 출력은 response 항목 기준으로
   console.log(result.aggregations.price.avg)
   console.log(result.aggregations.price_percentile_ranks.values)      //50L가격 백분위
   console.log(result.aggregations.price_range.buckets)         //range : 범위에 해당하는 값들 가져올 수 있음 
   console.log(result.aggregations.price_his.buckets)       // range를 interval로 나눔 
   console.log(result.aggregations.garbageType.buckets)    // 문자열필드 값 집계(갯수)     + 하위 aggs 
   console.log(typeof(result.aggregations))        

}

 run()
 // run().catch(console.log)   //catch는 에러 생기면 log찍힘 

/* --------------------------------- 정리사항 -----------------------------------------------------------------------
cardinality: keyword, ip 필드 등에서 사용 가능하며, 몇 종류의 필드들이 있는지 
percentiles: 백분위 구간 위치 값들 response합 (defulat:  1%, 5%, 25%, 50%, 75%, 95%, 99%) percents로 설정가능.  percentile_ranks: 반대로 값이 위치한 백분위 볼수 있음 

[bucket] 
range: 숫자 필드 값의 범위에 해당하는 doc_count 갯수 가져옴 / [from,to사용]            --날짜로도 가능(date_range)
histogram: range와 같이 숫자 필드로 값을 나누는/ interval옵션사용 (**이게 더 간단하고 유용할 듯)   --날짜(date_histogram)
terms : keyword필드의 문자열을 버킷으로 나누어 집계(count) 

[하위 agg 생성]

[파이프라인 agg]
 metrics aggregation의 결과를 새로운 입력으로 하는 pipeline aggregation
 min_bucket, max_bucket, avg_bucket, sum_bucket, stats_bucket, 이동 평균을 구하는 moving_avg, 미분값을 구하는 derivative, 값의 누적 합을 구하는 cumulative_sum
*/

 //=================================통계 계획================================

/*
용도별 각각 가격 그래프  x축:  l터 2리터 5리터 --- / 생활쓰레기, 음식물쓰레기 (종량제봉투용도)  
지역별 평균 가격  /  x축 : 지역  y축 ; 평균 가격    - 생활쓰레기 / 음식물쓰레기 라인 2개로 
*/
