'use strict'

const { Client} = require('@elastic/elasticsearch')     //require모듈 불러다 쓰기 ex)내가 생성한 chart.js를 불러다 쓰는 것 
console.log(Client)
const client = new Client({ 
    node: 'http://elastic:alpaco*5700@192.168.30.30:9200'
})   


async function run () {
    // Let's start by indexing some data
    var a = await client.index({
      index: 'garbage1',
      body: {
        character: 'Ned Stark',
        quote: 'Winter is coming.'
      }
    })

    var b = await client.index({
        index: 'garbage11',
        refresh : true,
        body: {
          character: 'Ned Stark',
          quote: 'Winter is coming.'
        }
      })
      console.log(a)
      console.log(b)

}

run().catch(console.log)