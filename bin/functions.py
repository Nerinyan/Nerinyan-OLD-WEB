from pymysql import NULL
from .config import UserConfig
from flask_jsonpify import jsonify
import random
from collections import defaultdict
import requests
import pprint

from Crypto import Random
from Crypto.Cipher import AES
import base64
import hashlib
from Crypto import Random

import time
import datetime
import locale

import mysql.connector
from colorama import init, Fore
import redis
import bcrypt
import datetime
import requests
from discord_webhook import DiscordWebhook, DiscordEmbed
import time
import hashlib
import json
import pycountry
import os
import timeago
from requests import get
from urllib.request import urlopen

banchokey = ["1234567890"]
BASE_API = 'https://osu.ppy.sh/api'

def genToken(username):
    istokne = chkToken(username)
    if istokne[0]:
        return istokne[1]
    now = time.strftime('%Y-%m-%d %H:%M:%S')
    now2 = int(time.time())
    expire = now2 + 259200
    text = f"{username}tokengeneratedby{now}"
    result = (bcrypt.hashpw(text.encode('UTF-8'), bcrypt.gensalt())).decode('utf-8')
    try:
        mydb = mysql.connector.connect(
            host=UserConfig["MysqlHost"],
            user=UserConfig["MysqlUser"],
            passwd=UserConfig["MysqlPassword"]
        ) 
    except Exception as e:
        print(f"{Fore.RED} DB서버 접속에 실패하였습니다.\n 에러: {e}{Fore.RESET}")
        exit()
    mycursor = mydb.cursor()

    mycursor.execute(f"INSERT INTO NerinaCDN.token VALUES ('{username}', '{result}', {expire}, 0, {now2})")
    mydb.commit()
    return result
        

def chkToken(username):
    try:
        mydb = mysql.connector.connect(
            host=UserConfig["MysqlHost"],
            user=UserConfig["MysqlUser"],
            passwd=UserConfig["MysqlPassword"]
        ) 
    except Exception as e:
        print(f"{Fore.RED} DB서버 접속에 실패하였습니다.\n 에러: {e}{Fore.RESET}")
        exit()    
    mycursor = mydb.cursor()
    mycursor.execute(f"SELECT token, expire, isexpired, generatetime FROM NerinaCDN.token WHERE userid = '{username}'")
    user = mycursor.fetchall()
    if not user:
        return [False]
    user = user[0]
    expire = user[1]
    isexpired = user[2]
    generatewhen = user[3]
    if not isexpired:
        expirechk = expire - generatewhen
        if expirechk < 0:
            mycursor.execute(f"DELETE FROM NerinaCDN.token WHERE userid = '{username}'")
            mydb.commit()
            return [False]

        return [True, user[0]]

def get_beatmap_file_name(setid):
    try:
        mydb = mysql.connector.connect(
            host=UserConfig["MysqlHost"],
            user=UserConfig["MysqlUser"],
            passwd=UserConfig["MysqlPassword"]
        ) 
    except Exception as e:
        print(f"{Fore.RED} DB서버 접속에 실패하였습니다.\n 에러: {e}{Fore.RESET}")
        return 'server has some problems now'
    cur = mydb.cursor()
    with open("./bin/sql/get_beatmap_file_name.sql", 'r') as sqlopen:
        sql = (sqlopen.read()).format(setid)
    cur.execute(sql)
    beatdata = cur.fetchone()
    try:    
        artist = beatdata[0]
        title = beatdata[1] 
        final_file_name = f"{setid} {artist} - {title}.osz"
        mydb.close()
        return final_file_name
    except:
        addbeatmap = add_beatmap_just_one(setid)
        if addbeatmap == 'ok':
            try:
                mydb = mysql.connector.connect(
                    host=UserConfig["MysqlHost"],
                    user=UserConfig["MysqlUser"],
                    passwd=UserConfig["MysqlPassword"]
                ) 
            except Exception as e:
                print(f"{Fore.RED} DB서버 접속에 실패하였습니다.\n 에러: {e}{Fore.RESET}")
                return 'server has some problems now'
            cur = mydb.cursor()
            cur.execute(sql)
            beatdata = cur.fetchone()
            try:    
                artist = beatdata[0]
                title = beatdata[1] 
                final_file_name = f"{setid} {artist} - {title}.osz"
                mydb.close()
                return final_file_name
            except:
                return f'db not found'
        else:
            return f'db not found'

