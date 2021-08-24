import json
import sqlite3
import html
import os
from os import path
from sqlite3.dbapi2 import Cursor

con = sqlite3.connect('../test.db')
cur = con.cursor()
scrapped_dir = path.join(os.getcwd(), 'scrapped')

for file in os.listdir(scrapped_dir):
    with open(path.join(scrapped_dir, file), "r") as fptr:
        fstr = fptr.read()
        fjson = json.loads(fstr)

    articles = fjson['articles']

    for article in articles:
        # image = str(article['image'])
        title = str(article['jsonld']['headline'])
        description = str(article['jsonld']['description'])
        author = str(article['jsonld']['creator'][0])
        datePublished = str(article['jsonld']['datePublished'])
        content = html.escape(article['content'])
        tags = article['tags']
        tags_str = ",".join(tags)
        posts_query = f'insert into posts (title, description, author, content, datePublished, tags) values ("{title}","{description}", "{author}", "{content}", "{datePublished}", "{tags_str}")'
        cur.execute(posts_query)
        postID = cur.lastrowid

        for tag in tags:
            tags_query = f'insert into tags (postID, tag) values ({postID}, "{tag}")'
            cur.execute(tags_query)

    print(f'inserted {file} into db')
con.commit()
con.close()
