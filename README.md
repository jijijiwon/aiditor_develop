<h1 align="center"> 🎥 아이크[AIC] 🎥 </h1>

<div align="center">
<img src="https://github.com/user-attachments/assets/717ba1b5-01a2-493b-85b0-3dbe1fb31330" width="40%" title="아이크" alt="AIc"></img>

<b>🔗[아이크 바로가기](https://www.aiditor.link, "aiditor link")</b> <br>
</div>

<br>

## 📌목차

1. [📄프로젝트 소개](#project)
2. [👨‍👩‍👧‍👦팀 소개 및 역할](#team)
3. [🗓️개발 일정](#period)
4. [🔨기술 스택 및 이유](#technology-stack)
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

