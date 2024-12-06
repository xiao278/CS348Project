import mysql.connector

# Establish a connection to the MySQL server
conn = mysql.connector.connect(
    host="localhost",
    user="lib_backend",
    password="12345678@",
    database="LibraryManagementDB"
)

def exe_sql_file(file_path:str, multiple_queries = True):
    # Create a cursor to execute queries
    cursor = conn.cursor()

    # Open and read the SQL file
    with open(file_path, 'r') as file:
        sql_queries = file.read()

    # Split the SQL file content into individual queries
    if multiple_queries:
        try:
            conn.start_transaction(isolation_level="SERIALIZABLE")
            queries = sql_queries.split(';')
            for query in queries:
                    if query.strip() != '':
                        cursor.execute(query)
            conn.commit()
        except Exception as e:
            print("Error executing query:", str(e))
    else:
        query = sql_queries
        try:
            if query.strip() != '':
                cursor.execute(query)
                conn.commit()
        except Exception as e:
            print("Error executing query:", str(e))
    # print(queries)

    # Iterate over the queries and execute them
    

    # Close the cursor and the database connection
    cursor.close()
    # conn.close()