from asyncio.tasks import ensure_future
from types import DynamicClassAttribute
from typing import Dict
from bs4 import BeautifulSoup
import asyncio
import aiohttp
import json
import re
import time

async def getArticle(session: aiohttp.ClientSession, url, tag) -> Dict:
    # clear cookies to prevent medium blocking access
    session.cookie_jar.clear()
    try:
        async with session.get(url) as response:
            page = await response.text()
            soup = BeautifulSoup(page, features="html.parser")
            content = ""
            tags = []
            jsonld = json.loads(
                "".join(soup.find("script", {"type": "application/ld+json"}).contents))

            # title = jsonld['headline']
            # author = jsonld['creator']
            # image = jsonld['image']
            # description = jsonld['description']
            # dataPublished = jsonld['datePublished']

            if not soup.article:
                return False
            if "isAccessibleForFree" in jsonld and jsonld['isAccessibleForFree'] == 'False':
                # print(f'article is not free: \n {url} \n')
                return False
    except:
        print(f'failed to get url {url}')
        return False

    #gets the list of tags
    def getTags(soup, tag, url):
        try:
            sel_result = None
            selectors = [
                f'a[href="/tagged/{tag}"]',
                f'a[href="/tag/{tag}"]',
                f'a[href="https://medium.com/tag/{tag}"]'
            ]

            re_match = re.search("https://medium.com/(.*)/", url)
            if (re_match and re_match.group(1)):
                selectors.append(
                    f'a[href="https://medium.com/{re_match.group(1)}/tagged/{tag}"]')

            for sel in selectors:
                sel_result = soup.select(sel)
                if (sel_result):
                    break

            tags_ul = sel_result[0].parent.parent
        except:
            print(f"failed to tag: \n {url} \n")
            return []
        return [tag.text for tag in tags_ul.find_all('li')]

    # find specific elements in article by walking tree. Such as p, h1 and lists
    def _walk(soup):
        nonlocal content
        if soup.name is not None:
            if soup.name == "ol" or soup.name == "ul":
                content += f"<{soup.name}>"
                for child in soup.children:
                    content += "<{tag}>{text}</{tag}>".format(
                        tag=child.name, text=child.text,)
                content += f"</{soup.name}>"
                return
            for child in soup.children:
                if child.name == "h1" or child.name == "h2" or child.name == "p" or child.name == "a":
                    ntag = "<{tag}>{text}</{tag}>".format(
                        tag=child.name, text=child.text)
                    content = content + ntag 
                else:
                    _walk(child)

    try:
        _walk(soup.article)
        tags = getTags(soup, tag, url)
    except:
        print(f"couldn't parse url {url}")
        return False

    article = {
        "jsonld": jsonld, #contains headline,author,image etc...
        "content": content,
        "tags": tags,
    }

    # if None in article.values():
    #     return False
    return article

async def getArticles(reqlist):
    baseurl = "https://medium.com/tag/"
    articles_url = []
    tasks = []
    ensured_articles = []

    async with aiohttp.ClientSession(headers={'User-Agent': 'Mozilla/5.0'}) as session:
        for r in reqlist:
            r_url = f'{baseurl}{r[0]}/archive/{r[1]}'
            print(f"scraping {r[0]} {r[1]}...")
            # session.cookie_jar.clear()
            response = await session.get(r_url)
            resdata = await response.text()
            response.close()

            soup = BeautifulSoup(resdata, features="html.parser")
            articles = soup.select('.postArticle-content')
            articles_url = [article.parent['href'] for article in articles]
            for a_url in articles_url:
                tasks.append(asyncio.ensure_future(
                    getArticle(session, a_url, r[0])))
        ensured_articles = await asyncio.gather(*tasks)

    # remove false from articles
    return filter(lambda x: x, ensured_articles)
    # return ensured_articles

start_time = time.time()

tagt = 'health'

reqlist = [
    (tagt, 2015),
    (tagt, 2016),
    (tagt, 2017),
    (tagt, 2018),
    (tagt, 2019),
    (tagt, 2020),
]

articles = asyncio.run(getArticles(reqlist))

scrape_count = 0
tag_count = 0
ArticlesJson = {"articles": []}

for article in articles:
    scrape_count += 1
    print(article['jsonld']['headline'] + "\n" + str(article['tags']) + "\n")

    # convert to strings for json
    if (article and article['tags']):
        article['content'] = str(article['content'])
        ArticlesJson['articles'].append(article)
        tag_count += 1
print(f'scraped {scrape_count} articles, tagged {tag_count} articles')

with open(f"{tagt}.json", "w") as fptr:
    json.dump(ArticlesJson, fptr)

end_time = time.time()
print(f'program took: {end_time - start_time}s')
