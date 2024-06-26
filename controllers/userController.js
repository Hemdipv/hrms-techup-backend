const db = require("../models");
const jwt = require("jsonwebtoken");

// create main model
const User = db.user;
const Role = db.role;
const RoleModule = db.roleModule;
const Module = db.module;

const Staff = db.staff;
const { Op } = require("sequelize");
const sendEmail = require("../Utills/emailService");

//1. create user
const addUser = async (req, res) => {
  const modules = await Module.findAll();
  const { email, createdBy, staffId } = req.body;
  try {
    const staff = await Staff.findOne({ where: { staffId } });
    let info = {
      ...req.body,
      name: staff?.name,
    };
    const user = await User.create(info);
    // const user = {};
    let inputData = [];

    // const inputData = [
    //   {
    //     roleModuleId: 0,
    //     userId: 9,
    //     roleId: 1,
    //     moduleId: 1,
    //     isViewed: "no",
    //     isEdited: "no",
    //     createdBy:req?.body?.createdBy,
    //   },
    // ];
    console.log("inputData", inputData);
    let roleModule;
    if (user?.userId > 0) {
      modules.forEach((element) => {
        inputData.push({
          roleModuleId: 0,
          userId: user?.userId,
          roleId: user?.roleId,
          moduleId: element?.moduleId,
          isViewed: "yes",
          isEdited: "no",
          createdBy: req?.body?.createdBy,
        });
      });
      inputData.map(async (data) => {
        return await RoleModule.create(data);
      });
      const currentUser = await User.findOne({ where: { userId: createdBy } });

      sendEmail({
        subject: "A new user created for HRMS",
        html: `<div>
            <p>Hello Sir</p>
            <p>
              I would like to inform you that a new User with this email <b> ${email}</b> is created 
               by ${currentUser?.email}.
            </p>
            <br  />
            <p>Thanks and regards,</p>
            <p>${currentUser?.email} </p>
          </div>`,
        to: process.env.FROM_EMAIL,
        from: process.env.EMAIL,
      });
      // roleModule = await RoleModule.create();
    }

    let userModuleData = await RoleModule.findAll({
      where: { userId: user?.userId },
    });

    res.status(200).send({
      flag: true,
      message: "User created successfully!",
      outdata: { user },
    });
    // console.log(user)
    return;
  } catch (error) {
    res.status(500).send({
      flag: false,
      message: "Something went wrong!",
      error,
    });
    return;
  }
};

