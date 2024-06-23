import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
  maritalStatus: string | null;
  age: string | null;
  isOnline: boolean;
  profileImage: string | null;
  city: string | null;
  gender: string | null;
  userName: string | null;
  birthDate: string | null;
  height: string | null;
  weight: string | null;
  eyeColor: string | null;
  hairColor: string | null;
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
  public maritalStatus!: string | null;
  public age!: string | null;
  public isOnline!: boolean;
  public profileImage!: string | null;
  public city!: string | null;
  public gender!: string | null;
  public userName!: string | null;
  public birthDate!: string | null;
  public height!: string | null;
  public weight!: string | null;
  public eyeColor!: string | null;
  public hairColor!: string | null;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
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
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    age: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    birthDate: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    height: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    eyeColor: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    hairColor: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
  },
  {
    sequelize,
    tableName: 'FINDER_USERS',

  }
);

export default User;
