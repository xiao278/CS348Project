import pandas as pd
import os
from data_analytics import *
import regex as re
from tqdm import tqdm
import numpy as np
from ast import literal_eval


TESTING = False
TEST_THRESHOLD = 1000

# CREATE TABLE Books (
#     isbn CHAR(13) PRIMARY KEY,
#     edition TINYINT,
#     title CHAR(150),
#     price FLOAT,
#     category CHAR(50)
# );

cur_dur = os.path.dirname(__file__)

data = pd.read_csv(os.path.join(cur_dur,"./books_data.csv"))
data.rename_axis('book_id', inplace=True)
data.index += 1



# cols:
#    'title', 'series', 'author', 'rating', 'description', 'language',
#    'isbn', 'genres', 'characters', 'bookFormat', 'edition', 'pages',
#    'publisher', 'publishDate', 'firstPublishDate', 'awards', 'numRatings',
#    'ratingsByStars', 'likedPercent', 'setting', 'bbeScore', 'bbeVotes',
#    'price'

badName = "bad name"

def extract_role(author:str):
    author = author.strip()
    if author == "more…":
        raise Exception("bad name")

    role = re.findall(r"\((.*?)\)", author)

    if len(role) == 0:
        author_name = author
        role = ["Author"]
    else:
        author_name_match = re.match(r"(?:([^\(\)]+))\s?(?:\(.*)?", author)
        # if (author_name_match is None):
        #     print(author)
        #     exit()
        author_name = author_name_match.group(1).strip()

    # print(author_name)
    # print(role)
    return (author_name, role)


#notes: 
#   - price can be null
#   - author is a list
#   - genre is a parsable list
#   - assume one publisher per book, so if there is multiple just take one
#   - ignore setting and characters
#   - ISBN is fucked
#   - mysql db is 1-indexed

# book table will have:
#   - title

# book df
book_df = data.loc[0: (TEST_THRESHOLD if TESTING else len(data)),['title', 'publishDate']]
book_df.rename(columns={"publishDate": "publish_date"}, inplace=True)
book_df['publish_date'] = pd.to_datetime(book_df['publish_date'], errors='coerce')


print(book_df)

# author df
author_df = pd.DataFrame(columns=['name'])
author_df.rename_axis("author_id", inplace=True)
author_book_df = pd.DataFrame(columns=['book_id','author_id','role'])

author_set = dict()

for index, row in tqdm(data.loc[:,['author', 'title']].iterrows()):
    author_list = row['author'].split(",")
    for author in author_list:
        try:
            name, roles = extract_role(author)
        except Exception as e:
            if e == badName:
                continue
        except:
            print(row['title'])
            print(row['author'])
            exit()
        if name not in author_set:
            n = len(author_df)
            author_set[name] = n + 1
            author_df.loc[n] = [name]
        for role in roles:
            author_book_df.loc[len(author_book_df)] = [
                index,
                author_set[name], 
                role
            ]
    if (TESTING and index >= TEST_THRESHOLD):
        break

author_df.index += 1

print(author_df)
print(author_book_df)

#language df
language_df = pd.DataFrame(columns=['language'])
language_df.rename_axis("lang_id", inplace=True)
book_df['lang_id'] = None

lang_set = dict()

for index, row in tqdm(data.loc[:,['language', 'title']].iterrows()):
    language = row['language']
    title = row['title']
    if language is np.nan:
        continue
    if language not in lang_set:
        n = len(language_df)
        lang_set[language] = n + 1
        language_df.loc[n] = [language]
    book_df.loc[index, 'lang_id'] = lang_set[language]
    if (TESTING and index >= TEST_THRESHOLD):
        break

language_df.index += 1

print(book_df)
print(language_df)

genre_df = pd.DataFrame(columns=['genre'])
genre_df.rename_axis("genre_id", inplace=True)
book_genre_df = pd.DataFrame(columns=['book_id', 'genre_id'])
book_genre_df = book_genre_df.astype('int32')

genre_set = dict()

for book_index, row in tqdm(data.loc[:,['genres', 'title']].iterrows()):
    genre_list = literal_eval(row['genres'])
    for genre in genre_list:
        if genre not in genre_set:
            n = len(genre_df)
            genre_set[genre] = n + 1
            genre_df.loc[n] = [genre]
        book_genre_df.loc[len(book_genre_df)] = [
            book_index,
            genre_set[genre]
        ]
    if (TESTING and book_index >= TEST_THRESHOLD):
        break

genre_df.index += 1

print(genre_df)
print(book_genre_df)

publisher_df = pd.DataFrame(columns=['name'])
publisher_df.rename_axis("publisher_id", inplace=True)
book_df['publisher_id'] = None

pub_set = dict()

for index, row in tqdm(data.loc[:,['publisher', 'title']].iterrows()):
    publisher:str | float = row['publisher']
    title = row['title']
    if publisher is np.nan:
        continue
    publisher = publisher.split(",")[0]
    if publisher not in pub_set:
        n = len(publisher_df)
        # mysql autoincrement id starts at 1, so 1 indexed
        pub_set[publisher] = n + 1
        publisher_df.loc[n] = [publisher]
    book_df.loc[index, 'publisher_id'] = pub_set[publisher]
    if (TESTING and index >= TEST_THRESHOLD):
        break

publisher_df.index += 1

print(publisher_df)
print(book_df)

write_dir = os.path.realpath(os.path.join(cur_dur, "../data_csv"))
B_PATH = os.path.join(write_dir, "Books.csv")
G_PATH = os.path.join(write_dir, "Genres.csv")
L_PATH = os.path.join(write_dir, "Languages.csv")
A_PATH = os.path.join(write_dir, "Authors.csv")
WB_PATH = os.path.join(write_dir, "Written_By.csv")
BG_PATH = os.path.join(write_dir, "Book_Genre.csv")
P_PATH = os.path.join(write_dir, "Publishers.csv")
# BL_PATH = os.path.join(write_dir, "Book_Lang.csv")

filepaths = [B_PATH,G_PATH,L_PATH,A_PATH,WB_PATH,BG_PATH,P_PATH]

for filepath in filepaths:
    if os.path.isfile(filepath):
        os.remove(filepath)

book_df.to_csv(B_PATH)
publisher_df.to_csv(P_PATH)
genre_df.to_csv(G_PATH)
language_df.to_csv(L_PATH)
author_df.to_csv(A_PATH)
author_book_df.to_csv(WB_PATH, index=False)
book_genre_df.to_csv(BG_PATH, index=False)