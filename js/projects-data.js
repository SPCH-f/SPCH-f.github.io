const projects = [
  {
    id: 1,
    title: "Petanque Management System",
    stack: ["React.js", "Node.js", "MySQL"],
    description:
      "ระบบจัดการสนามกีฬาแบบครบวงจร ที่นำระบบดิจิทัลมาแทนที่การจดบันทึกด้วยกระดาษแบบเดิม รองรับการจองสนามและอุปกรณ์แบบเรียลไทม์ ด้วยฟรอนต์เอนด์ React.js ที่ซิงค์ปฏิทินและสถานะการจองได้ทันที ทำงานร่วมกับแบ็กเอนด์ Node.js ที่ออกแบบให้รองรับการขยายระบบในอนาคต พร้อมระบบควบคุมสิทธิ์การเข้าถึงตามบทบาท (RBAC) เพื่อความปลอดภัยของข้อมูล",
    demoUrl: null,
    githubUrl: "https://github.com/SPCH-f/petanque-club-system",
  },
  {
    id: 2,
    title: "Football Data Archive – AI Chatbot (RAG)",
    stack: ["React.js", "FastAPI", "PostgreSQL"],
    description:
      "เว็บแอปพลิเคชันสำหรับคนรักฟุตบอล ที่ให้ผู้ใช้ค้นหาตารางคะแนนและผลการแข่งขันได้แบบเรียลไทม์ ขับเคลื่อนด้วย FastAPI ในการจัดการข้อมูลฝั่งเซิร์ฟเวอร์ ร่วมกับฐานข้อมูล PostgreSQL ที่ออกแบบมาให้รองรับข้อมูลปริมาณสูงจาก Football API ภายนอก นอกจากนี้ยังผสานระบบ Retrieval-Augmented Generation (RAG) เพื่อให้ผู้ใช้สามารถถามตอบข้อมูลฟุตบอลผ่านแชทบอทได้อย่างแม่นยำ",
    demoUrl: null,
    githubUrl: "https://github.com/SPCH-f/Football_Data_Archive",
  },
  {
    id: 3,
    title: "Fkhalifa AI – Text to Image Generation",
    stack: ["Python", "Django", "Pillow", "Pollinations AI", "Tailwind CSS", "MySQL"],
    description:
      "แพลตฟอร์ม AI สำหรับสร้างภาพจากข้อความ พัฒนาด้วย Django และตกแต่งหน้าตาด้วย Tailwind CSS โดยเชื่อมต่อกับ Pollinations AI เพื่อประมวลผลข้อความให้กลายเป็นภาพ พร้อมระบบ Autocomplete ช่วยแนะนำคำ Prompt ระหว่างพิมพ์ ด้านหลังบ้านใช้ Pillow ในการแปลงไฟล์ภาพเป็น WebP และสร้าง Thumbnail อัตโนมัติ เพื่อลดขนาดไฟล์และเพิ่มความเร็วในการโหลดหน้าเว็บ พร้อมระบบจัดเก็บประวัติการสร้างภาพและลบภาพได้แบบเรียลไทม์",
    demoUrl: null,
    githubUrl: "https://github.com/SPCH-f/Fkhalifa-Generator-IMG",
  },
  {
    id: 4,
    title: "Gold Tracker Bot",
    stack: ["Python", "LINE Messaging API", "Google Sheets API", "GitHub Actions"],
    description:
      "ระบบอัตโนมัติสำหรับติดตามราคาทองคำแบบ Serverless เขียนด้วย Python ทำงานผ่าน GitHub Actions ในการดึงข้อมูลราคาทองคำโลกและอัตราแลกเปลี่ยนเงินตราจาก Yahoo Finance API ตามรอบเวลาที่กำหนด พร้อมประมวลผลข้อมูลแบบเรียลไทม์เพื่อคำนวณราคาทองคำในตลาดไทย แล้วส่งแจ้งเตือนอัตโนมัติผ่าน LINE Messaging API",
    demoUrl: null,
    githubUrl: "https://github.com/SPCH-f/gold-tracker-bot",
  },
];

export default projects;
