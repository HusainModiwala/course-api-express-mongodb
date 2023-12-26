const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {User, Course} = require("../db/index")

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const {username, password} = req.body;
    if(!username || !password)return res.status(400).json({"msg": "Enter non-empty username and password"});
    
    try {
        const newUser = new User({username, password});
        await newUser.save();
        return res.status(200).json({"msg": "User created successfully"});
    } catch (error) {
        return res.status(500).json({"msg": `Error occured, ${error}`});
    }
    
});

router.get('/courses', userMiddleware, async (req, res) => {
    // Implement listing all courses logic
    try {
        const courses = await Course.find();
        if(courses.length > 0) return res.status(200).json({"courses": courses});
        return res.status(200).json({"msg": "No courses found."});
    } catch (error) {
        return res.status(500).json({"msg": `Error occured, ${error}`});
    }
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    if(!courseId) return res.status(400).json({"msg": "enter valid courseId"});

    try {
        const course = await Course.findById(courseId).exec();
        if(!course) return res.status(404).json({"msg": "no course found"});
        const user = await User.findOne({'username': req.headers.username});
        await Course.updateOne(
            { _id: courseId },
            { $set: { purchasedBy: user._id } }
          );
        return res.status(200).json({"msg": "course purchased successfully."});
    } catch (error) {
        return res.status(500).json({"msg": `Error occured, ${error}`});
    }
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    try {
        const user = await User.findOne({'username': req.headers.username});
        const purchasedCourses = await Course.find({purchasedBy: user._id});
        if(purchasedCourses)return res.status(200).json({'purchasedCourses': purchasedCourses});
        return res.status(404).json({'msg': 'No courses found'})
    } catch (error) {
        return res.status(500).json({"msg": `Error occured, ${error}`});
    }
});

module.exports = router;