import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';
import Message from './Message';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public phone!: string;
  public firstName!: string;
  public lastName!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  // public async comparePassword(candidatePassword: string): Promise<boolean> {
  //   console.log('Comparing password:', candidatePassword);
  //   console.log('Stored hashed password:', this.password);
  //   // return bcrypt.compare(candidatePassword, this.password);
  //   const isMatch = await bcrypt.compare(candidatePassword, this.password);

  //   console.log('Password match result:', isMatch);
  //   return isMatch;

  // }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'FINDER_USERS',
    // hooks: {
    //   beforeSave:async(user)=>{
    //     if (user.changed('password')) {
    //       console.log('Hashing password before saving');

    //       user.password =  await bcrypt.hash(user.password,10);
    //       console.log('Hashed password:', user.password);

    //     }
    //   }
    // }
  }
);



export default User;
