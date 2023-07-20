// 파일 업데이트 js 관련파일

//app.js
app.use("/uploads/project", express.static(__dirname + "/uploads/project"));

//project.js router
const { createProject } = require("../controllers/projectController");
const upload = require("../middlewares/upload");
router.post("/write", upload("uploads/project"), createProject);

//projectController.js
// 컨트롤러: 글쓰기
const createProject = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const {
      projectName,
      projectCompany,
      projectIntro,
      projectCategory,
      projectUrl,
      projectColor1,
      projectColor2,
      projectColor3,
      projectColorM,
      projectStart,
      projectEnd,
      projectOrder,
    } = req.body;

    const projectFile1 =
      req.fileData && req.fileData.projectFile1
        ? req.fileData.projectFile1
        : null;
    const projectFile2 =
      req.fileData && req.fileData.projectFile2
        ? req.fileData.projectFile2
        : null;
    const projectFile3 =
      req.fileData && req.fileData.projectFile3
        ? req.fileData.projectFile3
        : null;
    const projectFile4 =
      req.fileData && req.fileData.projectFile4
        ? req.fileData.projectFile4
        : null;
    const projectFile5 =
      req.fileData && req.fileData.projectFile5
        ? req.fileData.projectFile5
        : null;

    const query = `
      INSERT INTO project (
        projectName, projectCompany, projectIntro, projectCategory,
        projectStart, projectEnd, projectUrl, projectColor1,
        projectColor2, projectColor3, projectColorM,
        projectFile1, projectFile2, projectFile3, projectFile4, projectFile5, projectOrder
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      projectName,
      projectCompany,
      projectIntro,
      projectCategory,
      formatDate(projectStart),
      formatDate(projectEnd),
      projectUrl,
      projectColor1,
      projectColor2,
      projectColor3,
      projectColorM,
      projectFile1 ? projectFile1.filename : null,
      projectFile2 ? projectFile2.filename : null,
      projectFile3 ? projectFile3.filename : null,
      projectFile4 ? projectFile4.filename : null,
      projectFile5 ? projectFile5.filename : null,
      projectOrder,
    ];

    const result = await connection.query(query, values);
    await connection.commit();
    const insertedId = result[0].insertId;
    res.status(200).json({ insertedId: insertedId });
    console.log("Data saved to database - project");
  } catch (error) {
    await connection.rollback();
    handleDatabaseError(error);
    res.sendStatus(500);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

//upload.js

const multer = require("multer");
const path = require("path");

const upload = (destination) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const filename = file.fieldname + "-" + uniqueSuffix + ext;

      req.fileData = req.fileData || {};
      req.fileData[file.fieldname] = {
        originalname: file.originalname,
        filename: filename,
      };
      cb(null, filename);
    },
  });

  return multer({ storage }).any();
};

module.exports = upload;
