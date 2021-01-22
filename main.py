from flask import Flask, render_template, send_from_directory, make_response, jsonify, redirect, url_for, request
from flask_restful import reqparse
from flask.helpers import send_file
from bin.config import UserConfig
from bin.functions import *
import os
from requests import get

app = Flask('NerinaBeatmapMirror')

host = UserConfig["host"]
port = UserConfig["port"]
debugmode = bool(UserConfig["debug"])

@app.route("/")
@app.route("/dev")
def main_redirect():
    return redirect(url_for('main'))

@app.route('/ip', methods=['GET'])
def get_ip():
    return request.environ.get('HTTP_X_REAL_IP', request.remote_addr)

@app.route("/main")
def main():
    parser = reqparse.RequestParser()
    parser.add_argument('creator', type=int)
    parser.add_argument('mode', type=int)
    parser.add_argument('status', type=int)
    parser.add_argument('query', type=str)
    args = parser.parse_args()
    creatorid = args['creator']
    mode = args['mode']
    status = args['status']
    query = args['query']
    if creatorid == None:
        creatorid = 0
    if mode == None:
        mode = 0
    if status == None:
        status = 1
    if query == None:
        query = ''
    return render_template("main.html", creator=creatorid, mode=str(mode), status=str(status), query=str(query))

@app.route("/old")
def oldmain():
    return render_template("old.html")

@app.route('/example')
def owowowo():
    resp = make_response(send_from_directory('', 'video.txt'))
    resp.headers['Content-type'] = 'text/plain; charset=utf-8'
    return resp

@app.route('/d/<setid>')
@app.route('/s/<setid>')
@app.route('/osu/s/<setid>')
def download_beatmapset(setid):
    check = check_file(setid)
    if check:
        path = "./beatmaps/"
        fileformat = ".osz"
        filename = get_beatmap_file_name(setid)
        if filename == 'db not found':
            return f'beatmap({setid}) not found ErrorCode-1'
        else:
            return send_file(f"{path}{setid}{fileformat}", attachment_filename=filename, as_attachment=True)
    else:
        return f'beatmap({setid}) not found ErrorCode-3'

@app.route('/osu/b/<bid>')
@app.route('/b/<bid>')
def downlaod_beatmap(bid):
    setid = convertToBeatmapidToSetid(bid)
    print(setid)
    check = check_file(setid)
    if check:
        path = "./beatmaps/"
        fileformat = ".osz"
        filename = get_beatmap_file_name(setid)
        if filename == 'db not found':
            return f'beatmap({setid}) not found ErrorCode-4'
        else:
            return send_file(f"{path}{setid}{fileformat}", attachment_filename=filename, as_attachment=True)
    else:
        return f'beatmap({setid}) not found ErrorCode-5'

@app.route('/api/b/<setid>')
def api_getset(setid):

    data = get_setdata_from_db(setid)
    result = jsonify(data)

    return result

def download(url, file_name):
    with open(file_name, "wb") as file:
        response = get(url)
        if len(response.content) > 13:
            file.write(response.content)
        else:
            return 'no'

def check_file(setid):
    check = os.path.isfile(f"/media/data/beatmaps/{setid}.osz")
    if check:
        return True
    
    urls = ('https://beatconnect.io/b/', 'http://192.168.0.6:8003?name=false&s=', 'https://hentai.ninja/d/', 'http://storage.ainu.pw/d/', 'http://storage.ripple.moe/d/')
    for url in urls:
        filedir = "beatmaps/" + setid + ".osz"
        if os.path.exists(filedir):
            os.remove(filedir)
        url = f"{url}{setid}"
        download(url, filedir)
        beatmapsize = os.path.getsize(filedir)
        if beatmapsize >= 1000000:
            return True
        else:
            os.remove(filedir)
            continue

    return False

if __name__ == '__main__':
    app.run(port=port, host=host, debug=debugmode)
