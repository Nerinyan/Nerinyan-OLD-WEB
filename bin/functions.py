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

BASE_API = 'https://osu.ppy.sh/api'

def download(url, file_name):
    with open(file_name, "wb") as file:
        response = get(url)
        if len(response.content) > 13:
            file.write(response.content)
        else:
            return False

def check_file(setid):
    check = os.path.isfile(f"/media/data/beatmaps/{setid}.osz")
    if check:
        a = check_mtime_file(setid)
        if a:
            return True
    down = download_file(setid)

    return down

def check_mtime_file(setid):
    check = os.path.getmtime(f"/media/data/beatmaps/{setid}.osz")
    data = get_beatmap_data_on_bancho(setid)
    last_update = data['last_update']
    ts_last_update = time.mktime(datetime.datetime.strptime(last_update, '%Y-%m-%d %H:%M:%S').timetuple())
    owo = int(check - ts_last_update)

    if owo < 0:
        print(f"[❌]{Fore.RED} {setid} | 파일 마지막 수정 날짜 불일치{Fore.RESET}")
        os.remove(f"/media/data/beatmaps/{setid}.osz")
        print(f"[D]{Fore.RED} {setid} | 파일 재 다운로드 시작{Fore.RESET}")
        down = download_file(setid)
        return down

    return True

def download_file(setid):
    filedir = "beatmaps/" + setid + ".osz"
    if os.path.exists(filedir):
        os.remove(filedir)
    url = f"http://192.168.0.6:8003/d/?name=false&s={setid}"
    print(f"[D]{Fore.GREEN} {url}{Fore.RESET} | 다운로드 시도중...{Fore.RESET}")
    downloads = get(url)
    status = downloads.status_code
    if status == 200:
        beatmapsize = os.path.getsize(filedir)
        if beatmapsize >= 1000000:
            print(f"[✔]{Fore.GREEN} {url}{Fore.RESET} | 다운로드 성공!{Fore.RESET}")
            return True
        else:
            os.remove(filedir)
    else:
        print(f"[❌]{Fore.RED} {url}{Fore.RESET} | 다운로드 실패{Fore.RESET}")
        url = f"http://beatconnect.io/b/{setid}"
        print(f"[D]{Fore.GREEN} {url}{Fore.RESET} | 다운로드 시도중...{Fore.RESET}")
        down = download(url, filedir)
        if down:
            beatmapsize = os.path.getsize(filedir)
            if beatmapsize >= 1000000:
                print(f"[✔] {Fore.GREEN} {url}{Fore.RESET} | 다운로드 성공!{Fore.RESET}")
                return True
            else:
                os.remove(filedir)
                print(f"[❌] {Fore.RED} {url}{Fore.RESET} | 다운로드 실패{Fore.RESET}")
                return False
        else:
            print(f"[❌] {Fore.RED} {url}{Fore.RESET} | 다운로드 실패{Fore.RESET}")
            os.remove(filedir)
            return False

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

def req_update_beatmapsets(setid):
    url = f"http://192.168.0.6:8003/?s={setid}"
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


def get_setdata_from_db(setid):
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

    cur.execute(f"SELECT beatmap_id, beatmapset_id, beatmap_version, ranked, FORMAT(difficulty_rating,0) as difficulty_rating, mode, mode_str, FORMAT(bpm,0) as bpm, FORMAT(ar,0) as ar, FORMAT(cs,0) as cs, FORMAT(od,0) as od, FORMAT(hp,0) as hp, total_length, hit_length, playcount, passcount FROM BeatmapMirror.beatmaps where beatmap_id = {setid} limit 1;")

    try:
        first_data = cur.fetchall()
        row_headers = [x[0] for x in cur.description]
        second_data = list(first_data)
        data = []
        for result in second_data:
            data.append(dict(zip(row_headers, result)))
    except:
        data = []

    mydb.close()

    print(data)

    json = {'result': data}
    
    return json

def get_data_from_db(offset, amout, mode, status, query):
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

    if status == 0:
        ranked = '0, -1, -2'
    elif status == 4:
        ranked = '4'
    elif status == 3:
        ranked = '3, 2'
    elif status == -3:
        ranked = '-1, -2, 0, 1, 2, 3, 4 ,5'
    elif status == 1:
        ranked = '1'
    else:
        ranked = '-1, -2, 0, 1, 2, 3, 4 ,5'


    if len(query) > 1:
        sqldir = "./bin/sql/api_sql/with_query.sql"
        with open(sqldir, 'r') as sqlopen:
            sql = (sqlopen.read()).format(offset, mode, ranked, query)
    else:
        sqldir = "./bin/sql/api_sql/without_query.sql"
        with open(sqldir, 'r') as sqlopen:
            sql = (sqlopen.read()).format(ranked, mode, offset, 2)

    cur.execute(sql)
    aa = [{'a':'b', 'c':'d'}, {'e':'f', 'g':'h'}]
    try:
        first_data = cur.fetchall()
        row_headers = [x[0] for x in cur.description]
        row_headers.insert(1, 'Beatmaps')
        bmapdata = []
        for i in first_data:
            bsetid = i[0]
            sqldir = "./bin/sql/api_sql/beatmap_query.sql"
            with open(sqldir, 'r') as sqlopen:
                sql = (sqlopen.read()).format(bsetid)
            cur.execute(sql)
            bmapdatas = cur.fetchall()
            row_headers = [x[0] for x in cur.description]
            bmapdatalist = list(bmapdatas)

            print(row_headers)
            for result in bmapdatalist:
                bmapdata.append(dict(zip(row_headers, result)))
            
        dbdatalist = list(first_data)
        dbdatalist.insert(1, aa)
        first_data = tuple(dbdatalist)
        data = []
        for result in dbdatalist:
            data.append(dict(zip(row_headers, result)))
    except Exception as e:
        data = [{'error': str(e)}]

    mydb.close()

    json = {'result': bmapdata}
    
    return json

