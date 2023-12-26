const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const {Admin, Course} = require('../db/index');

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic

  let username = req.body.username; 
  let password = req.body.password;
  const newAdmin = new Admin({username, password});
  if(!username || !password){
    return res.status(400).json({"msg": "Enter non-empty username and password"});
  }
  try {
    await newAdmin.save();
    return res.status(201).json({"msg": "Admin created successfully"});
  } catch (error) {
    return res.status(500).json({"msg": `Internal server error ${error}`});  }    
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
  // Input: Headers: { 'username': 'username', 'password': 'password' }, Body: { title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com' }
  // Output: { message: 'Course created successfully', courseId: "new course id" }
  const {title, description, price, imageLink} = req.body;
  const newCourse = new Course({title, description, price, image:imageLink, purchasedBy: null});
  if(!title || !price) return res.status(400).json({"msg": "Bad request. Enter valid input values"});

  try {
    const response = await newCourse.save();
    res.json({"message": `Course created successfully courseId: ${response._id}` });
  } catch (error) {
    return res.status(500).json({"msg": "Internal server error."});
  }
});

router.get('/courses', adminMiddleware, async (req, res) => {
  try {
    const courses = await Course.find();

    if(courses.length > 0)res.status(200).json(courses)
    return res.status(200).json({"msg": "No courses found"});

  } catch (error) {
    return res.status(500).json({"msg": `An error occured ${error}`});
  }
});

module.exports = router;