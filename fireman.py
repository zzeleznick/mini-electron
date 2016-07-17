import json
from firebase import firebase
import random

FB_URL = "https://rabbit-af6d6.firebaseio.com/"
FIELDS = ["id", "name", "rating", "price"]
FB = None

def get_auth():
    with open("auth/db.json", "r") as infile:
        data = json.load(infile)
        secret = data["secret"]
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