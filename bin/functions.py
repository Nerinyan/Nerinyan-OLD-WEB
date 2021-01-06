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
from urllib.request import urlopen

banchokey = ["1234567890"]

def genToken(username):
    istokne = chkToken(username)
    if not istokne[0]:
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
    else:
        return istokne[1]

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
    else:
        user = user[0]
        expire = user[1]
        isexpired = user[2]
        generatewhen = user[3]
        if isexpired == 0:
            expirechk = expire - generatewhen
            if expirechk < 0:
                mycursor.execute(f"DELETE FROM NerinaCDN.token WHERE userid = '{username}'")
                mydb.commit()
                return [False]
            else:
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
    sqlopen = open("./bin/sql/get_beatmap_file_name.sql", 'r')
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
    json_url = urlopen(f"https://osu.ppy.sh/api/get_beatmaps?k={randomkey}&b=" + bid)
    data = json.loads(json_url.read())
   #print(data)
    try:
        beatmapid = data[0]['beatmap_id']
        b_setid = data[0]['beatmapset_id']
        b_artist = data[0]['artist']
        b_artist_unicode = data[0]['artist_unicode']
        b_title = data[0]['title']
        b_title_unicode = data[0]['title_unicode']
        b_creator = data[0]['creator']
        b_submit_date = data[0]['submit_date']
        b_last_update = data[0]['last_update']
        b_playcount = data[0]['playcount']
        b_bpm = data[0]['bpm']
        b_tags = data[0]['tags']
        b_genre_id = data[0]['genre_id']
        b_language_id = data[0]['language_id']
        b_favourite_count = data[0]['favourite_count']
        b_preview_url = f"//b.ppy.sh/preview/{b_setid}.mp3"
        b_ranked = data[0]['approved']
        b_ranked_date = data[0]['approved_date']

        aa = checkBeatmapInDB(b_setid)

        if aa == 0:
            aaaa = insert_data(set_id = b_setid, artist = b_artist, artist_unicode = b_artist_unicode, title = b_title, title_unicode = b_title_unicode, creator = b_creator, 
                        submit_date = b_submit_date, last_update = b_last_update, playcount = b_playcount, bpm = b_bpm, tags = b_tags, genre_id = b_genre_id, genre_name = '', language_id = b_language_id, language_name = '', favorite_count = b_favourite_count,
                        preview_url = b_preview_url, ranked = b_ranked, ranked_date = b_ranked_date)

        return b_setid
    except Exception as e:
        return e 

def add_beatmap_just_one(setid):
    randomkey = random.choice(banchokey)
    json_url = urlopen(f"https://osu.ppy.sh/api/get_beatmaps?k={randomkey}&s=" + setid)
    data = json.loads(json_url.read())
   #print(data)
    try:
        beatmapid = data[0]['beatmap_id']
        b_setid = data[0]['beatmapset_id']
        b_artist = data[0]['artist']
        b_artist_unicode = data[0]['artist_unicode']
        b_title = data[0]['title']
        b_title_unicode = data[0]['title_unicode']
        b_creator = data[0]['creator']
        b_submit_date = data[0]['submit_date']
        b_last_update = data[0]['last_update']
        b_playcount = data[0]['playcount']
        b_bpm = data[0]['bpm']
        b_tags = data[0]['tags']
        b_genre_id = data[0]['genre_id']
        b_language_id = data[0]['language_id']
        b_favourite_count = data[0]['favourite_count']
        b_preview_url = f"//b.ppy.sh/preview/{b_setid}.mp3"
        b_ranked = data[0]['approved']
        b_ranked_date = data[0]['approved_date']

        aaaa = insert_data(set_id = b_setid, artist = b_artist, artist_unicode = b_artist_unicode, title = b_title, title_unicode = b_title_unicode, creator = b_creator, 
                    submit_date = b_submit_date, last_update = b_last_update, playcount = b_playcount, bpm = b_bpm, tags = b_tags, genre_id = b_genre_id, genre_name = '', language_id = b_language_id, language_name = '', favorite_count = b_favourite_count,
                    preview_url = b_preview_url, ranked = b_ranked, ranked_date = b_ranked_date)
        return aaaa
    except Exception as e:
        return e

def insert_data(set_id, artist, artist_unicode, title, title_unicode, creator, submit_date, last_update, playcount, bpm, tags, genre_id, genre_name, language_id, language_name, favorite_count, preview_url, ranked, ranked_date):
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

    cur.execute(f"select beatmapset_id from BeatmapMirror.sets where beatmapset_id = {set_id}")
    chkdata = cur.fetchone()
    try:
        beatmap_id = chkdata[0]
    except:
        beatmap_id = NULL
    if beatmap_id == NULL:
        locale.setlocale(locale.LC_TIME,'ko_KR.UTF-8')
        nowtime = time.strftime("%Y-%m-%dT%H:%M:%S+09:00", time.localtime(time.time()))
        print(f'INSERT INTO BeatmapMirror.sets (beatmapset_id, title, title_unicode, artist, artist_unicode, creator, submitted_date, ranked, ranked_date, last_updated, lset_checked, play_count, bpm, tags, genre_id, genre_name, language_id, language_name, favourite_count, preview_url) VALUES ({set_id}, "{title}", "{title_unicode}", "{artist}", "{artist_unicode}", "{creator}", "{submit_date}", {ranked}, "{ranked_date}", "{last_update}", "{nowtime}", {playcount}, {bpm}, "{tags}", {genre_id}, "", {language_id}, "", {favorite_count}, "{preview_url}");')
        cur.execute(f'INSERT INTO BeatmapMirror.sets (beatmapset_id, title, title_unicode, artist, artist_unicode, creator, submitted_date, ranked, ranked_date, last_updated, lset_checked, play_count, bpm, tags, genre_id, genre_name, language_id, language_name, favourite_count, preview_url) VALUES ({set_id}, "{title}", "{title_unicode}", "{artist}", "{artist_unicode}", "{creator}", "{submit_date}", {ranked}, "{ranked_date}", "{last_update}", "{nowtime}", {playcount}, {bpm}, "{tags}", {genre_id}, "", {language_id}, "", {favorite_count}, "{preview_url}");')
        mydb.commit()
    mydb.close()

    return 'ok'   

cute_emoji = [ 'Σ(￣□￣;)', 'へ(￣∇￣へ)', '(ㅇ︿ㅇ)', '๑°⌓°๑', '٩(๑`^´๑)۶', '(ง •̀_•́)ง', "٩( 'ω' )و", '(๑╹∀╹๑)', '(╹౪╹*๑)', '٩(๑>∀<๑)۶', '(๑・‿・๑)', '✿˘◡˘✿', '(❀╹◡╹)', 'ʅ（´◔౪◔）ʃ'
 ]

