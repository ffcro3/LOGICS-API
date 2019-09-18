import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  //  METHOD TO CREATE A NEW USER
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error:
          'Name, Email and password are requireds. Please check any values in theses fields and try again.',
      });
    }

    const UserExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (UserExists) {
      return res.status(400).json({
        error: 'User Already exists',
      });
    }

    const { name, email, password, userType } = await User.create(req.body);

    return res.json({
      name,
      email,
      password,
      userType,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation Failed. Please, check the fields and try again.',
      });
    }

    const { email, oldPassword } = req.body;

    // FIND THE USER TO MAKE THE ID AVAILABLE TO UPDATE
    const user = await User.findByPk(req.userId);

    // CHECK IF USER IS CHANGING THE E-MAIL FOR ONE THAT ALREADY EXISTS
    if (email !== user.email) {
      const userExists = await User.findOne({
        where: {
          email,
        },
      });

      if (userExists) {
        return res.status(400).json({
          error: 'User already exists',
        });
      }
    }

    // CHECK IF USER IS TRYINT TO CHANGE PASSWORD AND THEN HE MUST CONFIRM THE
    // OLD PASSWORD THAT ALREADY IS REGISTRED
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({
        error: 'Password does not match',
      });
    }

    const { id, name, userType, imagemUsuario, active } = await user.update(
      req.body
    );

    return res.json({
      id,
      name,
      userType,
      imagemUsuario,
      active,
    });
  }
}

export default new UserController();
