from pymysql import NULL
from requests.api import request
from .config import UserConfig
import random
import time
import locale
import mysql.connector
import time
import json
from requests import get
from colorama import Fore
from urllib.request import urlopen
import pymongo
from bson.json_util import dumps
import datetime
import os
from flask import redirect
import base64

BASE_API = 'https://osu.ppy.sh/api'

def stringToBase64(s):
    return base64.b64encode(s.encode('utf-8'))

def req_update_beatmapsets(setid):
    url = f"https://api.nerina.pw/u?k={UserConfig['ApiKey']}&s={setid}"
    print(f"[U] {Fore.GREEN} {setid}{Fore.RESET} | 비트맵셋 업데이트 중...{Fore.RESET}")
    try:
        downloads = get(url)
        status = downloads.status_code

        if status == 200:
            return True
        else:
            return False
    except:
        return False

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
        cur.execute(f"select * from BeatmapMirror.beatmaps where set_id = {setid} limit 1")
        data = cur.fetchone()
        beatmapid = data[0]
    except:
        beatmapid = 0

    mydb.close()

    return beatmapid

def checkServerStatus():
    url_MainServer = f"https://api.nerina.pw/"
    url_SubServer = f"https://xiiov.com/search"
    MainServer = get(url_MainServer).status_code
    SubServer = get(url_SubServer).status_code
    result = []
    if MainServer == 200 and SubServer == 200:
        title = "Nerinyan's All services are running normally!"
        description = "네리냥의 모든 서비스가 정상적으로 작동되고 있습니다!"
        alertType = "success"
    elif MainServer == 200 and SubServer != 200:
        title = "Nerinyan's Sub Download server has some problemes now..."
        description = "네리냥의 미러 서버에 현재 문제가 발생하였습니다."
        alertType = "warning"
    elif MainServer != 200 and SubServer == 200:
        title = "Nerinyan's Main server has some problemes now..."
        description = "네리냥의 메인 서버에 현재 문제가 발생하였습니다."
        alertType = "warning"
    elif MainServer != 200 and SubServer != 200:
        title = "Nerinyan's All services has some problemes now..."
        description = "네리냥의 모든 서비스에 현재 문제가 발생하였습니다."
        alertType = "error"
    MainServerStatusCode = MainServer
    SubServerStatusCode = SubServer
    result.append({"title": title, "description": description, "alertType": alertType, "ServerStatus": {"Main": MainServerStatusCode, "Sub": SubServerStatusCode}})
    return result

def convertToBeatmapidToSetid(bid):
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
        cur.execute(f"select beatmapset_id from BeatmapMirror.beatmaps where beatmap_id = {bid} limit 1")
        data = cur.fetchone()
        sid = data[0]
        return sid
    except:
        sid = 0

    if sid == 0:
        randomkey = random.choice(banchokey)
        json_url = urlopen(f"{BASE_API}/get_beatmaps?k={randomkey}&b=" + bid)
        data = json.loads(json_url.read())
        try:
            beatmap = data[0]
            beatmap['preview_url'] = "//b.ppy.sh/preview/{beatmapset_id}.mp3".format(**beatmap)
            aa = checkBeatmapInDB(beatmap['beatmapset_id'])

            if not aa:
                req_update_beatmapsets(beatmap['beatmapset_id'])

            return beatmap['beatmapset_id']
        except Exception as e:
            return e

cute_emoji = [ 'Σ(￣□￣;)', 'へ(￣∇￣へ)', '(ㅇ︿ㅇ)', '๑°⌓°๑', '٩(๑`^´๑)۶', '(ง •̀_•́)ง', "٩( 'ω' )و", '(๑╹∀╹๑)', '(╹౪╹*๑)', '٩(๑>∀<๑)۶', '(๑・‿・๑)', '✿˘◡˘✿', '(❀╹◡╹)', 'ʅ（´◔౪◔）ʃ'
 ]