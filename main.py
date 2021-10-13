from flask import Flask, render_template, send_from_directory, make_response, jsonify, redirect, url_for, request
from flask_restful import reqparse
from flask.helpers import send_file
from bin.config import UserConfig
from bin.functions import *
import base64

app = Flask('NerinaBeatmapMirror')
app.config['JSON_SORT_KEYS'] = False
host = UserConfig["host"]
port = UserConfig["port"]
debugmode = bool(UserConfig["debug"])

loadbal = 0

@app.errorhandler(404)
def page_not_found(error):
    return render_template("404.html", reason=error)

@app.route("/")
@app.route("/main")
def main():
    Status = checkServerStatus()
    
    parser = reqparse.RequestParser()
    parser_rows = {'int': {'creator'}, 'str': {'m', 's', 'q', 'nsfw', 'e', 'sort'}}
    for parsers in parser_rows:
        parserKey = parser_rows[parsers]
        for pars in parserKey:
            parser.add_argument(pars, type=type(parsers))

    args = parser.parse_args()
    creatorid = args['creator']
    mode = args['m']
    status = args['s']
    query = args['q']
    nsfw = args['nsfw']
    extra = args['e']
    sort = args['sort']

    if creatorid == None:
        creatorid = 0
    if mode == None:
        mode = -1
    if status == None:
        status = ""
    if query == None:
        query = ''
    if nsfw == None:
        nsfw = '0'
    if extra == None:
        extra = ''
    if sort == None:
        sort = 'ranked_desc'
        
    return render_template("main.html", creator=creatorid, mode=str(mode), status=str(status), query=str(query), nsfw=str(nsfw), extra=str(extra), sort=str(sort), Title=Status[0]["title"], Description=Status[0]["description"], AlertType=Status[0]["alertType"], SubServerStatus=Status[0]["ServerStatus"]["Sub"])

@app.route("/d")
def downloadMainPage():
    return render_template("download.html")

@app.route('/beatmap/update/<setid>')
def update_beatmap(setid):
    aaaa = req_update_beatmapsets(setid)
    if aaaa:
        return "ok"
    else:
        return goto_error_page('Beatmap Update Failed')

@app.route('/d/<setid>')
@app.route('/s/<setid>', methods=['get'])
@app.route('/osu/s/<setid>', methods=['get'])
def RedirectDownload(setid):
    B_DATA = get_beatmapData(setid)

    parser = reqparse.RequestParser()
    parser_rows = {'int': {'server', 'noVideo'}}
    for parsers in parser_rows:
        parserKey = parser_rows[parsers]
        for pars in parserKey:
            parser.add_argument(pars, type=type(parsers))

    args = parser.parse_args()
    server = args["server"]
    novid = args["noVideo"]

    if server == None:
        server = 0

    BaseURL = "https://api.nerina.pw/download?b="
    setJson = {
        "server": int(server),
        "beatmapsetid": int(setid)
    }
    setString = str(json.dumps(setJson))
    setString = setString.replace(" ", "")
    setb64 = str(stringToBase64(setString))
    setb64 = setb64.replace("b'", "")
    setb64 = setb64.replace("'", "")

    uri = f"{BaseURL}{setb64}"
    if novid == 1:
        uri += "?noVideo=1"
    desc = generateMainDesc(B_DATA)
    return render_template("redirect.html", 
        redirect_uri = uri,
        beatmap_data = B_DATA,
        title=f"{B_DATA['artist']} - {B_DATA['title']}",
        description=desc,
        thumb = f"https://b.ppy.sh/thumb/{setid}l.jpg")

@app.route('/osu/b/<bid>', methods=['get'])
@app.route('/b/<bid>', methods=['get'])
def downlaod_beatmap(bid):
    setid = convertToBeatmapidToSetid(bid)
    print(f"bid({bid}) converting -> sid({setid})")
    return RedirectDownload(setid)

def goto_error_page(reason):
    return render_template("404.html", reason=reason)

if __name__ == '__main__':
    app.run(port=port, host=host, debug=debugmode)
