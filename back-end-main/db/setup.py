from mysql import connector
from dotenv import load_dotenv
import os

load_dotenv()

try:
  mysqlDb = connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USERNAME"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
  )
  print('Sukses menghubungkan ke database')
  dbCursor = mysqlDb.cursor()
except Exception as e:
  print('Gagal menghubungkan ke database', e)