//2. get all user
const getAllUsers = async (req, res) => {
  // try {
  //   let users = await User.findAll();
  //   let staff = [];

  const { isActive, searchString } = req.query;
  let { currentPage } = req.query;

  if (currentPage == null || currentPage == undefined) {
    currentPage = 0;
  }
  let users;

  try {
    // if (!searchString && !isActive) {
    //   if (currentPage == 0) {
    //     users = await User.findAndCountAll({});
    //   } else {
    //     users = await User.findAndCountAll({
    //       offset: Number(process.env.PAGE_OFFSET * (currentPage - 1)),
    //       limit: Number(process.env.PAGE_LIMIT),
    //     });
    //   }
    // } else if (isActive && searchString) {
    //   if (currentPage == 0) {
    //     users = await User.findAndCountAll({
    //       where: {
    //         email: { [Op.like]: `%${searchString}%` },
    //         isActive,
    //       },
    //     });
    //   } else {
    //     users = await User.findAndCountAll({
    //       where: {
    //         email: { [Op.like]: `%${searchString}%` },
    //         isActive,
    //       },
    //       offset: Number(process.env.PAGE_OFFSET * (currentPage - 1)),
    //       limit: Number(process.env.PAGE_LIMIT),
    //     });
    //   }
    // } else if (searchString) {
    //   if (currentPage == 0) {
    //     users = await User.findAndCountAll({
    //       where: {
    //         email: { [Op.like]: `%${searchString}%` },
    //       },
    //     });
    //   } else {
    //     users = await User.findAndCountAll({
    //       where: {
    //         email: { [Op.like]: `%${searchString}%` },
    //       },
    //       offset: Number(process.env.PAGE_OFFSET * (currentPage - 1)),
    //       limit: Number(process.env.PAGE_LIMIT),
    //     });
    //   }
    // } else if (isActive) {
    //   if (currentPage == 0) {
    //     users = await User.findAndCountAll({
    //       where: {
    //         isActive,
    //       },
    //     });
    //   } else {
    //     users = await User.findAndCountAll({
    //       where: {
    //         isActive,
    //       },
    //       offset: Number(process.env.PAGE_OFFSET * (currentPage - 1)),
    //       limit: Number(process.env.PAGE_LIMIT),
    //     });
    //   }
    // }

    if (true) {
      if (currentPage == 0) {
        users = await User.findAndCountAll({
          order: [["createdAt", "DESC"]],
          where: {
            // name: { [Op.like]: `%${searchString ? searchString : ""}%` },
            // email: { [Op.like]: `%${searchString ? searchString : ""}%` },
            [Op.or]: [
              { name: { [Op.like]: `%${searchString ? searchString : ""}%` } },
              { email: { [Op.like]: `%${searchString ? searchString : ""}%` } },
              // { mobile: { [Op.like]: `%${searchString ? searchString : ""}%` } }
            ],
            isActive: { [Op.like]: `%${isActive ? isActive : ""}%` },
            // dateOfApplication: {
            //   [Op.gte]: new Date(startDate),
            //   [Op.lte]: new Date(endDate),
            // },
          },
        });
      } else {
        users = await User.findAndCountAll({
          order: [["createdAt", "DESC"]],

          where: {
            // name: { [Op.like]: `%${searchString ? searchString : ""}%` },
            // email: { [Op.like]: `%${searchString ? searchString : ""}%` },
            [Op.or]: [
              { name: { [Op.like]: `%${searchString ? searchString : ""}%` } },
              { email: { [Op.like]: `%${searchString ? searchString : ""}%` } },
              // { mobile: { [Op.like]: `%${searchString ? searchString : ""}%` } }
            ],
            isActive: { [Op.like]: `%${isActive ? isActive : ""}%` },
            // dateOfApplication: {
            //   [Op.gte]: new Date(startDate),
            //   [Op.lte]: new Date(endDate),
            // },
          },
          offset: Number(process.env.PAGE_OFFSET * (currentPage - 1)),
          limit: Number(process.env.PAGE_LIMIT),
        });
      }
    }

    // let staffs = [];
    // staffs = await Staff.findAll();
    // users = users?.rows.map((user) => {
    //   let userDetails = user;
    //   return {
    //     ...userDetails.dataValues,
    //     name: staffs.filter((staff) => staff?.staffId == user.staffId)[0]?.name,
    //   };
    // });

    // users = await User.findAll({
    //   where: {
    //     // email: { [Op.like]: `%${searchString}%` },
    //     email: "",
    //     isActive: "",
    //   },
    // });

    res.status(200).send({
      flag: true,
      outdata: { users: users.rows },
      totalRecord: users?.count,
    });
    return;
  } catch (err) {
    res.status(501).send(err);
    return;
  }
};

//3. get one user
const getOneUser = async (req, res) => {
  let id = req.params.id;
  try {
    let user = await User.findOne({ where: { userId: id } });

    let staff = {};
    staff = await Staff.findOne({ where: { staffId: user?.staffId } });

    let role = await Role.findOne({ where: { roleId: user.roleId } });
    let outdata = {
      name: staff.name,
      roleName: role.roleName,
      ...user.dataValues,
    };
    res.status(200).send({
      flag: true,
      outdata: { ...outdata },
    });
    return;
  } catch (error) {
    res.status(500).send({
      flag: false,
      message: "something went wrong!",
      error,
    });
    return;
  }
};

//4. update user details

