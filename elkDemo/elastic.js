const {Client}  = require('@elastic/elasticsearch')
const client = new Client({
    node : "http://elastic:alpaco*5700@192.168.30.30:9200"
})   


module.exports = async function() {
    const result1 = await client.search({
        index : "garbage11",
        body : {
            query : {
                match : {
                    "시도명" : "서울특별시"            
                }
            },
            size : 0,
            aggs : {
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
    })   

    const result2 = await client.search({
        index : "garbage11",
        body : {
            query : {
                match : {
                    "시도명" : "전라북도"
                }
            },
            size : 0,
            aggs : {
                "price_his" :{
                    "histogram" : {
                        "field" : "50ℓ가격",
                        "interval" : 1000
                    }
                }
            }
        }
    })

    global.result1 = result1;   //result1 변수를 밖에서도 사용하기 위해서
    global.result2=result2;

    res1 = result1.aggregations.garbageType.buckets;   //global로 result사용가능
   // module.exports.res1 = res1;
    res2 = result2.aggregations.price_his.buckets; 
    //module.exports.res2 = res2;
    return {res1,res2};
}

//chart1().catch(console.log);

// chart1().then(function(result){
//     console.log('this is then')
// })

module.exports = (async function() {
    const client = 10;
   
     const db =20;
     return { client, db };
   })();
