import json
import sqlite3
import html
import os
import mysql.connector
from os import path
# from sqlite3.dbapi2 import Cursor


# con = sqlite3.connect('../test.db')
# cur = con.cursor()
scrapped_dir = path.join(os.getcwd(), 'scrapped')
con = mysql.connector.connect(
    host='maria-database.czhqi7oxesf3.us-west-1.rds.amazonaws.com',
    port=3306,
    user='dbuser',
    password='Kenneth12',
    database='blogpub'
)
cur = con.cursor()
def test():
    try:
        cur.execute("""INSERT INTO posts (title,description,author,content,datePublished,tags) VALUES ("what you didn't know about donald trump", "donald trump","nima","donald trump has orange hair","some date","politics, news")""")
        print('sucess')
    except Exception as e:
        print(e);


def insert():
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

            try:
                cur.execute(posts_query)
            except Exception as e:
                print(f'author exceeds max {30 < len(author)}, content exceeds max {16777215 <  len(content)}')
                print(e)
            postID = cur.lastrowid

            for tag in tags:
                tags_query = f'insert into tags (postID, tag) values ({postID}, "{tag}")'
                cur.execute(tags_query)

        print(f'inserted {file} into db')

#test()
insert()
con.commit()
con.close()
