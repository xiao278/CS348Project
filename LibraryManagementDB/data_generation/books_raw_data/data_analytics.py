from ast import literal_eval
import pandas as pd

def get_max_genre_length(df):
    max_genre_len = 0
    for genre_list_str in df['genres']:
        genre_list = literal_eval(genre_list_str)
        for genre in genre_list:
            if max_genre_len < len(genre):
                # print(genre)
                max_genre_len = len(genre)
    return max_genre_len