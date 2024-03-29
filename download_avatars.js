// <username>:<token> -I https://api.github.com/users/lighthouse-labs
'use strict';
const dotenv = require('dotenv').config({path:'./.env'})
const request = require('request')
const fs = require('fs')

// Environment variables loaded from .env file
const BASE_URL = process.env.BASE_URL
const ACCEPT_HEADER = process.env.ACCEPT_HEADER
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

// Command line arguments
let repoOwner = process.argv[2]
let repoName = process.argv[3]

// getRepoContributors returns a list of URLs
// for the avatars of contributors
const getRepoContributors = (repoOwner, repoName) => {
    return new Promise ((resolve, reject) => {
    if(repoOwner === undefined || repoName === undefined) {
        reject('Please run as follows:\nnpm run <repo owner> <repo name>')
    } else if (process.argv.length !== 4) {
        reject('Wrong number of arguments\nPlease run as follows:\nnpm run <repo owner> <repo name>')
    }
    let outcome = ''
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
            outcome += data
        })
        .on('response', (res) => {
            if (res.statusCode !== 200 && res.statusCode === 404) {
                reject('Github User or Repo not found')
            }
        })
        .on('end', () => {
            resolve(outcome)
        })
    })
}

// downloadImageByURL creates a file for each image
// by url and names the file as per his username
const downloadImageByURL = (url, filePath) => {
    var dir = './avatars';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    let img = fs.createWriteStream(filePath)
    img.on('open', () => {
        request(url).pipe(img)
    })
}

// Drives the program
getRepoContributors(repoOwner, repoName)
    .then((data) => {
        const dataJson = JSON.parse(data)
        for (let i of dataJson) {
            downloadImageByURL(i.avatar_url, `./avatars/${i.login}.jpg`)
        }
    })
    .catch(err => console.log(err))