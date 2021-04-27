from flask import Flask, render_template, send_from_directory, make_response, jsonify, redirect, url_for, request
from flask_restful import reqparse
from flask.helpers import send_file
from bin.config import UserConfig
from bin.functions import *
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

@app.route("/d")
def downloadMainPage():
    return render_template("download.html")

@app.route("/old")
def oldmain():
    return render_template("old.html")

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
def loadBalanceDownadBeatmapset(setid):
    global loadbal
    if loadbal == 0:
        loadbal += 1
        return download_beatmapset(setid)
    else:
        loadbal = 0
        return returnDownloadThtftgr(setid)

@app.route('/d2/<setid>', methods=['get'])
@app.route('/s2/<setid>', methods=['get'])
@app.route('/osu/s2/<setid>', methods=['get'])
def download_beatmapset(setid):
    check = check_file(setid)
    if check:
        path = "/media/data/beatmaps/"
        fileformat = ".osz"
        filename = get_beatmap_file_name(setid)
        if filename == 'db not found':
            return goto_error_page('Failed to get data from beatmap.')
        else:
            return send_file(f"{path}{setid}{fileformat}", attachment_filename=filename, as_attachment=True)
    else:
        return goto_error_page('Beatmap does not exist.')

@app.route('/osu/b/<bid>', methods=['get'])
@app.route('/b/<bid>', methods=['get'])
def downlaod_beatmap(bid):
    setid = convertToBeatmapidToSetid(bid)
    print(f"bid({bid}) converting -> sid({setid})")
    check = check_file(setid)
    if check:
        path = "/media/data/beatmaps/"
        fileformat = ".osz"
        filename = get_beatmap_file_name(setid)
        if filename == 'db not found':
            return goto_error_page('Failed to get data from beatmap.')
        else:
            return send_file(f"{path}{setid}{fileformat}", attachment_filename=filename, as_attachment=True)
    else:
        return goto_error_page('Beatmap does not exist.')

@app.route('/api/b/<setid>', methods=['get'])
def api_getset(setid):
    data = get_setdata_from_db(setid)
    #result = jsonify(data)
    result = data

    return result

@app.route('/api/v1/search', methods=['get'])
def routeapiV1():
    parser = reqparse.RequestParser()
    parser_rows = {'int': {'min_ar','max_ar','min_cs','max_cs','min_od','max_od','min_hp','max_hp','min_bpm','max_bpm','min_length','max_length','mode','status','amount'},
                    'str': {'query','sort','sortby'}
                }
    for parsers in parser_rows:
        parserKey = parser_rows[parsers]
        for pars in parserKey:
            parser.add_argument(pars, type=type(parsers))

    args = parser.parse_args()

    ar = dict(min=args["min_ar"], max=args["max_ar"])
    cs = dict(min=args["min_cs"], max=args["max_cs"])
    od = dict(min=args["min_od"], max=args["max_od"])
    hp = dict(min=args["min_hp"], max=args["max_hp"])
    bpm = dict(min=args["min_bpm"], max=args["max_bpm"])
    length = dict(min=args["min_length"], max=args["max_length"])

    query = args["query"]
    mode = args["mode"]
    status = args["status"]
    amount = args["amount"]
    sort = args["sort"]
    sortby = args["sortby"]

    data = ApiV1(ar=ar, cs=cs, od=od, hp=hp, bpm=bpm, length=length, query=query, mode=mode, status=status, amount=amount, sort=sort, sortby=sortby)
    result = jsonify(data)

    return result

@app.route('/api/v2/search', methods=['get'])
def routeapiV2():
    parser = reqparse.RequestParser()
    parser_rows = {'int': {'min_ar','max_ar','min_cs','max_cs','min_od','max_od','min_hp','max_hp','min_bpm','max_bpm','min_length','max_length','mode','status','amount'},
                    'str': {'query','sort','sortby'}
                }
    for parsers in parser_rows:
        parserKey = parser_rows[parsers]
        for pars in parserKey:
            parser.add_argument(pars, type=type(parsers))

    args = parser.parse_args()

    ar = dict(min=args["min_ar"], max=args["max_ar"])
    cs = dict(min=args["min_cs"], max=args["max_cs"])
    od = dict(min=args["min_od"], max=args["max_od"])
    hp = dict(min=args["min_hp"], max=args["max_hp"])
    bpm = dict(min=args["min_bpm"], max=args["max_bpm"])
    length = dict(min=args["min_length"], max=args["max_length"])

    query = args["query"]
    mode = args["mode"]
    status = args["status"]
    amount = args["amount"]
    sort = args["sort"]
    sortby = args["sortby"]

    data = ApiV2(ar=ar, cs=cs, od=od, hp=hp, bpm=bpm, length=length, query=query, mode=mode, status=status, amount=amount, sort=sort, sortby=sortby)
    result = jsonify(data)

    return result

def goto_error_page(reason):
    return render_template("404.html", reason=reason)

if __name__ == '__main__':
    app.run(port=port, host=host, debug=debugmode)
