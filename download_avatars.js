// <username>:<token> -I https://api.github.com/users/lighthouse-labs
'use strict';
const dotenv = require('dotenv').config({path:'./.env'})
const request = require('request')

const BASE_URL = process.env.BASE_URL
const ACCEPT_HEADER = process.env.ACCEPT_HEADER
const ACCESS_TOKEN = process.env.ACCESS_TOKEN
const USERNAME = process.env.USERNAME

let repoOwner = process.argv[2]
let repoName = process.argv[3]


const getRepoContributors = (repoOwner, repoName, cb) => {
    return new Promise ((resolve, reject) => { 
    let response = ''
    let options = {
        uri: `${BASE_URL}/repos/${repoOwner}/${repoName}/contributors`,
        method: 'GET',
        encoding: 'utf8',
        headers: {
            'user-agent': 'request',
            'Authorization': ACCESS_TOKEN,
            'Accept': ACCEPT_HEADER
        }
    };
    request
        .get(options)
        .on('error', (err) => reject(err))
        .on('data', (data) => {
            response += data
        })
        .on('end', () => {
            resolve(response, cb)
        })
    })
}

getRepoContributors(repoOwner, repoName)
    .then((data) => {
        const dataJson = JSON.parse(data)
        for (let i of dataJson) {
            console.log(i.avatar_url)
        }
    })
    .catch(err => console.log(err))