const express = require('express');
const Mentor = require('../Schema/mentorSchema')
const Student = require('../Schema/studentSchema')

const router = express.Router();


// Create Mentor
router.post('/api/mentors', async (req, res) => {
    try {
        const { name, email } = req.body;
        const mentor = await Mentor.create({ name, email });
        res.status(201).json(mentor);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create Mentor' });
    }
});

// Create Student
router.post('/api/students', async (req, res) => {
    try {
        const { name, email } = req.body;
        const student = await Student.create({ name, email });
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create Student' });
    }
});

// Assign a Student to a Mentor
router.put('/api/students/:studentId/assign-mentor/:mentorId', async (req, res) => {
    try {
        const { studentId, mentorId } = req.params;
        const mentorDetail = await Mentor.findById(mentorId);
        const student = await Student.findByIdAndUpdate(studentId, { mentor: mentorId, mentorName: mentorDetail.name }, { new: true });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Failed to assign Mentor to Student' });
    }
});

// Select one Mentor and add multiple Students (bulk assignment)
router.put('/api/mentors/:mentorId/add-students', async (req, res) => {
    try {
        const { mentorId } = req.params;
        const { studentIds } = req.body;
        const mentorDetail = await Mentor.findById(mentorId);
        const students = await Student.updateMany({ _id: { $in: studentIds } }, { mentor: mentorId, mentorName: mentorDetail.name });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add Students to Mentor' });
    }
});

// Assign or Change Mentor for a particular Student
router.put('/api/students/:studentId/assign-mentor/:mentorId', async (req, res) => {
    try {
        const { studentId, mentorId } = req.params;
        const mentorDetail = await Mentor.findById(mentorId);
        const student = await Student.findByIdAndUpdate(studentId, { mentor: mentorId, mentorName: mentorDetail.name }, { new: true });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Failed to assign/change Mentor for Student' });
    }
});

// Select One Student and Assign one Mentor
router.get('/api/students/:studentId/assign-mentor/:mentorId', async (req, res) => {
    try {
        const { studentId, mentorId } = req.params;
        const mentorDetail = await Mentor.findById(mentorId);
        const student = await Student.findByIdAndUpdate(studentId, { mentor: mentorId, mentorName: mentorDetail.name }, { new: true });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Failed to assign Mentor to Student' });
    }
});

// Show all Students for a particular Mentor
router.get('/api/mentors/:mentorId/students', async (req, res) => {
    try {
        const { mentorId } = req.params;
        const mentorDetail = await Mentor.findById(mentorId);
        const students = await Student.find({ mentor: mentorId, mentorName: mentorDetail.name });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch Students for Mentor' });
    }
});

// Show the previously assigned Mentor for a particular Student
router.get('/api/students/:studentId/previous-mentor', async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId).populate('mentor', 'name email');
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        const previousMentor = student.mentor;
        res.json(previousMentor);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch previous Mentor for Student' });
    }
});

module.exports = router;