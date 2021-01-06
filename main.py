from flask import Flask, render_template, send_from_directory, make_response
from flask.helpers import send_file
from flask_recaptcha import ReCaptcha
from bin.config import UserConfig
from bin.functions import *
import os
from requests import get

app = Flask('NerinaBeatmapMirror')
recaptcha = ReCaptcha(app=app)
app.secret_key = os.urandom(24) 

app.config.update({
    "RECAPTCHA_THEME": "dark",
    "RECAPTCHA_SITE_KEY": UserConfig["RecaptchaSiteKey"],
    "RECAPTCHA_SECRET_KEY": UserConfig["RecaptchaSecret"],
    "RECAPTCHA_ENABLED": True
})

host = UserConfig["host"]
port = UserConfig["port"]
debugmode = bool(UserConfig["debug"])

def NoPerm(session):
    return render_template("403.html")

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
            return f'beatmap file({setid}) not found'
        else:
            return send_file(f"{path}{setid}{fileformat}", attachment_filename=filename, as_attachment=True)
    else:
        return f'beatmap file({setid}) not found'

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

@app.route('/api/lists')
def api_lists():
    return {'data': {'ok': '5k', '5k': 'ok'}}

def download(url, file_name):
    with open(file_name, "wb") as file:
        response = get(url)
        if response.content <= 13:
            return 'no'
        else:
            file.write(response.content)

def check_file(setid):
    check = os.path.isfile(f"/media/data/beatmaps/{setid}.osz")
    if check:
        return True
    
    urls = ['https://hentai.ninja/d/', 'https://beatconnect.io/b/', 'http://storage.ainu.pw/d/', 'http://storage.ripple.moe/d/']
    filedir = "beatmaps/" + setid + ".osz"
    for url in urls:
        if os.path.exists(filedir):
            os.remove(filedir)
        url = f"{urls[1]}{setid}"
        download(url, filedir)
        beatmapsize = os.path.getsize(filedir)
        if beatmapsize >= 1000000:
            return True
        else:
            continue

    return False

if __name__ == '__main__':
    app.run(port=port, host=host, debug=debugmode)
