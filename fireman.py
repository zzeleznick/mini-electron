import requests, json
from firebase import firebase
import copy
import random
import uuid

FB_URL = "https://rabbit-af6d6.firebaseio.com/"
FIELDS = ["id", "uuid", "name", "rating", "price"]
FCM_KEY = None
FB = None

def get_auth():
    global FCM_KEY
    with open("auth/db.json", "r") as infile:
        data = json.load(infile)
        secret = data["secret"]
        FCM_KEY = data["fcm"]
    auth = firebase.FirebaseAuthentication(secret, None)
    return auth

def get_db():
    global FB
    if FB: return FB
    FB = firebase.FirebaseApplication(FB_URL)
    FB.authentication = get_auth()
    return FB

get_db()

def dump_db():
    FB.put("/", "results", {})

def make_dummy_data(count = 1):
    def inner():
        for i in range(count):
            idx = random.randint(0,10**6)
            rating = random.randint(1,5)
            data = {"id": idx,
                    "uuid": "%s" % uuid.uuid1(),
                    "name": "Result %s" % idx,
                    "rating": rating,
                    "price": rating * 30}
            yield (idx, data)
    return {idx: data for (idx,data) in inner() }

def get(suffix, child_key = None, *args):
    result = FB.get(suffix, child_key, *args)
    return result if result else {}

def populate_db(count = 50, drop = False):
    if drop:
        original = {}
    else:
        original = get("/results")
    bulk = make_dummy_data(count)
    original.update(bulk)
    return FB.put("/", "results", original)

def put_dummy_data(count = 1):
    bulk = make_dummy_data(count)
    for (idx, data) in bulk.iteritems():
        put(idx, data)

def put_user(name, key, extra={}):
    payload = copy.deepcopy(extra)
    payload["key"] = key
    payload["name"] = name
    return FB.put("/users", name, payload)

def send_notifcation(regKey):
    if not FCM_KEY:
        raise(IOError("Missing FCM Key"))
    headers = {"Authorization": "key=%s" % FCM_KEY,
              "Content-Type": "application/json",
              }
    url = "https://fcm.googleapis.com/fcm/send"
    data = {"to": regKey, "priority": "high"}
    response = requests.post(url, headers=headers, data=json.dumps(data))
    return response

def put(name, data):
    return FB.put("/results", name, data)

'''
# Note the second arg of get is the key we are looking for
fb.get("/", None)
fb.put("/results", "0", {"name": "zz", "age": 21})
fb.get("/", None)
fb.put("/results", "1", {"name": "nz", "age": 12})
fb.put("/results", "2", {"name": "nzz", "age": 122})
'''