def checkBeatmapInDB(setid):
    try:
        mydb = mysql.connector.connect(
            host=UserConfig["MysqlHost"],
            user=UserConfig["MysqlUser"],
            passwd=UserConfig["MysqlPassword"]
        ) 
    except Exception as e:
        print(f"{Fore.RED} DB서버 접속에 실패하였습니다.\n 에러: {e}{Fore.RESET}")
        return 'server has some problems now'
    cur = mydb.cursor()
    try:
        cur.execute(f"select * from BeatmapMirror where beatmapset_id = {setid}")
        data = cur.fetchone()
        beatmapid = data[0]
    except:
        beatmapid = 0

    mydb.close()

    return beatmapid

def convertToBeatmapidToSetid(bid):
    randomkey = random.choice(banchokey)
    json_url = urlopen(f"{BASE_API}/get_beatmaps?k={randomkey}&b=" + bid)
    data = json.loads(json_url.read())
   #print(data)
    try:
        beatmap = data[0]
        beatmap['preview_url'] = "//b.ppy.sh/preview/{beatmapset_id}.mp3".format(**beatmap)
        aa = checkBeatmapInDB(beatmap['beatmapset_id'])

        if not aa:
            aaaa = insert_data(beatmap)

        return beatmap['beatmapset_id']
    except Exception as e:
        return e 

def add_beatmap_just_one(setid):
    randomkey = random.choice(banchokey)
    params = {
        'k': randomkey,
        's': setid
    }
    json_url = get(f'{BASE_API}/get_beatmaps?', params = params)

    if not json_url or json_url.status_code != 200:
        return # TODO: return an error of the request being bad

    data = json_url.json()
    if not data:
        return # TODO: return an error of empty data
   #print(data)
    try:
        beatmap = data[0]
        beatmap['preview_url'] = "//b.ppy.sh/preview/{beatmapset_id}.mp3".format(**beatmap)
        aaaa = insert_data(beatmap)
        return aaaa
    except Exception as e:
        return e

def insert_data(beatmap: dict):
    try:
        mydb = mysql.connector.connect(
            host=UserConfig["MysqlHost"],
            user=UserConfig["MysqlUser"],
            passwd=UserConfig["MysqlPassword"]
        ) 
    except Exception as e:
        print(f"{Fore.RED} DB서버 접속에 실패하였습니다.\n 에러: {e}{Fore.RESET}")
        return 'server has some problems now'
    cur = mydb.cursor()

    cur.execute("select beatmapset_id from BeatmapMirror.sets where beatmapset_id = {beatmapset_id}".format(**beatmap))
    chkdata = cur.fetchone()
    try:
        beatmap_id = chkdata[0]
    except:
        beatmap_id = NULL
    if beatmap_id == NULL:
        locale.setlocale(locale.LC_TIME,'ko_KR.UTF-8')
        nowtime = time.strftime("%Y-%m-%dT%H:%M:%S+09:00", time.localtime(time.time()))
        print('INSERT INTO BeatmapMirror.sets (beatmapset_id, title, title_unicode, artist, artist_unicode, creator, submitted_date, ranked, ranked_date, last_updated, lset_checked, play_count, bpm, tags, genre_id, genre_name, language_id, language_name, favourite_count, preview_url) VALUES ({beatmapset_id}, "{title}", "{title_unicode}", "{artist}", "{artist_unicode}", "{creator}", "{submit_date}", {approved}, "{approved_date}", "{last_update}", "{nowtime}", {playcount}, {bpm}, "{tags}", {genre_id}, "", {language_id}, "", {favorite_count}, "{preview_url}");'.format(**beatmap, nowtime = nowtime))
        cur.execute('INSERT INTO BeatmapMirror.sets (beatmapset_id, title, title_unicode, artist, artist_unicode, creator, submitted_date, ranked, ranked_date, last_updated, lset_checked, play_count, bpm, tags, genre_id, genre_name, language_id, language_name, favourite_count, preview_url) VALUES ({beatmapset_id}, "{title}", "{title_unicode}", "{artist}", "{artist_unicode}", "{creator}", "{submit_date}", {approved}, "{approved_date}", "{last_update}", "{nowtime}", {playcount}, {bpm}, "{tags}", {genre_id}, "", {language_id}, "", {favorite_count}, "{preview_url}");'.format(**beatmap, nowtime = nowtime))
        mydb.commit()
    mydb.close()

    return 'ok'   

cute_emoji = [ 'Σ(￣□￣;)', 'へ(￣∇￣へ)', '(ㅇ︿ㅇ)', '๑°⌓°๑', '٩(๑`^´๑)۶', '(ง •̀_•́)ง', "٩( 'ω' )و", '(๑╹∀╹๑)', '(╹౪╹*๑)', '٩(๑>∀<๑)۶', '(๑・‿・๑)', '✿˘◡˘✿', '(❀╹◡╹)', 'ʅ（´◔౪◔）ʃ'
 ]

