import json
from os import path, urandom
from colorama import init, Fore
from base64 import b64encode

init()
DefaultConfig = {
    "port": "1241",
    "host": "0.0.0.0",
    "debug": "True",

    #MYSQL SETTINGS
    "MysqlHost" : "",
    "MysqlUser" : "",
    "MysqlPassword" : "",
    "MysqlDb" : "",
    "MongoHost" : "",
    "MongoUser": "",
    "MongoPassword": "",
    "MongoDB": ""
}

class JsonFile:
    @classmethod
    def SaveDict(self, Dict, File="config.json"):
        with open(File, 'w') as json_file:
            json.dump(Dict, json_file, indent=4)

    @classmethod
    def GetDict(self, File="config.json"):
        if not path.exists(File):
            return {}
        else:
            with open(File) as f:
                data = json.load(f)
            return data


UserConfig = JsonFile.GetDict("./config.json")

if UserConfig == {}:
    print(Fore.RED + "Not Found Config" + Fore.RESET)
    JsonFile.SaveDict(DefaultConfig, "./config.json")
    print(Fore.LIGHTYELLOW_EX + "Config Created.")
    print(Fore.LIGHTYELLOW_EX + "File Name : config.json")
    exit()
else:
    AllGood = True
    NeedSet = []
    for key in list(DefaultConfig.keys()):
        if key not in list(UserConfig.keys()):
            AllGood = False
            NeedSet.append(key)

    if AllGood:
        print(Fore.GREEN + "Loading Config" + Fore.RESET)
    else:
        print(Fore.BLUE + " Updating Config" + Fore.RESET)
        for Key in NeedSet:
            UserConfig[Key] = DefaultConfig[Key]
            print(Fore.BLUE + f"{Key}added to config." + Fore.RESET)
        print(Fore.GREEN + "Config updated!" + Fore.RESET)
        JsonFile.SaveDict(UserConfig, "./config.json")
        exit()