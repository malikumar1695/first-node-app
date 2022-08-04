const express = require('express');
const controller = require('./Controllers/students.controller');

const router = express.Router();

router.post('/savestudent',controller.saveStudent);
router.put('/updatestudent',controller.updateStudent);
router.get('/getstudentbyid/:id',controller.getStudent);
router.delete('/removestudentbyid/:id',controller.removeStudentById);


router.post('/savestudenttoes',controller.saveStudentES);
router.put('/updatestudentines',controller.updateStudentES);
router.get('/getstudentbyidfromes/:id',controller.getStudentES);
router.delete('/removestudentbyidfromes/:id',controller.removeStudentByIdES);

router.get('/sec',(req,res,next)=>{
    console.log('in the middleware');
    res.send('<h4>Second Page</h4>')
    });  

router.get('/',(req,res,next)=>{
    res.send('<h3>Home Page</h3>')
})

module.exports = router;