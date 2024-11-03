from execute_sql import exe_sql
import os

cur_dir = os.path.dirname(__file__)
strong_table_dir = os.path.join(cur_dir, "strong_entities_tables")
weak_table_dir = os.path.join(cur_dir, "weak_entities_tables")
relation_dir = os.path.join(cur_dir, "relations_tables")

exe_order = [strong_table_dir, weak_table_dir, relation_dir]

def populate_db():
    for table_dir in exe_order:
        filenames = os.listdir(table_dir)
        for filename in filenames:
            print(os.path.join(table_dir, filename))
            exe_sql(os.path.join(table_dir, filename), False)