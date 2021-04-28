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

BASE_API = 'https://osu.ppy.sh/api'

def download(url, file_name):
    with open(file_name, "wb") as file:
        response = get(url)
        if len(response.content) > 13:
            file.write(response.content)
        else:
            return False

def check_file(setid):
    print(f"[C]{Fore.LIGHTBLUE_EX} NERINA{Fore.RESET} | 메인 서버에 파일이 존재하는지 체크 중 ...{Fore.RESET}")
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
        print(f"[❌]{Fore.RED} {setid}{Fore.RESET} | 파일 마지막 수정 날짜 불일치{Fore.RESET}")
        os.remove(f"/media/data/beatmaps/{setid}.osz")
        print(f"[D]{Fore.RED} {setid}{Fore.RESET} | 파일 재 다운로드 시작")
        down = download_file(setid)
        return down

    return True

def download_file(setid):
    filedir = "/media/data/beatmaps/" + setid + ".osz"
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

def isthftgrAlive(setid):
    URLBASE = "https://xiiov.com/alive/"
    url = URLBASE + setid
    print(f"[C]{Fore.LIGHTBLUE_EX} {url}{Fore.RESET} | THFTGR 서버에 파일이 존재하는지 체크 중 ...{Fore.RESET}")
    downloads = get(url)
    if not downloads or downloads.status_code != 200:
        print(f"[❌]{Fore.RED} {setid}{Fore.RESET} | THFTGR 서버에 파일이 존재하지 않습니다.{Fore.RESET}")
        return False
    
    return True

def returnDownloadThtftgr(setid):
    filename = get_beatmapFileName_from_db(setid)

    URLBASE = "https://xiiov.com/d/"
    url = URLBASE + setid + f"?filename={filename}"

    return redirect(url)

    

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

def get_beatmapFileName_from_db(setid):
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

    cur.execute(f"SELECT concat(set_id, ' ', artist, ' - ', title, '.osz') from BeatmapMirror.beatmaps where set_id = {setid} limit 1;")

    try:
        d = cur.fetchone()
        filename = d[0]
    except:
        filename = 'None'

    mydb.close()
    
    return filename

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

def convertToBeatmapidToSetid(bid):
    randomkey = random.choice(banchokey)
    json_url = urlopen(f"{BASE_API}/get_beatmaps?k={randomkey}&b=" + bid)
    data = json.loads(json_url.read())
    try:
        beatmap = data[0]
        beatmap['preview_url'] = "//b.ppy.sh/preview/{beatmapset_id}.mp3".format(**beatmap)
        aa = checkBeatmapInDB(beatmap['beatmapset_id'])

        if not aa:
            aaaa = add_beatmap_just_one(beatmap['beatmapset_id'])

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
    json_url = get(f'http://192.168.0.6:8003/?&s={setid}')

    if not json_url or json_url.status_code != 200:
        print(f"[❌]{Fore.RED} {setid}{Fore.RESET} | 비트맵 데이터를 수동으로 추가하는데 문제가 발생하였습니다.{Fore.RESET}")
        return # TODO: return an error of the request being bad

    return 'ok'

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
        sql = 'INSERT INTO BeatmapMirror.sets (beatmapset_id, title, title_unicode, artist, artist_unicode, creator, submitted_date, ranked, ranked_date, last_updated, lset_checked, play_count, bpm, tags, genre_id, genre_name, language_id, language_name, favourite_count, preview_url) VALUES ({beatmapset_id}, "{title}", "{title_unicode}", "{artist}", "{artist_unicode}", "{creator}", "{submit_date}", {approved}, "{approved_date}", "{last_update}", "{nowtime}", {playcount}, {bpm}, "{tags}", {genre_id}, "", {language_id}, "", {favourite_count}, "{preview_url}");'.format(**beatmap, nowtime=nowtime)
        cur.execute(sql)
        mydb.commit()
    mydb.close()

    return 'ok'   

