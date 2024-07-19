import os
import requests, json
import pymysql
from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel, EmailStr
from fastapi.responses import JSONResponse
import smtplib
import datetime as dt
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

app = FastAPI()

with open('secrets.json', 'r') as f:
    secrets = json.load(f)

## DB connect
DBHOSTNAME = secrets.get("MYSQL_HOSTNAME")
DBPORT = int(secrets.get("MYSQL_PORT"))
DBUSERNAME = secrets.get("MYSQL_USERNAME")
DBPASSWORD = secrets.get("MYSQL_PASSWORD")
DB = secrets.get("MYSQL_DBNAME")

class EmailRequest(BaseModel):
    email: EmailStr
    name: str

class AnnounceRequest(BaseModel):
    title: str
    content: str

class BoardRequest(BaseModel):
    title: str
    content: str
    writer: str
    wremail: EmailStr

class BoardNum(BaseModel):
    boardnum: int

class ReplyRequest(BaseModel):
    boardnum: int
    content: str

class ReplyUpdateRequest(BaseModel):
    boardnum: int
    replynum: int

def get_db_connection():
    return pymysql.connect(host=DBHOSTNAME, port=DBPORT, user=DBUSERNAME, password=DBPASSWORD, db=DB)

def get_update_worknum():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT worknum FROM workTable WHERE email = %s"
            cursor.execute(sql, ("process_number"))
            data = cursor.fetchone()

            current_worknum = int(data[0])
            new_worknum = current_worknum + 1
            sql = "UPDATE workTable SET worknum = %s WHERE email = %s"
            cursor.execute(sql, (new_worknum, "process_number"))
            connection.commit()
            return new_worknum
    finally:
        connection.close()

async def get_board_data(boardnum: int):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM boardTable WHERE boardnum = %s"
            cursor.execute(sql, (boardnum))

            result = cursor.fetchall()
            wrdate = result[0][4].strftime("%Y.%m.%d")
            boardlist = {"boardnum": result[0][0], "title": result[0][1], "content": result[0][2], "writer": result[0][3], "wrdate": wrdate, "viewcnt": result[0][5], "wremail": result[0][6], "replynum": result[0][7]}
            return boardlist
    finally:
        connection.close()

@app.get("/")
def read_root():
    print("connected...")
    return {"status_code":"200"}