def get_data_from_mongodb(offset, amout, mode, status, query):
    host = UserConfig["MongoHost"]
    user = UserConfig["MongoUser"]
    password = UserConfig["MongoPassword"]
    client = pymongo.MongoClient(f'mongodb://{user}:{password}@{host}')
    db = client["Debian"]
    collection = db["BeatmapSets"]
    data = [{"a": "b"}]
    results = dumps(collection.find().sort([("last_updated", -1)]).limit(30))
    dict = json.loads(results)
    
    client.close()

    return dict

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
    try:
        beatmap = data[0]
        beatmap['preview_url'] = "//b.ppy.sh/preview/{beatmapset_id}.mp3".format(**beatmap)
        aa = checkBeatmapInDB(beatmap['beatmapset_id'])

        if not aa:
            aaaa = insert_data(beatmap)

        return beatmap['beatmapset_id']
    except Exception as e:
        return e 

def get_beatmap_data_on_bancho(setid):
    randomkey = random.choice(banchokey)
    params = {
        'k': randomkey,
        's': setid
    }
    json_url = get(f'{BASE_API}/get_beatmaps?', params = params)
    
    if not json_url or json_url.status_code != 200:
        print(f"[❌]{Fore.RED} {setid}{Fore.RESET} | 반초API에서의 응답이 원할하지 않습니다.{Fore.RESET}")
        return # TODO: return an error of the request being bad

    data = json_url.json()
    
    if not data:
        print(f"[❌]{Fore.RED} {setid}{Fore.RESET}| 반초API 데이터를 JSON으로 변환하는 도중 문제가 발생하였습니다.{Fore.RESET}")
        return # TODO: return an error of empty data

    beatmap = data[0]
    beatmap['preview_url'] = "//b.ppy.sh/preview/{beatmapset_id}.mp3".format(**beatmap)
    return beatmap

def add_beatmap_just_one(setid):
    randomkey = random.choice(banchokey)
    params = {
        'k': randomkey,
        's': setid
    }
    json_url = get(f'{BASE_API}/get_beatmaps?', params = params)
    
    if not json_url or json_url.status_code != 200:
        print(f"[❌]{Fore.RED} {setid}{Fore.RESET} | 반초API에서의 응답이 원할하지 않습니다.{Fore.RESET}")
        return # TODO: return an error of the request being bad

    data = json_url.json()
    
    if not data:
        print(f"[❌]{Fore.RED} {setid}{Fore.RESET}| 반초API 데이터를 JSON으로 변환하는 도중 문제가 발생하였습니다.{Fore.RESET}")
        return # TODO: return an error of empty data

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
        sql = 'REPLACE INTO BeatmapMirror.sets (beatmapset_id, title, title_unicode, artist, artist_unicode, creator, submitted_date, ranked, ranked_date, last_updated, lset_checked, play_count, bpm, tags, genre_id, genre_name, language_id, language_name, favourite_count, preview_url) VALUES ({beatmapset_id}, "{title}", "{title_unicode}", "{artist}", "{artist_unicode}", "{creator}", "{submit_date}", {approved}, "{approved_date}", "{last_update}", "{nowtime}", {playcount}, {bpm}, "{tags}", {genre_id}, "", {language_id}, "", {favourite_count}, "{preview_url}");'.format(**beatmap, nowtime=nowtime)
        cur.execute(sql)
        mydb.commit()
    mydb.close()

    return 'ok'   

cute_emoji = [ 'Σ(￣□￣;)', 'へ(￣∇￣へ)', '(ㅇ︿ㅇ)', '๑°⌓°๑', '٩(๑`^´๑)۶', '(ง •̀_•́)ง', "٩( 'ω' )و", '(๑╹∀╹๑)', '(╹౪╹*๑)', '٩(๑>∀<๑)۶', '(๑・‿・๑)', '✿˘◡˘✿', '(❀╹◡╹)', 'ʅ（´◔౪◔）ʃ'
 ]

