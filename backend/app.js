const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const secretPath = path.resolve("/app/secrets.json");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// config
const secret = require(secretPath);
const port = secret.BACK_PORT;
const FAST_API_MP = `${secret.FAST_API_MP_IP}`;
const FAST_API_F = `${secret.FAST_API_F_IP}`;
const FAST_API_USER = `${secret.FAST_API_USER_IP}`;

// api
app.get("/", (req, res) => {
  res.send(200);
});

app.get("/healthcheck", (req, res) => {
  res.send(234);
});

app.get("/hello", (req, res) => {
  console.log(FAST_API_USER);
  res.sendStatus({ "Hello World!": "api" });
});

// 로그인 및 유저 정보
app.post("/login", async (req, res) => {
  const { access_token } = req.body;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );
    const { email, name, picture } = response.data;

    const isUser = await axios.get(`${FAST_API_USER}/selectuser`, {
      params: { email },
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (isUser.data.length === 0) {
      const addUser = await axios.post(
        `${FAST_API_USER}/adduser`,
        { email, name, picture, optin: "" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      res.json("user added: " + addUser.data);
    }
    res.json("user exists: " + isUser.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/selectuser", async (req, res) => {
  const { email } = req.query;
  try {
    const response = await axios.get(`${FAST_API_USER}/selectuser`, {
      params: { email },
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/adduser", async (req, res) => {
  const { email, name, picture } = req.body;
  try {
    const response = await axios.post(
      `${FAST_API_USER}/adduser`,
      { email, name, picture },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.response.data.message,
    });
  }
});

app.put("/updateuser", async (req, res) => {
  const { email, name, opt } = req.body;
  try {
    const response = await axios.put(
      `${FAST_API_USER}/updateuser`,
      { email, name, opt },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/deleteuser", async (req, res) => {
  const { email } = req.query;
  try {
    const response = await axios.delete(`${FAST_API_USER}/deleteuser`, {
      params: { email },
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/selectuserwork", async (req, res) => {
  const { email } = req.query;
  try {
    const response = await axios.get(`${FAST_API_USER}/selectuserwork`, {
      params: { email },
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/deletework", async (req, res) => {
  const { worknum } = req.query;
  try {
    const response = await axios.delete(`${FAST_API_USER}/deletework`, {
      params: { worknum },
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getboardlist", async (req, res) => {
  try {
    const response = await axios.get(`${FAST_API_USER}/getboardlist`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getboard", async (req, res) => {
  const { boardnum } = req.query;
  try {
    const response = await axios.get(`${FAST_API_USER}/getboard`, {
      params: { boardnum },
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getannouncelist", async (req, res) => {
  try {
    const response = await axios.get(`${FAST_API_USER}/getannouncelist`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getannounce", async (req, res) => {
  const { boardnum } = req.query;
  try {
    const response = await axios.get(`${FAST_API_USER}/getannounce`, {
      params: { boardnum },
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addboard", async (req, res) => {
  const { title, content, writer, wremail } = req.body;
  try {
    const response = await axios.post(
      `${FAST_API_USER}/addboard`,
      { title, content, writer, wremail },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addannounce", async (req, res) => {
  const { title, content } = req.body;
  try {
    const response = await axios.post(
      `${FAST_API_USER}/addannounce`,
      { title, content },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/updateboardcnt", async (req, res) => {
  const { boardnum } = req.body;
  try {
    const response = await axios.put(
      `${FAST_API_USER}/updateboardcnt`,
      { boardnum },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/updateannccnt", async (req, res) => {
  const { boardnum } = req.body;
  try {
    const response = await axios.put(
      `${FAST_API_USER}/updateannccnt`,
      { boardnum },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addreply", async (req, res) => {
  const { boardnum, content } = req.body;
  try {
    const response = await axios.post(
      `${FAST_API_USER}/addreply`,
      { boardnum, content },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getreply", async (req, res) => {
  const { boardnum } = req.query;
  try {
    const response = await axios.get(`${FAST_API_USER}/getreply`, {
      params: { boardnum },
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/updatereplynum", async (req, res) => {
  const { boardnum, replynum } = req.body;
  try {
    const response = await axios.put(
      `${FAST_API_USER}/updatereplynum`,
      { boardnum, replynum },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/sendemail2", async (req, res) => {
  const { boardnum } = req.body;
  try {
    const response = await axios.post(
      `${FAST_API_USER}/sendemail2`,
      { boardnum },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 영상 편집기
app.post("/video-reqeust", async (req, res) => {
  const { email, name, opt, filename, wtype, videolength } = req.body;
  try {
    const response = await axios.post(
      `${FAST_API_USER}/addworknum`,
      { email, name, opt, filename, wtype, videolength },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/mp-video-edit", upload.single("videofile"), async (req, res) => {
  console.log(req.body); // filename과 worknum을 포함한 데이터
  console.log(req.file); // 비디오 파일 데이터

  const { filename, worknum, power, mosaic } = req.body;
  const videofile = req.file;

  // FormData 객체 생성
  const formData = new FormData();
  formData.append(
    "videofile",
    Buffer.from(videofile.buffer),
    videofile.originalname
  );
  formData.append("filename", filename);
  formData.append("worknum", worknum);
  formData.append("power", power);
  formData.append("mosaic_strength", mosaic);

  try {
    const response2 = await axios.post(
      `${FAST_API_MP}/mp-editvideo`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );
    res.json(response2.data);
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/request-photos", upload.array("photo", 5), async (req, res) => {
  const { index } = req.body;
  const photos = req.files;
  console.log(photos);
  console.log(index);

  try {
    // 새로운 FormData 객체 생성
    const formData = new FormData();
    formData.append("directory_name", index);
    photos.forEach((photo, idx) => {
      formData.append("files", photo.buffer, photo.originalname);
    });

    // 외부 API 서버에 POST 요청 보내기
    const response = await axios.post(
      `${FAST_API_F}/f-trainfaces`, // 실제 외부 API 엔드포인트로 변경
      formData,
      {
        headers: {
          ...formData.getHeaders(), // FormData 헤더 설정
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error sending photos:", error);
    res.status(500).send("Error uploading photos");
  }
});

const jobStatus = {};

app.post("/f-video-edit", upload.single("videofile"), async (req, res) => {
  const { filename, worknum } = req.body;
  const file = req.file;
  const jobId = uuidv4();

  // 작업 상태 초기화
  jobStatus[jobId] = { status: "queued", result: null };

  // 비동기 작업을 처리하는 함수
  const processVideo = async () => {
    const formData = new FormData();
    formData.append("file", Buffer.from(file.buffer), file.originalname);
    formData.append("filename", filename);
    formData.append("worknum", worknum);

    try {
      const responseF = await axios.post(
        `${FAST_API_F}/f-editvideo`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 600000, // 10분 타임아웃 설정 (단위: 밀리초)
        }
      );
      // 작업 완료 상태 업데이트
      jobStatus[jobId] = { status: "completed", result: responseF.data };
    } catch (error) {
      console.error("Error uploading video:", error);
      jobStatus[jobId] = { status: "failed", result: error.message };
    }
  };

  // 비동기 작업 실행
  processVideo();

  // 작업 ID 반환
  res.json({ jobId });
});

// 작업 상태 확인 엔드포인트
app.get("/job-status", (req, res) => {
  const { jobId } = req.query;
  if (jobStatus[jobId]) {
    res.json(jobStatus[jobId]);
  } else {
    res.status(404).json({ error: "Job not found" });
  }
});

app.get("/myvideo", async (req, res) => {
  const { worknum } = req.query;
  console.log(worknum);

  if (worknum.charAt(0) !== "F") {
    try {
      const response = await axios.get(`${FAST_API_MP}/mp-downloadvideo`, {
        params: { worknum },
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);

      const url = response.data.download_url;
      const labels = Object.entries(response.data.labels)
        .filter(([key, value]) => value !== "0")
        .map(([key, value]) => {
          return { [key]: value };
        });

      res.json({ url: url, labels: labels });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    try {
      const response = await axios.get(`${FAST_API_F}/f-downloadvideo`, {
        params: { worknum },
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);

      const url = response.data.download_url;
      const labels = response.data.labels;

      res.json({ url: url, labels: labels });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.get("/video-list", async (req, res) => {
  const { worknum } = req.query;
  const response = await axios.get(`${FAST_API_MP}/mp-findlist`);
  const worklist = response.data.pending_jobs;

  console.log(worknum);
  const count = worklist.indexOf(worknum) + 1;
  console.log(count);

  res.json({ count: count });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
