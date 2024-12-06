from execute_sql import exe_sql_file
from populate_DB import populate_db
import os

cur_dir = os.path.dirname(__file__)

exe_sql_file(os.path.realpath(os.path.join(cur_dir,"./schema.sql")))
exe_sql_file(os.path.realpath(os.path.join(cur_dir,"./indexes.sql")))

populate_db()