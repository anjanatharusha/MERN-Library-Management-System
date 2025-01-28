const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../TokenCheck/verifyToken');
const { User } = require('../models');
const {ValidateRegister} = require('../Validates/userValidate')
const router = express.Router();
const sequelize = require('../models/sequelize');
const moment = require('moment-timezone');
const axios = require('axios'); 

const { tokenService } = require("../services/token-service.js");

// import { tokenService } from "../services/token-service.js";

//__________________Register user_____________________
router.post('/register', async (req, res) => 
{
    const { email, password, landline, gender, nic, dob, address, name, mobile } = req.body;

    const validationError = ValidateRegister(email, password);
    if(validationError) 
    {
        return res.status(400).json({ message: validationError });
    }

    try 
    {
        const ifExist = await User.findOne({ where: { email } });
        if(ifExist)
        {
            return res.status(400).json({ message: 'Email is already registerred' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ email, password: hashedPassword, landline: landline || null, gender: gender || null, nic: nic || null, dob: dob || null,  address: address || null,  name: name || null, mobile: mobile || null});

        res.status(201).json({ message: 'User registered successfully',  user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt,updatedAt: user.updatedAt }});
    } 
    catch (error) 
    {
        console.error('Registration error:', error);

        if (error.name === 'SequelizeUniqueConstraintError') 
        {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(400).json({ message: 'Error registering user', error });
    }
});


//________________Form data_______________________________________________________________________________________________________
router.post('/formRegister', async (req, res) => 
{
    const { email, password, landline, gender, nic, dob, address, name, mobile, role, year, grade } = req.body;

    const validationError = ValidateRegister(email, password);
    if(validationError) 
    {
        return res.status(400).json({ message: validationError });
    }

    try 
    {
        const qry = `SELECT * FROM reg_users WHERE email = :email`;
        const ifUser = await sequelize.query(qry, {
            replacements: {email},
            type: sequelize.QueryTypes.SELECT
        });
        
        if(ifUser.length > 0) 
        {
            return res.status(400).json({ message: 'Email is already registered', ifUser });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const sriLankaTime = moment.tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss'); // Get current time in Sri Lanka time zone
    
        const table = "reg_users";
        const qry2 = `
        INSERT INTO ${table} 
        (email, password, landline, gender, nic, dob, address, name, mobile, createdat, updatedat, role, year, grade)
        VALUES
        (:email, :password, :landline, :gender, :nic, :dob, :address, :name, :mobile, :createdat, :updatedat, :role, :year, :grade)`;


        const result = await sequelize.query(qry2, {
            replacements: {email, password: hashedPassword, landline, gender, nic, dob, address, name, mobile, createdat: sriLankaTime, updatedat: sriLankaTime, role, year, grade},
            type: sequelize.QueryTypes.INSERT
        });
    
        res.status(201).json({ message: 'User registered successfully', user: { result } });
    } 
    catch (error) 
    {
        console.error('Registration error:', error);

        if (error.name === 'SequelizeUniqueConstraintError') 
        {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(400).json({ message: 'Error registering user', error });
    }
});

//_________________Get registration form data details(teachers)_________________________________________________________________________
router.get('/getRegFormTeachers', async (req, res) => 
{
    try 
    {
        const role = 'teacher';
        const qry = `SELECT * FROM reg_users WHERE role = :role`;
        const ifUser = await sequelize.query(qry, { replacements: {role}, type: sequelize.QueryTypes.SELECT });

        if(ifUser.length > 0)
        {
            return res.status(200).json({ifUser})
        }
        res.status(404).json({ message: 'teachers not found' });
        
    } 
    catch (error) 
    {
        console.error('Login error:', error);
        res.status(400).json({ message: 'Error fetching data', error });
    }
});


//_________________Get registration form data details(students)___________________________________________________________________
router.get('/getRegFormStudents', async (req, res) => 
{
    try
    {
        const role = 'student';
        const qry = `SELECT * FROM reg_users WHERE role = :role`;
        const ifUser = await sequelize.query(qry, { replacements: {role}, type: sequelize.QueryTypes.SELECT });

        if(ifUser.length > 0)
        {
            return res.status(200).json({ifUser})
        }
        res.status(404).json({ message: 'Students not found' });    
    } 
    catch (error) 
    {
        console.error('Login error:', error);
        res.status(400).json({ message: 'Error fetching data', error });
    }
});


//_________________Accept/Reject(teachers)___________________________________________________________________
router.post('/acceptOrRejectRequestTeachers', async (req, res) => 
{
    try
    {
        const sriLankaTime = moment.tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
        const createdAt = sriLankaTime;
        const updatedAt = sriLankaTime;

        const {id, action, role, name, email, password, landline, gender, nic, dob, address, mobile, year, grades, term, subjects} = req.body;
        if(role === 'teacher')
        {
            if(action === 'Accepted')
            {
                const user = await User.create({ name, email, role, password, landline, gender, nic, dob, address, mobile, createdAt, updatedAt});

                const ifExist = await User.findOne({ where: { email } });
                const user_id = ifExist.id;


                // Register teacher in library
                console.log(name);
                const [firstName, lastName] = name.split(' ', 2);
                
                console.log(firstName);
                console.log('fghhsfdh');
                console.log(lastName);

                const libraryUser = {
                    name: firstName,
                    fatherName: lastName,
                    email: email,
                    password: password,
                }

                async function sendToLibrary() {
                    try {
                      const response = await axios.post('http://localhost:5000/api/teachers', libraryUser);
                      console.log('Data sent successfully to library:', response.data);
                    } catch (error) {
                      console.error('Error sending data:', error);
                    }
                }

                sendToLibrary();



                const qry1 = `INSERT INTO dham_teacher (user_id) VALUES (:user_id)`;
                const result1 = await sequelize.query(qry1, { replacements: {user_id}, type: sequelize.QueryTypes.INSERT });

                for(const grade of grades)
                {
                    for(const subject of subjects)
                    {
                        const qry2 = `INSERT INTO assign_teachers (user_id, name, year, grade, term, subject) VALUES (:user_id, :name, :year, :grade, :term, :subject)`;
                        const result2 = await sequelize.query(qry2, { replacements: {user_id, name, year, grade, term, subject}, type: sequelize.QueryTypes.INSERT });
                    }
                }

                const qry3 = `DELETE FROM reg_users WHERE id = :id`;
                const result3 = await sequelize.query(qry3, { replacements: {id}, type: sequelize.QueryTypes.DELETE });

                return res.status(201).json({success: true, message:'successfully Accepted that applicant'});
            }
            else if(action === 'Rejected')
            {
                const qry3 = `DELETE FROM reg_users WHERE id = :id`;
                const result3 = await sequelize.query(qry3, { replacements: {id}, type: sequelize.QueryTypes.DELETE });
                return res.status(400).json({success: true,  message: 'successfully Rejected that applicant'});
            }
            else
            {
                return res.status(400).json({success: false, message: 'Not action method'});
            }
        }
        else
        {
            return res.status(400).json({success: false , message: 'Not role specified'});
        }
    } 
    catch (error) 
    {
        console.error('error manage data:', error);
        res.status(400).json({ message: 'Error fetching data', error });
    }
});


//_________________Accept/Reject(students)___________________________________________________________________
router.post('/acceptOrRejectRequestStudents', async (req, res) => 
    {
        try
        {
            const sriLankaTime = moment.tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
            const createdAt = sriLankaTime;
            const updatedAt = sriLankaTime;
    
            const {id, action, role, name, email, password, landline, gender, nic, dob, address, mobile, year, grade} = req.body;
            console.log(id, action, role, name, email, password, landline, gender, nic, dob, address, mobile, year, grade);
            if(role === 'student')
            {
                if(action === 'Accepted')
                {
                    console.log('aaaaa');
                    const user = await User.create({ name, email, role, password, landline, gender, nic, dob, address, mobile, createdAt, updatedAt});
                    console.log('bbbb');
    
                    const ifExist = await User.findOne({ where: { email } });
                    const user_id = ifExist.id;
                    console.log('cccccc');



                    // Register student in library
                    console.log(name);
                    const [firstName, lastName] = name.split(' ', 2);
                    
                    console.log(firstName);
                    console.log('fghhsfdh');
                    console.log(lastName);

                    const libraryUser = {
                        rollNumber: user_id.toString(),
                        name: firstName,
                        fatherName: lastName,
                        email: email,
                        password: password,
                    }

                    async function sendToLibrary() {
                        try {
                          const response = await axios.post('http://localhost:5000/api/students', libraryUser);
                          console.log('Data sent successfully to library:', response.data);
                        } catch (error) {
                          console.error('Error sending data:', error);
                        }
                    }

                    sendToLibrary();


    
                    const qry1 = `INSERT INTO dham_student (user_id, dhamma_grade) VALUES (:user_id, :dhamma_grade)`;
                    const result1 = await sequelize.query(qry1, { replacements: {user_id, dhamma_grade: grade}, type: sequelize.QueryTypes.INSERT });
                    console.log('dddddddd');
    
                    const t1_result = 'Not yet';
                    const t2_result = 'Not yet';
                    const t3_result = 'Not yet';
                    const t1_attend = '0';
                    const t2_attend = '0';
                    const t3_attend = '0';

                    const qry2 = `INSERT INTO pali (user_id, grade, year, t1_result, t2_result, t3_result, t1_attend, t2_attend, t3_attend) VALUES (:user_id, :grade, :year, :t1_result, :t2_result, :t3_result, :t1_attend, :t2_attend, :t3_attend)`;
                    const qry3 = `INSERT INTO buddha_charithaya (user_id, grade, year, t1_result, t2_result, t3_result, t1_attend, t2_attend, t3_attend) VALUES (:user_id, :grade, :year, :t1_result, :t2_result, :t3_result, :t1_attend, :t2_attend, :t3_attend)`;
                    const qry4 = `INSERT INTO abhidharmaya (user_id, grade, year, t1_result, t2_result, t3_result, t1_attend, t2_attend, t3_attend) VALUES (:user_id, :grade, :year, :t1_result, :t2_result, :t3_result, :t1_attend, :t2_attend, :t3_attend)`;
                   
                    const result2 = await sequelize.query(qry2, { replacements: {user_id, grade, year, t1_result, t2_result, t3_result, t1_attend, t2_attend, t3_attend}, type: sequelize.QueryTypes.INSERT });
                    const result3 = await sequelize.query(qry3, { replacements: {user_id, grade, year, t1_result, t2_result, t3_result, t1_attend, t2_attend, t3_attend}, type: sequelize.QueryTypes.INSERT });
                    const result4 = await sequelize.query(qry4, { replacements: {user_id, grade, year, t1_result, t2_result, t3_result, t1_attend, t2_attend, t3_attend}, type: sequelize.QueryTypes.INSERT });
                    console.log('eeeeeeeee');
    
                    const qry5 = `DELETE FROM reg_users WHERE id = :id`;
                    const result5 = await sequelize.query(qry5, { replacements: {id}, type: sequelize.QueryTypes.DELETE });
    
                    return res.status(201).json({success: true, message:'successfully Accepted that applicant'});
                }
                else if(action === 'Rejected')
                {
                    console.log('ffffffff');

                    const qry3 = `DELETE FROM reg_users WHERE id = :id`;
                    const result3 = await sequelize.query(qry3, { replacements: {id}, type: sequelize.QueryTypes.DELETE });
                    return res.status(400).json({success: true,  message: 'successfully Rejected that applicant'});
                }
                else
                {
                    console.log('gggggggg');

                    return res.status(400).json({message: 'Not action method'});
                }
            }
            else
            {
                console.log('hhhhhhhhhh');

                return res.status(400).json({success: false , message: 'Not role specified'});
            }
        } 
        catch (error) 
        {
            console.error('error manage data:', error);
            res.status(400).json({ message: 'Error fetching data', error });
        }
    });

//__________________Login user_____________________
router.post('/login', async (req, res) => 
{
    const { email, password} = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log(user);
            console.log(token);

            /* GENERAT TOKENS FOR LIBRARY */
            const { accessToken, refreshToken } = await tokenService.genrateTokens({
                email: user.email,
                role: "Student",
            });

            console.log(accessToken);
            console.log(refreshToken);
        
            /* SAVE REFRESH TOKEN INTO DB OR UPDATE PREVIOUS REFRESH TOKEN OF USER */
            // try {
            //     const isExist = await tokenService.findRefreshToken({ user: user._id });
            //     if (isExist) {
            //     /* IF ALREADY EXIST TOKEN INTO DB THEN UPDATE TOKEN */
            //     await tokenService.updateRefreshToken(
            //         { user: user._id },
            //         { token: refreshToken }
            //     );
            //     } else {
            //     /* IF NOT THEN SIMPLY SAVED IT INTO DB */
            //     await tokenService.saveRefreshToken({
            //         user: user._id,
            //         token: refreshToken,
            //     });
            //     }
            // } catch (error) {
            //     return next(error);
            // }
        
            /* SET COOKIES  */
            res.cookie("accessToken", accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
            });
        
            res.cookie("refreshToken", refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
            });
  
            res.json({ 
                message: 'Login successful',
                // user: userExist,
                // isAuth: true, 
                token 
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password or Not permission yet' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ message: 'Error logging in', error });
    }
});

//_____________update user passwords_______________________________________
router.put('/user', async (req, res) => 
{
    try 
    {
        const { email, password, mobile, newpassword} = req.body;

        if(!email || !password || !mobile || !newpassword) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const ifInclude = await User.findOne({where:{email, mobile}});
        
        if(!ifInclude || ifInclude == null) {
            return res.status(400).json({ message: 'Incorrect Current email or mobile' });
        }

        const isCorrect = await bcrypt.compare(password, ifInclude.password);
        // return res.status(400).json({isCorrect});

        if(!isCorrect){
            return res.status(400).json({ message: 'Incorrect current password' });
        }  
        
        const validationError = ValidateRegister(email, newpassword, mobile); 

        if(validationError !== null)
        {
            return res.status(400).json({ message: validationError });
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);

        const details =  await User.update({ password: hashedPassword }, { where: { email, mobile } });

        return res.status(200).json({message: 'Password is changed', details});
    }
    catch (error) 
    {
        res.status(500).json({ message: 'Error updating password', error });
    }
});


//_____________________verify Token_____________________________________
router.get('/profile', verifyToken, async (req, res) => 
{
    try 
    {
        const user = await User.findByPk(req.user.id); // Retrieve user info from DB using decoded ID
        if(!user) 
        {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } 
    catch(error) 
    {
        console.error('Error retrieving profile:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;