from flask import Flask, render_template, send_from_directory, make_response, jsonify
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

@app.route("/dev")
def main():
    return render_template("main.html")

@app.route("/")
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
            return f'beatmap file({setid}) not found (error=1)'
        else:
            return send_file(f"{path}{setid}{fileformat}", attachment_filename=filename, as_attachment=True)
    else:
        return f'beatmap file({setid}) not found (error=3)'

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
            return f'beatmap file({setid}) not found'
        else:
            return send_file(f"{path}{setid}{fileformat}", attachment_filename=filename, as_attachment=True)
    else:
        return f'beatmap file({setid}) not found'

@app.route('/api/search')
def api_lists():
    parser = reqparse.RequestParser()
    parser.add_argument('p', type=int)
    parser.add_argument('m', type=int)
    parser.add_argument('r', type=int)
    parser.add_argument('q', type=str)
    args = parser.parse_args()
    page = args['p']
    mode = args['m']
    ranked = args['r']
    query = args['q']

    if type(page) != int:
        page = 0
    if type(mode) != int:
        mode = 0
    if type(ranked) != int:
        ranked = 0
    if len(query) < 1:
        query = ''

    data = get_data_from_db(page, mode, ranked, query)
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
    
    urls = ('https://hentai.ninja/d/', 'https://beatconnect.io/b/', 'http://192.168.0.6:8003?name=false&s=', 'http://storage.ainu.pw/d/', 'http://storage.ripple.moe/d/')
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
            continue

    return False

if __name__ == '__main__':
    app.run(port=port, host=host, debug=True)