@app.post("/sendemail")
async def send_email(request: EmailRequest):
    try:
        # SMTP 서버 설정
        smtp_server = "smtp.gmail.com"
        port = 587
        sender_email = secrets.get("EMAIL_ID")
        password = secrets.get("EMAIL_PASSWORD")

        html = f"""
        <html>
            <body>
                <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                bgcolor="#F4F5F7"
                style="
                    padding: 82px 16px 82px;
                    color: #191919;
                    font-family: 'Noto Sans KR', sans-serif;
                "
                class="wrapper"
                >
                <tbody style="display: block; max-width: 600px; margin: 0 auto">
                    <tr width="100%" style="display: block">
                    <td width="100%" style="display: block">
                        <table
                        width="100%"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        bgcolor="#FFFFFF"
                        style="
                            display: inline-block;
                            padding: 32px;
                            text-align: left;
                            border-top: 3px solid #22b4e6;
                            border-collapse: collapse;
                        "
                        class="container"
                        >
                        <tbody style="display: block">
                            <!-- 로고 -->
                            <tr>
                            <td
                                style="
                                padding-top: 15px;
                                padding-bottom: 30px;
                                font-size: 20px;
                                font-weight: bold;
                                "
                            >
                                <img width="130" src="https://i.ibb.co/qjb67XM/mainlogo.png" />
                            </td>
                            </tr>
                            <!-- 본문 컨텐츠 영역 -->
                            <tr width="100%" style="display: block; margin-bottom: 32px">
                            <td width="100%" style="display: block; font-size: 20px">
                                <table class="content">
                                <tbody>
                                    <td style="display: block; margin-bottom: 10px">
                                    안녕하세요, {request.name}님!
                                    </td>
                                    <td style="display: block; margin-bottom: 10px">
                                    {request.name}님이 요청한 동영상 편집이
                                    완료되었어요!😆
                                    </td>
                                    <td style="display: block; margin-bottom: 10px">
                                    <a href="https://www.aiditor.link">사이트</a>에 접속하여
                                    결과를 확인해주세요.
                                    </td>
                                </tbody>
                                </table>
                            </td>
                            </tr>
                            <!-- 푸터(통합 서비스) -->
                            <tr
                            width="100%"
                            style="
                                display: block;
                                padding-top: 24px;
                                border-top: 1px solid #e9e9e9;
                            "
                            >
                            <td
                                style="
                                padding-bottom: 8px;
                                color: #a7a7a7;
                                font-size: 12px;
                                line-height: 20px;
                                "
                            >
                                본 메일은 발신 전용입니다.
                            </td>
                            </tr>
                            <tr>
                            <td
                                style="
                                padding-bottom: 10px;
                                color: #a7a7a7;
                                font-size: 12px;
                                line-height: 20px;
                                "
                            >
                                Copyright © 2024 AIDitor All Rights Reserved.
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
            </body>
        </html>
        """
        message = MIMEText(html, "html")
        message["Subject"] = f"AIditor: {request.name}님이 요청한 동영상 편집을 완료했어요!🎉"
        message["To"] = request.email

        # 이메일 전송
        with smtplib.SMTP(smtp_server, port) as server:
            server.starttls()
            server.login(sender_email, password)
            server.sendmail(sender_email, request.email, message.as_string())

        return JSONResponse(
            status_code=200,
            content = {
                "status": "Success",
                "code": 200,
                "message": f"{request.name}님에게 이메일 전송이 완료되었습니다."
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sendemail2")
async def send_email2(data: BoardNum):
    boardnum = data.boardnum
    data = await get_board_data(boardnum)
    name = data['writer']
    email = data['wremail']
    try:
        # SMTP 서버 설정
        smtp_server = "smtp.gmail.com"
        port = 587
        sender_email = secrets.get("EMAIL_ID")
        password = secrets.get("EMAIL_PASSWORD")

        html = f"""
        <html>
            <body>
                <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                bgcolor="#F4F5F7"
                style="
                    padding: 82px 16px 82px;
                    color: #191919;
                    font-family: 'Noto Sans KR', sans-serif;
                "
                class="wrapper"
                >
                <tbody style="display: block; max-width: 600px; margin: 0 auto">
                    <tr width="100%" style="display: block">
                    <td width="100%" style="display: block">
                        <table
                        width="100%"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        bgcolor="#FFFFFF"
                        style="
                            display: inline-block;
                            padding: 32px;
                            text-align: left;
                            border-top: 3px solid #22b4e6;
                            border-collapse: collapse;
                        "
                        class="container"
                        >
                        <tbody style="display: block">
                            <!-- 로고 -->
                            <tr>
                            <td
                                style="
                                padding-top: 15px;
                                padding-bottom: 30px;
                                font-size: 20px;
                                font-weight: bold;
                                "
                            >
                                <a href="https://www.aiditor.link"
                                ><img
                                    width="130"
                                    src="https://i.ibb.co/qjb67XM/mainlogo.png"
                                /></a>
                            </td>
                            </tr>
                            <!-- 본문 컨텐츠 영역 -->
                            <tr width="100%" style="display: block; margin-bottom: 32px">
                            <td width="100%" style="display: block; font-size: 20px">
                                <table class="content">
                                <tbody>
                                    <td style="display: block; margin-bottom: 10px">
                                    안녕하세요, {name}님!
                                    </td>
                                    <td style="display: block; margin-bottom: 10px">
                                    {name}님이 문의하신 내용에 대한 답변이
                                    완료되었습니다!😆
                                    </td>
                                    <td style="display: block; margin-bottom: 10px; font-size: 0.9em;">
                                    <a href="https://www.aiditor.link/board/{boardnum}">게시글 바로가기</a>
                                    </td>
                                </tbody>
                                </table>
                            </td>
                            </tr>
                            <!-- 푸터(통합 서비스) -->
                            <tr
                            width="100%"
                            style="
                                display: block;
                                padding-top: 24px;
                                border-top: 1px solid #e9e9e9;
                            "
                            >
                            <td
                                style="
                                padding-bottom: 8px;
                                color: #a7a7a7;
                                font-size: 12px;
                                line-height: 20px;
                                "
                            >
                                본 메일은 발신 전용입니다.
                            </td>
                            </tr>
                            <tr>
                            <td
                                style="
                                padding-bottom: 10px;
                                color: #a7a7a7;
                                font-size: 12px;
                                line-height: 20px;
                                "
                            >
                                Copyright © 2024 AIDitor All Rights Reserved.
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
            </body>
            </html>
        """
        message = MIMEText(html, "html")
        message["Subject"] = f"AIditor: {name}님이 문의하신 내용에 대한 답변이 완료되었습니다.🎉"
        message["To"] = email

        # 이메일 전송
        with smtplib.SMTP(smtp_server, port) as server:
            server.starttls()
            server.login(sender_email, password)
            server.sendmail(sender_email, email, message.as_string())

        return JSONResponse(
            status_code=200,
            content = {
                "status": "Success",
                "code": 200,
                "message": f"{name}님에게 이메일 전송이 완료되었습니다."
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/selectalluser")
def select_all_user():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM userTable"
            cursor.execute(sql)

            result = cursor.fetchall()
            return result
    finally:
        connection.close()

@app.get("/selectuser")
async def select_user(email: str):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM userTable WHERE email = %s"
            cursor.execute(sql, (email))

            data = cursor.fetchall()
            if data == ():
                return None
            else:
                result = {"email": data[0][0], "name": data[0][1], "picture": data[0][2], "opt": data[0][3], "isadmin": data[0][4]}
                return result
    finally:
        connection.close()

@app.post("/adduser")
async def add_user(data: dict):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO userTable (email, name, picture) VALUES (%s, %s, %s)"
            values = (data["email"], data["name"], data["picture"])
            cursor.execute(sql, values)

            connection.commit()
            result = {"email": data["email"], "name": data["name"], "picture": data["picture"], "opt":"in"}
            return result
    finally:
        connection.close()

@app.put("/updateuser")
async def update_user(data: dict):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "UPDATE userTable SET name = %s, opt = %s WHERE email = %s"
            values = (data["name"], data["opt"], data["email"])
            cursor.execute(sql, values)

            connection.commit()
            return {"email": data["email"], "name": data["name"], "opt": data["opt"]}
    finally:
        connection.close()

@app.delete("/deleteuser")
async def delete_user(email: str):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "DELETE FROM userTable WHERE email = %s"
            cursor.execute(sql, (email))

            sql = "DELETE FROM workTable WHERE worknum IN (SELECT worknum FROM (SELECT * FROM workTable WHERE email = %s) AS userdb )"
            cursor.execute(sql, (email))

            connection.commit()
            return {"email": email}
    finally:
        connection.close()

@app.post("/addworknum")
async def add_work_num(data: dict):
    connection = get_db_connection()
    print("data: ",data)

    g_worknum = get_update_worknum()
    wtype = data["wtype"]
    worknum = wtype + format(g_worknum, "05")    
    date = dt.datetime.now().strftime("%Y.%m.%d")
    videolength = data["videolength"]
    h = int(videolength) // 3600
    m = int(videolength) % 3600 // 60
    s = int(videolength) % 3600 % 60
    videolength = "%02d:%02d:%02d" % (h, m, s)
    try:
        with connection.cursor() as cursor:

            sql = "INSERT INTO workTable (email, name, opt, worknum, filename, date, wtype, videolength) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
            values = (data["email"], data["name"], data["opt"], worknum, data["filename"], date, wtype, videolength)
            cursor.execute(sql, values)

            connection.commit()
            result = {"email": data["email"], "name": data["name"], "opt": data["opt"], "worknum": worknum, "filename": data["filename"], "date": date, "wtype": wtype, "videolength": videolength}
            print("result: ", result)
            return worknum
    
    finally:
        connection.close()

@app.get("/selectuserwork")
async def select_user_work(email: str):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT filename, date, videolength, isprocess, wtype, worknum FROM workTable WHERE email = %s"
            cursor.execute(sql, (email))

            result = cursor.fetchall()
            worklist = []
            for i in range (0, len(result)):
                worklist.append({"filename": result[i][0], "date": result[i][1], "videolength": result[i][2], "isprocess": result[i][3], "wtype": result[i][4], "worknum": result[i][5]})
            return worklist
    finally:
        connection.close()

# process 진행 전 (W -> Y)
@app.get("/updateprocess")
def update_process(worknum: str):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT isprocess FROM workTable WHERE worknum = %s"
            cursor.execute(sql, (worknum))
            data = cursor.fetchone()

            if data is None:
                return 0
            else:
                sql = "UPDATE workTable SET isprocess = 'Y' WHERE worknum = %s"
                cursor.execute(sql, (worknum))
                connection.commit()
                return 1
    finally:
        connection.close()

# process 진행 완료 (Y -> N)
@app.put("/finishprocess")
async def finish_process(worknum: str):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT email, name, opt FROM workTable WHERE worknum = %s"
            cursor.execute(sql, (worknum))
            data = cursor.fetchall()

            sql = "UPDATE workTable SET isprocess = %s WHERE worknum = %s"
            values = ("N", worknum)
            cursor.execute(sql, values)
            connection.commit()

            email = data[0][0]
            name = data[0][1]
            opt = data[0][2]

            if opt == "in":
                return EmailRequest(email=email, name=name)
            else:
                return 0 # opt == out이므로 process 종료
    finally:
        connection.close()

@app.delete("/deletework")
async def delete_work(worknum: str):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "DELETE FROM workTable WHERE worknum = %s"
            cursor.execute(sql, (worknum))
            connection.commit()

            return {"worknum": worknum}
    finally:
        connection.close()

@app.get("/getannouncelist")
async def get_announce_list():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM anncTable"
            cursor.execute(sql)

            result = cursor.fetchall()
            annclist = []
            for i in range (0, len(result)):
                wrdate = result[i][4].strftime("%Y.%m.%d")
                annclist.append({"boardnum": result[i][0], "title": result[i][1], "writer": result[i][3], "wrdate": wrdate, "viewcnt": result[i][5]})
            return annclist
    finally:
        connection.close()

@app.get("/getannounce")
async def get_announce(boardnum: int):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM anncTable WHERE boardnum = %s"
            cursor.execute(sql, (boardnum))

            result = cursor.fetchall()
            wrdate = result[0][4].strftime("%Y.%m.%d")
            annc = {"boardnum": result[0][0], "title": result[0][1], "content": result[0][2], "writer": result[0][3], "wrdate": wrdate, "viewcnt": result[0][5]}
            return annc
    finally:
        connection.close()

@app.post("/addannounce")
async def add_announce(request: AnnounceRequest):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO anncTable (title, content) VALUES (%s, %s)"
            values = (request.title, request.content)
            cursor.execute(sql, values)

            connection.commit()
            return request
    finally:
        connection.close()

@app.get ("/getboardlist")
async def get_board_list():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM boardTable"
            cursor.execute(sql)

            result = cursor.fetchall()
            boardlist = []
            for i in range (0, len(result)):
                wrdate = result[i][4].strftime("%Y.%m.%d")
                boardlist.append({"boardnum": result[i][0], "title": result[i][1], "writer": result[i][3], "wrdate": wrdate, "viewcnt": result[i][5], "replynum": result[i][7]})
            return boardlist
    finally:
        connection.close()

@app.get ("/getboard")
async def get_board(boardnum: int):
    return await get_board_data(boardnum)

@app.post("/addboard")
async def add_board(request: BoardRequest):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO boardTable (title, content, writer, wremail) VALUES (%s, %s, %s, %s)"
            values = (request.title, request.content, request.writer, request.wremail)
            cursor.execute(sql, values)

            connection.commit()
            return request
    finally:
        connection.close()

@app.put("/updateboardcnt")
async def update_board_cnt(data: BoardNum):
    boardnum = data.boardnum
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "UPDATE boardTable SET viewcnt = viewcnt + 1 WHERE boardnum = %s"
            cursor.execute(sql, (boardnum,))

            connection.commit()
            return {"boardnum": boardnum}
    finally:
        connection.close()

@app.put("/updateannccnt")
async def update_annc_cnt(data: BoardNum):
    boardnum = data.boardnum
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "UPDATE anncTable SET viewcnt = viewcnt + 1 WHERE boardnum = %s"
            cursor.execute(sql, (boardnum,))

            connection.commit()
            return {"boardnum": boardnum}
    finally:
        connection.close()

@app.post("/addreply")
async def add_reply(request: ReplyRequest):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO replyTable (boardnum, content) VALUES (%s, %s)"
            values = (request.boardnum, request.content)
            cursor.execute(sql, values)

            connection.commit()
            return request
    finally:
        connection.close()

@app.get("/getreply")
async def get_reply(boardnum: int):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM replyTable WHERE boardnum = %s"
            cursor.execute(sql, (boardnum))

            result = cursor.fetchall()
            replylist = []
            for i in range (0, len(result)):
                wrdate = result[i][3].strftime("%Y.%m.%d")
                replylist.append({"content": result[i][2], "wrdate": wrdate})
            return replylist
    finally:
        connection.close()

@app.put("/updatereplynum")
async def update_replynum(request: ReplyUpdateRequest):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "UPDATE boardTable SET replynum = %s WHERE boardnum = %s"
            values = (request.replynum, request.boardnum)
            cursor.execute(sql, values)

            connection.commit()
            return request
    finally:
        connection.close()