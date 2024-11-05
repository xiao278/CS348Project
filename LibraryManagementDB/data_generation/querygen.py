import os
import csv
'''
-- relations
DROP TABLE IF EXISTS Wishlist;
DROP TABLE IF EXISTS Reader_Login;
DROP TABLE IF EXISTS Staff_Login;
DROP TABLE IF EXISTS Report;
DROP TABLE IF EXISTS Borrow;
DROP TABLE IF EXISTS PublishedBy;
DROP TABLE IF EXISTS WrittenBy;

-- weak entities
DROP TABLE IF EXISTS Copies;

-- strong entities
DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Publishers;
DROP TABLE IF EXISTS Authors;
DROP TABLE IF EXISTS Readers;
DROP TABLE IF EXISTS Logins;
DROP TABLE IF EXISTS Staffs;
'''

strong_entities = {'Books', 'Publishers', 'Authors', 'Readers', 'Logins', 'Staffs', 'Genres', 'Languages'}
weak_entities = {'Copies'}
relations = {'Wishist', 'Reader_Login', 'Staff_Login', 'Report', 'Borrow', 'Written_By', 'Book_Genre'}

READ_DIR:str = os.path.dirname(__file__) + "/data_csv"
S_WRITE_DIR:str = os.path.realpath(os.path.join(os.path.dirname(__file__), "../strong_entities_tables"))
W_WRITE_DIR:str = os.path.realpath(os.path.join(os.path.dirname(__file__), "../weak_entities_tables"))
R_WRITE_DIR:str = os.path.realpath(os.path.join(os.path.dirname(__file__), "../relations_tables"))

write_dirs  = [S_WRITE_DIR, W_WRITE_DIR, R_WRITE_DIR]

filenames = os.listdir(READ_DIR)

def load_dataset(filename:str) -> bool:
    [name, ftype] = filename.split(".", 1)
    table_type:int = -1
    if name in strong_entities:
        table_type = 0
    elif name in weak_entities:
        table_type = 1
    elif name in relations:
        table_type = 2
    else:
        print("file name '%s' not recognized!" % (filename))
        return False
    # read_file = csv.reader(os.path.join(READ_DIR,filename))
    write_file_path = os.path.join(write_dirs[table_type], name + ".sql")
    if os.path.isfile(write_file_path):
        os.remove(write_file_path)
    write_file = open(write_file_path, "w+")

    def format_columns(columns):
        columns_formatted = "\t("
        for i in range(len(columns)):
            column:str = columns[i].strip("\"").strip()
            isnumeric:bool = column.isnumeric()
            if not isnumeric:
                columns_formatted += "`"
            columns_formatted += column
            if not isnumeric:
                columns_formatted += "`"
            if i < len(columns) - 1:
                columns_formatted += ", "
        columns_formatted += ")"
        return columns_formatted
    
    # write tuples
    def format_tuples(columns):
        columns_formatted = "\t("
        for i in range(len(columns)):
            column:str = columns[i].strip("\"").strip().replace('\'', '\'\'')
            isnumeric:bool = column.isnumeric()
            if column == "":
                column = "NULL"
                isnumeric = True
            
            if not isnumeric:
                columns_formatted += "'"
            columns_formatted += column
            if not isnumeric:
                columns_formatted += "'"
            if i < len(columns) - 1:
                columns_formatted += ", "
        columns_formatted += ")"
        return columns_formatted

    with open(os.path.join(READ_DIR,filename), newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        header_columns = next(reader)
        write_file.write("INSERT INTO %s\n" % name)
        write_file.write(format_columns([k for k,v in header_columns.items()]))
        write_file.write("\nVALUES\n")

        write_file.write(format_tuples([v for k,v in header_columns.items()]))

        while(True):
            try:
                line = next(reader)
            except StopIteration:
                break
            # if line == "":
            #     break
            write_file.write(",\n")
            # tup_elements = line.rstrip('\n').split(",")
            write_file.write(format_tuples([v for k,v in line.items()]))
        write_file.write(";")


for filename in filenames:
    load_dataset(filename)

"""
INSERT INTO MyTable
  ( Column1, Column2, Column3 )
VALUES
  ('John', 123, 'Lloyds Office'), 
  ('Jane', 124, 'Lloyds Office'), 
  ('Billy', 125, 'London Office'),
  ('Miranda', 126, 'Bristol Office');
"""