const updateUser = async (req, res) => {
  let id = req.params.id;
  const { employeCode, staffId, email, password, roleId, updatedBy, isActive } =
    req.body;
  let info = {
    employeCode,
    staffId,
    email,
    password,
    roleId,
    updatedBy,
    isActive,
  };
  try {
    const staff = await Staff.findOne({ where: { staffId } });
    const user = await User.update(
      { ...info, name: staff?.name },
      { where: { userId: id } }
    );
    if (user == 1) {
      const currentUser = await User.findOne({ where: { userId: updatedBy } });

      sendEmail({
        subject: "User Details Updated",
        html: `<div>
            <p>Hello Sir</p>
            <p>
              I would like to inform you that User Details is updated for this user <b>${email}</b> (
               by ${currentUser.email}.
            </p>
            <br  />
            <p>Thanks and regards,</p>
            <p>${currentUser.email} </p>
          </div>`,
        to: process.env.FROM_EMAIL,
        from: process.env.EMAIL,
      });
      res.status(200).send({
        flag: true,
        message: "User details updated!",
      });
      return;
    } else {
      res.status(200).send({
        flag: false,
        message: "Something went wrong!",
      });
      return;
    }
  } catch (error) {
    res.status(500).send({
      flag: false,
      error,
    });
    return;
  }
};

//5. delete user by id

const deleteUser = async (req, res) => {
  let id = req.params.id;
  const { isActive, updatedBy } = req.body;
  let info = {
    isActive,
    updatedBy,
  };
  try {
    if (!updatedBy) {
      res.status(400).send({
        flag: false,
      });
      return;
    }
    const user = await User.update(info, { where: { userId: id } });
    if (user == 1) {
      if (isActive == "yes") {
        res.status(200).send({
          flag: true,
          // user,
          message: "User details is recovered successfully.",
        });
        return;
      }
      if (isActive == "no") {
        res.status(200).send({
          flag: true,
          // user,
          message: "User details is deleted successfully.",
        });
        return;
      }
      res.status(404).send({
        flag: false,
        message: "Something went wrong!",
      });
      return;
    } else {
      res.status(404).send({
        flag: false,
        message: "Something went wrong!",
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      flag: false,
      error,
    });
    return;
  }
};

//6. Login user
const userLogin = async (req, res) => {
  let { email, password } = req.body;
  console.log("req.body", req.body);
  //comeent
  try {
    // let role = await Role.findOne({ where: { roleId: user.roleId } })
    if (!password || !email) {
      res.status(400).send({
        flag: false,
        message: "Please enter required feilds.",
        token: "",
      });
      return;
    }
    let user = await User.findOne({ where: { email, isActive: "yes" } });

    if (!user) {
      res.status(200).send({
        flag: false,
        message: "Invalid email or password.",
        token: "",
      });
      return;
    }
    if (user.password == password) {
      let role = await Role.findOne({ where: { roleId: user.roleId } });
      let roleModule = await RoleModule.findAll({
        where: { userId: user.userId },
      });
      user.password = undefined;

      user.roleName = role.roleName;
      let jwtSecretKey = process.env.JWT_SECRET_KEY;
      let data = {
        // time: Date(),
        userId: email,
      };

      const token = jwt.sign(data, jwtSecretKey, { expiresIn: "24h" });
      res.status(200).send({
        flag: true,
        message: "Logged in successfully!",
        outdata: {
          user,
          roleName: role.roleName,
          roleModule,
        },
        token: token,
      });
      return;
    } else {
      res.status(200).send({
        flag: false,
        message: "Invalid email or password!",
        token: "",
      });
      return;
    }
  } catch (error) {
    res.status(500).send({
      flag: false,
      message: "something went wrong!",
      error,
    });
    return;
  }
};

//7. Get User Permission
const getUserPermission = async (req, res) => {
  try {
    const userList = await User.findAll({ where: { isActive: "yes" } });
    const role = await Module.findAll();
    res.status(200).send({
      flag: true,
      message: "User data fetch successfully",
      user: userList,
      role: role,
    });
  } catch (err) {
    res.status(500).send({
      flag: false,
      message: "something went wrong!",
      err,
    });
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  userLogin,
  getUserPermission,
};
