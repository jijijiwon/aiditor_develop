<h1 align="center"> 🎥 아이크[AIC] 🎥 </h1>

<div align="center">
<img src="https://github.com/user-attachments/assets/d7fef5e9-33de-4107-8308-1b802055e6a5" title="아이크" alt="AIc"></img>

<b>🔗[아이크 바로가기](https://www.aiditor.link, "aiditor link")</b> <br>
</div>

<br>

## 📌목차

1. [📄프로젝트 소개](#project)
2. [👨‍👩‍👧‍👦팀 소개 및 역할](#team)
3. [🗓️개발 일정](#period)
4. [🔨기술 스택](#technology-stack)
5. [🔍기능 및 구조](#function-and-structure)
6. [👫협업 방식](#cooperation)

<br>

## <span id="project">1. 📄프로젝트 소개</span>

- <아이크>는 영상 속 유해 정보와 개인정보를 모자이크하는 **영상 자동 모자이크 서비스**입니다.
- 영상을 업로드하고 라벨을 고르면 **선택된 라벨이 모자이크 된 영상**을 얻을 수 있습니다.
- 실시간으로 유해 정보와 개인정보를 가릴 수 있는 **실시간 모자이크**를 제공합니다.
- 사용자 편의를 위해 **챗봇**과 **문의 게시판**을 제공합니다.

<br>

## <span id="team">2. 👨‍👩‍👧‍👦팀 소개 및 역할</span>

<div align="center">

  저희는 "아이크"를 개발한 **"AIvolution"** 입니다.   
  
  <table>
    <thead>
      <th>이지원</th>
      <th>김영욱</th>
      <th>안수연</th>
      <th>윤주연</th>
    </thead>
    <tbody align="center">
      <tr>
        <td> <img width="180" alt="이지원" src="https://github.com/user-attachments/assets/70557b15-a214-4898-82e5-3c287179d638"> </td>
        <td> <img width="180" alt="김영욱" src="https://github.com/user-attachments/assets/5fd818a7-e1a8-4c73-9937-d7c99aa2f6b4"> </td>
        <td> <img width="180" alt="안수연" src="https://github.com/user-attachments/assets/0b751d79-65d8-4bdf-be91-9bd57cbc0d3d"> </td>
        <td> <img width="180" alt="윤주연" src=  "https://github.com/user-attachments/assets/c15bcbf4-ec82-476e-881f-b66abbf0933d"> </td>
      </tr>
      <tr>
        <td> <a href="https://github.com/jijijiwon">jijijiwon</a> </td>
        <td> <a href="https://github.com/kimyoungGF">kimyoungGF</a> </td>
        <td> <a href="https://github.com/Sy3058">Sy3058 </a> </td>
        <td> <a href="https://github.com/juyeon980310">juyeon980310 </a></td>
      </tr>
      <tr>
        <td> 팀장 </td>
        <td> 팀원 </td>
        <td> 팀원 </td>
        <td> 팀원 </td>
      </tr>
    </tbody>
  </table>
</div>

<br>

### 역할 분담

#### 👑이지원👑

- 기획 발표
- Figma를 이용한 화면 디자인
- Front-end 구조 설계, 서비스 페이지 및 이용권 페이지 설계
- Back-end 기능 설계, 영상 api 호출
- Docker 전체 배포
- AWS 도메인, 로드밸런서
- 업무 분담, 진행 관리 등 일정 관리
- 보고서 작성 및 발표

#### 김영욱

- 유해정보 블라인드, 개인 정보 보호 기능 구현
- 영상 정보 분석에 필요한 모델 학습
- AWS S3 정책 설정
- 작업 정보 DB 관리

#### 안수연

- 화면 디자인
- Frond-end 로그인, 게시판, 내 정보 관리 및 관리자 페이지 설계
- Back-end 기능 설계, user api 호출
- user 및 board 관련 기능 설계
- user 및 board 관련 테이블 생성 및 관리
- 시연 영상 제작, README 작성

#### 윤주연

- 얼굴 감지 기능 구현
- AWS S3 정책 설정
- 작업 정보 DB 관리

## <span id="period">3. 🗓️개발 일정</span>
![image](https://github.com/user-attachments/assets/b642af25-33cc-43e2-8561-8ed1030e2ea3)

### 기능 테스트 발표

#### Week1 (6/7 ~ 6/13)
- 코드 리뷰 및 모델 선정

#### Week2 (6/14 ~ 6/20)
- 학습 데이터 선정
- React 설계 및 구현
- python-yolo 테스트

#### Week3 (6/21 ~ 6/26)
- 구글 로그인 구현
- 기본 DB 세팅
- React moderation 페이지 구현
- yolon8 Streamlit으로 구현
- React FastAPI 구현
- **1차 중간발표**

### 착수 발표

#### Week1 (6/27 ~ 7/3)
- 기능 정의서 작성
- 로그인 및 메일 기능 구현
- moderation 학습 테스트 & face 모델 테스트 후 모델 확정
- 도메인 구매
- 작업 DB 생성 및 관리
- 발표 자료 제작
- **2차 중간발표**

#### Week2 (7/4 ~ 7/10)
- 회원 관리 기능 설계 및 구현
- React 작업별 상세 페이지 구현
- 모듈화 및 로그 저장
- 프로그램 병렬, 비동기식 전환
- 얼굴 감지 결과 타임스탬프 
- React 게시판 구현
- Front-end 한글화
- 작업 완료 시 이메일 전송 및 S3 Bucket의 다운로드 URL 전송

#### Week3 (7/11 ~ 7/18)
- 각자 개발한 부분 dockerizing 후 하나의 dockerfile로 통합
- 예외처리 및 소스 정리 (coding convention)
- 관리자 페이지 구현
- 배포 도메인 등록
- 2차 설계
- **1차 배포**

#### Week4 (7/19 ~ 7/25)
- 이용권 관련 페이지 및 api 구현
- React 및 Back-end 예외처리
- 작업 상태 세분화

#### Week5 (7/26 ~ 8/1)
- session storage 암호화
- 세부적인 오류 해결
- 실시간 기능 추가

#### Week6 (8/2 ~ 8/8)
- QA
- **2차 배포**
- 세부적인 오류 해결
- 광고용 배너 제작

#### Week7 (8/9 ~ 8/15)
- 서류 작업 및 세부사항 수정
- Footer 생성 및 Footer-banner 제작
- **최종 발표**

## <span id="techonoloy-stack">4. ⛏️기술 스택</span>

<table>
  <tr>
    <td align="center" width="150px"> 사용 기술 </td>
    <td width="850px">
      <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=ffffff"/>&nbsp
      <img src="https://img.shields.io/badge/React%20Router-CA4245?style=for-the-badge&logo=ReactRouter&logoColor=ffffff"/>&nbsp
      <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=ffffff"/>&nbsp
      <img src="https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=Node.js&logoColor=ffffff"/>&nbsp
      <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=ffffff"/>&nbsp
      <img src="https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=OpenCV&logoColor=ffffff"/>&nbsp
      <img src="https://img.shields.io/badge/Dlib-008000?style=for-the-badge&logo=Dlib&logoColor=ffffff"/>&nbsp
      <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=ffffff"/>&nbsp
      <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=ffffff"/>&nbsp
    </td>
  </tr>
  <tr>
    <td align="center"> 데이터베이스 </td>
    <td>
      <img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=AmazonS3&logoColor=ffffff"/>&nbsp
      <img src="https://img.shields.io/badge/MysQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=ffffff"/>&nbsp
      <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=ffffff"/>&nbsp
    </td>
  </tr>
  <tr>
    <td align="center"> 클라우드 인프라 및 관리 </td>
    <td>
      <img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=AmazonEC2&logoColor=ffffff"/>&nbsp
      <img src="https://img.shields.io/badge/AWS%20Elastic%20Load%20Balancing-8C4FFF?style=for-the-badge&logo=AWSElasticLoadBalancing&logoColor=ffffff"/>&nbsp
    </td>
  <tr>
    <td align="center"> 패키지 </td>
    <td>
      <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=NPM&logoColor=ffffff"/>&nbsp
    </td>
  </tr>
  <tr>
    <td align="center"> 컨테이너화 </td>
    <td>
      <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=ffffff"/>&nbsp
    </td>
  <tr>
    <td align="center"> 포맷터 </td>
    <td>
      <img src="https://img.shields.io/badge/Prettier-373338?style=for-the-badge&logo=Prettier&logoColor=ffffff"/>&nbsp
    </td>
  </tr>
  <tr>
    <td align="center"> 협업 </td>
    <td>
      <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=ffffff"/>&nbsp
      <img src="https://img.shields.io/badge/Notion-5a5d69?style=for-the-badge&logo=Notion&logoColor=ffffff"/>&nbsp
    </td>
  </tr>
  <tr>
    <td align="center"> 디자인 </td>
    <td>
      <img src="https://img.shields.io/badge/Figma-d90f42?style=for-the-badge&logo=Figma&logoColor=ffffff"/>&nbsp
    </td>
  </tr>
  <tr>
    <td align="center"> IDE </td>
    <td>
      <img src="https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=VSCode&logoColor=ffffff"/>&nbsp
    </td>
  </tr>
</table>

<br>

## <span id="function-and-structure">5. 🔍기능 및 구조</span>

### 기능

<!--
- 메인 화면
- 로그인
- 로그아웃

- 영상 편집기
  - 유해정보 블라인드
  - 개인정보 보호
  - 얼굴 감지
- 실시간 모자이크
  - 유해정보 블라인드
  - 개인정보 보호

- 문의 게시판 조회 및 등록
- 공지사항 조회

- 내 정보
  - 내 정보 수정
  - 이용권 구매
  - 맡긴 영상 확인
  - 진행 상황 확인
  - 완료 영상 확인 및 다운로드
-->

<table>
  <thead align="center">
    <th width="500px"> 메인 화면 </th>
    <th width="500px"> 로그인 </th>
  </thead>
  <tbody>
    <tr>
      <td>
        <img src="https://github.com/user-attachments/assets/1bccb6fe-c8d3-4e78-a7ef-4d6267c168b9"/>
      </td>
      <td>
        <img src="https://github.com/user-attachments/assets/0b1feafc-51f4-4cfb-91c9-ffe5d3944fe6"/>
      </td>
    </tr>
    <tr>
      <td> 왼쪽의 사이드바를 통해 원하는 메뉴에 접근할 수 있습니다. 하단에는 광고용 배너와 사용자 편의를 위한 챗봇이 있습니다. 광고용 배너는 왼쪽 하단의 버튼을 눌러 제거할 수 있습니다. </td>
      <td> 오른쪽 상단의 로그인을 클릭하여 로그인을 할 수 있습니다. 회원 정보가 존재하지 않는 경우 로그인과 동시에 자동으로 회원 가입이 진행되며, 구글 로그인과 카카오 로그인을 제공합니다. </td>
    </tr>
  </tbody>
</table>

<table>
  <thead align="center">
    <th width="500px"> 로그아웃 </th>
    <th width="500px"> 영상 편집기 - 유해정보 블라인드 </th>
  </thead>
  <tbody>
    <tr>
      <td>
        <img src="https://github.com/user-attachments/assets/b25c71f5-6468-4d30-afd0-97543d58e2e8"/>
      </td>
      <td>
        <img src="https://github.com/user-attachments/assets/8296f585-06aa-40a1-8b79-c99ab977816f"/>
      </td>
    </tr>
    <tr>
      <td> 왼쪽의 로그아웃 버튼을 클릭해 로그아웃할 수 있습니다. </td>
      <td> 편집을 원하는 영상을 넣고 감지 정확도와 모자이크 강도, 편집할 컨텐츠를 선택한 후 편집을 요청할 수 있습니다. 편집이 완료되면 이메일 수신 동의자에 한하여 이메일이 발송됩니다. </td>
    </tr>
  </tbody>
</table>

<table>
  <thead align="center">
    <th width="500px"> 영상 편집기 - 개인정보 보호 </th>
    <th width="500px"> 영상 편집기 - 얼굴 감지 </th>
  </thead>
  <tbody>
    <tr>
      <td>
        <img src="https://github.com/user-attachments/assets/3bfbbdef-e04e-4c75-ae40-cdc2f933950f"/>
      </td>
      <td>
        <img src="https://github.com/user-attachments/assets/efc960e3-5c12-48b1-b71d-74527a17ca75"/>
      </td>
    </tr>
    <tr>
      <td> 왼쪽의 로그아웃 버튼을 클릭해 로그아웃할 수 있습니다. </td>
      <td> 편집을 원하는 영상을 넣고 감지 정확도와 모자이크 강도, 편집할 컨텐츠를 선택한 후 편집을 요청할 수 있습니다. 편집이 완료되면 이메일 수신 동의자에 한하여 이메일이 발송됩니다. </td>
    </tr>
  </tbody>
</table>

<table>
  <thead align="center">
    <th width="500px"> 실시간 모자이크 - 유해정보 블라인드 </th>
    <th width="500px"> 실시간 모자이크 - 개인정보 보호 </th>
  </thead>
  <tbody>
    <tr>
      <td>
        <img src="https://github.com/user-attachments/assets/c25d2bbb-affd-4bf6-bac6-2ac4c48b5c45"/>
      </td>
      <td>
        <img src="https://github.com/user-attachments/assets/b3120d82-a891-41e7-b315-10b4554d9282"/>
      </td>
    </tr>
    <tr>
      <td> 왼쪽의 로그아웃 버튼을 클릭해 로그아웃할 수 있습니다. </td>
      <td> 편집을 원하는 영상을 넣고 감지 정확도와 모자이크 강도, 편집할 컨텐츠를 선택한 후 편집을 요청할 수 있습니다. 편집이 완료되면 이메일 수신 동의자에 한하여 이메일이 발송됩니다. </td>
    </tr>
  </tbody>
</table>

<table>
  <thead align="center">
    <th width="500px"> 문의 게시판 </th>
    <th width="500px"> 공지사항 </th>
  </thead>
  <tbody>
    <tr>
      <td>
        <img src="https://github.com/user-attachments/assets/20c16627-af55-45a7-a19d-23060a344141"/>
      </td>
      <td>
        <img src="https://github.com/user-attachments/assets/9b95b044-bd5e-4813-836e-b3708545cdb3"/>
      </td>
    </tr>
    <tr>
      <td> 왼쪽의 로그아웃 버튼을 클릭해 로그아웃할 수 있습니다. </td>
      <td> 편집을 원하는 영상을 넣고 감지 정확도와 모자이크 강도, 편집할 컨텐츠를 선택한 후 편집을 요청할 수 있습니다. 편집이 완료되면 이메일 수신 동의자에 한하여 이메일이 발송됩니다. </td>
    </tr>
  </tbody>
</table>

<table>
  <thead align="center">
    <th width="500px"> 내 정보 </th>
    <th width="500px"> 이용권 구매 </th>
  </thead>
  <tbody>
    <tr>
      <td>
        <img src="https://github.com/user-attachments/assets/e4e78610-6522-4ee1-bc6c-603808a8a1ff"/>
      </td>
      <td>
        <img src="https://github.com/user-attachments/assets/c62067d5-16e4-4c70-8236-bdf6fa746505"/>
      </td>
    </tr>
    <tr>
      <td> 왼쪽의 로그아웃 버튼을 클릭해 로그아웃할 수 있습니다. </td>
      <td> 편집을 원하는 영상을 넣고 감지 정확도와 모자이크 강도, 편집할 컨텐츠를 선택한 후 편집을 요청할 수 있습니다. 편집이 완료되면 이메일 수신 동의자에 한하여 이메일이 발송됩니다. </td>
    </tr>
  </tbody>
</table>

<table>
  <thead align="center">
    <th width="500px"> 회원 정보 수정 </th>
    <th width="500px"> 회원 탈퇴 </th>
  </thead>
  <tbody>
    <tr>
      <td>
        <img src="https://github.com/user-attachments/assets/d2f9259e-e125-4dad-b2d2-1ffc38f99a37"/>
      </td>
      <td>
        <img src="https://github.com/user-attachments/assets/51bff484-1c15-4750-9a35-459de0b81c9b"/>
      </td>
    </tr>
    <tr>
      <td> 왼쪽의 로그아웃 버튼을 클릭해 로그아웃할 수 있습니다. </td>
      <td> 편집을 원하는 영상을 넣고 감지 정확도와 모자이크 강도, 편집할 컨텐츠를 선택한 후 편집을 요청할 수 있습니다. 편집이 완료되면 이메일 수신 동의자에 한하여 이메일이 발송됩니다. </td>
    </tr>
  </tbody>
</table>

<table>
  <thead align="center">
    <th width="500px"> 작업 삭제 </th>
    <th width="500px"> 작업 완료 상세 페이지 </th>
  </thead>
  <tbody>
    <tr>
      <td>
        <img src="https://github.com/user-attachments/assets/c5706bf1-301a-4be0-9f59-8ff5d03975ba"/>
      </td>
      <td>
        <img src="https://github.com/user-attachments/assets/9af1da4d-4323-415d-99ab-baa883e35a24"/>
      </td>
    </tr>
    <tr>
      <td> 왼쪽의 로그아웃 버튼을 클릭해 로그아웃할 수 있습니다. </td>
      <td> 편집을 원하는 영상을 넣고 감지 정확도와 모자이크 강도, 편집할 컨텐츠를 선택한 후 편집을 요청할 수 있습니다. 편집이 완료되면 이메일 수신 동의자에 한하여 이메일이 발송됩니다. </td>
    </tr>
  </tbody>
</table>

<table>
  <thead align="center">
    <th width="500px"> 작업 진행중 </th>
    <th width="500px"> 작업 에러 발생 </th>
  </thead>
  <tbody>
    <tr>
      <td>
        <img src="https://github.com/user-attachments/assets/4ee7efa6-0970-44e6-9a46-84d1c2fda76a"/>
      </td>
      <td>
        <img src="https://github.com/user-attachments/assets/6c9d8fe5-c082-41f2-ab40-a2ab4825c9aa"/>
      </td>
    </tr>
    <tr>
      <td> 왼쪽의 로그아웃 버튼을 클릭해 로그아웃할 수 있습니다. </td>
      <td> 편집을 원하는 영상을 넣고 감지 정확도와 모자이크 강도, 편집할 컨텐츠를 선택한 후 편집을 요청할 수 있습니다. 편집이 완료되면 이메일 수신 동의자에 한하여 이메일이 발송됩니다. </td>
    </tr>
  </tbody>
</table>

<table>
  <thead align="center">
    <th width="500px"> 관리자 페이지 </th>
    <th width="500px"> 작업 완료 이메일 </th>
  </thead>
  <tbody>
    <tr>
      <td>
        <img src="관리자 페이지"/>
      </td>
      <td>
        <img src="이메일 세트"/>
      </td>
    </tr>
    <tr>
      <td> 왼쪽의 로그아웃 버튼을 클릭해 로그아웃할 수 있습니다. </td>
      <td> 편집을 원하는 영상을 넣고 감지 정확도와 모자이크 강도, 편집할 컨텐츠를 선택한 후 편집을 요청할 수 있습니다. 편집이 완료되면 이메일 수신 동의자에 한하여 이메일이 발송됩니다. </td>
    </tr>
  </tbody>
</table>

### 구조

```
backend/
├── app.js
├── Dockerfile
└── package.json

config/
└── secrets.json

fastapi-f/
├── knn_examples/
├── logs/
│   ├── dlib_face_recognition_resnet_model_v1.dat
│   ├── Dockerfile
│   ├── main.py
│   ├── shape_predictor_68_face_landmarks.dat
│   ├── test_blur_app.py
│   └── trained_knn_model.clf
└── requirements.txt

fastapi-mp/
├── app/
│   ├── configdb.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── video_processor.py
├── app2/
│   ├── main2.py
│   ├── downloads/
│   ├── logs/
│   └── processed_videos/
└── yolomodel/
    ├── addf2.pt
    ├── card2.pt
    ├── Dockerfile
    ├── Dockerfile.mongo
    ├── mongod.conf
    └── requirements.txt

fastapi-user/
├── app/
│   ├── main.py
│   ├── Dockerfile
│   ├── init.sh
│   ├── my.cnf
│   └── requirements.txt
└── frontend/
    ├── public/
    │   ├── images/
    │   ├── favicon.ico
    │   ├── index.html
    │   └── manifest.json
    └── src/
        ├── components/
        ├── routes/
        ├── App.css
        ├── App.js
        ├── App.test.js
        ├── index.css
        ├── index.js
        ├── PretendardVariable.ttf
        ├── reportWebVitals.js
        ├── TossFaceFontMac.ttf
        ├── .gitignore
        ├── config-overrides.js
        ├── Dockerfile
        ├── package-lock.json
        ├── package.json
        └── README.md
├── .env
├── .gitignore
├── docker-compose.yml
└── Makefile
```

