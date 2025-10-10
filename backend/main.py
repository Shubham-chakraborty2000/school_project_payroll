from db_connection import get_connection
def main():
    con=get_connection()
    cursor =con.cursor()
    cursor.execute("SELECT DATABASE();")
    print("Connected to database:", cursor.fetchone()[0])
    cursor.close()
    con.close()

if __name__ == "__main__":
    main()