def ApiV1(ar, cs, od, hp, bpm, length, query, mode, status, amount, sort, sortby):
    try:
        mydb = mysql.connector.connect(
            host=UserConfig["MysqlHost"],
            user=UserConfig["MysqlUser"],
            passwd=UserConfig["MysqlPassword"]
        ) 
    except Exception as e:
        print(f"{Fore.RED} DB서버 접속에 실패하였습니다.\n 에러: {e}{Fore.RESET}")
        return 'server has some problems now'
    whereQuery = ""
    whereQuery2 = ""
    if ar['min'] == None:
        minAR = 0
    else:
        minAR = ar['min']
    if ar['max'] == None:
        maxAR = 10
    else:
        maxAR = ar['max']
    if cs['min'] == None:
        minCS = 0
    else:
        minCS = cs['min']
    if cs['max'] == None:
        maxCS = 10
    else:
        maxCS = cs['min']
    if od['min'] == None:
        minOD = 0
    else:
        minOD = od['min']
    if od['max'] == None:
        maxOD = 10
    else:
        maxOD = od['min']
    if hp['min'] == None:
        minHP = 0
    else:
        minHP = hp['min']
    if hp['max'] == None:
        maxHP = 10
    else:
        minHP = hp['min']
    if bpm['min'] == None:
        minBPM = 0
    else:
        minBPM = bpm['min']
    if bpm['max'] == None:
        maxBPM = 600
    else:
        maxBPM = bpm['min']
    if length['min'] == None:
        minLENGTH = 0
    else:
        minLENGTH = length['min']
    if length['max'] == None:
        maxLENGTH = 5000
    else:
        maxLENGTH = length['min']

    if status == '1':
        whereQuery += 'main.set_ranked in (1,2) '
        whereQuery2 += 'set_ranked in (1,2) '
    elif status == '3':
        whereQuery += 'main.set_ranked in (3) '
        whereQuery2 += 'set_ranked in (3) '
    elif status == '4':
        whereQuery += 'main.set_ranked in (4) '
        whereQuery2 += 'set_ranked in (4) '
    elif status == '0':
        whereQuery += 'main.set_ranked in (0, -1, -2) '
        whereQuery2 += 'set_ranked in (0, -1, -2) '
    elif status == '-3':
        whereQuery += 'main.set_ranked in (0, -1, -2,1,2,3,4,5,6) '
        whereQuery2 += 'set_ranked in (0, -1, -2,1,2,3,4,5,6) '
    elif status == None:
        whereQuery += 'main.set_ranked in (1,2) '
        whereQuery2 += 'set_ranked in (1,2) '
    else:
        whereQuery += 'main.set_ranked in (1,2) '
        whereQuery2 += 'set_ranked in (1,2) '

    if mode == None:
        whereQuery += f'and main.mode = 0 '
        whereQuery2 += f'and mode = 0 '
    elif mode == '-1':
        whereQuery += ''
        whereQuery2 += ''
    else:
        whereQuery += f'and main.mode = {mode} '
        whereQuery2 += f'and mode = {mode} '

    if sortby == None:
        sortQuery = " order by set_last_updated"
        sortQuery2 = " order by last_updated"
    else:
        sortQuery = f"order by {sortby}"
        sortQuery2 = f"order by {sortby}"
        sortQuery2 = sortQuery2.replace("set_", "")

    if sort == None:
        sortQuery += f" desc"
        sortQuery2 += f" desc"
    else:
        sortQuery += f" {sort}"
        sortQuery2 += f" {sort}"

    if amount == None:
        sortQuery += f" limit 48"
        sortQuery2 += f" limit 48"
    else:
        sortQuery += f" limit {amount}"
        sortQuery2 += f" limit {amount}"

    whereQuery += f'And main.ar between {minAR} and {maxAR} '
    whereQuery += f'And main.od between {minOD} and {maxOD} '
    whereQuery += f'And main.cs between {minCS} and {maxCS} '
    whereQuery += f'And main.hp between {minHP} and {maxHP} '
    whereQuery += f'And main.bpm between {minBPM} and {maxBPM} '
    whereQuery += f'And main.total_length between {minLENGTH} and {maxLENGTH} '

    whereQuery2 += f'And ar between {minAR} and {maxAR} '
    whereQuery2 += f'And od between {minOD} and {maxOD} '
    whereQuery2 += f'And cs between {minCS} and {maxCS} '
    whereQuery2 += f'And hp between {minHP} and {maxHP} '
    whereQuery2 += f'And bpm between {minBPM} and {maxBPM} '
    whereQuery2 += f'And total_length between {minLENGTH} and {maxLENGTH} '
    
    cur = mydb.cursor()
    if query != None and len(query) > 0:
        with open("./bin/sql/api_sql/with_query.sql", 'r') as sqlopen:
            sql = (sqlopen.read()).format(query, whereQuery, sortQuery)
    else:
        with open("./bin/sql/api_sql/without_query.sql", 'r') as sqlopen:
            sql = (sqlopen.read()).format(whereQuery2, sortQuery, sortQuery2)
    print(sql)
    cur.execute(sql)
    try:
        first_data = cur.fetchall()
        row_headers = [x[0] for x in cur.description]
        row_headers.insert(1, "ChildrenBeatmaps")
        a = list()
        second_data = list(first_data)
        for setdata in second_data:
            setdata = list(setdata)
            beatmapsetid = setdata[0]
            with open("./bin/sql/api_sql/subquery.sql", 'r') as sqlopen:
                sql = (sqlopen.read()).format(beatmapsetid)
            cur.execute(sql)
            ffirst_data = cur.fetchall()
            subrow_headers = [x[0] for x in cur.description]
            sub_data = list(ffirst_data)
            bmdata = []
            for bdata in sub_data:
                bmdata.append(dict(zip(subrow_headers, bdata)))
            setdata.insert(1, bmdata)
            a.append(setdata)
        data = []
        for result in a:
            data.append(dict(zip(row_headers, result)))
        return data
    except Exception as e:
        return {'error': str(e)}


def ApiV2(ar, cs, od, hp, bpm, length, query, mode, status, amount, sort, sortby):
    try:
        mydb = mysql.connector.connect(
            host=UserConfig["MysqlHost"],
            user=UserConfig["MysqlUser"],
            passwd=UserConfig["MysqlPassword"]
        ) 
    except Exception as e:
        print(f"{Fore.RED} DB서버 접속에 실패하였습니다.\n 에러: {e}{Fore.RESET}")
        return 'server has some problems now'
    whereQuery = ""
    whereQuery2 = ""
    if ar['min'] == None:
        minAR = 0
    else:
        minAR = ar['min']
    if ar['max'] == None:
        maxAR = 10
    else:
        maxAR = ar['max']
    if cs['min'] == None:
        minCS = 0
    else:
        minCS = cs['min']
    if cs['max'] == None:
        maxCS = 10
    else:
        maxCS = cs['min']
    if od['min'] == None:
        minOD = 0
    else:
        minOD = od['min']
    if od['max'] == None:
        maxOD = 10
    else:
        maxOD = od['min']
    if hp['min'] == None:
        minHP = 0
    else:
        minHP = hp['min']
    if hp['max'] == None:
        maxHP = 10
    else:
        minHP = hp['min']
    if bpm['min'] == None:
        minBPM = 0
    else:
        minBPM = bpm['min']
    if bpm['max'] == None:
        maxBPM = 600
    else:
        maxBPM = bpm['min']
    if length['min'] == None:
        minLENGTH = 0
    else:
        minLENGTH = length['min']
    if length['max'] == None:
        maxLENGTH = 5000
    else:
        maxLENGTH = length['min']

    NewWhereQuery = ""
    NewWhereQuery2 = ""

    if status == '1':
        NewWhereQuery += 'set_ranked in (1,2) '
        NewWhereQuery2 += "main.set_ranked in (1,2) "
    elif status == '3':
        NewWhereQuery2 += 'main.set_ranked in (3) '
        NewWhereQuery += 'set_ranked in (3) '
    elif status == '4':
        NewWhereQuery2 += 'main.set_ranked in (4) '
        NewWhereQuery += 'set_ranked in (4) '
    elif status == '0':
        NewWhereQuery2 += 'main.set_ranked in (0, -1, -2) '
        NewWhereQuery += 'set_ranked in (0, -1, -2) '
    elif status == '-3':
        NewWhereQuery2 += 'main.set_ranked in (0, -1, -2,1,2,3,4,5,6) '
        NewWhereQuery += 'set_ranked in (0, -1, -2,1,2,3,4,5,6) '
    elif status == None:
        NewWhereQuery2 += 'main.set_ranked in (1,2) '
        NewWhereQuery += 'set_ranked in (1,2) '
    else:
        NewWhereQuery2 += 'main.set_ranked in (1,2) '
        NewWhereQuery += 'set_ranked in (1,2) '

    if mode == None:
        NewWhereQuery2 += f'and main.mode = 0 '
        NewWhereQuery += f'and mode = 0 '
    elif mode == '-1':
        pass
    else:
        NewWhereQuery2 += f'and main.mode = {mode} '
        NewWhereQuery += f'and mode = {mode} '

    if sortby == None:
        sortQuery = " order by set_last_updated"
        sortQuery2 = " order by last_updated"
    else:
        sortQuery = f"order by {sortby}"
        sortQuery2 = f"order by {sortby}"
        sortQuery2 = sortQuery2.replace("set_", "")

    if sort == None:
        sortQuery += f" desc"
        sortQuery2 += f" desc"
    else:
        sortQuery += f" {sort}"
        sortQuery2 += f" {sort}"

    if amount == None:
        sortQuery += f" limit 48"
        sortQuery2 += f" limit 48"
    else:
        sortQuery += f" limit {amount}"
        sortQuery2 += f" limit {amount}"

    whereQuery += f'And main.ar between {minAR} and {maxAR} '
    whereQuery += f'And main.od between {minOD} and {maxOD} '
    whereQuery += f'And main.cs between {minCS} and {maxCS} '
    whereQuery += f'And main.hp between {minHP} and {maxHP} '
    whereQuery += f'And main.bpm between {minBPM} and {maxBPM} '
    whereQuery += f'And main.total_length between {minLENGTH} and {maxLENGTH} '

    whereQuery2 += f'And ar between {minAR} and {maxAR} '
    whereQuery2 += f'And od between {minOD} and {maxOD} '
    whereQuery2 += f'And cs between {minCS} and {maxCS} '
    whereQuery2 += f'And hp between {minHP} and {maxHP} '
    whereQuery2 += f'And bpm between {minBPM} and {maxBPM} '
    whereQuery2 += f'And total_length between {minLENGTH} and {maxLENGTH} '

    QuerySplice = str(query).split(" ")
    SearchQueryText = ""
    for queryText in QuerySplice:
        if "cs<" in queryText or "cs>" in queryText or "cs=" in queryText:
            NewWhereQuery += "AND " + queryText + " "
            NewWhereQuery2 += "AND main." + queryText + " "
            pass
        elif "ar<" in queryText or "ar>" in queryText or "ar=" in queryText:
            NewWhereQuery += "AND " + queryText + " "
            NewWhereQuery2 += "AND main." + queryText + " "
            pass
        elif "od<" in queryText or "od>" in queryText or "od=" in queryText:
            NewWhereQuery += "AND " + queryText + " "
            NewWhereQuery2 += "AND main." + queryText + " "
            pass
        elif "hp<" in queryText or "hp>" in queryText or "hp=" in queryText:
            NewWhereQuery += "AND " + queryText + " "
            NewWhereQuery2 += "AND main." + queryText + " "
            pass
        elif "bpm<" in queryText or "bpm>" in queryText or "bpm=" in queryText:
            NewWhereQuery += "AND " + queryText + " "
            NewWhereQuery2 += "AND main." + queryText + " "
            pass
        elif "length<" in queryText or "length>" in queryText or "length=" in queryText:
            queryText = queryText.replace("length", "total_length")
            NewWhereQuery += "AND " + queryText + " "
            NewWhereQuery2 += "AND main." + queryText + " "
            pass
        else:
            SearchQueryText += queryText + " "
            pass
    SearchQueryText = SearchQueryText[:-1]

    cur = mydb.cursor()
    with open("./bin/sql/api_sql/with_query.sql", 'r') as sqlopen:
        sql = (sqlopen.read()).format(SearchQueryText, NewWhereQuery2, sortQuery)
    cur.execute(sql)
    try:
        first_data = cur.fetchall()
        row_headers = [x[0] for x in cur.description]
        row_headers.insert(1, "ChildrenBeatmaps")
        a = list()
        second_data = list(first_data)
        for setdata in second_data:
            setdata = list(setdata)
            beatmapsetid = setdata[0]
            with open("./bin/sql/api_sql/subquery.sql", 'r') as sqlopen:
                sql = (sqlopen.read()).format(beatmapsetid)
            cur.execute(sql)
            ffirst_data = cur.fetchall()
            subrow_headers = [x[0] for x in cur.description]
            sub_data = list(ffirst_data)
            bmdata = []
            for bdata in sub_data:
                bmdata.append(dict(zip(subrow_headers, bdata)))
            setdata.insert(1, bmdata)
            a.append(setdata)

        data = []
        for result in a:
            data.append(dict(zip(row_headers, result)))
        
        return data
    except Exception as e:
        return {'error': str(e)}


cute_emoji = [ 'Σ(￣□￣;)', 'へ(￣∇￣へ)', '(ㅇ︿ㅇ)', '๑°⌓°๑', '٩(๑`^´๑)۶', '(ง •̀_•́)ง', "٩( 'ω' )و", '(๑╹∀╹๑)', '(╹౪╹*๑)', '٩(๑>∀<๑)۶', '(๑・‿・๑)', '✿˘◡˘✿', '(❀╹◡╹)', 'ʅ（´◔౪◔）ʃ'
 ]

